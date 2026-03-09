"""Admin configuration for the Medicaments app."""

from django.contrib import admin

from .models import Medicament


@admin.register(Medicament)
class MedicamentAdmin(admin.ModelAdmin):
    """Admin pour le modèle Medicament."""

    list_display = [
        "nom", "dci", "categorie", "forme", "dosage",
        "prix_vente", "stock_actuel", "stock_minimum",
        "date_expiration", "est_actif",
    ]
    list_filter = ["categorie", "forme", "ordonnance_requise", "est_actif"]
    search_fields = ["nom", "dci"]
    ordering = ["nom"]
