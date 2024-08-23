import os
import uuid
from django.db import models
from django.core.validators import FileExtensionValidator

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
    phone = models.CharField(max_length=15)
    profile_pic = models.ImageField(upload_to=unique_image_path, validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])])
    specialization = models.CharField(max_length=255)
    dpt_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    
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
    phone = models.CharField(max_length=15)
    dpt_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    f_id = models.ForeignKey(Faculty, on_delete=models.CASCADE)
    l_id = models.ForeignKey(Level, on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to=unique_image_path, validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])])
    
    def save(self, *args, **kwargs):
        if not self.reg_no:
            last_student = Student.objects.all().order_by('st_id').last()
            if last_student:
                num_part = int(last_student.reg_no[2:7]) + 1
            else:
                num_part = 0
            self.reg_no = f"24rp{num_part:05d}"
        super(Student, self).save(*args, **kwargs)
    
    def __str__(self):
        return f'{self.fname} {self.lname}'



