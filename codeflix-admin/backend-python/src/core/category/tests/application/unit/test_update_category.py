from unittest.mock import create_autospec
from src.core.category.domain.category_repository import CategoryRepository
from src.core.category.application.update_category import UpdateCategory, UpdateCategoryRequest
from src.core.category.domain.category import Category


class TestUpdateCategory:
    def test_update_category_name(self):
        category = Category(
            name="Movie",
            description="Movies category",
            is_active=True,
        )
        mock_repository = create_autospec(CategoryRepository)
        mock_repository.get_by_id.return_value = category
        
        use_case = UpdateCategory(repository=mock_repository)
        request = UpdateCategoryRequest(
            id=category.id,
            name="TV Show"
        )

        use_case.execute(request)

        assert category.name == "TV Show"
        assert category.description == "Movies category"
        mock_repository.update.assert_called_once_with(category)

    def test_update_category_description(self):
        category = Category(
            name="Movie",
            description="Movies category",
            is_active=True,
        )
        mock_repository = create_autospec(CategoryRepository)
        mock_repository.get_by_id.return_value = category
        
        use_case = UpdateCategory(repository=mock_repository)
        request = UpdateCategoryRequest(
            id=category.id,
            description="TV Shows category"
        )

        use_case.execute(request)

        assert category.description == "TV Shows category"
        assert category.name == "Movie"
        mock_repository.update.assert_called_once_with(category)

    def test_deactivate_category(self):
        category = Category(
            name="Movie",
            description="Movies category",
            is_active=True,
        )
        mock_repository = create_autospec(CategoryRepository)
        mock_repository.get_by_id.return_value = category
        
        use_case = UpdateCategory(repository=mock_repository)
        request = UpdateCategoryRequest(
            id=category.id,
            is_active=False,
        )

        use_case.execute(request)

        assert category.is_active is False
        assert category.name == "Movie"
        assert category.description == "Movies category"
        mock_repository.update.assert_called_once_with(category)

    def test_activate_category(self):
        category = Category(
            name="Movie",
            description="Movies category",
            is_active=False,
        )
        mock_repository = create_autospec(CategoryRepository)
        mock_repository.get_by_id.return_value = category
        
        use_case = UpdateCategory(repository=mock_repository)
        request = UpdateCategoryRequest(
            id=category.id,
            is_active=True,
        )

        use_case.execute(request)

        assert category.is_active is True
        assert category.name == "Movie"
        assert category.description == "Movies category"
        mock_repository.update.assert_called_once_with(category)