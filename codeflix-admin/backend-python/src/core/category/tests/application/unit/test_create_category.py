from unittest.mock import MagicMock
from uuid import UUID

import pytest

from src.core.category.domain.category_repository import CategoryRepository
from src.core.category.application.create_category import CreateCategory, CreateCategoryRequest, CreateCategoryResponse, InvalidCategoryData

class TestCreateCategory:
    def test_create_category_with_valid_data(self):
        mock_repository = MagicMock(CategoryRepository)
        
        use_case = CreateCategory(repository=mock_repository)
        request = CreateCategoryRequest(
            name="Movie",
            description="Movies category",
            is_active=True
        )

        response = use_case.execute(request)

        assert response.id is not None
        assert isinstance(response, CreateCategoryResponse)
        assert isinstance(response.id, UUID)
        assert mock_repository.save.called is True

    def test_create_category_with_invalid_data(self):
        mock_repository = MagicMock(CategoryRepository)

        use_case = CreateCategory(repository=mock_repository)
        request = CreateCategoryRequest(name="")

        with pytest.raises(InvalidCategoryData, match="name cannot be empty") as exec_info:
            use_case.execute(request)

        # just for knowledge:
        assert exec_info.type is InvalidCategoryData
        assert str(exec_info.value) == "name cannot be empty"

