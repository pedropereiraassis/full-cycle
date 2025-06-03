from uuid import UUID
import uuid

import pytest

from src.core.category.application.delete_category import DeleteCategory, DeleteCategoryRequest
from src.core.category.application.exceptions import CategoryNotFound
from src.core.category.domain.category import Category
from src.core.category.infra.in_memory_category_repository import InMemoryCategoryRepository


class TestDeleteCategory:
    def test_delete_category(self):
        category_movie = Category(
            name="Movie",
            description="Movies category",
            is_active=True,
        )
        category_tv_show = Category(
            name="TV Show",
            description="TV Shows category",
            is_active=True,
        )

        repository = InMemoryCategoryRepository(
            categories=[category_movie, category_tv_show]
        )

        use_case = DeleteCategory(repository=repository)

        request = DeleteCategoryRequest(
            id=category_movie.id,
        )

        assert repository.get_by_id(category_movie.id) is not None
    
        response = use_case.execute(request)

        assert response is None
        assert repository.get_by_id(category_movie.id) is None
