from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from app.utils.utils import StandardResultsSetPagination, MultipartJsonParser
from ecommerce import models, serializers


class MobileViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.MobileSerializer
    queryset = models.Mobile.objects.all()
    http_method_names = ["get", "post", "put", "patch", "head", "delete"]
    lookup_field = "slug"
    pagination_class = StandardResultsSetPagination
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ["title", "color__name", "brand__name"]
    filterset_fields = ["tags__name", "buy_price", "display_price", "color__name", "brand__name", "screen_type__name"]
    parser_classes = [MultipartJsonParser, JSONParser]


class ImageStorageViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = models.ImageStorage.objects.all()
    serializer_class = serializers.ImageStorageSerializer
    http_method_names = ["get", "post", "put", "patch", "head", "delete"]

    def create(self, request, *args, **kwargs):
        file_fields = list(request.FILES.keys())
        serializer = serializers.ImageStorageSerializer(
            data=request.data, file_fields=file_fields)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializers.ImageStorageSerializer(serializer.image_instance, many=True, context={'request': request}).data)


class TagViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.TagSerializer
    queryset = models.Tag.objects.all()
    http_method_names = ["get", "head"]
    lookup_field = "slug"

class ScreenTypeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ScreenTypeSerializer
    queryset = models.ScreenType.objects.all()
    http_method_names = ["get", "head"]


class RamUnitViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.RamUnitSerializer
    queryset = models.RamUnit.objects.all()
    http_method_names = ["get", "head"]


class ColorViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.ColorSerializer
    queryset = models.Color.objects.all()
    http_method_names = ["get", "head"]


class BrandViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.BrandSerializer
    queryset = models.Brand.objects.all()
    http_method_names = ["get", "head"]


class UsbPortViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.UsbPortSerializer
    queryset = models.UsbPort.objects.all()
    http_method_names = ["get", "head"]
