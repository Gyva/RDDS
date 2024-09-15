from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, SupervisorViewSet, FacultyViewSet, LevelViewSet, StudentViewSet, login_view

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'supervisors', SupervisorViewSet)
router.register(r'faculties', FacultyViewSet)
router.register(r'levels', LevelViewSet)
router.register(r'students', StudentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view, name='login'),
]
