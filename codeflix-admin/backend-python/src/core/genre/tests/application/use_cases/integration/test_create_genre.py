from unittest.mock import create_autospec
import uuid
import pytest

from src.core.category.domain.category import Category
from src.core.category.domain.category_repository import CategoryRepository
from src.core.category.infra.in_memory_category_repository import (
    InMemoryCategoryRepository,
)
from src.core.genre.application.use_cases.create_genre import CreateGenre
from src.core.genre.domain.genre_repository import GenreRepository
from src.core.genre.infra.in_memory_genre_repository import InMemoryGenreRepository


@pytest.fixture
def mock_genre_repository() -> GenreRepository:
    return create_autospec(GenreRepository)


@pytest.fixture
def movie_category() -> Category:
    return Category(name="Movie")


@pytest.fixture
def documentary_category() -> Category:
    return Category(name="Documentary")


@pytest.fixture
def category_repository(movie_category, documentary_category) -> CategoryRepository:
    return InMemoryCategoryRepository(categories=[movie_category, documentary_category])


class TestCreateGenre:
    def test_create_genre_with_associated_categories(
        self, movie_category, documentary_category, category_repository
    ):
        genre_repository = InMemoryGenreRepository()

        use_case = CreateGenre(
            repository=genre_repository, category_repository=category_repository
        )

        input = CreateGenre.Input(
            name="Action", category_ids={movie_category.id, documentary_category.id}
        )

        output = use_case.execute(input)

        assert isinstance(output.id, uuid.UUID)

        saved_genre = genre_repository.get_by_id(output.id)
        assert saved_genre.name == "Action"
        assert saved_genre.categories == {movie_category.id, documentary_category.id}
        assert saved_genre.is_active is True
