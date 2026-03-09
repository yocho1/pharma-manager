"""URL routes for the Categories app."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CategorieViewSet

router = DefaultRouter()
router.register("", CategorieViewSet, basename="categorie")

urlpatterns = [
    path("", include(router.urls)),
]
