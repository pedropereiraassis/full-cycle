from dataclasses import dataclass
from decimal import Decimal
from uuid import UUID

from src.core._shared.domain.entity import Entity
from src.core.video.domain.value_objects import (
    AudioVideoMedia,
    ImageMedia,
    MediaStatus,
    MediaType,
    Rating,
)


@dataclass
class Video(Entity):
    title: str
    description: str
    launch_year: int
    duration: Decimal
    rating: Rating
    opened: bool
    published: bool

    categories: set[UUID]
    genres: set[UUID]
    cast_members: set[UUID]

    banner: ImageMedia | None = None
    thumbnail: ImageMedia | None = None
    thumbnail_half: ImageMedia | None = None
    trailer: AudioVideoMedia | None = None
    video: AudioVideoMedia | None = None

    def __post_init__(self):
        self.validate()

    def validate(self):
        if len(self.title) > 255:
            self.notification.add_error("title cannot be longer than 255")

        if not self.title:
            self.notification.add_error("title cannot be empty")

        if self.notification.has_errors:
            raise ValueError(self.notification.messages)

    def publish(self):
        if not self.video:
            self.notification.add_error("Video media is required to publish the video")
        elif self.video.status != MediaStatus.COMPLETED:
            self.notification.add_error("Video must be fully processed to be published")

        self.published = True
        self.validate()

    def update(
        self, title, description, launch_year, duration, opened, published, rating
    ):
        self.title = title
        self.description = description
        self.launch_year = launch_year
        self.duration = duration
        self.opened = opened
        self.published = published
        self.rating = rating

        self.validate()

    def add_category(self, category_id: UUID):
        self.categories.add(category_id)
        self.validate()

    def remove_category(self, category_id: UUID):
        self.categories.discard(category_id)
        self.validate()

    def add_genre(self, genre_id: UUID):
        self.genres.add(genre_id)
        self.validate()

    def remove_genre(self, genre_id: UUID):
        self.genres.discard(genre_id)
        self.validate()

    def add_cast_member(self, cast_member_id: UUID):
        self.cast_members.add(cast_member_id)
        self.validate()

    def remove_cast_member(self, cast_member_id: UUID):
        self.cast_members.discard(cast_member_id)
        self.validate()

    def update_banner(self, banner: ImageMedia):
        self.banner = banner
        self.validate()

    def update_thumbnail(self, thumbnail: ImageMedia):
        self.thumbnail = thumbnail
        self.validate()

    def update_thumbnail_half(self, thumbnail_half: ImageMedia):
        self.thumbnail_half = thumbnail_half
        self.validate()

    def update_trailer(self, trailer: AudioVideoMedia):
        self.trailer = trailer
        self.validate()

    def update_video_media(self, video: AudioVideoMedia):
        self.video = video
        self.validate()

    def process(self, status, encoded_location):
        if status == MediaStatus.COMPLETED:
            self.video = AudioVideoMedia(
                name=self.video.name,
                raw_location=self.video.raw_location,
                media_type=MediaType.VIDEO,
                status=status,
                encoded_location=encoded_location,
            )

            self.publish()
        else:
            self.video = AudioVideoMedia(
                name=self.video.name,
                raw_location=self.video.raw_location,
                media_type=MediaType.VIDEO,
                status=MediaStatus.ERROR,
                encoded_location="",
            )

        self.validate()
