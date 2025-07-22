import uuid
import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
class TestCreateVideoWithoutFile:
    def test_user_can_create_video_without_file(self) -> None:
        api_client = APIClient()

        create_response = api_client.post(
            "/api/categories/",
            data={"name": "Movie", "description": "Movie description"},
        )
        assert create_response.status_code == 201
        created_category_id = create_response.data["id"]

        create_response = api_client.post(
            "/api/genres/",
            data={
                "name": "Drama",
                "categories": [
                    created_category_id,
                ],
            },
        )
        assert create_response.status_code == 201
        created_genre_id = create_response.data["id"]

        create_response = api_client.post(
            "/api/cast_members/",
            data={
                "name": "John Doe",
                "type": "ACTOR",
            },
        )
        assert create_response.status_code == 201
        created_cast_member_id = create_response.data["id"]

        create_response = api_client.post(
            "/api/videos/",
            data={
                "title": "title",
                "description": "description",
                "launch_year": 2019,
                "opened": True,
                "rating": "L",
                "duration": 1,
                "categories": [created_category_id],
                "genres": [created_genre_id],
                "cast_members": [created_cast_member_id],
            },
        )
        assert create_response.status_code == 201
        created_video_id = create_response.data["id"]

        assert created_video_id is not None

    def test_user_cannot_create_video_with_invalid_data(self) -> None:
        api_client = APIClient()

        create_response = api_client.post(
            "/api/videos/",
            data={
                "title": "",
                "description": "",
                "opened": True,
                "categories": [],
                "genres": [],
                "cast_members": [],
            },
        )
        assert create_response.status_code == 400
        assert create_response.data == {
            "title": ["This field may not be blank."],
            "launch_year": ["This field is required."],
            "rating": ["This field is required."],
            "duration": ["This field is required."],
        }
