# Generated by Django 5.1 on 2024-08-22 15:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_level_f_id'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='level',
            options={'ordering': ['l_id']},
        ),
    ]
