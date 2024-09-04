import twitter
from decouple import config
from rest_framework import serializers


class TwitterAuthTokenVerification:
    """
    Class to decode user access_token and user access_token_secret
    token will combine the user access_token and access_token_secret separated by space
    """

    @staticmethod
    def validate_twitter_auth_token(access_token_key, access_token_secret):
        """Validate_twitter_auth_token method returns a twitter user profile info"""

        consumer_api_key = config("TWITTER_API_KEY")
        consumer_api_secret_key = config("TWITTER_CONSUMER_SECRET")

        try:
            api = twitter.Api(
                consumer_key=consumer_api_key,
                consumer_secret=consumer_api_secret_key,
                access_token_key=access_token_key,
                access_token_secret=access_token_secret,
            )

            user_profile_info = api.VerifyCredentials(include_email=True)
            return user_profile_info.__dict__

        except Exception as identifer:
            raise serializers.ValidationError(
                {"tokens": ["The tokens are invalid or expired"]}
            )
