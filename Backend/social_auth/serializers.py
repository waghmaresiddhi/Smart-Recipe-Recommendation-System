import requests
from decouple import config
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed, ValidationError

from . import google, facebook, twitterhelper
from .register import register_social_user


class FacebookSocialAuthSerializer(serializers.Serializer):
    """Handles serialization of facebook related data"""

    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        user_data = facebook.Facebook.validate(auth_token)
        print(user_data)

        try:
            user_id = user_data["id"]
            email = user_data["email"]
            name = user_data["name"]
            picture = user_data["picture"]["data"]["url"]
            provider = "facebook"
            return register_social_user(
                provider=provider,
                user_id=user_id,
                email=email,
                name=name,
                picture=picture,
            )
        except Exception as identifier:
            raise serializers.ValidationError(
                "The token is invalid or expired. Please Login again"
            )


class GoogleSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        user_data = google.Google.validate(auth_token)
        try:
            user_data["sub"]
        except:
            raise serializers.ValidationError(
                "The token is invalid or expired. Please Login again"
            )

        if user_data["aud"] != config("GOOGLE_CLIENT_ID"):
            raise AuthenticationFailed("Invalid User")

        user_id = user_data["sub"]
        email = user_data["email"]
        name = user_data["name"]
        picture = user_data["picture"]
        provider = "google"

        return register_social_user(
            provider=provider, user_id=user_id, email=email, name=name, picture=picture
        )


def get_profile_details(token):
    url = "https://api.linkedin.com/v2/me"

    querystring = {
        "projection": "(id,firstName,lastName,profilePicture(displayImage~:playableStreams))"
    }

    headers = {"authorization": "Bearer {access_token}".format(access_token=token)}

    response = requests.request("GET", url, headers=headers, params=querystring)
    response = response.json()
    print(response)
    fname = response["firstName"]["localized"]["en_US"]
    lname = response["lastName"]["localized"]["en_US"]
    user_id = response["id"]
    profile_image = response["profilePicture"]["displayImage~"]["elements"][3][
        "identifiers"
    ][0]["identifier"]

    return {
        "name": fname + " " + lname,
        "profile_image": profile_image,
        "user_id": user_id,
    }


def get_email_address(token):
    url = "https://api.linkedin.com/v2/emailAddress"

    querystring = {"q": "members", "projection": "(elements*(handle~))"}

    headers = {"authorization": "Bearer {access_token}".format(access_token=token)}

    response = requests.request("GET", url, headers=headers, params=querystring)
    response = response.json()
    print(response)
    email_address = response["elements"][0]["handle~"]["emailAddress"]
    return email_address


class LinkedINSocialAuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        provider = "linkedin"
        client_id = config("LINKEDIN_CLIENT_ID")
        client_secret = config("LINKEDIN_CLIENT_SECRET")
        url = "https://www.linkedin.com/oauth/v2/accessToken"
        redirect_url = config("CLIENT_URL") + "/linkedin-login/"
        payload = "grant_type=authorization_code&code={code}&redirect_uri={redirect_uri}&client_id={id}&client_secret={secret}".format(
            code=auth_token,
            redirect_uri=redirect_url,
            id=client_id,
            secret=client_secret,
        )
        headers = {"content-type": "application/x-www-form-urlencoded"}
        response = requests.request("POST", url, data=payload, headers=headers)
        response = response.json()
        print(response)
        if response.get("access_token"):
            access_token = response.get("access_token")
            profile_details = get_profile_details(access_token)
            email = get_email_address(access_token)
            return register_social_user(
                provider=provider,
                user_id=profile_details.get("user_id"),
                email=email,
                name=profile_details.get("name"),
                picture=profile_details.get("profile_image"),
            )
        else:
            raise ValidationError("Invalid Token")


class TwitterSocialAuthSerializer(serializers.Serializer):
    access_token_key = serializers.CharField()
    access_token_secret = serializers.CharField()

    def validate(self, attrs):

        access_token_key = attrs.get("access_token_key")
        access_token_secret = attrs.get("access_token_secret")

        user_data = (
            twitterhelper.TwitterAuthTokenVerification.validate_twitter_auth_token(
                access_token_key, access_token_secret
            )
        )

        try:
            user_id = user_data["id"]
            email = user_data["email"]
            name = user_data["name"]
            provider = "twitter"
        except:
            raise serializers.ValidationError(
                "The token is invalid or expired. Please Login again"
            )

        return register_social_user(
            provider=provider, user_id=user_id, email=email, name=name
        )
