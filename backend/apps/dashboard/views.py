"""Dashboard statistics API view."""

from datetime import date

from django.db import models as db_models
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema

from apps.medicaments.models import Medicament
from apps.ventes.models import Vente


@extend_schema(
    summary="Statistiques du tableau de bord",
    description=(
        "Retourne les indicateurs clés : "
        "nombre de médicaments actifs, alertes de stock, "
        "ventes du jour et chiffre d'affaires du jour."
    ),
    tags=["Dashboard"],
    responses={
        200: {
            "type": "object",
            "properties": {
                "total_medicaments": {"type": "integer"},
                "alertes_stock": {"type": "integer"},
                "ventes_du_jour": {"type": "integer"},
                "chiffre_affaires_jour": {"type": "string"},
                "medicaments_expires": {"type": "integer"},
            },
        }
    },
)
@api_view(["GET"])
def dashboard_stats(request):
    """Return key dashboard statistics."""
    today = date.today()

    total_medicaments = Medicament.objects.filter(est_actif=True).count()

    alertes_stock = Medicament.objects.filter(
        est_actif=True,
        stock_actuel__lte=db_models.F("stock_minimum"),
    ).count()

    ventes_jour = Vente.objects.filter(
        date_vente__date=today,
        statut="completee",
    )

    ventes_du_jour = ventes_jour.count()

    chiffre_affaires_jour = (
        ventes_jour.aggregate(total=db_models.Sum("montant_total"))["total"] or 0
    )

    medicaments_expires = Medicament.objects.filter(
        est_actif=True,
        date_expiration__lt=today,
    ).count()

    return Response({
        "total_medicaments": total_medicaments,
        "alertes_stock": alertes_stock,
        "ventes_du_jour": ventes_du_jour,
        "chiffre_affaires_jour": f"{chiffre_affaires_jour:.2f}",
        "medicaments_expires": medicaments_expires,
    })
