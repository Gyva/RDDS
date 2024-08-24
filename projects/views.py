from rest_framework import viewsets, serializers
from .models import Department, Supervisor, Faculty, Level, Student
from .serializers import DepartmentSerializer, SupervisorSerializer, FacultySerializer, LevelSerializer, StudentSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

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

class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        dpt_id = self.request.query_params.get('dpt_id', None)
        if dpt_id:
            queryset = queryset.filter(dpt_id=dpt_id)
        return queryset

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