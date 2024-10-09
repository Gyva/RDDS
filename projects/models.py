import os
import uuid
from django.db import models
from django.core.validators import FileExtensionValidator
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.utils.text import slugify

class User(AbstractUser):
    ROLE_CHOICES = (
        ('SUPERVISOR', 'Supervisor'),
        ('STUDENT', 'Student'),
        ('REGISTER', 'Register'),
        ('ADMIN', 'Admin'),
        ('HOD', 'Hod')
    )

    role = models.CharField(max_length=25, choices=ROLE_CHOICES, default='STUDENT')
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="custom_user_set",  # Custom related_name to avoid conflict
        blank=True,
        verbose_name="groups",
        help_text="The groups this user belongs to.",
    )
    
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="custom_user_set",  # Custom related_name to avoid conflict
        blank=True,
        verbose_name="user permissions",
        help_text="Specific permissions for this user.",
    )
# Function to generate a unique profile picture filename

def unique_image_path(instance, filename):
    ext = filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    if isinstance(instance, Supervisor):
        return os.path.join('static/supervisor/', unique_filename)
    elif isinstance(instance, Student):
        return os.path.join('static/student/', unique_filename)

# Department Model
class Department(models.Model):
    dpt_id = models.AutoField(primary_key=True)
    dpt_name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.dpt_name

# Supervisor Model
class Supervisor(models.Model):
    ROLE_CHOICES = (
        ('HoD', 'Head of Department'),
        ('Lecturer', 'Lecturer'),
    )
    
    sup_id = models.AutoField(primary_key=True)
    reg_num = models.CharField(max_length=8, unique=True, editable=False)
    fname = models.CharField(max_length=100)
    lname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(unique=True, max_length=15)
    profile_pic = models.ImageField(upload_to=unique_image_path, validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])])
    specialization = models.CharField(max_length=255)
    dpt_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
    # New field to link Supervisor to a user account
    account = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.reg_num:
            last_sup = Supervisor.objects.all().order_by('sup_id').last()
            if last_sup:
                sup_num = int(last_sup.reg_num[3:]) + 1
            else:
                sup_num = 0
            self.reg_num = f"sup{sup_num:05d}"
        super(Supervisor, self).save(*args, **kwargs)
    
    def __str__(self):
        return f'{self.fname} {self.lname}'

# Faculty Model
class Faculty(models.Model):
    f_id = models.AutoField(primary_key=True)
    f_name = models.CharField(max_length=255)
    dpt_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.f_name

# Level Model
class Level(models.Model):
    l_id = models.AutoField(primary_key=True)
    l_name = models.CharField(max_length=255)
    dpt_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    f_id = models.ForeignKey('Faculty', on_delete=models.CASCADE, default=1)
    
    class Meta:
        ordering = ['l_id'] 
        unique_together = ('f_id', 'l_name')
        
    def __str__(self):
        return self.l_name

# Student Model
class Student(models.Model):
    st_id = models.AutoField(primary_key=True)
    reg_no = models.CharField(max_length=10, unique=True, editable=False)
    fname = models.CharField(max_length=100)
    lname = models.CharField(max_length=100)
    dob = models.DateField()
    email = models.EmailField(unique=True)
    phone = models.CharField(unique=True, max_length=15)
    dpt_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    f_id = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    l_id = models.ForeignKey(Level, on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to=unique_image_path, validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])])
    
    # New field to link Student to a user account
    account = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.reg_no:
            last_stu = Student.objects.all().order_by('st_id').last()
            if last_stu:
                stud_num = int(last_stu.reg_no[4:]) + 1
            else:
                stud_num = 0
            self.reg_no = f"24rp{stud_num:05d}"
        super(Student, self).save(*args, **kwargs)
    
    def __str__(self):
        return f'{self.fname} {self.lname}'

#project model
class Project(models.Model):
    APPROVAL_STATUS_CHOICES = [
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Pending', 'Pending'),
    ]
    project_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True)  # Student submitting the project
    title = models.CharField(max_length=200, unique=True, editable=True)
    case_study = models.CharField(max_length=200)
    abstract = models.TextField()
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)  # Automatically set from student or supervisor
    supervisor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)  # Supervisor's project won't have a student
    check_status = models.BooleanField(default=False)  # AI uniqueness test
    approval_status = models.CharField(max_length=10, choices=APPROVAL_STATUS_CHOICES, default='Pending')  # Approval by supervisor/admin
    completion_status = models.BooleanField(default=False)
    collaborators = models.ManyToManyField(Student, related_name='collaborated_projects', blank=True)  # Collaborators can join after approval
    improved_project = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='improvements')
    accademic_year = models.CharField(max_length=10, null=False, default= None)

    def can_student_submit(self, student):
        has_approved_project = Project.objects.filter(student=student, approval_status=True).exists()
        return not has_approved_project

    def is_unique(self):
        # AI uniqueness check logic
        from .utils import check_project_uniqueness
        return check_project_uniqueness(self.title, self.abstract)
    

    def save(self, *args, **kwargs):
        if self.is_unique():
            self.check_status = True
        else:
            self.check_status = False
        super().save(*args, **kwargs)

#Feedback model
class Feedback(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    feedback_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Feedback'
        verbose_name_plural = 'Feedbacks'
        ordering = ['created_at']

    def __str__(self):
        return f"Feedback from {self.user} on {self.project.title}"

#Conversation model   
class Conversation(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE, related_name='conversations')
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='conversations')
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Conversation for project: {self.project.title}"

#Message model
class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Message from {self.sender.email} at {self.timestamp}"

# ProjectFile model  
def project_file_upload_path(instance, filename):
    main_student_reg_no = instance.project.student.reg_no if instance.project.student else ''
    # Get the registration numbers of all collaborators
    collaborator_reg_nos = instance.project.collaborators.values_list('reg_no', flat=True)
    
    # Combine the main student's reg_no with all collaborator reg_nos
    all_reg_nos = [main_student_reg_no] + list(collaborator_reg_nos)
    
    # Join all reg_nos with underscores
    reg_no_part = '_'.join(all_reg_nos)
    
    # Slugify the filename to avoid issues with special characters
    filename_slug = slugify(os.path.splitext(filename)[0])
    
    # Get the file extension (e.g., '.pdf', '.docx')
    extension = os.path.splitext(filename)[1]
    
    # Construct the new filename using all students' reg_no and slugified filename
    new_filename = f"{reg_no_part}_{filename_slug}{extension}"
    
    # Return the full path to store the file, e.g., "projects/documents/24rp00001_24rp00002_final-report.pdf"
    return f"projects/documents/{new_filename}"  
class ProjectFile(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    file = models.FileField(upload_to=project_file_upload_path, validators=[FileExtensionValidator(['pdf'])])
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    # Track the uploader
    uploader = models.ForeignKey(Student, on_delete=models.CASCADE)

    def __str__(self):
        return f"File for Project: {self.project.title} uploaded by {self.uploader.reg_no}"