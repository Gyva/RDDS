# Generated by Django 5.1 on 2024-08-27 18:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_student_user_supervisor_account_user'),
    ]

    operations = [
        migrations.RenameField(
            model_name='student',
            old_name='user',
            new_name='account',
        ),
    ]
