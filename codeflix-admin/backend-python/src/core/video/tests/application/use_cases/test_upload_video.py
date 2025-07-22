from unittest.mock import create_autospec
from src.core._shared.events.abstract_message_bus import AbstractMessageBus
from src.core._shared.infra.storage.abstract_storage_service import (
    AbstractStorageService,
)
from src.core.video.application.events.integration_events import (
    AudioVideoMediaUpdatedIntegrationEvent,
)
from src.core.video.application.use_cases.upload_video import UploadVideo
from src.core.video.domain.value_objects import (
    AudioVideoMedia,
    MediaStatus,
    MediaType,
    Rating,
)
from src.core.video.domain.video import Video
from src.core.video.infra.in_memory_video_repository import InMemoryVideoRepository


class TestUploadVideo:
    def test_upload_video_media_to_video(self):
        video = Video(
            title="Title",
            description="Description",
            launch_year=2024,
            duration=120,
            rating=Rating.L,
            opened=False,
            published=False,
            categories=set(),
            genres=set(),
            cast_members=set(),
        )
        video_repository = InMemoryVideoRepository(videos=[video])
        mock_storage = create_autospec(AbstractStorageService)
        mock_message_bus = create_autospec(AbstractMessageBus)

        input = UploadVideo.Input(
            video_id=video.id,
            file_name="video.mp4",
            content=b"video content",
            content_type="video/mp4",
        )

        use_case = UploadVideo(
            video_repository=video_repository,
            storage_service=mock_storage,
            message_bus=mock_message_bus,
        )

        use_case.execute(input)

        mock_storage.store.assert_called_once_with(
            file_path=f"videos/{video.id}/video.mp4",
            content=b"video content",
            content_type="video/mp4",
        )
        mock_message_bus.handle.assert_called_once_with(
            [
                AudioVideoMediaUpdatedIntegrationEvent(
                    resource_id=f"{video.id}.{MediaType.VIDEO}",
                    file_path=f"videos/{video.id}/video.mp4",
                )
            ]
        )

        video_from_repo = video_repository.get_by_id(video.id)
        assert video_from_repo.video == AudioVideoMedia(
            name="video.mp4",
            raw_location=f"videos/{video.id}/video.mp4",
            encoded_location="",
            status=MediaStatus.PENDING,
            media_type=MediaType.VIDEO,
        )
