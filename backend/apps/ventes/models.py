"""Models for the Ventes app."""

from django.db import models


class Vente(models.Model):
    """Vente effectuée en pharmacie.

    Regroupe une ou plusieurs lignes de vente (LigneVente).
    Peut être annulée, ce qui restaure le stock des médicaments concernés.
    """

    STATUT_CHOICES = [
        ("completee", "Complétée"),
        ("annulee", "Annulée"),
    ]

    date_vente = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de vente",
    )
    montant_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Montant total",
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default="completee",
        verbose_name="Statut",
    )

    class Meta:
        ordering = ["-date_vente"]
        verbose_name = "Vente"
        verbose_name_plural = "Ventes"

    def __str__(self):
        return f"Vente #{self.pk} — {self.montant_total} € ({self.statut})"


class LigneVente(models.Model):
    """Ligne détail d'une vente.

    Stocke un snapshot du prix unitaire au moment de la vente
    afin de préserver l'historique même si le prix du médicament change.
    """

    vente = models.ForeignKey(
        Vente,
        on_delete=models.CASCADE,
        related_name="lignes",
        verbose_name="Vente",
    )
    medicament = models.ForeignKey(
        "medicaments.Medicament",
        on_delete=models.PROTECT,
        related_name="lignes_vente",
        verbose_name="Médicament",
    )
    quantite = models.PositiveIntegerField(
        verbose_name="Quantité",
    )
    prix_unitaire = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix unitaire (snapshot)",
        help_text="Prix du médicament au moment de la vente.",
    )
    sous_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name="Sous-total",
    )

    class Meta:
        verbose_name = "Ligne de vente"
        verbose_name_plural = "Lignes de vente"

    def __str__(self):
        return f"{self.medicament.nom} x{self.quantite}"
