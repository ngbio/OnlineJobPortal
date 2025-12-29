from django.contrib import admin
from django.db.models import Count
from django.utils.safestring import mark_safe
from jobapps.models import JobPost, Applications

class ApplicationsAdmin(admin.ModelAdmin):
    list_display = ['id', 'created_date', 'active']
    search_fields = ['id']
    readonly_fields = ['image_view']

    def image_view(self, obj):
        return mark_safe(f"<img src='/static/{obj.cv.name}' width='120' />")

class MyAdminSite(admin.AdminSite):
    site_header = 'Job Post'


admin_site = MyAdminSite(name='Job Post')

admin_site.register(JobPost)
admin_site.register(Applications, ApplicationsAdmin)
