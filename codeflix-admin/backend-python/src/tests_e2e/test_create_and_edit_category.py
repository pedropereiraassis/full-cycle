import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestCreateAndEditCategory:
    def test_user_can_create_and_edit_category(self) -> None:
        api_client = APIClient()

        list_response = api_client.get("/api/categories/")
        assert list_response.data == {"data": []}

        create_response = api_client.post(
            "/api/categories/",
            data={"name": "Movie", "description": "Movie description"},
        )
        assert create_response.status_code == 201
        created_category_id = create_response.data["id"]

        list_response = api_client.get("/api/categories/")
        assert list_response.data == {
            "data": [
                {
                    "id": created_category_id,
                    "name": "Movie",
                    "description": "Movie description",
                    "is_active": True,
                }
            ]
        }

        update_request = api_client.put(
            f"/api/categories/{created_category_id}/",
            data={
                "name": "Documentary",
                "description": "Documentary description",
                "is_active": False,
            },
        )
        assert update_request.status_code == 204

        list_response = api_client.get("/api/categories/")
        assert list_response.data == {
            "data": [
                {
                    "id": created_category_id,
                    "name": "Documentary",
                    "description": "Documentary description",
                    "is_active": False,
                }
            ]
        }
