from django.contrib import admin
from . import models


# Register your models here.
@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "last_modified",
    ]


@admin.register(models.Task)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "project",
        "description",
    ]
