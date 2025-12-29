from jobapps.models import JobPost, Applications, User
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

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username','password', 'email', 'first_name', 'last_name', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only': True,
            }
        }

    def create(self, validated_data):
        u = User(**validated_data)
        u.set_password(u.password)
        u.save()

        return u

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['avatar'] = instance.avatar.url if instance.avatar else None

        return data
