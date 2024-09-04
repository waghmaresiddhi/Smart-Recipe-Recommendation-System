from django.urls import include, path
from . import views

urlpatterns = [
    path(
        "project/<int:project_id>/task/",
        views.TaskCreateView.as_view(),
        name="project-task-list-create-update",
    ),
]
