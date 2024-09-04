from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from rest_framework.exceptions import ValidationError

from bulk_todo.models import Project
from bulk_todo.serializers import TaskSerializer


class TaskCreateView(generics.CreateAPIView):
    serializer_class = TaskSerializer

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

        return super(TaskCreateView, self).get_serializer(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        project = Project.objects.get(id=kwargs["project_id"])
        if isinstance(request.data, list):
            for item in request.data:
                item["project"] = project
        else:
            raise ValidationError("Invalid Input")

        return super(TaskCreateView, self).post(request, *args, **kwargs)
