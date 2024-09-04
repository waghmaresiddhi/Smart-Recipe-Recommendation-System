from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User, AUTH_PROVIDERS
from .serializers import ChangePasswordSerializer, UserProfileSerializer
from .utils import Util


class ChangePasswordAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    model = User
    serializer_class = ChangePasswordSerializer

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            if self.request.user.auth_provider != AUTH_PROVIDERS.get("email"):
                return Response(
                    {
                        "error": f"You are not allowed to change password, since you logged in with "
                        f"{request.user.auth_provider}"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response(
                    {"error": "Wrong Password"}, status=status.HTTP_400_BAD_REQUEST
                )
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                "status": "success",
                "message": "Password updated successfully",
            }
            return Response(response, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileApiView(generics.RetrieveAPIView, generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer
    model = User

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def get_queryset(self):
        if self.request.user is None:
            queryset = User.objects.none()
        else:
            queryset = User.objects.none()
        return queryset
