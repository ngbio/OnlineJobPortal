from rest_framework import viewsets, generics
from jobapps import serializers, paginators
from jobapps.models import JobPost, Applications

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

class ApplicationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Applications.objects.filter(active=True)
    serializer_class = serializers.ApplicationSerializer