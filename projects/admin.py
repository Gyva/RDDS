from django.contrib import admin
from .models import Department, Supervisor, Faculty, Level, Student

admin.site.register(Department)
admin.site.register(Supervisor)
admin.site.register(Faculty)
admin.site.register(Level)
admin.site.register(Student)