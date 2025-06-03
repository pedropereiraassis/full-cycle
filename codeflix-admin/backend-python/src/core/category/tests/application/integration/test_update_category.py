from uuid import UUID
import uuid

import pytest

from src.core.category.application.update_category import UpdateCategory, UpdateCategoryRequest
from src.core.category.application.exceptions import CategoryNotFound
from src.core.category.domain.category import Category
from src.core.category.infra.in_memory_category_repository import InMemoryCategoryRepository


class TestUpdateCategory:
    def test_update_category_name_and_description_deactivate(self):
        category = Category(
            name="Movie",
            description="Movies category",
            is_active=True,
        )

        repository = InMemoryCategoryRepository()
        repository.save(category=category)

        use_case = UpdateCategory(repository=repository)

        request = UpdateCategoryRequest(
            id=category.id,
            name="TV Show",
            description="TV Shows category",
            is_active=False
        )

        use_case.execute(request)

        updated_category = repository.get_by_id(id=category.id)

        assert updated_category.name == "TV Show"
        assert updated_category.description == "TV Shows category"
        assert updated_category.is_active is False

    def test_update_category_with_invalid_name(self):
        category = Category(
            name="Movie",
            description="Movies category",
            is_active=True,
        )

        repository = InMemoryCategoryRepository()
        repository.save(category=category)

        use_case = UpdateCategory(repository=repository)

        request = UpdateCategoryRequest(
            id=category.id,
            name="*"*256
        )

        with pytest.raises(ValueError):
            use_case.execute(request)

        repository.get_by_id(id=category.id)
