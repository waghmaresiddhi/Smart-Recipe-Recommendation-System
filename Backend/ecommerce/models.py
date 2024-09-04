from pathlib import Path
from autoslug import AutoSlugField
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver

from app.utils.utils import _delete_file
from django.core.files.storage import get_storage_class

default_storage = get_storage_class()()


class Tag(models.Model):
    name = models.CharField(max_length=255)
    slug = AutoSlugField(populate_from="name", unique=True, max_length=255)

    def __str__(self):
        return self.name

class ScreenType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class RamUnit(models.Model):
    unit = models.CharField(max_length=255)

    def __str__(self):
        return self.unit


class Color(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class UsbPort(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Mobile(models.Model):
    name = models.CharField(max_length=255)
    slug = AutoSlugField(populate_from="name", unique=True, max_length=255)
    tags = models.ManyToManyField(Tag, related_name="mobile", blank=True, null=True)
    display_price = models.IntegerField()
    buy_price = models.IntegerField()
    discount = models.IntegerField()
    screen_type = models.ForeignKey(ScreenType, related_name="mobile", on_delete=models.CASCADE)
    ram = models.IntegerField()
    ram_unit = models.ForeignKey(RamUnit, related_name="mobile", on_delete=models.CASCADE)
    processor = models.CharField(max_length=255)
    color = models.ManyToManyField(Color, related_name="mobile")
    brand = models.ForeignKey(Brand, related_name="mobile", on_delete=models.CASCADE)
    front_camera = models.IntegerField()
    back_camera = models.IntegerField()
    usb_port = models.ForeignKey(UsbPort, related_name="mobile", on_delete=models.CASCADE)
    has_earphone_jack = models.BooleanField(default=True)
    description = models.TextField()
    launch_date = models.DateField()
    spec = models.FileField(max_length=100, upload_to="mobile_specs", null=True, blank=True)
    featured_image = models.ImageField(max_length=100, upload_to="featured_image", null=True, blank=True)

    def __str__(self):
        return self.name


class ImageStorage(models.Model):
    image = models.ImageField(max_length=100, upload_to="mobile_images", null=True, blank=True)
    
    def __str__(self):
        return self.image.name


class MobileImage(models.Model):
    mobile = models.ForeignKey(Mobile, related_name="mobile_image", on_delete=models.CASCADE)
    image_storage = models.ForeignKey(ImageStorage, related_name="mobile_image", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.mobile.name} | {self.image_storage}"


# @receiver(pre_delete, sender=Mobile)
# def delete_file_pre_delete_post(sender, instance, *args, **kwargs):
#     if instance.spec:
#         _delete_file(instance.spec.path)


@receiver(pre_delete, sender=ImageStorage)
def delete_file_pre_delete_post(sender, instance, *args, **kwargs):
    path = Path(instance.image.name)
    folder_path = str(path.parent)
    
    # delete a file
    instance.image.delete()
    default_storage.delete(folder_path)

    # if instance.image:
    #     _delete_file(instance.image.path)
