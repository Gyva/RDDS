# Generated by Django 5.1 on 2024-10-16 23:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0014_rename_academic_year_project_accademic_year'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='supervisor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='projects.supervisor'),
        ),
    ]
