"""ViewSets for the Ventes app."""

from django_filters import rest_framework as django_filters
from django.db import transaction
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view

from apps.medicaments.models import Medicament

from .models import Vente
from .serializers import VenteDetailSerializer, VenteSerializer


class VenteFilter(django_filters.FilterSet):
    """Filtres pour les ventes."""

    date = django_filters.DateFilter(field_name="date_vente", lookup_expr="date")

    class Meta:
        model = Vente
        fields = ["statut", "date"]


@extend_schema_view(
    list=extend_schema(
        summary="Lister les ventes",
        description="Retourne l'historique des ventes avec leurs lignes.",
        tags=["Ventes"],
    ),
    create=extend_schema(
        summary="Créer une vente",
        description=(
            "Crée une nouvelle vente avec ses lignes. "
            "Le stock des médicaments est automatiquement déduit. "
            "Le prix unitaire est snapshoté au moment de la vente."
        ),
        tags=["Ventes"],
    ),
    retrieve=extend_schema(
        summary="Détail d'une vente",
        description="Retourne le détail complet d'une vente et de ses lignes.",
        tags=["Ventes"],
    ),
)
class VenteViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """ViewSet pour les ventes.

    Actions disponibles :
    - list : historique des ventes
    - create : créer une vente (déduit le stock)
    - retrieve : détail d'une vente
    - annuler : annuler une vente (restaure le stock)
    """

    queryset = Vente.objects.prefetch_related("lignes", "lignes__medicament").all()
    filterset_class = VenteFilter
    ordering_fields = ["date_vente", "montant_total"]

    def get_serializer_class(self):
        """Utilise le serializer détaillé pour retrieve, sinon le standard."""
        if self.action == "retrieve":
            return VenteDetailSerializer
        return VenteSerializer

    @extend_schema(
        summary="Annuler une vente",
        description=(
            "Annule une vente complétée et restaure le stock "
            "de chaque médicament concerné."
        ),
        tags=["Ventes"],
        request=None,
        responses={200: VenteDetailSerializer},
    )
    @action(detail=True, methods=["post"], url_path="annuler")
    @transaction.atomic
    def annuler(self, request, pk=None):
        """Annule une vente et restaure le stock des médicaments."""
        vente = self.get_object()

        if vente.statut == "annulee":
            return Response(
                {"detail": "Cette vente est déjà annulée."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Restore stock for each line
        for ligne in vente.lignes.select_related("medicament"):
            med = Medicament.objects.select_for_update().get(pk=ligne.medicament.pk)
            med.stock_actuel += ligne.quantite
            med.save(update_fields=["stock_actuel"])

        vente.statut = "annulee"
        vente.save(update_fields=["statut"])

        serializer = VenteDetailSerializer(vente)
        return Response(serializer.data, status=status.HTTP_200_OK)
