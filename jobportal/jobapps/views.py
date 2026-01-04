from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from jobapps import serializers, paginators
from jobapps.models import JobPost, Applications, User, Comment


class IsApprovedEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return (
            user.is_authenticated and user.role == 'employer' and user.is_active
        )

class JobPostView(viewsets.ViewSet, generics.ListAPIView):
    queryset = JobPost.objects.filter(active=True)
    serializer_class = serializers.JobPostSerializer
    pagination_class = paginators.ItemPaginator #Phân trang

    def get_queryset(self):
        query = self.queryset

        name = self.request.query_params.get('name')
        if name:
            query = query.filter(name__icontains=name)

        company = self.request.query_params.get('company')
        if company:
            query = query.filter(company__icontains=company)

        address = self.request.query_params.get('address')
        if address:
            query = query.filter(address__icontains=address)


        return query

    @action(methods=['post'], url_path='create_job',detail=False, permission_classes=[IsApprovedEmployer])
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

    @action(methods=['get'], detail=True, permission_classes=[IsApprovedEmployer])
    def applications(self, request):
        job = self.get_object()

        # CHỈ employer sở hữu job mới xem được
        if job.employer != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        applications = job.applications.filter(active=True)

        return Response(serializers.ApplicationSerializer(applications, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['patch'], url_path='update_job', detail=True, permission_classes=[IsApprovedEmployer])
    def get_job_post(self, request, pk):
        job = self.get_object()

        if job.employer != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)


        for k, v in request.data.items():
            if k in ['name', 'company', 'description', 'request', 'salary']:
                setattr(job, k, v)
        job.save()
        return Response(serializers.JobPostSerializer(job).data, status=status.HTTP_200_OK)


class ApplicationView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Applications.objects.filter(active=True)
    serializer_class = serializers.ApplicationSerializer

    @action(methods=['post'], url_path='create_application',detail=True, permission_classes=[permissions.IsAuthenticated])
    def create_application(self, request, pk):

        if request.user.role != 'candidate':
            return Response(status=status.HTTP_403_FORBIDDEN)

        s = serializers.ApplicationSerializer(data={
                'full_name': request.data.get('full_name'),
                'email' : request.data.get('email'),
                'phone': request.data.get('phone'),
                'cv': request.data.get('cv'),
                'candidate': request.user.pk, # gán employer từ user đang login
                'job_post': pk,
            })
        s.is_valid(raise_exception=True)
        c = s.save()
        return Response(serializers.ApplicationSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['get', 'post'], url_path='comments', detail=True, permission_classes=[IsApprovedEmployer])
    def get_comments(self, request, pk):
        application = self.get_object()
        user = request.user

        if application.candidate != user and application.job_post.employer != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if request.method.__eq__('POST'):
            if user.role != 'employer':
                return Response(status=status.HTTP_403_FORBIDDEN)

            s = serializers.CommentSerializer(data={
                'content': request.data.get('content'),
                'user': self.request.user.pk,
                'application': pk
            })
            s.is_valid(raise_exception=True)
            c = s.save()
            return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

        comments = self.get_object().comment_set.select_related('user').filter(active=True)

        p = paginators.CommentPaginator()
        page = p.paginate_queryset(comments, self.request)
        if page is not None:
            serializer = serializers.CommentSerializer(page, many=True)
            return p.get_paginated_response(serializer.data)

        return Response(serializers.CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)

    def get_queryset(self):
        user = self.request.user

        if user.role == 'candidate':
            return Applications.objects.filter(candidate=user, active=True)
        if user.role == 'employer':
            return Applications.objects.filter(job_post__employer=user,active=True)

        return Applications.objects.none()

class UserView(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    @action(methods=['get', 'patch'], url_path='current-user', detail=False,
            permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        u = request.user
        if request.method.__eq__('PATCH'):
            for k, v in request.data.items():
                if k in ['first_name', 'last_name', 'email']:
                    setattr(u, k, v)
            u.save()

        return Response(serializers.UserSerializer(u).data, status=status.HTTP_200_OK)

