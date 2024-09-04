# Generated by Django 3.1.5 on 2022-08-03 05:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0002_auto_20220802_1954'),
    ]

    operations = [
        migrations.CreateModel(
            name='ImageStorage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(blank=True, null=True, upload_to='mobile_images')),
            ],
        ),
        migrations.RemoveField(
            model_name='mobile',
            name='images',
        ),
        migrations.CreateModel(
            name='MobileImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_storage', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mobile_image', to='ecommerce.imagestorage')),
                ('mobile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mobile_image', to='ecommerce.mobile')),
            ],
        ),
    ]
