"""Models for the Medicaments app."""

from django.db import models


class Medicament(models.Model):
    """Médicament en stock dans la pharmacie.

    Contient toutes les informations nécessaires à la gestion
    d'un médicament : identification, prix, stock, expiration.
    Le champ `est_actif` permet le soft-delete.
    """

    FORME_CHOICES = [
        ("comprime", "Comprimé"),
        ("gelule", "Gélule"),
        ("sirop", "Sirop"),
        ("injectable", "Injectable"),
        ("pommade", "Pommade"),
        ("suppositoire", "Suppositoire"),
        ("gouttes", "Gouttes"),
        ("autre", "Autre"),
    ]

    nom = models.CharField(
        max_length=200,
        verbose_name="Nom commercial",
    )
    dci = models.CharField(
        max_length=200,
        blank=True,
        default="",
        verbose_name="Dénomination Commune Internationale",
    )
    categorie = models.ForeignKey(
        "categories.Categorie",
        on_delete=models.PROTECT,
        related_name="medicaments",
        verbose_name="Catégorie",
    )
    forme = models.CharField(
        max_length=20,
        choices=FORME_CHOICES,
        default="comprime",
        verbose_name="Forme galénique",
    )
    dosage = models.CharField(
        max_length=50,
        blank=True,
        default="",
        verbose_name="Dosage",
    )
    prix_achat = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix d'achat",
    )
    prix_vente = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix de vente",
    )
    stock_actuel = models.PositiveIntegerField(
        default=0,
        verbose_name="Stock actuel",
    )
    stock_minimum = models.PositiveIntegerField(
        default=10,
        verbose_name="Stock minimum (seuil d'alerte)",
    )
    date_expiration = models.DateField(
        verbose_name="Date d'expiration",
    )
    ordonnance_requise = models.BooleanField(
        default=False,
        verbose_name="Ordonnance requise",
    )
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création",
    )
    est_actif = models.BooleanField(
        default=True,
        verbose_name="Actif",
        help_text="False = supprimé (soft delete)",
    )

    class Meta:
        ordering = ["nom"]
        verbose_name = "Médicament"
        verbose_name_plural = "Médicaments"

    def __str__(self):
        return f"{self.nom} ({self.dosage})" if self.dosage else self.nom

    @property
    def en_alerte_stock(self):
        """Retourne True si le stock actuel est inférieur ou égal au seuil minimum."""
        return self.stock_actuel <= self.stock_minimum
