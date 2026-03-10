"""Serializers for the Ventes app.

Business rules:
- Creating a sale deducts stock for each line item.
- Cancelling a sale restores the stock.
- LigneVente stores a snapshot of the unit price at sale time.
"""

from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from apps.medicaments.models import Medicament

from .models import LigneVente, Vente


class LigneVenteSerializer(serializers.ModelSerializer):
    """Serializer pour une ligne de vente.

    En lecture, expose le nom du médicament.
    En écriture, seuls `medicament` et `quantite` sont requis ;
    `prix_unitaire` et `sous_total` sont calculés automatiquement.
    """

    medicament_nom = serializers.CharField(
        source="medicament.nom", read_only=True
    )

    class Meta:
        model = LigneVente
        fields = [
            "id",
            "medicament",
            "medicament_nom",
            "quantite",
            "prix_unitaire",
            "sous_total",
        ]
        read_only_fields = ["id", "prix_unitaire", "sous_total"]

    def validate_quantite(self, value):
        """La quantité doit être strictement positive."""
        if value <= 0:
            raise serializers.ValidationError("La quantité doit être supérieure à 0.")
        return value


class VenteSerializer(serializers.ModelSerializer):
    """Serializer pour une vente avec ses lignes.

    Gère la création atomique de la vente et de ses lignes,
    y compris la déduction du stock et le calcul du montant total.
    """

    lignes = LigneVenteSerializer(many=True)

    class Meta:
        model = Vente
        fields = [
            "id",
            "date_vente",
            "montant_total",
            "statut",
            "lignes",
        ]
        read_only_fields = ["id", "date_vente", "montant_total", "statut"]

    def validate_lignes(self, value):
        """Au moins une ligne est requise."""
        if not value:
            raise serializers.ValidationError("Une vente doit contenir au moins une ligne.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        """Crée la vente, ses lignes, déduit le stock et calcule le total."""
        lignes_data = validated_data.pop("lignes")
        vente = Vente.objects.create(**validated_data)

        montant_total = Decimal("0.00")

        for ligne_data in lignes_data:
            medicament = ligne_data["medicament"]
            quantite = ligne_data["quantite"]

            # Lock the medicament row to prevent race conditions
            med = Medicament.objects.select_for_update().get(pk=medicament.pk)

            if not med.est_actif:
                raise serializers.ValidationError(
                    {"lignes": f"Le médicament '{med.nom}' n'est plus disponible."}
                )

            if med.stock_actuel < quantite:
                raise serializers.ValidationError(
                    {"lignes": f"Stock insuffisant pour '{med.nom}'. "
                               f"Disponible : {med.stock_actuel}, demandé : {quantite}."}
                )

            # Snapshot price and compute sub-total
            prix_unitaire = med.prix_vente
            sous_total = prix_unitaire * quantite

            LigneVente.objects.create(
                vente=vente,
                medicament=med,
                quantite=quantite,
                prix_unitaire=prix_unitaire,
                sous_total=sous_total,
            )

            # Deduct stock
            med.stock_actuel -= quantite
            med.save(update_fields=["stock_actuel"])

            montant_total += sous_total

        vente.montant_total = montant_total
        vente.save(update_fields=["montant_total"])

        return vente


class VenteDetailSerializer(VenteSerializer):
    """Serializer détaillé pour une vente (lecture seule)."""

    lignes = LigneVenteSerializer(many=True, read_only=True)