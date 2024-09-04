# Generated by Django 3.1.5 on 2021-05-14 04:01
import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0007_populate_uuid_values'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='unique_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
