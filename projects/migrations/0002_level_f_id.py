# Generated by Django 5.1 on 2024-08-21 21:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='level',
            name='f_id',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='projects.faculty'),
        ),
    ]
