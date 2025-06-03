from unittest.mock import create_autospec
from src.core.category.domain.category_repository import CategoryRepository
from src.core.category.application.list_category import CategoryOutput, ListCategory, ListCategoryRequest, ListCategoryResponse
from src.core.category.domain.category import Category


class TestListCategory:
    def test_list_category_with_empty_data(self):
        mock_repository = create_autospec(CategoryRepository)
        mock_repository.list.return_value = []
        
        use_case = ListCategory(repository=mock_repository)
        request = ListCategoryRequest()

        response = use_case.execute(request)

        assert response == ListCategoryResponse(data=[])

    def test_list_category_with_filled_data(self):
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
        mock_repository = create_autospec(CategoryRepository)
        mock_repository.list.return_value = [
            category_movie,
            category_tv_show,
        ]
        
        use_case = ListCategory(repository=mock_repository)
        request = ListCategoryRequest()

        response = use_case.execute(request)

        assert response == ListCategoryResponse(
            data=[
                CategoryOutput(
                    id=category_movie.id,
                    name=category_movie.name,
                    description=category_movie.description,
                    is_active=category_movie.is_active,
                ),
                CategoryOutput(
                    id=category_tv_show.id,
                    name=category_tv_show.name,
                    description=category_tv_show.description,
                    is_active=category_tv_show.is_active,
                ),
            ]
        )
