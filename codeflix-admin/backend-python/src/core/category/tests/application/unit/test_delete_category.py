from unittest.mock import create_autospec
from uuid import UUID
import uuid

import pytest

from src.core.category.domain.category_repository import CategoryRepository
from src.core.category.application.delete_category import DeleteCategory, DeleteCategoryRequest
from src.core.category.application.exceptions import CategoryNotFound
from src.core.category.domain.category import Category

class TestDeleteCategory:
    def test_delete_category(self):
        category = Category(
            name="Movie",
            description="Movies category",
        )
        mock_repository = create_autospec(CategoryRepository)
        mock_repository.get_by_id.return_value = category

        use_case = DeleteCategory(mock_repository)
        request = DeleteCategoryRequest(
            id=category.id,
        )

        use_case.execute(request)

        mock_repository.delete.assert_called_once_with(category.id)

    def test_delete_category_not_found(self):
        mock_repository = create_autospec(CategoryRepository)
        mock_repository.get_by_id.return_value = None

        use_case = DeleteCategory(mock_repository)
        request = DeleteCategoryRequest(
            id=uuid.uuid4(),
        )

        with pytest.raises(CategoryNotFound):
            use_case.execute(request)

        mock_repository.delete.assert_not_called()