from django.urls import path, include
from jobapps import views
from rest_framework.routers import DefaultRouter

r = DefaultRouter()
r.register('job_post', views.JobPostViewSet, basename='job_post')
r.register('applications', views.ApplicationViewSet, basename='application')
r.register('users', views.UserViewSet, basename='user')



urlpatterns = [
    path('', include(r.urls)),
]