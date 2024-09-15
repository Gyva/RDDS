from rest_framework import serializers
from .models import Department, Supervisor, Faculty, Level, Student, User
from django.contrib.auth import authenticate

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