from django.urls import path

from .views import (
    GoogleSocialAuthView,
    FacebookSocialAuthView,
    TwitterSocialAuthView,
    LinkedINSocialAuthView,
)

urlpatterns = [
    path("google/", GoogleSocialAuthView.as_view()),
    path("facebook/", FacebookSocialAuthView.as_view()),
    path("twitter/", TwitterSocialAuthView.as_view()),
    path("linkedin/", LinkedINSocialAuthView.as_view()),
]
