from uuid import UUID

import pytest
from src.core.category.application.create_category import CreateCategory, CreateCategoryRequest, CreateCategoryResponse
from src.core.category.application.exceptions import InvalidCategoryData
from src.core.category.infra.in_memory_category_repository import InMemoryCategoryRepository


class TestCreateCategory:
    def test_create_category_with_valid_data(self):
        repository = InMemoryCategoryRepository()
        
        use_case = CreateCategory(repository=repository)
        request = CreateCategoryRequest(
            name="Movie",
            description="Movies category",
            is_active=True
        )

        response = use_case.execute(request)

        assert response.id is not None
        assert isinstance(response, CreateCategoryResponse)
        assert isinstance(response.id, UUID)
        assert len(repository.categories) == 1

        persisted_category = repository.categories[0]

        assert persisted_category.id == response.id
        assert persisted_category.name == "Movie"
        assert persisted_category.description == "Movies category"
        assert persisted_category.is_active is True
        
    def test_create_category_with_invalid_data(self):
        repository = InMemoryCategoryRepository()
        
        use_case = CreateCategory(repository=repository)
        request = CreateCategoryRequest(name="")

        with pytest.raises(InvalidCategoryData, match="name cannot be empty") as exec_info:
            use_case.execute(request)

        # just for knowledge:
        assert exec_info.type is InvalidCategoryData
        assert str(exec_info.value) == "name cannot be empty"

        assert len(repository.categories) == 0