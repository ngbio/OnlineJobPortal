from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from jobapps import serializers, paginators
from jobapps.models import JobPost, Applications, User, Category
from django.db.models import Count


class CategoryView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer

class IsApprovedEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return (
                user.is_authenticated and user.role == 'employer' and user.is_active
        )


class JobPostView(viewsets.ViewSet, generics.ListAPIView):
    queryset = JobPost.objects.filter(active=True)
    serializer_class = serializers.JobPostSerializer
    pagination_class = paginators.ItemPaginator
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]


    @action(methods=['post'], detail=False, permission_classes=[IsApprovedEmployer])
    def add_job(self, request):
        data = request.data.copy()
        data['employer'] = request.user.pk
        if 'category_id' in request.data:
            data['category'] = request.data.get('category_id')

        serializer = serializers.JobPostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(methods=['patch'], detail=True, permission_classes=[IsApprovedEmployer])
    def update_job(self, request, pk=None):

        job = get_object_or_404(JobPost, pk=pk)

        if job.employer != request.user:
            return Response({"detail": "Bạn không có quyền sửa bài đăng này!"},
                            status=status.HTTP_403_FORBIDDEN)

        for k, v in request.data.items():
            if k in ['name', 'company', 'salary', 'address', 'description', 'request', 'benefits', 'category_id']:
                setattr(job, k, v)

        job.save()
        return Response(serializers.JobPostSerializer(job).data, status=status.HTTP_200_OK)


    @action(methods=['delete'], detail=True, permission_classes=[IsApprovedEmployer])
    def delete_job(self, request, pk=None):

        job = get_object_or_404(JobPost, pk=pk)

        if job.employer != request.user:
            return Response({"detail": "Bạn không có quyền xóa bài đăng này!"},
                            status=status.HTTP_403_FORBIDDEN)

        job.delete()
        return Response({"message": "Xóa thành công"}, status=status.HTTP_200_OK)

    def get_queryset(self):
        query = self.queryset
        user = self.request.user

        if user.is_authenticated and user.role == 'employer':
            query = query.filter(employer=user)

        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)

        name = self.request.query_params.get('name')
        if name:
            query = query.filter(name__icontains=name)

        company = self.request.query_params.get('company')
        if company:
            query = query.filter(company__icontains=company)

        address = self.request.query_params.get('address')
        if address:
            query = query.filter(address__icontains=address)

        sort_by = self.request.query_params.get('sort_by')
        if sort_by == 'salary_asc':
            query = query.order_by('salary')
        elif sort_by == 'salary_desc':
            query = query.order_by('-salary')
        elif sort_by == 'date_asc':
            query = query.order_by('created_date')
        else:
            query = query.order_by('-created_date')


        return query


    @action(methods=['post'], detail=True, permission_classes=[permissions.IsAuthenticated])
    def apply(self, request, pk):
        if request.user.role != 'candidate':
            return Response( status=status.HTTP_403_FORBIDDEN)

        if Applications.objects.filter(job_post_id=pk, candidate=request.user).exists():
            return Response( {"detail": "Bạn đã ứng tuyển công việc này rồi."},
                        status=status.HTTP_400_BAD_REQUEST)

        data = request.data.copy()
        data['candidate'] = request.user.pk
        data['job_post'] = pk

        s = serializers.ApplicationSerializer(data=data)
        s.is_valid(raise_exception=True)
        app = s.save(candidate=request.user, job_post_id=pk)

        return Response(serializers.ApplicationSerializer(app).data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], detail=True, permission_classes=[IsApprovedEmployer])
    def applications(self, request, pk=None):
        job = self.get_object()

        if job.employer != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        applications = job.applications.filter(active=True)
        return Response(serializers.ApplicationSerializer(applications, many=True).data, status=status.HTTP_200_OK)


class ApplicationView(viewsets.ViewSet, generics.ListAPIView):
    queryset = Applications.objects.filter(active=True)
    serializer_class = serializers.ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]

    def get_queryset(self):
        query = self.queryset.select_related('job_post', 'job_post__employer')
        user = self.request.user

        if user.role == 'candidate':
            query = query.filter(candidate=user).order_by('-created_date')
        return query

    def get_permissions(self):
        if self.action.__eq__('get_comments') and self.request.method.__eq__('POST'):
            return [IsApprovedEmployer()]

        return [permissions.AllowAny()]

    @action(methods=['get', 'post'], url_path='comments', detail=True)
    def get_comments(self, request, pk = None):
        application = self.get_object()

        is_employer = (application.job_post.employer == request.user)
        is_candidate = (application.candidate == request.user)

        if not (is_employer or is_candidate):
            return Response({"detail": "Bạn không có quyền của bài đăng này!"},
                            status=status.HTTP_403_FORBIDDEN)

        if request.method.__eq__('POST'):
            s = serializers.CommentSerializer(data={
                'content': request.data.get('content'),
                'user': self.request.user.pk,
                'application': pk
            })

            if s.is_valid():
                c = s.save(user=request.user, application_id=pk)
                return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

            return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)

        comments = application.comment_set.select_related('user').filter(active=True).filter(active=True)

        p = paginators.CommentPaginator()
        page = p.paginate_queryset(comments, request)
        if page is not None:
            serializer = serializers.CommentSerializer(page, many=True)
            return p.get_paginated_response(serializer.data)

        return Response(serializers.CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)

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


class StatsView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(methods=['get'], detail=False, url_path='employer-stats')
    def employer_stats(self, request):
        if request.user.role != 'employer':
            return Response(status=status.HTTP_403_FORBIDDEN)

        stats = JobPost.objects.filter(employer=request.user).annotate(total_applications=Count('applications')
        ).values('id', 'name', 'total_applications')

        return Response(stats)

