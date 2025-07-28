from uuid import UUID
from pydantic import BaseModel, HttpUrl

from src.domain.video import Rating


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    description: str


class CastMemberResponse(BaseModel):
    id: UUID
    name: str
    type: str


class GenreResponse(BaseModel):
    id: UUID
    name: str


class BannerResponse(BaseModel):
    name: str
    raw_location: HttpUrl


class VideoResponse(BaseModel):
    id: UUID
    title: str
    launch_year: int
    rating: Rating
    is_active: bool
    categories: list[CategoryResponse]
    cast_members: list[CastMemberResponse]
    genres: list[GenreResponse]
    banner: BannerResponse
