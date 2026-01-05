from django.urls import path, include
from jobapps import views
from rest_framework.routers import DefaultRouter

r = DefaultRouter()
r.register('categories', views.CategoryView, basename='category')
r.register('job_post', views.JobPostView, basename='job_post')
r.register('applications', views.ApplicationView, basename='application')
r.register('users', views.UserView, basename='user')
r.register('stats', views.StatsView, basename='stats')



urlpatterns = [
    path('', include(r.urls)),
]