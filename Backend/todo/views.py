from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from user.permissions import IsObjOwnerPermission
from .serializers import ToDoSerializer
from .models import ToDo
from .paginations import ToDoPagination


class ToDoViewSet(ModelViewSet):
    permission_classes = (IsAuthenticated, IsObjOwnerPermission)
    serializer_class = ToDoSerializer
    pagination_class = ToDoPagination
    http_method_names = ["get", "post", "put", "patch", "head", "delete"]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        if self.request.user is None:
            queryset = ToDo.objects.none()
        else:
            queryset = ToDo.objects.filter(user=self.request.user.id).order_by(
                "-created_at"
            )
        return queryset

    def destroy(self, request, *args, **kwargs):
        super().destroy(request)
        return Response(
            {"message": "Todo deleted successfully"}, status=status.HTTP_200_OK
        )
