"""Serializers for the Categories app."""

from rest_framework import serializers

from .models import Categorie


class CategorieSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Categorie.

    Gère la validation et la représentation JSON des catégories.
    """

    class Meta:
        model = Categorie
        fields = ["id", "nom", "description", "date_creation"]
        read_only_fields = ["id", "date_creation"]

    def validate_nom(self, value):
        """Valide que le nom de la catégorie n'est pas vide après strip."""
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Le nom de la catégorie ne peut pas être vide.")
        return value