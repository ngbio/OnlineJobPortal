from django.urls import path, include
from jobapps import views
from rest_framework.routers import DefaultRouter

r = DefaultRouter()
r.register('job_post', views.JobPostViewSet, basename='job_post')
r.register('application', views.ApplicationViewSet, basename='application')


urlpatterns = [
    path('', include(r.urls)),
]