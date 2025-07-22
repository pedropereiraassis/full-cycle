from rest_framework.test import APIClient
import pytest
from rest_framework import status

from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.core.category.domain.category import Category
from src.core.genre.domain.genre import Genre
from src.django_project.cast_member_app.repository import DjangoORMCastMemberRepository
from src.django_project.category_app.repository import DjangoORMCategoryRepository
from src.django_project.genre_app.repository import DjangoORMGenreRepository
from src.django_project.video_app.repository import DjangoORMVideoRepository


@pytest.fixture
def video_repository() -> DjangoORMVideoRepository:
    return DjangoORMVideoRepository()


@pytest.fixture
def category_documentary():
    return Category(name="Documentary", description="Documentary description")


@pytest.fixture
def category_repository() -> DjangoORMCategoryRepository:
    return DjangoORMCategoryRepository()


@pytest.fixture
def genre_romance(category_documentary) -> Genre:
    return Genre(
        name="Romance",
        is_active=True,
        categories={category_documentary.id},
    )


@pytest.fixture
def genre_repository() -> DjangoORMGenreRepository:
    return DjangoORMGenreRepository()


@pytest.fixture
def cast_member_actor():
    return CastMember(name="John Doe", type=CastMemberType.ACTOR)


@pytest.fixture
def cast_member_repository() -> DjangoORMCastMemberRepository:
    return DjangoORMCastMemberRepository()


@pytest.mark.django_db
class TestCreateAPI:
    def test_create_genre_with_associated_categories(
        self,
        video_repository,
        category_repository,
        category_documentary,
        genre_repository,
        genre_romance,
        cast_member_actor,
        cast_member_repository,
    ):
        category_repository.save(category_documentary)
        genre_repository.save(genre_romance)
        cast_member_repository.save(cast_member_actor)

        url = "/api/videos/"
        data = {
            "title": "title",
            "description": "description",
            "launch_year": 2019,
            "rating": "L",
            "duration": 1,
            "categories": [str(category_documentary.id)],
            "genres": [str(genre_romance.id)],
            "cast_members": [str(cast_member_actor.id)],
        }
        response = APIClient().post(url, data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["id"]
        saved_video_id = response.data["id"]

        saved_video = video_repository.get_by_id(saved_video_id)

        assert saved_video is not None
        assert str(saved_video.id) == saved_video_id
        assert saved_video.title == "title"
        assert saved_video.description == "description"
        assert saved_video.launch_year == 2019
        assert saved_video.rating == "L"
        assert saved_video.duration == 1
        assert saved_video.categories == {category_documentary.id}
        assert saved_video.genres == {genre_romance.id}
        assert saved_video.cast_members == {cast_member_actor.id}
