from jobapps.models import JobPost, Applications
from rest_framework import serializers

class JobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = ['id','name','employer_id']

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applications
        fields = ['id','notes', 'created_date', 'cv']
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['cv'] = instance.cv.url
        return data