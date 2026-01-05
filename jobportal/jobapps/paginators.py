from rest_framework.pagination import PageNumberPagination

class ItemPaginator(PageNumberPagination):
    page_size = 20

class CommentPaginator(PageNumberPagination):
    page_size = 2