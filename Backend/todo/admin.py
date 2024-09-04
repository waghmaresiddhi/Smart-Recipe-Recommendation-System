from django.contrib import admin
from . import models


@admin.register(models.ToDo)
class TodoAdmin(admin.ModelAdmin):
    list_display = [
        "task",
        "created_at",
        "updated_at",
        "completed",
        "user",
    ]
