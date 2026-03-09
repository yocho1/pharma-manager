"""Serializers for the Medicaments app."""

from datetime import date

from rest_framework import serializers

from .models import Medicament


class MedicamentSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Medicament.

    Inclut un champ calculé `en_alerte_stock` et le nom de la catégorie.
    """

    en_alerte_stock = serializers.BooleanField(read_only=True)
    categorie_nom = serializers.CharField(
        source="categorie.nom", read_only=True
    )

    class Meta:
        model = Medicament
        fields = [
            "id",
            "nom",
            "dci",
            "categorie",
            "categorie_nom",
            "forme",
            "dosage",
            "prix_achat",
            "prix_vente",
            "stock_actuel",
            "stock_minimum",
            "date_expiration",
            "ordonnance_requise",
            "date_creation",
            "est_actif",
            "en_alerte_stock",
        ]
        read_only_fields = ["id", "date_creation", "est_actif"]

    def validate_prix_achat(self, value):
        """Le prix d'achat doit être positif."""
        if value <= 0:
            raise serializers.ValidationError("Le prix d'achat doit être supérieur à 0.")
        return value

    def validate_prix_vente(self, value):
        """Le prix de vente doit être positif."""
        if value <= 0:
            raise serializers.ValidationError("Le prix de vente doit être supérieur à 0.")
        return value

    def validate_date_expiration(self, value):
        """La date d'expiration ne doit pas être dans le passé."""
        if value < date.today():
            raise serializers.ValidationError("La date d'expiration ne peut pas être dans le passé.")
        return value

    def validate(self, attrs):
        """Vérifie que le prix de vente est supérieur au prix d'achat."""
        prix_achat = attrs.get("prix_achat", getattr(self.instance, "prix_achat", None))
        prix_vente = attrs.get("prix_vente", getattr(self.instance, "prix_vente", None))

        if prix_achat is not None and prix_vente is not None:
            if prix_vente < prix_achat:
                raise serializers.ValidationError(
                    {"prix_vente": "Le prix de vente doit être supérieur ou égal au prix d'achat."}
                )
        return attrs