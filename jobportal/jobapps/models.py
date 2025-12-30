from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField

class User(AbstractUser):
    role = models.CharField(choices=[
        ('employer', 'Employer'),
        ('candidate', 'Candidate')], max_length=50, default='candidate')

    avatar = CloudinaryField(null=True)

    def __str__(self):
        return self.username


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class JobPost(BaseModel):
    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_posts', limit_choices_to={'role':'employer'})
    name = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    description = models.TextField(null=True)
    request = models.TextField(null=True)
    salary = models.IntegerField(null=True)
    address = models.TextField(null=True)
    benefits = models.TextField(null=True)

    def __str__(self):
        return self.name


class Applications(BaseModel):
    job_post = models.ForeignKey(JobPost, on_delete=models.CASCADE)
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'candidate'})
    notes = models.TextField(null=True)
    applied = models.TextField(null=True)
    cv = CloudinaryField()

    def __str__(self):
        return self.notes


class Payment(BaseModel):
    pass
    # name = models.TextField(null=True)
    # amount = models.IntegerField(null=True)
    # price = models.IntegerField(null=True)
    # User = models.ForeignKey(User, on_delete=models.CASCADE)
    #
    # def __str__(self):
    #     return self.name