from uuid import uuid4
from decimal import Decimal

import pytest

from src.core.video.domain.value_objects import (
    MediaType,
    Rating,
    ImageMedia,
    AudioVideoMedia,
    MediaStatus,
)
from src.core.video.domain.video import Video


@pytest.fixture
def video() -> Video:
    return Video(
        title="Sample Video",
        description="A test video",
        launch_year=2022,
        duration=Decimal("120.5"),
        rating=Rating.AGE_12,
        categories={uuid4()},
        genres={uuid4()},
        cast_members={uuid4()},
        published=False,
        opened=False,
    )


class TestVideoEntity:
    def test_valid_video(self, video: Video) -> None:
        video.validate()
        assert video.notification.has_errors is False

    def test_invalid_video(self, video: Video) -> None:
        video.title = ""
        with pytest.raises(ValueError, match="title cannot be empty"):
            video.validate()

    def test_optional_attributes(self):
        # Create a Video object with optional attributes
        video = Video(
            title="Sample Video",
            description="A test video",
            launch_year=2022,
            duration=Decimal("120.5"),
            rating=Rating.AGE_12,
            published=False,
            opened=False,
            categories={uuid4()},
            genres={uuid4()},
            cast_members={uuid4()},
            banner=ImageMedia(name="banner.jpg", location="path/to/banner"),
            thumbnail=None,  # Testing None value for an optional attribute
            trailer=AudioVideoMedia(
                name="trailer.mp4",
                raw_location="raw_path",
                encoded_location="encoded_path",
                status=MediaStatus.COMPLETED,
                media_type=MediaType.VIDEO,
            ),
        )
        assert video.notification.has_errors is False
