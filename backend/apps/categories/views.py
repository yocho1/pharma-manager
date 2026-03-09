"""ViewSets for the Categories app."""

from rest_framework import viewsets
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Categorie
from .serializers import CategorieSerializer


@extend_schema_view(
    list=extend_schema(
        summary="Lister les catégories",
        description="Retourne la liste de toutes les catégories de médicaments.",
        tags=["Categories"],
    ),
    create=extend_schema(
        summary="Créer une catégorie",
        description="Crée une nouvelle catégorie de médicaments.",
        tags=["Categories"],
    ),
    retrieve=extend_schema(
        summary="Détail d'une catégorie",
        description="Retourne les informations d'une catégorie par son ID.",
        tags=["Categories"],
    ),
    update=extend_schema(
        summary="Modifier une catégorie",
        description="Met à jour complètement une catégorie existante.",
        tags=["Categories"],
    ),
    partial_update=extend_schema(
        summary="Modifier partiellement une catégorie",
        description="Met à jour partiellement une catégorie existante.",
        tags=["Categories"],
    ),
    destroy=extend_schema(
        summary="Supprimer une catégorie",
        description="Supprime définitivement une catégorie.",
        tags=["Categories"],
    ),
)
class CategorieViewSet(viewsets.ModelViewSet):
    """ViewSet CRUD pour les catégories de médicaments.

    Fournit les actions list, create, retrieve, update, partial_update, destroy.
    """

    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    search_fields = ["nom"]
    ordering_fields = ["nom", "date_creation"]
