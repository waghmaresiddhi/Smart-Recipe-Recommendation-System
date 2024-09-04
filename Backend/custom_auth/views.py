import jwt
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import DjangoUnicodeDecodeError, smart_str
from django.utils.http import urlsafe_base64_decode
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django_otp import devices_for_user
from django_otp.plugins.otp_totp.models import TOTPDevice

from app.settings import BASE_DIR
from custom_auth.serializers import (
    MyTokenObtainPainSerializer,
    UserRegisterSerializer,
    RequestPasswordResetEmailSerializer,
    SetNewPasswordSerializer,
    EmailVerificationSerializer,
)
from rest_framework.response import Response

from user.models import User, AUTH_PROVIDERS
from user.utils import Util


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPainSerializer

    # def post(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #
    #     try:
    #         serializer.is_valid(raise_exception=True)
    #     except TokenError as e:
    #         raise InvalidToken(e.args[0])
    #
    #     # set access token in browser with Httponly cookie.
    #     res = Response(serializer.validated_data, status=status.HTTP_200_OK)
    #     access_token = serializer.validated_data['access']
    #     res.set_cookie("access_token", access_token,
    #                    max_age=settings.SIMPLE_JWT.get('ACCESS_TOKEN_LIFETIME').total_seconds(), samesite="Lax",
    #                    secure=False, httponly=True, domain=config('CLIENT_URL'))
    #
    #     refresh_token = serializer.validated_data['refresh']
    #     res.set_cookie("refresh_token", refresh_token,
    #                    max_age=settings.SIMPLE_JWT.get('REFRESH_TOKEN_LIFETIME').total_seconds(), samesite="Lax",
    #                    secure=False, httponly=True)
    #     res.data = {"status": "success"}
    #     return res


class UserRegisterView(generics.GenericAPIView):
    serializer_class = UserRegisterSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data

        result = Util.send_email_verification_link(email=user_data["email"])
        message = ""
        if result:
            message = "We have sent you an email"
        else:
            message = "Unable to send an email"
        return Response(
            {"message": message, "user_data": user_data, "email_sent": result},
            status=status.HTTP_201_CREATED,
        )


class RequestPasswordResetEmailView(generics.GenericAPIView):
    """
    Use To Request A Password Reset Email ( Forgot Password )
    """

    serializer_class = RequestPasswordResetEmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        email = request.data.get("email", "")
        print("Mail reset request")
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {"error": "User not found! Please enter valid email address"},
                status=status.HTTP_404_NOT_FOUND,
            )
        if not user.is_verified:
            return Response(
                {"error": "Email address is not verified!"},
                status=status.HTTP_404_NOT_FOUND,
            )
        if user.auth_provider != AUTH_PROVIDERS.get("email"):
            return Response(
                {
                    "error": f"You can not reset password, since you are logged in with {user.auth_provider}"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        print("Sending mail")
        user = User.objects.get(email=email)
        sent = Util.send_forgot_password_link(user)
        message = ""
        if not sent:
            message = "SMTP Error"
        else:
            message = "Password reset link sent to your email " + user.email
        return Response(
            {"email_sent": sent, "message": message}, status=status.HTTP_200_OK
        )


class SetNewPasswordView(generics.GenericAPIView):
    """
    Use to reset password with valid uidb64 and token combination
    Requires new password,confirmed password, uidb64, token
    """

    serializer_class = SetNewPasswordSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            {"success": True, "message": "Password reset successfully!"},
            status=status.HTTP_200_OK,
        )


class PasswordTokenCheckView(generics.GenericAPIView):
    """
    To verify if two strings ie uidb64 and token are valid or not
    which are used to set new password
    Used before Reset Password form being submitted
    """

    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64, token):
        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response(
                    {"error": "Token is not valid, please request a new one"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            return Response(
                {
                    "success": True,
                    "message": "Credentials Valid",
                    "uidb64": uidb64,
                    "token": token,
                },
                status=status.HTTP_200_OK,
            )

        except DjangoUnicodeDecodeError:
            return Response(
                {"error": "Token is not valid, please request a new one"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class VerifyEmailView(APIView):
    """
    Use to verify email with token passed
    as GET request query string and then redirect frontend flow to login on success
    """

    serializer_class = EmailVerificationSerializer

    token_param_config = openapi.Parameter(
        "token",
        in_=openapi.IN_QUERY,
        description="Description",
        type=openapi.TYPE_STRING,
    )

    @swagger_auto_schema(manual_parameters=[token_param_config])
    def get(self, request):
        token = request.GET.get("token")
        try:
            # payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["RS256"])
            with open(BASE_DIR / "id_rsa.pub") as pubkey_file:
                payload = jwt.decode(token, key=pubkey_file.read(), algorithms="RS256")
                user = User.objects.get(id=payload["user_id"])
                if not user.is_verified:
                    user.is_verified = True
                    user.save()
                return Response(
                    {"email": "Successfully activated"}, status=status.HTTP_200_OK
                )
        except jwt.ExpiredSignatureError:
            return Response(
                {"error": "Activation link is expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except jwt.exceptions.DecodeError:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )


class ResendEmailVerificationLinkView(APIView):
    """
    Use to request new email verification link
    once old verification link is expired
    """

    def post(self, request, format=None):
        email = request.data["email"]
        sent = False
        user_queryset = User.objects.filter(email=email)
        if len(user_queryset) != 1:
            return Response({"email_sent": sent, "message": "Email does not exists"})

        user = user_queryset[0]

        if user.is_verified:
            return Response({"email_sent": sent, "message": "Email already verified"})

        sent = Util.send_email_verification_link(email=user_queryset[0].email)
        message = ""
        if not sent:
            message = "SMTP Error"
        else:
            message = "We have sent you verification link on " + user.email
        return Response({"email_sent": sent, "message": message})


def get_user_totp_device(self, user, confirmed=None):
    devices = devices_for_user(user, confirmed=confirmed)
    for device in devices:
        if isinstance(device, TOTPDevice):
            return device


class TOTPCreateView(APIView):
    """
    Use this endpoint to set up a new TOTP device
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        device = get_user_totp_device(self, user)
        if not device:
            device = user.totpdevice_set.create(confirmed=False)
        url = device.config_url
        return Response(url, status=status.HTTP_201_CREATED)


class TOTPVerifyView(APIView):
    """
    Use this endpoint to verify/enable a TOTP device
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, token, format=None):
        user = request.user
        device = get_user_totp_device(self, user)
        if not device is None and device.verify_token(token):
            if not device.confirmed:
                device.confirmed = True
                device.save()
            return Response("Successfully Enabled Two Factor Authentication", status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class TOTPDisableView(APIView):
    """
        Use this endpoint to disable a TOTP device
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, token, format=None):
        user = request.user
        device = get_user_totp_device(self, user)
        if not device is None and device.verify_token(token):
            if device.confirmed:
                device.confirmed = False
                device.save()
            return Response("Successfully Disabled Two Factor Authentication", status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class TOTPReEnableView(APIView):
    """
        Use this endpoint to disable a TOTP device
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        device = get_user_totp_device(self, user)
        if not device is None:
            if not device.confirmed:
                device.confirmed = True
                device.save()
            return Response("Successfully Re-Enabled Two Factor Authentication", status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
