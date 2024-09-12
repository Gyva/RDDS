import os
import uuid
from django.db import models, IntegrityError, transaction
from django.core.validators import FileExtensionValidator
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db.models import Max

# Function to generate a unique profile picture filename
def unique_image_path(instance, filename):
    ext = filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    if isinstance(instance, Supervisor):
        return os.path.join('static/supervisor/', unique_filename)
    elif isinstance(instance, Student):
        return os.path.join('static/student/', unique_filename)

# Department Model
class User(AbstractUser):
    ROLE_CHOICES = (
        ('SUPERVISOR', 'Supervisor'),
        ('STUDENT', 'Student'),
        ('REGISTER', 'Register'),
        ('ADMIN', 'Admin'),
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
    account = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)

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
    account = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.reg_no:
            # Use a transaction to ensure atomicity
            with transaction.atomic():
                # Ensure the generated reg_no is unique
                while True:
                    # Get the highest registration number
                    last_student = Student.objects.aggregate(Max('reg_no'))['reg_no__max']
                    
                    if last_student and last_student[2:7].isdigit():
                        num_part = int(last_student[2:7]) + 1
                    else:
                        num_part = 0
                        
                    # Generate new reg_no
                    new_reg_no = f"24rp{num_part:05d}"
                    
                    # Check if the generated reg_no already exists
                    if not Student.objects.filter(reg_no=new_reg_no).exists():
                        self.reg_no = new_reg_no
                        break
                        
        super(Student, self).save(*args, **kwargs)
    
    def __str__(self):
        return f'{self.fname} {self.lname}'

