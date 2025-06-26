from uuid import UUID
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)

from src.core.genre.application.exceptions import (
    InvalidGenre,
    RelatedCategoriesNotFound,
)
from src.core.genre.application.use_cases.create_genre import CreateGenre
from src.core.genre.application.use_cases.list_genre import ListGenre
from src.django_project.genre_app.repository import DjangoORMGenreRepository
from src.django_project.genre_app.serializers import ListGenreOutputSerializer


class GenreViewSet(viewsets.ViewSet):
    def list(self, request: Request) -> Response:
        use_case = ListGenre(repository=DjangoORMGenreRepository())

        output = use_case.execute(input=ListGenre.Input())

        response_serializer = ListGenreOutputSerializer(output)

        return Response(
            status=HTTP_200_OK,
            data=response_serializer.data,
        )

    def create(self, request: Request) -> Response:
        request_serializer = CreateGenreInputSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)

        input = CreateGenre.Input(**request_serializer.validated_data)

        use_case = CreateGenre(
            repository=DjangoORMGenreRepository(),
            category_repository=DjangoORMGenreRepository(),
        )

        try:
            output = use_case.execute(input)
        except (InvalidGenre, RelatedCategoriesNotFound) as err:
            return Response(data={"error": str(err)}, status=HTTP_400_BAD_REQUEST)

        response_serializer = CreateGenreOutputSerializer(output)

        return Response(
            status=HTTP_201_CREATED,
            data=response_serializer.data,
        )

    # def update(self, request: Request, pk: UUID = None):
    #     serializer = UpdateGenreRequestSerializer(
    #         data={
    #             **request.data,
    #             "id": pk,
    #         }
    #     )
    #     serializer.is_valid(raise_exception=True)

    #     input = UpdateGenreRequest(**serializer.validated_data)
    #     use_case = UpdateGenre(repository=DjangoORMGenreRepository())

    #     try:
    #         use_case.execute(request=input)
    #     except GenreNotFound:
    #         return Response(status=HTTP_404_NOT_FOUND)

    #     return Response(status=HTTP_204_NO_CONTENT)

    # def partial_update(self, request: Request, pk: UUID = None):
    #     serializer = PartialUpdateGenreRequestSerializer(
    #         data={
    #             **request.data,
    #             "id": pk,
    #         }
    #     )
    #     serializer.is_valid(raise_exception=True)

    #     input = UpdateGenreRequest(**serializer.validated_data)
    #     use_case = UpdateGenre(repository=DjangoORMGenreRepository())

    #     try:
    #         use_case.execute(request=input)
    #     except GenreNotFound:
    #         return Response(status=HTTP_404_NOT_FOUND)

    #     return Response(status=HTTP_204_NO_CONTENT)

    # def destroy(self, request: Request, pk=None) -> Response:
    #     serializer = DeleteGenreRequestSerializer(data={"id": pk})
    #     serializer.is_valid(raise_exception=True)

    #     input = DeleteGenreRequest(**serializer.validated_data)
    #     use_case = DeleteGenre(repository=DjangoORMGenreRepository())

    #     try:
    #         use_case.execute(input)
    #     except GenreNotFound:
    #         return Response(status=HTTP_404_NOT_FOUND)

    #     return Response(status=HTTP_204_NO_CONTENT)
