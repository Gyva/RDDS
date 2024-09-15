from rest_framework import viewsets, serializers
from .models import Department, Supervisor, Faculty, Level, Student, User
from .serializers import DepartmentSerializer, SupervisorSerializer, FacultySerializer, LevelSerializer, StudentSerializer, LoginSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model, login
from rest_framework.decorators import api_view

# Login view
@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user_data = serializer.validated_data

        # Log the user in (without session handling as it's token-based)
        user = User.objects.get(username=user_data['username'])
        login(request, user)

        return Response({
            'id': user_data['id'],
            'username': user_data['username'],
            'role': user_data['role']
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Department view
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

User = get_user_model()

# Supervisor view
class SupervisorViewSet(viewsets.ModelViewSet):
    queryset = Supervisor.objects.all()
    serializer_class = SupervisorSerializer

    def perform_create(self, serializer):
        department = serializer.validated_data['dpt_id']
        role = serializer.validated_data['role']

        if role == 'HoD':
            if Supervisor.objects.filter(dpt_id=department, role='HoD').exists():
                raise serializers.ValidationError("A department can only have one HoD.")
        
        serializer.save()

    @action(detail=False, methods=['get'], url_path='search-supervisor')
    def search_supervisor(self, request):
        reg_num = request.query_params.get('reg_num', None)

        if reg_num:
            try:
                supervisor = Supervisor.objects.get(reg_num=reg_num)
                #check if the student already has a linked user account
                if hasattr(supervisor, 'account') and supervisor.account:
                    return Response({"error": "This supervisor already has an account."}, status=status.HTTP_400_BAD_REQUEST)

                # Return the supervisor details to proceed with account creation
                serializer = self.get_serializer(supervisor)
                return Response({
                    "supervisor": serializer.data,
                    "reg_num": reg_num  # Include reg_num to pass it to the frontend
                }, status=status.HTTP_200_OK)
            except Supervisor.DoesNotExist:
                return Response({"error": "Supervisor not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Please provide a reg_num"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='create-account-supervisor')
    def create_account_supervisor(self, request):
        reg_num = request.data.get('reg_num', None)
        password = request.data.get('password', None)
        confirm_password = request.data.get('confirm_password', None)

        if not reg_num:
            return Response({"error": "Registration number is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not password or not confirm_password:
            return Response({"error": "Both password and confirm password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validate the password strength
            try:
                validate_password(password)
            except ValidationError as e:
                return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

            supervisor = Supervisor.objects.get(reg_num=reg_num)
            if supervisor.account:
                return Response({"error": "This supervisor already has a user account."}, status=status.HTTP_400_BAD_REQUEST)

            # Create User with hashed password
            user = User.objects.create_user(
                username=supervisor.reg_num,
                first_name=supervisor.fname,
                last_name=supervisor.lname,
                email=supervisor.email,
                password=password,
                role = "SUPERVISOR"
            )

            # Link the created user to the supervisor
            supervisor.account = user
            supervisor.save()

            return Response({"success": "Supervisor account created successfully."}, status=status.HTTP_201_CREATED)

        except Supervisor.DoesNotExist:
            return Response({"error": "Supervisor not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Faculty view
class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        dpt_id = self.request.query_params.get('dpt_id', None)
        if dpt_id:
            queryset = queryset.filter(dpt_id=dpt_id)
        return queryset

# Level view
class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        f_id = self.request.query_params.get('f_id', None)
        if f_id:
            queryset = queryset.filter(f_id=f_id)
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

# Student view
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_serializer_context(self):
        # Provide the department ID and faculty ID in the context for the serializer
        context = super().get_serializer_context()
        request = self.request

        # Extract `dpt_id` and `f_id` from the request data
        context['dpt_id'] = request.data.get('dpt_id') if request.data else None
        context['f_id'] = request.data.get('f_id') if request.data else None
        return context

        # Custom action for searching student by reg_num
    @action(detail=False, methods=['get'], url_path='search-student')
    def search_student(self, request):
        reg_num = request.query_params.get('reg_num', None)

        if reg_num:
            try:
                student = Student.objects.get(reg_no=reg_num)
                #check if the student already has a linked user account
                if hasattr(student, 'account') and student.account:
                    return Response({"error": "This student already has an account."}, status=status.HTTP_400_BAD_REQUEST)

                # Return the student details to proceed with account creation
                serializer = self.get_serializer(student)
                return Response({
                    "student": serializer.data,
                    "reg_num": reg_num  # Include reg_num to pass it to the frontend
                }, status=status.HTTP_200_OK)
            except Student.DoesNotExist:
                return Response({"error": "student not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Please provide a reg_num"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='create-account-student')
    def create_account_student(self, request):
        reg_num = request.data.get('reg_num', None)
        password = request.data.get('password', None)
        confirm_password = request.data.get('confirm_password', None)

        if not reg_num:
            return Response({"error": "Registration number is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not password or not confirm_password:
            return Response({"error": "Both password and confirm password are required."}, status=status.HTTP_400_BAD_REQUEST)

        if password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validate the password strength
            try:
                validate_password(password)
            except ValidationError as e:
                return Response({"error": e.messages}, status=status.HTTP_400_BAD_REQUEST)

            student = Student.objects.get(reg_no=reg_num)
            if student.account:
                return Response({"error": "This student already has a user account."}, status=status.HTTP_400_BAD_REQUEST)

            # Create User with hashed password
            user = User.objects.create_user(
                username=student.reg_no,
                first_name=student.fname,
                last_name=student.lname,
                email=student.email,
                password=password,
                role = "STUDENT"
            )

            # Link the created user to the student
            student.account = user
            student.save()

            return Response({"success": "student account created successfully."}, status=status.HTTP_201_CREATED)

        except Student.DoesNotExist:
            return Response({"error": "student not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)