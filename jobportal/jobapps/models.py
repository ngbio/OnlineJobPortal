from django.contrib.auth.models import AbstractUser
from django.db import models
from cloudinary.models import CloudinaryField

class User(AbstractUser):
    role = models.CharField(choices=[
        ('employer', 'Employer'),
        ('candidate', 'Candidate')], max_length=50)

    avatar = CloudinaryField(null=True)

    def __str__(self):
        return self.username

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class JobPost(BaseModel):
    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_posts', limit_choices_to={'role':'employer', 'is_active': True})
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
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
    job_post = models.ForeignKey(JobPost, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role':'candidate'})
    full_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=200)
    phone = models.CharField(max_length=200)
    cv = CloudinaryField(null=True)

    class Meta:
        unique_together = ('job_post', 'candidate')

    def __str__(self):
        return self.full_name

class Interaction(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False,  limit_choices_to={'role':'employer', 'is_active': True})
    application = models.ForeignKey(Applications, on_delete=models.CASCADE, null=False)

    class Meta:
        abstract = True


class Comment(Interaction):
    content = models.TextField(null=False, blank=False)

    def __str__(self):
        return self.content

