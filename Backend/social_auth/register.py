import random
from decouple import config
from django.core.files.temp import NamedTemporaryFile
from django.core.files import File
from django.contrib.auth import authenticate
from urllib.request import urlopen
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from user.models import User
from user.utils import Util


class SocialTokenObtainPainSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return Util.get_token(token, user)


def generate_username(username):
    name = "".join(username.split(" ")).lower()
    if not User.objects.filter(name=name).exists():
        return name
    else:
        random_username = name + str(random.randint(0, 1000))
        return generate_username(random_username)


def register_social_user(provider, user_id, email, name, picture=None):
    filtered_user_by_email = User.objects.filter(email=email)

    if filtered_user_by_email.exists():

        if provider == filtered_user_by_email[0].auth_provider:
            register_user = authenticate(email=email, password=config("SECRET_KEY"))
            serializer = SocialTokenObtainPainSerializer(
                data={"email": email, "password": config("SECRET_KEY")}
            )
            if serializer.is_valid():
                return serializer.validated_data
        else:
            raise AuthenticationFailed(
                detail="Please continue your login using "
                + filtered_user_by_email[0].auth_provider
            )

    else:
        user = {
            "name": generate_username(name),
            "email": email,
            "password": config("SECRET_KEY"),
        }
        user = User.objects.create_user(**user)
        user.is_verified = True
        user.auth_provider = provider
        if picture:
            img_obj = NamedTemporaryFile()
            img_obj.write(urlopen(picture).read())
            img_obj.flush()
            user.profile_image.save(str(user.unique_id) + ".png", File(img_obj))

        user.save()

        new_user = authenticate(email=email, password=config("SECRET_KEY"))
        print(new_user)
        serializer = SocialTokenObtainPainSerializer(
            data={"email": email, "password": config("SECRET_KEY")}
        )
        if serializer.is_valid():
            return serializer.validated_data
