from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from bulk_todo.models import Project, Task


class ModelObjectidField(serializers.Field):
    """
    We use this when we are doing bulk create/update. Since multiple instances share
    many of the same fk objects we validate and query the objects first, then modify the request data
    with the fk objects. This allows us to pass the objects in to be validated.
    """

    def to_representation(self, value):
        return value.id

    def to_internal_value(self, data):
        return data


class CurrentProjectDefault(object):
    requires_context = True

    def __call__(self, serializer_field):
        try:
            self.project = Project.objects.get(
                id=serializer_field.context["request"].parser_context["kwargs"][
                    "project_id"
                ]
            )
        except ObjectDoesNotExist:
            raise ValidationError("Project does not exist.")

        return self.project


class BulkCreateListSerializer(serializers.ListSerializer):
    project = ModelObjectidField()

    def create(self, validated_data):
        result = [self.child.create(attrs) for attrs in validated_data]
        task_ids = Task.objects.values_list("id", flat=True)
        try:
            list_obj = self.child.Meta.model.objects.bulk_create(result)
        except IntegrityError as e:
            raise ValidationError(e)
        print(task_ids)
        new_tasks = Task.objects.exclude(id__in=task_ids)
        print(new_tasks)
        update_project_last_modified(result)
        for x in list_obj:
            print(x)
        print(result)
        return new_tasks

    # def to_representation(self, instances):
    #
    #     # start = time.time()
    #     project = instances[0].project.pk
    #     rep_list = []
    #     for instance in instances:
    #         rep_list.append(
    #             dict(
    #                 id=instance.pk,
    #                 project=project,
    #                 description=instance.description,
    #                 name=instance.name,
    #                 last_modified=instance.last_modified,
    #             )
    #         )
    #
    #     # print("to_rep", time.time() - start)
    #
    #     return rep_list


def update_project_last_modified(instances):
    if isinstance(instances, list):
        project = instances[0].project
        project.last_modified = timezone.now()
        project.save()
        pass


class TaskSerializer(serializers.ModelSerializer):
    project = serializers.HiddenField(default=CurrentProjectDefault())

    def create(self, validated_data):
        instance = Task(**validated_data)
        if isinstance(self._kwargs["data"], dict):
            instance.save()
        return instance

    class Meta:
        model = Task
        fields = ("id", "name", "project", "description", "last_modified")
        read_only_fields = ("id", "last_modified")
        list_serializer_class = BulkCreateListSerializer
