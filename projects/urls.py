from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, SupervisorViewSet, FacultyViewSet, LevelViewSet, StudentViewSet, login_view, PasswordResetView, PasswordResetConfirmView

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'supervisors', SupervisorViewSet)
router.register(r'faculties', FacultyViewSet)
router.register(r'levels', LevelViewSet)
router.register(r'students', StudentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view, name='login'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
     path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
]
