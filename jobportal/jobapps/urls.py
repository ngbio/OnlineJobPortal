from django.urls import path, include
from jobapps import views
from rest_framework.routers import DefaultRouter

r = DefaultRouter()
r.register('job_post', views.JobPostView, basename='job_post')
r.register('applications', views.ApplicationView, basename='application')
r.register('users', views.UserView, basename='user')



urlpatterns = [
    path('', include(r.urls)),
]