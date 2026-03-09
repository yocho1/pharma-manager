"""
URL configuration for PharmaManager project.

Routes all API endpoints under /api/v1/ and exposes Swagger documentation.
"""

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # API v1
    path("api/v1/categories/", include("apps.categories.urls")),
    path("api/v1/medicaments/", include("apps.medicaments.urls")),
    path("api/v1/ventes/", include("apps.ventes.urls")),

    # OpenAPI schema & Swagger UI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
