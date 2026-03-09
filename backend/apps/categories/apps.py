from django.apps import AppConfig


class CategoriesConfig(AppConfig):
    """Configuration de l'application Catégories."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.categories"
    verbose_name = "Catégories"
