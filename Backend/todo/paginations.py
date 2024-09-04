from rest_framework.pagination import PageNumberPagination


class ToDoPagination(PageNumberPagination):
    page_size = 5
