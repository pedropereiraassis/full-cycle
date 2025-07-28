from datetime import datetime
from unittest.mock import create_autospec
from uuid import uuid4
import pytest

from src.application.listing import ListOutputMeta
from src.domain.category import Category
from src.domain.category_repository import CategoryRepository
from src.application.list_category import (
    ListCategory,
    ListCategoryInput,
)


class TestListCategory:
    @pytest.fixture
    def movie_category(self) -> Category:
        return Category(
            id=uuid4(),
            name="Movie",
            description="Movie category",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            is_active=True,
        )

    @pytest.fixture
    def series_category(self) -> Category:
        return Category(
            id=uuid4(),
            name="Series",
            description="Series category",
            created_at=datetime.now(),
            updated_at=datetime.now(),
            is_active=True,
        )

    def test_list_categories_with_default_values(self, series_category, movie_category):
        repository = create_autospec(CategoryRepository)
        repository.search.return_value = [series_category, movie_category]

        list_category = ListCategory(repository)
        output = list_category.execute(input=ListCategoryInput())

        assert output.data == [series_category, movie_category]
        assert output.meta == ListOutputMeta(
            page=1, per_page=5, sort="name", direction="asc"
        )
        repository.search.assert_called_once_with(
            search=None, page=1, per_page=5, sort="name", direction="asc"
        )
