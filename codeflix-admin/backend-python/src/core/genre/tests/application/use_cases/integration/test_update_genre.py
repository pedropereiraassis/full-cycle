from unittest.mock import create_autospec
import uuid
import pytest

from src.core.category.domain.category import Category
from src.core.category.domain.category_repository import CategoryRepository
from src.core.category.infra.in_memory_category_repository import (
    InMemoryCategoryRepository,
)
from src.core.genre.application.use_cases.update_genre import UpdateGenre
from src.core.genre.domain.genre import Genre
from src.core.genre.domain.genre_repository import GenreRepository
from src.core.genre.infra.in_memory_genre_repository import InMemoryGenreRepository


class TestUpdateGenre:
    def test_update_genre_with_associated_categories(self):
        category_repository = InMemoryCategoryRepository()
        movie_category = Category(name="Movie")
        category_repository.save(movie_category)
        documentary_category = Category(name="Documentary")
        category_repository.save(documentary_category)

        genre_repository = InMemoryGenreRepository()
        genre = Genre(
            name="Drama", categories={movie_category.id, documentary_category.id}
        )
        genre_repository.save(genre)

        use_case = UpdateGenre(
            repository=genre_repository, category_repository=category_repository
        )

        input = UpdateGenre.Input(
            id=genre.id,
            name="Action",
            category_ids={documentary_category.id},
            is_active=False,
        )

        use_case.execute(input)

        updated_genre = genre_repository.get_by_id(genre.id)
        assert updated_genre.name == "Action"
        assert updated_genre.categories == {documentary_category.id}
        assert updated_genre.is_active is False
