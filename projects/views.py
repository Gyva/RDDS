from rest_framework import viewsets, serializers, permissions, filters
from .models import Department, Supervisor, Faculty, Level, Student, User, Project, Feedback, Conversation, Message
from .serializers import DepartmentSerializer, SupervisorSerializer, FacultySerializer, LevelSerializer, StudentSerializer, LoginSerializer, PasswordResetSerializer, PasswordResetConfirmSerializer, ChangePasswordSerializer, ProjectSerializer, FeedbackSerializer, ConversationSerializer, MessageSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model, login
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .utils import check_improvement_similarity
from django.db import transaction
from django.conf import settings

# Login view
@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user_data = serializer.validated_data
        user = User.objects.get(username=user_data['username'])

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            'id': user_data['id'],
            'username': user_data['username'],
            'role': user_data['role'],
            'access_token': access_token,  # Access token for authentication
            'refresh_token': str(refresh),  # Refresh token to get new access tokens
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#  Logout view
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
# Change passwordview
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password has been changed successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Password resetview
class PasswordResetView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Password reset email sent.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#Password reset confirmation view   
class PasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
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
        
        supervisor=serializer.save()
        # Send email after the supervisor is successfully registered
        subject = "Supervisor Registration Successful"
        message = f"Hello {supervisor.fname} {supervisor.lname},\n\n" \
                  f"You have been successfully registered as a supervisor. Here are your details:\n\n" \
                  f"Registration Number: {supervisor.reg_num}\n" \
                  f"Email: {supervisor.email}\n\n" \
                  "You can use this registration number to create your account."
        
        # Make sure email sending does not affect the response
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [supervisor.email],  # Send email to the supervisor's registered email
                fail_silently=False,
            )
        except Exception as e:
            # Handle exceptions but don’t stop registration process
            print(f"Error sending email: {str(e)}")

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(
            {"message": "Supervisor created successfully. An email has been sent to the registered email address."},
            status=status.HTTP_201_CREATED
        )

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
            
            # Determine the role based on the supervisor's role
            if supervisor.role == 'Lecturer':
                user_role = 'SUPERVISOR'
            elif supervisor.role == 'HoD':
                user_role = 'HOD'
            else:
                return Response({"error": "Invalid role for supervisor."}, status=status.HTTP_400_BAD_REQUEST)

            # Create User with hashed password
            user = User.objects.create_user(
                username=supervisor.reg_num,
                first_name=supervisor.fname,
                last_name=supervisor.lname,
                email=supervisor.email,
                password=password,
                role = user_role
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
        # Get faculty by specific ID
        f_id = self.request.query_params.get('f_id', None)
        if f_id:
            queryset = queryset.filter(f_id=f_id)
        
        # Filter by department if provided
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
        
        # Get level by specific ID
        l_id = self.request.query_params.get('l_id', None)
        if l_id:
            queryset = queryset.filter(l_id=l_id)
        
        # Filter by faculty if provided
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

    def perform_create(self, serializer):
        student = serializer.save()

        # Send email after the student is successfully registered
        subject = "Student Registration Successful"
        message = f"Hello {student.fname} {student.lname},\n\n" \
                  f"You have been successfully registered as a student. Here are your details:\n\n" \
                  f"Registration Number: {student.reg_no}\n" \
                  f"Email: {student.email}\n\n" \
                  "You can use this registration number to create your account."
        
        # Make sure email sending does not affect the response
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [student.email],  # Send email to the student's registered email
                fail_silently=False,
            )
        except Exception as e:
            # Handle exceptions but don’t stop registration process
            print(f"Error sending email: {str(e)}")

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(
            {"message": "Student created successfully. An email has been sent to the registered email address."},
            status=status.HTTP_201_CREATED
        )

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
        
# Project viewset
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'project_id',
        'title',
        'case_study',
        'abstract',
        'check_status',
        'approval_status',
        'completion_status',
        'accademic_year',
    ]

    def create(self, request, *args, **kwargs):
        user = request.user
        
        if not (user.role == 'STUDENT' or user.role == 'SUPERVISOR'):
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create project object without saving to validate uniqueness
        project = Project(
            title=serializer.validated_data.get('title'),
            case_study=serializer.validated_data.get('case_study'),
            abstract=serializer.validated_data.get('abstract')
        )
        
         # Set department and assign user based on role
        if user.role == 'STUDENT':
            student = Student.objects.get(account=user)
            project.department = student.dpt_id
            project.student = student
        elif user.role == 'SUPERVISOR':
            supervisor = Supervisor.objects.get(account=user)
            project.department = supervisor.dpt_id
            project.supervisor = supervisor

        # Run the AI uniqueness check
        if project.is_unique():
            project.save()

            # Send notification email
            send_mail(
                'Project Submission Successful',
                'Your project has been successfully submitted and passed the uniqueness check!',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )

            return Response({"detail": "Project successfully submitted and passed the uniqueness check!"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"detail": "Project submission failed. The title or abstract is too similar to an existing project. Please innovate or provide more improvements."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Assign a project to a student (HoD or Supervisor)
    @action(detail=True, methods=['post'], url_path='assign-student', url_name='assign_student')
    def assign_student(self, request, pk=None):
        project = self.get_object()

        # Ensure the user is either Supervisor or HoD
        if request.user.role not in ['SUPERVISOR', 'HOD']:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Ensure the project is approved
        if not project.check_status or project.approval_status != 'Approved':
            return Response({'error': 'Project must pass AI uniqueness check and be approved before assigning a student.'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Get the student to be assigned
        student_id = request.data.get('student_id')
        student = get_object_or_404(Student, pk=student_id)

        # Check if the student already has an approved project
        if Project.objects.filter(student=student, approval_status='Approved').exists():
            return Response({'error': 'Student already has an approved project. Cancel the existing one to assign a new project.'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Ensure the student belongs to the same department and is in Level 6 Year 3 or Level 7 B-Tech
        if student.dpt_id != project.department or student.l_id.l_name not in ['Level 6 Year 3', 'Level 7 B-Tech']:
            return Response({'error': 'Student is not eligible for assignment.'}, status=status.HTTP_400_BAD_REQUEST)

        # Assign the student to the project
        project.student = student
        project.save()

        # Send notification email to both student and supervisor
        send_mail(
            'Project Assigned',
            f'Student {student.fname} {student.lname} has been assigned to your project.',
            settings.DEFAULT_FROM_EMAIL,
            [student.account.email, project.supervisor.account.email],
            fail_silently=False,
        )

        return Response({'message': f'Student {student.fname} {student.lname} assigned to project.'}, status=status.HTTP_200_OK)

    # Add a collaborator to a project (HoD or Supervisor)
    @action(detail=True, methods=['post'], url_path='add-collaborator', url_name='add_collaborator')
    def add_collaborator(self, request, pk=None):
        project = self.get_object()

        # Ensure the user is either Supervisor or HoD
        if request.user.role not in ['SUPERVISOR', 'HOD']:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        # Ensure the project is approved
        if not project.check_status or project.approval_status != 'Approved':
            return Response({'error': 'Project must pass AI uniqueness check and be approved before adding collaborators.'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Check if the primary student is assigned to the project
        if not project.student:
            return Response({'error': 'No primary student assigned to the project.'}, status=status.HTTP_400_BAD_REQUEST)

        primary_student = project.student

        # Get the collaborator to be added
        collaborator_id = request.data.get('collaborator_id')
        collaborator = get_object_or_404(Student, pk=collaborator_id)

        # Check if the collaborator already has an approved project
        if Project.objects.filter(collaborators=collaborator, approval_status='Approved').exists():
            return Response({'error': 'Collaborator already has an approved project. Cancel the existing one to add as a collaborator.'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Ensure the collaborator is from the same department and level as the primary student
        if collaborator.dpt_id != primary_student.dpt_id or collaborator.l_id != primary_student.l_id:
            return Response({'error': 'Collaborator must be from the same department and level as the primary student.'}, 
                            status=status.HTTP_400_BAD_REQUEST)

        # Add the collaborator to the project
        project.collaborators.add(collaborator)
        project.save()

        # Send notification email
        send_mail(
            'Collaborator Added',
            f'Collaborator {collaborator.fname} {collaborator.lname} has been added to your project.',
            settings.DEFAULT_FROM_EMAIL,
            [primary_student.account.email, collaborator.account.email],
            fail_silently=False,
        )

        return Response({'message': f'Collaborator {collaborator.fname} {collaborator.lname} added to project.'}, 
                        status=status.HTTP_200_OK)
    
    # Change Approval Status
    @action(detail=True, methods=['patch'], url_path='change-approval-status', url_name='change_approval_status')
    def change_approval_status(self, request, pk=None):
        project = self.get_object()
        
        # Ensure the user is HoD
        if request.user.role != 'HOD':
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        approval_status = request.data.get('approval_status')
        if approval_status not in ['Approved', 'Rejected']:
            return Response({"detail": "Invalid approval status."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the student already has an approved project
        student = project.student
        if student and approval_status == 'Approved':
            existing_approved_project = Project.objects.filter(student=student, approval_status='Approved').exclude(pk=project.pk).exists()
        if existing_approved_project:
            return Response({"detail": "This student already has an approved project. Approval denied."}, 
                            status=status.HTTP_400_BAD_REQUEST)


        project.approval_status = approval_status
        project.save()

        # Send notification email
        send_mail(
            'Project Approval Status Changed',
            f'The approval status of your project has been changed to {approval_status}.',
            settings.DEFAULT_FROM_EMAIL,
            [student.account.email],
            fail_silently=False,
        )

        return Response({"message": f"Approval status updated to {approval_status}."}, status=status.HTTP_200_OK)
    
    # Mark Project as Completed
    @action(detail=True, methods=['patch'], url_path='mark-completed', url_name='mark_completed')
    def mark_completed(self, request, pk=None):
        project = self.get_object()

        # Ensure the user is Supervisor or HoD
        if request.user.role not in ['SUPERVISOR', 'HOD']:
            return Response({"detail": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        project.completion_status = True
        project.save()

        # Send notification email
        send_mail(
            'Project Marked as Completed',
            'Your project has been marked as completed.',
            settings.DEFAULT_FROM_EMAIL,
            [project.student.account.email],
            fail_silently=False,
        )

        return Response({"message": "Project marked as completed."}, status=status.HTTP_200_OK)
        
        # Submit improved project
    @action(detail=True, methods=['post'], url_path='improve-project', url_name='improve_project')
    def improve_project(self, request, pk=None):
        try:
            original_project = self.get_object()  # Get the original project by ID (pk)

            # Ensure the project is completed
            if not original_project.completion_status:
                return Response({"error": "You can only improve a completed project."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Ensure the requesting user is a student
            if not hasattr(request.user, 'student'):
                return Response({"error": "Only students can submit improved projects."},
                                status=status.HTTP_403_FORBIDDEN)

            student = request.user.student  # Access student instance linked to the user

            # Check if the student is eligible (Level 6 Year 3 or Level 7 B-Tech)
            if student.l_id.l_name not in ['Level 6 Year 3', 'Level 7 B-Tech']:
                return Response({"error": "You are not eligible to submit an improved project."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Ensure the student has no other approved project
            if Project.objects.filter(student=student, approval_status='Approved').exists():
                return Response({"error": "You already have an approved project."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Check that the student's department matches the project's department
            if student.dpt_id != original_project.department:
                return Response({"error": "You can only improve projects from your own department."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Get the submitted data
            title = request.data.get('title', original_project.title)  # Allow title change
            abstract = request.data.get('abstract')
            case_study = request.data.get('case_study', original_project.case_study)
            collaborators = request.data.get('collaborators', [])

            # Ensure abstract is provided
            if not abstract:
                return Response({"error": "Abstract is required for an improved project."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Supervisor is automatically set to the original project's supervisor
            supervisor = original_project.supervisor

            # Run the improvement similarity check (from utils.py)
            improvement_valid = check_improvement_similarity(original_project.abstract, abstract)
            if not improvement_valid:
                return Response({"error": "The improvement is insufficient or too similar to the original project."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Validate collaborators
            valid_collaborators = []
            for collaborator_id in collaborators:
                try:
                    collaborator = Student.objects.get(pk=collaborator_id)
                    # Check if the collaborator is from the same department and eligible level
                    if (collaborator.dpt_id == student.dpt_id and
                            collaborator.l_id.l_name in ['Level 6 Year 3', 'Level 7 B-Tech']):
                        valid_collaborators.append(collaborator)
                    else:
                        return Response({"error": f"Collaborator with ID {collaborator_id} is not eligible."},
                                        status=status.HTTP_400_BAD_REQUEST)
                except Student.DoesNotExist:
                    return Response({"error": f"Collaborator with ID {collaborator_id} not found."},
                                    status=status.HTTP_400_BAD_REQUEST)

            # Create the improved project
            with transaction.atomic():
                improved_project = Project.objects.create(
                    title=title,
                    abstract=abstract,
                    case_study=case_study,
                    supervisor=supervisor,  # Keep the original supervisor
                    student=student,
                    improvement_of=original_project,
                    department=original_project.department,  # Same department
                    check_status=False,  # New project must go through the approval process
                    approval_status='Pending',  # HoD must approve it
                    completion_status=False
                )

                # Add valid collaborators
                improved_project.collaborators.set(valid_collaborators)

            return Response({"message": "Improved project submitted successfully!"},
                            status=status.HTTP_201_CREATED)

        except Project.DoesNotExist:
            return Response({"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
    
#Feedback viewset
class ProvideFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        """
        Handle feedback submission for a project.
        """
        try:
            project = Project.objects.get(project_id=project_id)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found.'}, status=status.HTTP_404_NOT_FOUND)

        feedback_text = request.data.get('feedback_text', None)

        if feedback_text is not None:
            # Check if the user is allowed to provide feedback
            if request.user.role == 'HOD' or (request.user.role == 'SUPERVISOR' and request.user == project.supervisor):
                feedback = Feedback.objects.create(
                    project=project,
                    user=request.user,
                    feedback_text=feedback_text
                )
                return Response({'message': 'Feedback submitted successfully.', 'feedback_id': feedback.id}, status=status.HTTP_201_CREATED)

            return Response({'error': 'You do not have permission to provide feedback on this project.'}, status=status.HTTP_403_FORBIDDEN)

        return Response({'error': 'Feedback text is required.'}, status=status.HTTP_400_BAD_REQUEST)
    

class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        project_id = self.request.query_params.get('project_id', None)
        
        # If a project_id is provided, filter conversations by that project
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        return queryset

    def create(self, request, *args, **kwargs):
        project_id = request.data.get('project_id')
        project = get_object_or_404(Project, pk=project_id)
        conversation, created = Conversation.objects.get_or_create(project=project)
        
        # Add participants (student, supervisor, collaborators, HoD)
        participants = [
            project.student.account,
            project.supervisor.account,
            *[collaborator.account for collaborator in project.collaborators.all()],
            project.department.hod.account
        ]
        conversation.participants.add(*participants)

        serializer = self.get_serializer(conversation)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='send-message')
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        text = request.data.get('text')

        # Create the message
        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            text=text
        )

        message_serializer = MessageSerializer(message)
        return Response(message_serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.request.query_params.get('conversation_id')
        return Message.objects.filter(conversation_id=conversation_id)

        # Optional filter for fetching messages before a certain timestamp
        before = self.request.query_params.get('before')
        if before:
            queryset = queryset.filter(timestamp__lt=before)
        
        return queryset.order_by('timestamp')  # Order by newest first

