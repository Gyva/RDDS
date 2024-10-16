from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, SupervisorViewSet, FacultyViewSet, LevelViewSet, StudentViewSet, login_view, PasswordResetView, PasswordResetConfirmView, ChangePasswordView, LogoutView, ProjectViewSet, ProvideFeedbackView, ConversationViewSet, MessageViewSet, ProjectFileViewSet, UserViewSet
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'supervisors', SupervisorViewSet)
router.register(r'faculties', FacultyViewSet)
router.register(r'levels', LevelViewSet)
router.register(r'students', StudentViewSet)
router.register(r'projects', ProjectViewSet, basename='projects')
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'messages', MessageViewSet, basename='message')
router.register(r'project-files', ProjectFileViewSet, basename='projectfile')
# router.register(r'feedbacks', ProvideFeedbackView, basename='feedback')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view, name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password-reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('projects/<int:project_id>/feedback/', ProvideFeedbackView.as_view(), name='provide_feedback'),
]
