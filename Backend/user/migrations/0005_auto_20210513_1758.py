# Generated by Django 3.1.5 on 2021-05-13 12:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0004_auto_20210513_1727'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_image',
            field=models.FileField(blank=True, null=True, upload_to='file_storage'),
        ),
    ]
