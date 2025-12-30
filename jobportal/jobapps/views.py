from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from jobapps import serializers, paginators
from jobapps.models import JobPost, Applications, User

class IsApprovedEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return (
            user.is_authenticated and user.role == 'employer' and user.is_active
        )

class JobPostViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = JobPost.objects.filter(active=True)
    serializer_class = serializers.JobPostSerializer
    pagination_class = paginators.ItemPaginator #Phân trang

    def get_queryset(self):
        query = self.queryset

        name = self.request.query_params.get('name')
        if name:
            query = query.filter(name__icontains=name)

        employer_id = self.request.query_params.get('employer_id')
        if employer_id:
            query = query.filter(employer_id=employer_id)

        return query

    @action(methods=['post'], url_path='create',detail=False, permission_classes=[IsApprovedEmployer])
    def create_job_post(self, request):
            s = serializers.JobPostSerializer(data={
                'name': request.data.get('name'),
                'company' : request.data.get('company'),
                'description': request.data.get('description'),
                'request': request.data.get('request'),
                'salary': request.data.get('salary'),
                'employer': request.user.pk  # gán employer từ user đang login
            })
            s.is_valid(raise_exception=True)
            c = s.save()
            return Response(serializers.JobPostSerializer(c).data, status=status.HTTP_201_CREATED)

class ApplicationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Applications.objects.filter(active=True)
    serializer_class = serializers.ApplicationSerializer

class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    @action(methods=['get'], url_path='current_user', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data, status=status.HTTP_200_OK)