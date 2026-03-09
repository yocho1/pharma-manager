from django.apps import AppConfig


class MedicamentsConfig(AppConfig):
    """Configuration de l'application Médicaments."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.medicaments"
    verbose_name = "Médicaments"
