from django.db import models
from user.models import User


class ToDo(models.Model):
    task = models.CharField(max_length=500, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed = models.BooleanField()
    user = models.ForeignKey(User, related_name="todo", on_delete=models.CASCADE)

    def __str__(self):
        return self.task
