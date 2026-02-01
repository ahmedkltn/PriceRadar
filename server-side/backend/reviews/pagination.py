from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class ReviewPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "limit"
    max_page_size = 50

    def get_paginated_response(self, data):
        return Response({
            "page": self.page.number,
            "limit": self.get_page_size(self.request),
            "total": self.page.paginator.count,
            "reviews": data,
        })
