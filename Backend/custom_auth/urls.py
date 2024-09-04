from django.urls import path, include, re_path
from rest_framework_simplejwt.views import TokenRefreshView
from custom_auth import views

urlpatterns = [
    # Basic Login
    path("login/", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", views.UserRegisterView().as_view(), name="register"),
    # Password Flow
    path(
        "forgot_password/",
        views.RequestPasswordResetEmailView.as_view(),
        name="forgot_password",
    ),
    path(
        "verify_reset_password_tokens/<uidb64>/<token>/",
        views.PasswordTokenCheckView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "reset_password/",
        views.SetNewPasswordView.as_view(),
        name="password_reset_complete",
    ),
    # Email Flow
    path("verify_email/", views.VerifyEmailView().as_view(), name="verify_email"),
    path(
        "request_verification_link/",
        views.ResendEmailVerificationLinkView.as_view(),
        name="request_verification_link",
    ),
    re_path(r'^totp/create/$', views.TOTPCreateView.as_view(), name='totp-create'),
    re_path(r'^totp/login/(?P<token>[0-9]{6})/$', views.TOTPVerifyView.as_view(), name='totp-login'),
    re_path(r'^totp/disable/(?P<token>[0-9]{6})/$', views.TOTPDisableView.as_view(), name='totp-disable'),
    re_path(r'^totp/re_enable/$', views.TOTPReEnableView.as_view(), name='totp-re-enable'),
]
