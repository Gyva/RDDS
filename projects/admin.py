from django.contrib import admin
from .models import Department, Supervisor, Faculty, Level, Student, User, Project

admin.site.register(Department)
admin.site.register(Supervisor)
admin.site.register(Faculty)
admin.site.register(Level)
admin.site.register(Student)
admin.site.register(User)
admin.site.register(Project)