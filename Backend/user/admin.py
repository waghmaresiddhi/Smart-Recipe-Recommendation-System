from django.contrib import admin
from . import models


class UserAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "unique_id",
        "is_verified",
        "is_active",
        "auth_provider",
        "created_at",
    )


admin.site.register(models.User, UserAdmin)
