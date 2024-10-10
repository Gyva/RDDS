from rest_framework import serializers
from .models import Department, Supervisor, Faculty, Level, Student, User, Project, Feedback, Conversation, Message, ProjectFile
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth import get_user_model

#Users serializer
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email','role','first_name','last_name'] 

#Login serializer
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)  # Handle both email and registration number
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        username_or_email = data.get('username')
        password = data.get('password')

        # Check if the user exists based on username or email
        user = User.objects.filter(username=username_or_email).first() or \
               User.objects.filter(email=username_or_email).first()

        if user and user.check_password(password):
            # If authentication is successful
            return {
                'id': user.id,
                'username': user.username,
                'role': user.role
            }
        else:
            raise serializers.ValidationError('Invalid credentials.')

# Department serializer
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class SupervisorSerializer(serializers.ModelSerializer):

    phone = serializers.CharField(max_length=10)

    class Meta:
        model = Supervisor
        fields = '__all__'

    def validate_phone(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        if not (value.startswith('078') or value.startswith('079') or value.startswith('073') or value.startswith('072')):
            raise serializers.ValidationError("Phone number must start with 078, 079, 073, or 072.")
        if len(value) != 10:
            raise serializers.ValidationError("Phone number must be exactly 10 digits long.")
        return value

class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = '__all__'

class LevelSerializer(serializers.ModelSerializer):
    f_id = serializers.PrimaryKeyRelatedField(queryset=Faculty.objects.none())

    class Meta:
        model = Level
        fields = ['l_id', 'l_name', 'dpt_id', 'f_id']

    def __init__(self, *args, **kwargs):
        super(LevelSerializer, self).__init__(*args, **kwargs)

        # If 'dpt_id' is provided, filter the faculties accordingly
        department_id = self.initial_data.get('dpt_id') if hasattr(self, 'initial_data') else None
        if department_id:
            self.fields['f_id'].queryset = Faculty.objects.filter(dpt_id=department_id)
        else:
            self.fields['f_id'].queryset = Faculty.objects.none()

    def validate(self, data):
        # Validate that the selected faculty belongs to the selected department
        department = data.get('dpt_id')
        faculty = data.get('f_id')

        if faculty and department and faculty.dpt_id != department:
            raise serializers.ValidationError("Selected faculty does not belong to the selected department.")

        return data

class StudentSerializer(serializers.ModelSerializer):
    f_id = serializers.PrimaryKeyRelatedField(queryset=Faculty.objects.none())
    l_id = serializers.PrimaryKeyRelatedField(queryset=Level.objects.none())
    phone = serializers.CharField(max_length=10)

    class Meta:
        model = Student
        fields =['st_id', 'reg_no', 'fname', 'lname', 'dob', 'email', 'phone', 'dpt_id', 'f_id', 'l_id', 'profile_pic','account']

    def __init__(self, *args, **kwargs):
        super(StudentSerializer, self).__init__(*args, **kwargs)

        # Get the department ID and faculty ID from the request context
        request = self.context.get('request')
        if request:
            department_id = request.data.get('dpt_id') if 'dpt_id' in request.data else None
            faculty_id = request.data.get('f_id') if 'f_id' in request.data else None
            
            # Update queryset for faculties based on department ID
            if department_id:
                self.fields['f_id'].queryset = Faculty.objects.filter(dpt_id=department_id)
            else:
                self.fields['f_id'].queryset = Faculty.objects.none()
            
            # Update queryset for levels based on department ID and faculty ID
            if department_id and faculty_id:
                self.fields['l_id'].queryset = Level.objects.filter(dpt_id=department_id, f_id=faculty_id)
            else:
                self.fields['l_id'].queryset = Level.objects.none()

    def validate_phone(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        if not (value.startswith('078') or value.startswith('073') or value.startswith('072')):
            raise serializers.ValidationError("Phone number must start with 078, 073, or 072.")
        if len(value) != 10:
            raise serializers.ValidationError("Phone number must be exactly 10 digits long.")
        return value
    
    def validate(self, data):
        department = data.get('dpt_id')
        faculty = data.get('f_id')
        level = data.get('l_id')

        if faculty and department and faculty.dpt_id != department:
            raise serializers.ValidationError("Selected faculty does not belong to the selected department.")
        
        if level and department and level.dpt_id != department:
            raise serializers.ValidationError("Selected level does not belong to the selected department.")
        
        if level and faculty and level.f_id != faculty:
            raise serializers.ValidationError("Selected level does not belong to the selected faculty.")

        return data
    
#Reset password serializer
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        username = data.get('username')
        
        try:
            user = User.objects.get(email=email, username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with the provided email and username combination.")
        
        self.context['user'] = user
        return data

    def save(self):      
        user = self.context['user']
        # Generate password reset token
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))

        # Create password reset URL
        reset_url = f"http://localhost:3000/reset-password/{uid}/{token}/"

        # Send password reset email
        subject = "Password Reset Request"
        message = f"Hi {user.username}, click the link below to reset your password and please don't reply to this email: {reset_url}"
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

        return user
    
class PasswordResetConfirmSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        uid = data.get('uidb64')
        token = data.get('token')
        new_password = data.get('new_password')
        confirm_new_password = data.get('confirm_new_password')

        if new_password != confirm_new_password:
            raise serializers.ValidationError("The two password fields didn't match.")

        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            raise serializers.ValidationError("Invalid reset link.")

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            raise serializers.ValidationError("Invalid or expired token.")

        return data

    def save(self):
        uid = self.validated_data['uidb64']
        user = User.objects.get(pk=urlsafe_base64_decode(uid).decode())

        # Validate the new password
        new_password = self.validated_data['new_password']
        validate_password(new_password, user)

        # Set the new password
        user.set_password(new_password)
        user.save()

        return user
    
# Change password serializer
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = self.context['request'].user

        # Check if the old password is correct
        if not user.check_password(data['old_password']):
            raise serializers.ValidationError({"old_password": "Old password is incorrect."})

        # Validate that new password and confirm password match
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({"confirm_new_password": "New passwords do not match."})

        return data

    def save(self, **kwargs):
        user = self.context['request'].user
        new_password = self.validated_data['new_password']

        # Validate new password using Django's built-in password validation
        validate_password(new_password, user)

        # Set the new password
        user.set_password(new_password)
        user.save()

        return user

# Project serializer
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['project_id','title', 'case_study', 'abstract', 'collaborators','check_status','approval_status', 'completion_status', 'department_id', 'student_id', 'supervisor_id', 'improved_project_id', 'accademic_year']

    def create(self, validated_data):
        request = self.context.get('request', None)
        user = request.user
        validated_data['department'] = user.profile.department

        if user.is_student:
            validated_data['student'] = user.student_profile
        elif user.is_supervisor:
            validated_data['supervisor'] = user.supervisor_profile

        return super().create(validated_data)
    
#Feedback serializer
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id', 'project', 'user', 'feedback_text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

#Message serializer
class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'text', 'timestamp']

#Conversation serializaers
class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'project', 'participants', 'messages', 'created_at']

# ProjectFile serializer
class ProjectFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFile
        fields = ['id', 'project', 'file', 'uploader', 'uploaded_at']
        read_only_fields = ['uploaded_at']