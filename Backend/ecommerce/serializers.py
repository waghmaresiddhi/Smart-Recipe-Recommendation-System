from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from rest_framework import serializers
from drf_writable_nested import WritableNestedModelSerializer

from app.utils.file_validations_utils import FileValidationUtil
from ecommerce import models


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tag
        fields = ["id", "name", "slug"]


class ScreenTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ScreenType
        fields = ["id", "name"]


class RamUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RamUnit
        fields = ["id", "unit"]


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Color
        fields = ["id", "name"]


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Brand
        fields = ["id", "name"]


class UsbPortSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UsbPort
        fields = ["id", "name"]


class ImageStorageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(
        required=False,
        validators=[
            FileValidationUtil.file_size_validate(2),
            FileValidationUtil.content_type_validate(["image/jpeg", "image/png"], [".jpg", ".jpeg", ".png"])
        ]
    )

    class Meta:
        model = models.MobileImage
        fields = ["id", "image"]

    def __init__(self, *args, **kwargs):
        file_fields = kwargs.pop('file_fields', None)
        super().__init__(*args, **kwargs)
        if file_fields:
            field_update_dict = {field: serializers.FileField(required=False, write_only=True) for field in
                                 file_fields}
            self.fields.update(**field_update_dict)

    image_instance = []

    def create(self, validated_data):
        validated_data_copy = validated_data.copy()
        validated_files = []
        for key, value in validated_data_copy.items():
            if isinstance(value, InMemoryUploadedFile) or isinstance(value, TemporaryUploadedFile):
                validated_files.append(value)
                validated_data.pop(key)
        self.image_instance = []
        for file in validated_files:
            created = models.ImageStorage.objects.create(image=file)
            self.image_instance.append(created)
        return self.image_instance

class MobileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MobileImage
        fields = ["image_storage",]
    
    def to_representation(self, instance):
        self.fields["image_storage"] = ImageStorageSerializer()
        return super(MobileImageSerializer, self).to_representation(instance)

class MobileSerializer(WritableNestedModelSerializer, serializers.ModelSerializer):
    
    tags = serializers.PrimaryKeyRelatedField(queryset=models.Tag.objects.all(), many=True)
    screen_type = serializers.PrimaryKeyRelatedField(queryset=models.ScreenType.objects.all())
    ram_unit = serializers.PrimaryKeyRelatedField(queryset=models.RamUnit.objects.all())
    color = serializers.PrimaryKeyRelatedField(queryset=models.Color.objects.all(), many=True)
    brand = serializers.PrimaryKeyRelatedField(queryset=models.Brand.objects.all())
    usb_port = serializers.PrimaryKeyRelatedField(queryset=models.UsbPort.objects.all())
    mobile_image = MobileImageSerializer(many=True)

    spec = serializers.FileField(
       required=False,
        validators=[
            FileValidationUtil.file_size_validate(2),
            FileValidationUtil.content_type_validate(
                ["application/pdf"], [".pdf"])
        ] 
    )

    class Meta:
        model = models.Mobile
        fields = ["id", "name", "slug", "tags", "display_price", "buy_price", "discount", "screen_type", "ram",
                  "ram_unit", "processor", "color", "brand", "front_camera", "back_camera", "usb_port", "has_earphone_jack",
                  "description", "launch_date", "spec", "mobile_image", "featured_image"]

    def to_representation(self, instance):
        self.fields["tags"] = TagSerializer(many=True)
        self.fields["screen_type"] = ScreenTypeSerializer()
        self.fields["ram_unit"] = RamUnitSerializer()
        self.fields["color"] = ColorSerializer(many=True)
        self.fields["brand"] = BrandSerializer()
        self.fields["usb_port"] = UsbPortSerializer()
        return super(MobileSerializer, self).to_representation(instance)
