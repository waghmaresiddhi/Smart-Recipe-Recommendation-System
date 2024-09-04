from rest_framework import serializers
from . import models


class ToDoSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        ordering = ["-id"]
        model = models.ToDo
        fields = ("id", "task", "created_at", "updated_at", "completed", "user")
        read_only_fields = ["id", "created_at", "updated_at", "user"]
