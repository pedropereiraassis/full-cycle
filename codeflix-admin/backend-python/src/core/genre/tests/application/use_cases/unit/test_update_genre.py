from unittest.mock import create_autospec
import uuid
import pytest

from src.core.category.domain.category import Category
from src.core.category.domain.category_repository import CategoryRepository
from src.core.genre.application.exceptions import (
    GenreNotFound,
    InvalidGenre,
    RelatedCategoriesNotFound,
)
from src.core.genre.application.use_cases.update_genre import UpdateGenre
from src.core.genre.domain.genre import Genre
from src.core.genre.domain.genre_repository import GenreRepository


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
def mock_category_repository_with_categories(
    movie_category, documentary_category
) -> CategoryRepository:
    repository = create_autospec(CategoryRepository)
    repository.list.return_value = [movie_category, documentary_category]
    return repository


@pytest.fixture
def mock_empty_category_repository() -> CategoryRepository:
    repository = create_autospec(CategoryRepository)
    repository.list.return_value = []
    return repository


class TestUpdateGenre:
    def test_when_genre_does_not_exist(
        self, mock_genre_repository, mock_category_repository_with_categories
    ):
        mock_genre_repository.get_by_id.return_value = None

        use_case = UpdateGenre(
            repository=mock_genre_repository,
            category_repository=mock_category_repository_with_categories,
        )

        input = UpdateGenre.Input(
            id=uuid.uuid4(), name="Action", category_ids=set(), is_active=True
        )

        with pytest.raises(GenreNotFound, match="Genre with .* not found"):
            use_case.execute(input=input)

        mock_genre_repository.update.assert_not_called()

    def test_when_updated_genre_is_invalid(
        self,
        movie_category,
        mock_category_repository_with_categories,
        mock_genre_repository,
    ):
        genre = Genre(name="Romance")
        mock_genre_repository.get_by_id.return_value = genre

        use_case = UpdateGenre(
            repository=mock_genre_repository,
            category_repository=mock_category_repository_with_categories,
        )

        input = UpdateGenre.Input(
            id=genre.id, name="", category_ids={movie_category.id}, is_active=True
        )

        with pytest.raises(InvalidGenre, match="name cannot be empty"):
            use_case.execute(input)

        mock_genre_repository.update.assert_not_called()

    def test_when_categories_do_not_exist(
        self,
        movie_category,
        mock_genre_repository,
        mock_empty_category_repository,
    ):
        genre = Genre(name="Romance")
        mock_genre_repository.get_by_id.return_value = genre

        use_case = UpdateGenre(
            repository=mock_genre_repository,
            category_repository=mock_empty_category_repository,
        )

        input = UpdateGenre.Input(
            id=genre.id, name="Action", category_ids={movie_category.id}, is_active=True
        )

        with pytest.raises(
            RelatedCategoriesNotFound, match="Categories not found: {.*}"
        ):
            use_case.execute(input)

        mock_genre_repository.update.assert_not_called()

    def test_when_updated_genre_is_valid_and_categories_exist(
        self,
        movie_category,
        documentary_category,
        mock_category_repository_with_categories,
        mock_genre_repository,
    ):
        genre = Genre(
            name="Romance", categories={movie_category.id, documentary_category.id}
        )
        mock_genre_repository.get_by_id.return_value = genre

        use_case = UpdateGenre(
            repository=mock_genre_repository,
            category_repository=mock_category_repository_with_categories,
        )

        input = UpdateGenre.Input(
            id=genre.id, name="Drama", category_ids={movie_category.id}, is_active=False
        )

        use_case.execute(input)

        mock_genre_repository.update.assert_called_with(
            Genre(
                id=genre.id,
                name="Drama",
                categories={movie_category.id},
                is_active=False,
            )
        )
