from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("mobile", views.MobileViewSet, basename="mobile")
router.register("image_storage", views.ImageStorageViewSet, basename="image_storage")
router.register("tag", views.TagViewSet, basename="tag")
router.register("screen_type", views.ScreenTypeViewSet, basename="screen_type")
router.register("ram_unit", views.RamUnitViewSet, basename="ram_unit")
router.register("color", views.ColorViewSet, basename="color")
router.register("brand", views.BrandViewSet, basename="brand")
router.register("usb_port", views.UsbPortViewSet, basename="usb_port")



urlpatterns = [
    path("", include(router.urls), name="ecommerce"),
]
