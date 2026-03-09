"""Admin configuration for the Categories app."""

from django.contrib import admin

from .models import Categorie


@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    """Admin pour le modèle Categorie."""

    list_display = ["nom", "description", "date_creation"]
    search_fields = ["nom"]
    ordering = ["nom"]
