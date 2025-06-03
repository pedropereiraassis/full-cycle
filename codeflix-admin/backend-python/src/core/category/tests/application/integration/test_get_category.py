from uuid import UUID
import uuid

import pytest

from src.core.category.application.get_category import GetCategory, GetCategoryRequest, GetCategoryResponse
from src.core.category.application.exceptions import CategoryNotFound
from src.core.category.domain.category import Category
from src.core.category.infra.in_memory_category_repository import InMemoryCategoryRepository


class TestGetCategory:
    def test_get_category_by_id(self):
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

        use_case = GetCategory(repository=repository)

        request = GetCategoryRequest(
            id=category_movie.id,
        )

        response = use_case.execute(request)

        assert response == GetCategoryResponse(
            id=category_movie.id,
            name="Movie",
            description="Movies category",
            is_active=True,
        )

    def test_get_category_when_does_not_exist(self):
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

        use_case = GetCategory(repository=repository)

        not_found_id = uuid.uuid4()

        request = GetCategoryRequest(
            id=not_found_id,
        )

        with pytest.raises(CategoryNotFound) as exec:
            use_case.execute(request)
