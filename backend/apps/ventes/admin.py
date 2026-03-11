"""Admin configuration for the Ventes app."""

from django.contrib import admin

from .models import LigneVente, Vente


class LigneVenteInline(admin.TabularInline):
    """Inline pour afficher les lignes dans le formulaire de vente."""

    model = LigneVente
    extra = 0
    readonly_fields = ["medicament", "quantite", "prix_unitaire", "sous_total"]


@admin.register(Vente)
class VenteAdmin(admin.ModelAdmin):
    """Admin pour le modèle Vente."""

    list_display = ["reference", "date_vente", "montant_total", "statut"]
    list_filter = ["statut", "date_vente"]
    ordering = ["-date_vente"]
    inlines = [LigneVenteInline]
    readonly_fields = ["reference", "date_vente", "montant_total"]
