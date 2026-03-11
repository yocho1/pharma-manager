"""Models for the Ventes app."""

import datetime

from django.db import models


def _generate_reference():
    """Génère une référence unique au format VNT-YYYY-NNNN."""
    year = datetime.date.today().year
    last = (
        Vente.objects.filter(reference__startswith=f"VNT-{year}-")
        .order_by("-reference")
        .values_list("reference", flat=True)
        .first()
    )
    if last:
        seq = int(last.split("-")[-1]) + 1
    else:
        seq = 1
    return f"VNT-{year}-{seq:04d}"


class Vente(models.Model):
    """Vente effectuée en pharmacie.

    Attributs:
        reference (str): Code unique auto-généré (ex: VNT-2026-0001).
        date_vente (datetime): Horodatage de la vente.
        montant_total (Decimal): Montant total TTC calculé automatiquement.
        statut (str): En cours, Complétée ou Annulée.
        notes (str): Remarques optionnelles sur la vente.

    Regroupe une ou plusieurs lignes de vente (LigneVente).
    Peut être annulée, ce qui restaure le stock des médicaments concernés.
    """

    STATUT_CHOICES = [
        ("en_cours", "En cours"),
        ("completee", "Complétée"),
        ("annulee", "Annulée"),
    ]

    reference = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        verbose_name="Référence",
        help_text="Code unique auto-généré (ex: VNT-2026-0001)",
    )
    date_vente = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de vente",
    )
    montant_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Montant total TTC",
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default="completee",
        verbose_name="Statut",
    )
    notes = models.TextField(
        blank=True,
        default="",
        verbose_name="Notes",
        help_text="Remarques optionnelles sur la vente.",
    )

    class Meta:
        ordering = ["-date_vente"]
        verbose_name = "Vente"
        verbose_name_plural = "Ventes"

    def save(self, *args, **kwargs):
        """Génère automatiquement la référence à la création."""
        if not self.reference:
            self.reference = _generate_reference()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference} — {self.montant_total} € ({self.statut})"


class LigneVente(models.Model):
    """Ligne détail d'une vente.

    Attributs:
        vente (Vente): Vente parente.
        medicament (Medicament): Médicament vendu.
        quantite (int): Quantité vendue.
        prix_unitaire (Decimal): Prix snapshot au moment de la vente.
        sous_total (Decimal): Calculé: quantité × prix_unitaire.

    Le prix_unitaire est un snapshot du prix au moment de la vente
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
