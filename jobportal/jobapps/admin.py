from django.contrib import admin
from django.utils.safestring import mark_safe
from jobapps.models import JobPost, Applications, User, Comment, Category
from django.urls import path
from django.db.models import Count
from django.template.response import TemplateResponse


class ApplicationsAdmin(admin.ModelAdmin):
    list_display = ['id','full_name','created_date', 'active']
    search_fields = ['id']
    readonly_fields = ['image_view']

    def image_view(self, obj):
        return mark_safe(f"<img src='/static/{obj.cv.name}' width='120' />")



class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'role', 'is_active')

class MyAdminSite(admin.AdminSite):
    site_header = 'Job Post'

    def get_urls(self):
        return [path('stats-view/', self.stats_view)] + super().get_urls()

    def stats_view(self, request):
        stats_category = Category.objects.annotate(count=Count('jobpost')).values('id', 'name', 'count')
        stats_application = JobPost.objects.annotate(count=Count('applications')).values('id', 'name', 'count')

        return TemplateResponse(request, 'admin/stats.html', {'stats_application': stats_application, 'stats_category': stats_category})


admin_site = MyAdminSite(name='Job Post')

admin_site.register(Category)
admin_site.register(User)
admin_site.register(JobPost)
admin_site.register(Applications, ApplicationsAdmin)
admin_site.register(Comment)

