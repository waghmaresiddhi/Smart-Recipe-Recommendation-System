from datetime import timedelta

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import EmailMessage
from django.core import mail
from django.template.loader import render_to_string
from django.utils.encoding import smart_bytes
from django.utils.html import strip_tags
from django.utils.http import urlsafe_base64_encode
from rest_framework_simplejwt.tokens import RefreshToken
from decouple import config
from user.models import User


class Util:
    @staticmethod
    def send_email(data):

        email = EmailMessage(
            subject=data["email_subject"],
            body=data["email_body"],
            to=[data["to_email"]],
        )
        result = email.send(fail_silently=True)
        return result == 1 if True else False

    @staticmethod
    def send_email_verification_link(email):
        user = User.objects.get(email=email)
        token = RefreshToken.for_user(user).access_token
        hours = 1
        token.set_exp(lifetime=timedelta(hours=hours))

        verify_email_link = config("CLIENT_URL") + "/verify-email/" + str(token)
        resend_verify_email_link = (
            config("CLIENT_URL") + "/request-verification-link/" + user.email
        )

        return Util.send_html_email(
            "Verify your email",
            user.email,
            "resend_email_verification_link.html",
            {
                "user_name": user.name,
                "hours": hours,
                "verify_email_link": verify_email_link,
                "resend_verify_email_link": resend_verify_email_link,
            },
        )

    @staticmethod
    def send_forgot_password_link(user):
        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)
        forgot_password_link = (
            config("CLIENT_URL") + "/reset-password/" + uidb64 + "/" + token
        )

        return Util.send_html_email(
            "Reset your password",
            user.email,
            "forgot_password_email.html",
            {
                "forgot_password_link": forgot_password_link,
                "user_name": user.name,
            },
        )

    @staticmethod
    def send_html_email(subject, to_mail, template, context):
        html_message = render_to_string(template, context)
        plain_message = strip_tags(html_message)
        from_email = config("EMAIL_ID")

        result = mail.send_mail(
            subject,
            plain_message,
            from_email,
            [to_mail],
            html_message=html_message,
            fail_silently=True,
        )
        return result == 1 if True else False

    @staticmethod
    def get_token(token, user):
        token["name"] = user.name
        token["email"] = user.email
        token["auth_provider"] = user.auth_provider
        token["made_by"] = "Oxvsys Automation Technologies Pvt. Ltd."
        if user.profile_image:
            token["profile_image"] = config("SERVER_URL") + user.profile_image.url
        else:
            token["profile_image"] = (
                "https://via.placeholder.com/250x250/0078D4/FFFFFF?text=" + user.name[0]
            )
        return token
