from uuid import UUID
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND

from src.core.category.application.exceptions import CategoryNotFound
from src.core.category.application.get_category import GetCategory, GetCategoryRequest
from src.core.category.application.list_category import (
    ListCategory,
    ListCategoryRequest,
)
from django_project.category_app.repository import DjangoORMCategoryRepository


class CategoryViewSet(viewsets.ViewSet):
    def list(self, request: Request) -> Response:
        input = ListCategoryRequest()

        use_case = ListCategory(repository=DjangoORMCategoryRepository())

        output = use_case.execute(input)

        categories = [
            {
                "id": str(category.id),
                "name": category.name,
                "description": category.description,
                "is_active": category.is_active,
            }
            for category in output.data
        ]

        return Response(
            status=HTTP_200_OK,
            data=categories,
        )

    def retrieve(self, request: Request, pk=None) -> Response:
        try:
            category_pk = UUID(pk)
        except:
            return Response(status=HTTP_400_BAD_REQUEST)

        input = GetCategoryRequest(id=category_pk)

        use_case = GetCategory(repository=DjangoORMCategoryRepository())

        try:
            output = use_case.execute(input)
        except CategoryNotFound:
            return Response(status=HTTP_404_NOT_FOUND)

        category = {
            "id": str(output.id),
            "name": output.name,
            "description": output.description,
            "is_active": output.is_active,
        }

        return Response(
            status=HTTP_200_OK,
            data=category,
        )
