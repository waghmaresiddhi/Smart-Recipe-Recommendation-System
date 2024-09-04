from rest_framework import serializers

from app.utils.file_validations_utils import FileValidationUtil
from .models import User


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    class Meta:
        model = User


class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.FileField(
        required=False,
        validators=[
            FileValidationUtil.file_size_validate(3),
            FileValidationUtil.content_type_validate(["image/jpeg"], [".jpg"]),
        ],
    )

    class Meta:
        ordering = ["-id"]
        model = User
        fields = (
            "email",
            "name",
            "profile_image",
        )
        read_only_fields = ("email",)
