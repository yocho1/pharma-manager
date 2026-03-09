"""Models for the Categories app."""

from django.db import models


class Categorie(models.Model):
    """Catégorie de médicaments.

    Permet de classer les médicaments par famille thérapeutique
    (ex: Antalgiques, Antibiotiques, Anti-inflammatoires…).
    """

    nom = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nom de la catégorie",
    )
    description = models.TextField(
        blank=True,
        default="",
        verbose_name="Description",
    )
    date_creation = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création",
    )

    class Meta:
        ordering = ["nom"]
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"

    def __str__(self):
        return self.nom
