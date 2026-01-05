from jobapps.models import JobPost, Applications, User, Comment, Category
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class JobPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPost
        fields = ['id', 'name', 'company', 'address', 'employer', 'created_date', 'category']

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applications
        fields = [
            'id', 'full_name', 'email', 'phone',
            'created_date', 'cv', 'candidate', 'job_post'
        ]
        extra_kwargs = {
            'candidate': {'write_only': True},
            'job_post': {'write_only': True},
        }

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['cv'] = instance.cv.url if instance.cv else ''
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username','password', 'email', 'first_name', 'last_name', 'avatar', 'role']
        extra_kwargs = {
            'password': {'write_only': True,}
        }

    def create(self, validated_data):
        u = User(**validated_data)
        u.set_password(u.password)
        if u.role == 'candidate':
            u.is_active = True
        if u.role == 'employer':
            u.is_active = False # chờ duyệt


        u.save()
        return u

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['avatar'] = instance.avatar.url if instance.avatar else ''

        return data

class CommentSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['user'] = UserSerializer(instance.user).data

        return data

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_date', 'user', 'application']
        extra_kwargs = {
            'application': {
                'write_only': "True"
            }
        }
