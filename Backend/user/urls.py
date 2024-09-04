from django.urls import path

from user import views

urlpatterns = [
    path("profile/", views.UserProfileApiView().as_view(), name="profile"),
    path(
        "change_password/",
        views.ChangePasswordAPIView.as_view(),
        name="change_password",
    ),
]
