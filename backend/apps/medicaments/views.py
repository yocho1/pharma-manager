"""ViewSets for the Medicaments app."""

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models as db_models
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Medicament
from .serializers import MedicamentSerializer


@extend_schema_view(
    list=extend_schema(
        summary="Lister les médicaments",
        description="Retourne la liste des médicaments actifs. Supporte la recherche et le filtrage.",
        tags=["Médicaments"],
    ),
    create=extend_schema(
        summary="Créer un médicament",
        description="Ajoute un nouveau médicament au catalogue.",
        tags=["Médicaments"],
    ),
    retrieve=extend_schema(
        summary="Détail d'un médicament",
        description="Retourne les informations détaillées d'un médicament.",
        tags=["Médicaments"],
    ),
    update=extend_schema(
        summary="Modifier un médicament",
        description="Met à jour complètement un médicament.",
        tags=["Médicaments"],
    ),
    partial_update=extend_schema(
        summary="Modifier partiellement un médicament",
        description="Met à jour partiellement un médicament.",
        tags=["Médicaments"],
    ),
    destroy=extend_schema(
        summary="Supprimer un médicament (soft delete)",
        description="Désactive le médicament sans le supprimer de la base.",
        tags=["Médicaments"],
        responses={204: None},
    ),
)
class MedicamentViewSet(viewsets.ModelViewSet):
    """ViewSet CRUD pour les médicaments avec soft-delete et alertes de stock.

    - Le queryset filtre par défaut les médicaments actifs.
    - DELETE effectue un soft-delete (est_actif = False).
    - L'action `alertes` retourne les médicaments en rupture de stock.
    """

    serializer_class = MedicamentSerializer
    search_fields = ["nom", "dci"]
    ordering_fields = ["nom", "prix_vente", "stock_actuel", "date_expiration"]
    filterset_fields = ["categorie", "forme", "ordonnance_requise"]

    def get_queryset(self):
        """Retourne uniquement les médicaments actifs."""
        return Medicament.objects.filter(est_actif=True).select_related("categorie")

    def perform_destroy(self, instance):
        """Soft-delete : désactive le médicament au lieu de le supprimer."""
        instance.est_actif = False
        instance.save(update_fields=["est_actif"])

    @extend_schema(
        summary="Alertes de stock",
        description=(
            "Retourne la liste des médicaments dont le stock actuel "
            "est inférieur ou égal au stock minimum."
        ),
        tags=["Médicaments"],
        responses={200: MedicamentSerializer(many=True)},
    )
    @action(detail=False, methods=["get"], url_path="alertes")
    def alertes(self, request):
        """Retourne les médicaments en alerte de stock."""
        queryset = self.get_queryset().filter(
            stock_actuel__lte=db_models.F("stock_minimum")
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
