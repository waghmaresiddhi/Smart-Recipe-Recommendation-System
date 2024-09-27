"""app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from decouple import config
from django.conf.urls.static import static
from django.conf.urls import url
from django.contrib import admin
from django_otp.admin import OTPAdminSite
from django.urls import path, include
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenRefreshView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from app import settings
from rest_framework.decorators import api_view


DJANGO_BASE_TEMPLATE_VERSION = "1.0.14"
PROJECT_VERSION = "0.0.0"


@api_view()
def server_status(request):
    return Response(
        {
            "server_status": True,
            "django_base_template_version": DJANGO_BASE_TEMPLATE_VERSION,
            "project_version": PROJECT_VERSION,
        }
    )


schema_view = get_schema_view(
    openapi.Info(
        title="Django Base Template API",
        default_version="v1",
        description="Test description",
        terms_of_service="https://www.oxvsys.com/terms-and-conditions",
        contact=openapi.Contact(email="hello@oxvsys.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

otp_admin_site = OTPAdminSite(OTPAdminSite.name)
for model_cls, model_admin in admin.site._registry.items():
    otp_admin_site.register(model_cls, model_admin.__class__)


urlpatterns = [
    path("admin/", include("admin_honeypot.urls", namespace="admin_honeypot")),
    path("", server_status, name="hello_world"),
    path("auth/", include("custom_auth.urls")),
    path("api/v1/user/", include("user.urls")),
    path("social_auth/", include("social_auth.urls")),
    path("api/v1/todo/", include("todo.urls")),
    path("api/v1/bulk_todo/", include("bulk_todo.urls")),
    path("api/v1/ecommerce/", include("ecommerce.urls")),
    path('api/', include('expenses.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
if settings.DEBUG:
    urlpatterns += [
        url(
            r"^swagger(?P<format>\.json|\.yaml)$",
            schema_view.without_ui(cache_timeout=0),
            name="schema-json",
        ),
        url(
            r"^swagger/$",
            schema_view.with_ui("swagger", cache_timeout=0),
            name="schema-swagger-ui",
        ),
        url(
            r"^redoc/$",
            schema_view.with_ui("redoc", cache_timeout=0),
            name="schema-redoc",
        ),
    ]

if config("TWO_FA", cast=bool):
    urlpatterns += [
        path("django_base_template_admin_1123/", otp_admin_site.urls),
    ]
else:
    urlpatterns += [
        path("  ", admin.site.urls),
    ]
