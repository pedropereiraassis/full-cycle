from unittest.mock import MagicMock, create_autospec
from uuid import UUID

from src.core.category.domain.category_repository import CategoryRepository
from src.core.category.application.get_category import GetCategory, GetCategoryRequest, GetCategoryResponse
from src.core.category.domain.category import Category

class TestGetCategory:
    def test_create_category_with_valid_data(self):
        category = Category(
            name="Movie",
            description="Movies category",
            is_active=True,
        )
        mock_repository = create_autospec(CategoryRepository)
        mock_repository.get_by_id.return_value = category
        
        use_case = GetCategory(repository=mock_repository)
        request = GetCategoryRequest(
            id=category.id,
        )

        response = use_case.execute(request)

        assert response == GetCategoryResponse(
            id=category.id,
            name="Movie",
            description="Movies category",
            is_active=True,
        )
