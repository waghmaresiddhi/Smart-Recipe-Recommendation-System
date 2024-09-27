# expenses/models.py
from django.db import models
from django.contrib.auth.models import User

class Expense(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    date = models.DateField()
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.category} - {self.amount} on {self.date}"

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to the user
    category = models.CharField(max_length=100)  # Budget category
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # Budget amount
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp

    def __str__(self):
        return f"{self.category} - {self.amount} (User: {self.user.username})"
