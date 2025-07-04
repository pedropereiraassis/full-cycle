import uuid
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from src.django_project.category_app.repository import DjangoORMCategoryRepository
from src.core.category.domain.category import Category


@pytest.fixture
def category_movie():
    return Category(name="Movie", description="Movie description")


@pytest.fixture
def category_documentary():
    return Category(name="Documentary", description="Documentary description")


@pytest.fixture
def category_repository() -> DjangoORMCategoryRepository:
    return DjangoORMCategoryRepository()


@pytest.mark.django_db
class TestListAPI:
    def test_list_categories(
        self,
        category_movie: Category,
        category_documentary: Category,
        category_repository: DjangoORMCategoryRepository,
    ) -> None:
        category_repository.save(category_movie)
        category_repository.save(category_documentary)

        url = "/api/categories/"
        response = APIClient().get(url)

        expected_data = {
            "data": [
                {
                    "id": str(category_movie.id),
                    "name": "Movie",
                    "description": "Movie description",
                    "is_active": True,
                },
                {
                    "id": str(category_documentary.id),
                    "name": "Documentary",
                    "description": "Documentary description",
                    "is_active": True,
                },
            ]
        }

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["data"]) == 2
        assert response.data == expected_data


@pytest.mark.django_db
class TestRetrieveAPI:
    def test_when_id_is_invalid_return_400(self):
        url = "/api/categories/1234/"
        response = APIClient().get(url)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_return_category_when_exists(
        self,
        category_movie: Category,
        category_documentary: Category,
        category_repository: DjangoORMCategoryRepository,
    ):
        category_repository.save(category_movie)
        category_repository.save(category_documentary)

        url = f"/api/categories/{category_documentary.id}/"
        response = APIClient().get(url)

        expected_data = {
            "data": {
                "id": str(category_documentary.id),
                "name": "Documentary",
                "description": "Documentary description",
                "is_active": True,
            }
        }

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_data

    def test_return_404_when_not_exists(self):
        url = f"/api/categories/{uuid.uuid4()}/"
        response = APIClient().get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestCreateAPI:
    def test_when_payload_is_invalid_return_400(self):
        url = "/api/categories/"
        response = APIClient().post(
            url, data={"name": "", "description": "Movie description"}
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_when_payload_is_valid_return_201(
        self,
        category_repository: DjangoORMCategoryRepository,
    ):
        url = "/api/categories/"
        response = APIClient().post(
            url, data={"name": "Movie", "description": "Movie description"}
        )

        assert response.status_code == status.HTTP_201_CREATED

        created_category_id = uuid.UUID(response.data["id"])
        assert category_repository.get_by_id(created_category_id) == Category(
            id=created_category_id,
            name="Movie",
            description="Movie description",
        )
        assert category_repository.list() == [
            Category(
                id=created_category_id,
                name="Movie",
                description="Movie description",
            )
        ]


@pytest.mark.django_db
class TestUpdateAPI:
    def test_when_request_data_is_valid_return_204(
        self,
        category_movie: Category,
        category_repository: DjangoORMCategoryRepository,
    ) -> None:
        category_repository.save(category_movie)

        url = f"/api/categories/{category_movie.id}/"
        data = {
            "name": "Not Movie",
            "description": "Another description",
            "is_active": False,
        }
        response = APIClient().put(url, data=data)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not response.data
        updated_category = category_repository.get_by_id(category_movie.id)
        assert updated_category.name == "Not Movie"
        assert updated_category.description == "Another description"
        assert updated_category.is_active is False

    def test_when_request_data_is_invalid_then_return_400(self) -> None:
        url = "/api/categories/1234/"
        data = {
            "name": "",
            "description": "Movie description",
        }
        response = APIClient().put(url, data=data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {
            "id": ["Must be a valid UUID."],
            "name": ["This field may not be blank."],
            "is_active": ["This field is required."],
        }

    def test_when_category_with_id_does_not_exist_then_return_404(
        self,
    ) -> None:
        url = f"/api/categories/{uuid.uuid4()}/"
        data = {
            "name": "Not Movie",
            "description": "Another description",
            "is_active": False,
        }
        response = APIClient().put(url, data=data)

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestPartialUpdateAPI:
    def test_when_request_data_is_invalid_return_400(self) -> None:
        url = "/api/categories/1234/"
        data = {
            "name": "",
            "description": "Movie description",
        }
        response = APIClient().patch(url, data=data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data == {
            "id": ["Must be a valid UUID."],
            "name": ["This field may not be blank."],
        }

    def test_when_category_with_id_does_not_exist_return_404(
        self,
    ) -> None:
        url = f"/api/categories/{uuid.uuid4()}/"
        data = {
            "name": "Not Movie",
            "description": "Another description",
            "is_active": False,
        }
        response = APIClient().patch(url, data=data)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_when_update_all_data_return_204(
        self,
        category_movie: Category,
        category_repository: DjangoORMCategoryRepository,
    ) -> None:
        category_repository.save(category_movie)

        url = f"/api/categories/{category_movie.id}/"
        data = {
            "name": "TV Show",
            "description": "TV Show description",
            "is_active": False,
        }
        response = APIClient().patch(url, data=data)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        updated_category = category_repository.get_by_id(category_movie.id)
        assert updated_category.name == "TV Show"
        assert updated_category.description == "TV Show description"
        assert updated_category.is_active is False

    def test_when_update_only_name_return_204(
        self,
        category_movie: Category,
        category_repository: DjangoORMCategoryRepository,
    ) -> None:
        category_repository.save(category_movie)

        url = f"/api/categories/{category_movie.id}/"
        data = {
            "name": "TV Show",
        }
        response = APIClient().patch(url, data=data)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        updated_category = category_repository.get_by_id(category_movie.id)
        assert updated_category.name == "TV Show"
        assert updated_category.description == "Movie description"
        assert updated_category.is_active is True

    def test_when_update_only_description_return_204(
        self,
        category_movie: Category,
        category_repository: DjangoORMCategoryRepository,
    ) -> None:
        category_repository.save(category_movie)

        url = f"/api/categories/{category_movie.id}/"
        data = {
            "description": "TV Show description",
        }
        response = APIClient().patch(url, data=data)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        updated_category = category_repository.get_by_id(category_movie.id)
        assert updated_category.name == "Movie"
        assert updated_category.description == "TV Show description"
        assert updated_category.is_active is True

    def test_when_update_only_is_active_return_204(
        self,
        category_movie: Category,
        category_repository: DjangoORMCategoryRepository,
    ) -> None:
        category_repository.save(category_movie)

        url = f"/api/categories/{category_movie.id}/"
        data = {"is_active": False}
        response = APIClient().patch(url, data=data)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        updated_category = category_repository.get_by_id(category_movie.id)
        assert updated_category.name == "Movie"
        assert updated_category.description == "Movie description"
        assert updated_category.is_active is False


@pytest.mark.django_db
class TestDeleteAPI:
    def test_when_id_is_invalid_return_400(self):
        url = "/api/categories/1234/"
        response = APIClient().delete(url)

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_when_category_does_not_exist_return_404(self):
        url = f"/api/categories/{uuid.uuid4()}/"
        response = APIClient().delete(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_when_category_exist_return_204(
        self,
        category_movie: Category,
        category_repository: DjangoORMCategoryRepository,
    ):
        category_repository.save(category_movie)

        url = f"/api/categories/{category_movie.id}/"
        response = APIClient().delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert category_repository.get_by_id(category_movie.id) is None
        assert category_repository.list() == []
