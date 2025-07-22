from uuid import UUID

from django.db import transaction

from src.core.video.domain.value_objects import AudioVideoMedia, MediaType
from src.core.video.domain.video import Video
from src.core.video.domain.video_repository import VideoRepository
from src.django_project.video_app.models import (
    Video as VideoORM,
    AudioVideoMedia as AudioVideoMediaORM,
)


class DjangoORMVideoRepository(VideoRepository):
    def save(self, video: Video) -> None:
        with transaction.atomic():
            video_model = VideoORM.objects.create(
                id=video.id,
                title=video.title,
                description=video.description,
                launch_year=video.launch_year,
                opened=video.opened,
                published=video.published,
                duration=video.duration,
                rating=video.rating,
            )
            video_model.categories.set(video.categories)
            video_model.genres.set(video.genres)
            video_model.cast_members.set(video.cast_members)

    def get_by_id(self, id: UUID) -> Video | None:
        try:
            video_model = VideoORM.objects.get(pk=id)
            video = Video(
                id=video_model.id,
                title=video_model.title,
                description=video_model.description,
                launch_year=video_model.launch_year,
                opened=video_model.opened,
                published=video_model.published,
                duration=video_model.duration,
                rating=video_model.rating,
                categories=set(video_model.categories.values_list("id", flat=True)),
                genres=set(video_model.genres.values_list("id", flat=True)),
                cast_members=set(video_model.cast_members.values_list("id", flat=True)),
            )
            if video_model.video:
                video.video = AudioVideoMedia(
                    name=video_model.video.name,
                    raw_location=video_model.video.raw_location,
                    encoded_location=video_model.video.encoded_location,
                    status=video_model.video.status,
                    media_type=MediaType.VIDEO,
                )

            return video
        except VideoORM.DoesNotExist:
            return None

    def delete(self, id: UUID) -> None:
        VideoORM.objects.filter(id=id).delete()

    def list(self) -> list[Video]:
        return [
            Video(
                id=video_model.id,
                title=video_model.title,
                description=video_model.description,
                launch_year=video_model.launch_year,
                published=video_model.published,
                opened=video_model.opened,
                duration=video_model.duration,
                rating=video_model.rating,
                categories=set(video_model.categories.values_list("id", flat=True)),
                genres=set(video_model.genres.values_list("id", flat=True)),
                cast_members=set(video_model.cast_members.values_list("id", flat=True)),
            )
            for video_model in VideoORM.objects.all()
        ]

    def update(self, video: Video) -> None:
        try:
            video_model = VideoORM.objects.get(pk=video.id)
        except VideoORM.DoesNotExist:
            return None
        else:
            with transaction.atomic():
                # Remove related medias - if they exist
                AudioVideoMediaORM.objects.filter(id=video_model.id).delete()

                # Update relationships with other entities/aggregates
                video_model.categories.set(video.categories)
                video_model.genres.set(video.genres)
                video_model.cast_members.set(video.cast_members)

                # Persist related medias if they exist in the entity
                video_model.video = (
                    AudioVideoMediaORM.objects.create(
                        name=video.video.name,
                        raw_location=video.video.raw_location,
                        status=video.video.status,
                        encoded_location=video.video.encoded_location,
                    )
                    if video.video
                    else None
                )

                # Update video attributes
                video_model.title = video.title
                video_model.description = video.description
                video_model.launch_year = video.launch_year
                video_model.opened = video.opened
                video_model.published = video.published
                video_model.duration = video.duration
                video_model.rating = video.rating

                video_model.save()
