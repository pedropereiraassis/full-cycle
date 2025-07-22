from uuid import UUID

from rest_framework import viewsets, status
from rest_framework.request import Request
from rest_framework.response import Response

from src.core._shared.events.message_bus import MessageBus
from src.core._shared.infra.storage.local_storage import LocalStorage
from src.core.video.application.use_cases.create_video_without_media import (
    CreateVideoWithoutMedia,
)
from src.core.video.application.use_cases.exceptions import (
    InvalidVideo,
    RelatedEntitiesNotFound,
    VideoNotFound,
)
from src.core.video.application.use_cases.upload_video import UploadVideo
from src.django_project.cast_member_app.repository import DjangoORMCastMemberRepository
from src.django_project.category_app.repository import DjangoORMCategoryRepository
from src.django_project.genre_app.repository import DjangoORMGenreRepository
from src.django_project.video_app.repository import DjangoORMVideoRepository
from src.django_project.video_app.serializers import (
    CreateVideoRequestSerializer,
    CreateVideoResponseSerializer,
)


class VideoViewSet(viewsets.ViewSet):
    def list(self, request: Request) -> Response:
        raise NotImplementedError

    def create(self, request: Request) -> Response:
        request_serializer = CreateVideoRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)

        input = CreateVideoWithoutMedia.Input(**request_serializer.validated_data)

        use_case = CreateVideoWithoutMedia(
            video_repository=DjangoORMVideoRepository(),
            category_repository=DjangoORMCategoryRepository(),
            cast_member_repository=DjangoORMCastMemberRepository(),
            genre_repository=DjangoORMGenreRepository(),
        )

        try:
            output = use_case.execute(input)
        except (InvalidVideo, RelatedEntitiesNotFound) as err:
            return Response(
                data={"error": str(err)}, status=status.HTTP_400_BAD_REQUEST
            )

        response_serializer = CreateVideoResponseSerializer(output)

        return Response(
            status=status.HTTP_201_CREATED,
            data=response_serializer.data,
        )

    def destroy(self, request: Request, pk: UUID = None):
        raise NotImplementedError

    def update(self, request: Request, pk: UUID = None):
        raise NotImplementedError

    def partial_update(self, request: Request, pk: UUID = None):
        file = request.FILES["video_file"]
        content = file.read()
        content_type = file.content_type

        upload_video = UploadVideo(
            video_repository=DjangoORMVideoRepository(),
            storage_service=LocalStorage(),
            message_bus=MessageBus(),
        )

        input = UploadVideo.Input(
            video_id=pk,
            file_name=file.name,
            content=content,
            content_type=content_type,
        )

        try:
            upload_video.execute(input)
        except VideoNotFound:
            return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)
