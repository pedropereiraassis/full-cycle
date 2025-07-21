from uuid import UUID
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_404_NOT_FOUND,
)

from src.core.category.application.create_category import (
    CreateCategory,
    CreateCategoryRequest,
)
from src.core.category.application.delete_category import (
    DeleteCategory,
    DeleteCategoryRequest,
)
from src.core.category.application.exceptions import CategoryNotFound
from src.core.category.application.get_category import GetCategory, GetCategoryRequest
from src.core.category.application.list_category import (
    ListCategory,
)
from src.django_project.category_app.repository import DjangoORMCategoryRepository
from src.core.category.application.update_category import (
    UpdateCategory,
    UpdateCategoryRequest,
)
from src.django_project.category_app.serializers import (
    CreateCategoryRequestSerializer,
    CreateCategoryResponseSerializer,
    DeleteCategoryRequestSerializer,
    ListCategoryResponseSerializer,
    PartialUpdateCategoryRequestSerializer,
    RetrieveCategoryRequestSerializer,
    RetrieveCategoryResponseSerializer,
    UpdateCategoryRequestSerializer,
)


class CategoryViewSet(viewsets.ViewSet):
    def list(self, request: Request) -> Response:
        order_by = request.query_params.get("order_by", "name")
        current_page = int(request.query_params.get("current_page", 1))

        input = ListCategory.Input(order_by=order_by, current_page=current_page)

        use_case = ListCategory(repository=DjangoORMCategoryRepository())

        output = use_case.execute(input)

        response_serializer = ListCategoryResponseSerializer(instance=output)

        return Response(
            status=HTTP_200_OK,
            data=response_serializer.data,
        )

    def retrieve(self, request: Request, pk=None) -> Response:
        request_serializer = RetrieveCategoryRequestSerializer(data={"id": pk})
        request_serializer.is_valid(raise_exception=True)

        input = GetCategoryRequest(id=request_serializer.validated_data["id"])

        use_case = GetCategory(repository=DjangoORMCategoryRepository())

        try:
            output = use_case.execute(input)
        except CategoryNotFound:
            return Response(status=HTTP_404_NOT_FOUND)

        response_serializer = RetrieveCategoryResponseSerializer(instance=output)

        return Response(
            status=HTTP_200_OK,
            data=response_serializer.data,
        )

    def create(self, request: Request) -> Response:
        request_serializer = CreateCategoryRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)

        input = CreateCategoryRequest(**request_serializer.validated_data)

        use_case = CreateCategory(repository=DjangoORMCategoryRepository())

        output = use_case.execute(input)

        response_serializer = CreateCategoryResponseSerializer(instance=output)

        return Response(
            status=HTTP_201_CREATED,
            data=response_serializer.data,
        )

    def update(self, request: Request, pk: UUID = None):
        serializer = UpdateCategoryRequestSerializer(
            data={
                **request.data,
                "id": pk,
            }
        )
        serializer.is_valid(raise_exception=True)

        input = UpdateCategoryRequest(**serializer.validated_data)
        use_case = UpdateCategory(repository=DjangoORMCategoryRepository())

        try:
            use_case.execute(request=input)
        except CategoryNotFound:
            return Response(status=HTTP_404_NOT_FOUND)

        return Response(status=HTTP_204_NO_CONTENT)

    def partial_update(self, request: Request, pk: UUID = None):
        serializer = PartialUpdateCategoryRequestSerializer(
            data={
                **request.data,
                "id": pk,
            }
        )
        serializer.is_valid(raise_exception=True)

        input = UpdateCategoryRequest(**serializer.validated_data)
        use_case = UpdateCategory(repository=DjangoORMCategoryRepository())

        try:
            use_case.execute(request=input)
        except CategoryNotFound:
            return Response(status=HTTP_404_NOT_FOUND)

        return Response(status=HTTP_204_NO_CONTENT)

    def destroy(self, request: Request, pk=None) -> Response:
        serializer = DeleteCategoryRequestSerializer(data={"id": pk})
        serializer.is_valid(raise_exception=True)

        input = DeleteCategoryRequest(**serializer.validated_data)
        use_case = DeleteCategory(repository=DjangoORMCategoryRepository())

        try:
            use_case.execute(input)
        except CategoryNotFound:
            return Response(status=HTTP_404_NOT_FOUND)

        return Response(status=HTTP_204_NO_CONTENT)
