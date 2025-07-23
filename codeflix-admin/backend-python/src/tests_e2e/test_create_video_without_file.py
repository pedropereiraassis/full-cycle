import pytest
from rest_framework.test import APIClient

import jwt
import os

from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization


@pytest.fixture
def auth_client():
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    private_key_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption(),
    ).decode()

    public_key = private_key.public_key()
    public_key_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    ).decode()

    # 2. Define a env var que seu código usa
    os.environ["AUTH_PUBLIC_KEY"] = (
        public_key_pem.replace("-----BEGIN PUBLIC KEY-----\n", "")
        .replace("-----END PUBLIC KEY-----", "")
        .replace("\n", "")
    )

    rsa_keys = {
        "private_key_pem": private_key_pem,
        "public_key_pem": public_key_pem,
        "private_key": private_key,
    }

    payload = {
        "sub": "test-user-id",
        "aud": "account",
        "iss": "http://auth-server/",
        "realm_access": {"roles": ["admin"]},
        # "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        # "iat": datetime.datetime.utcnow(),
    }

    # 4. Gera o token com RS256
    token = jwt.encode(payload, rsa_keys["private_key"], algorithm="RS256")

    print(token)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client


@pytest.mark.django_db
class TestCreateVideoWithoutFile:
    def test_user_can_create_video_without_file(self, auth_client) -> None:
        create_response = auth_client.post(
            "/api/categories/",
            data={"name": "Movie", "description": "Movie description"},
        )
        assert create_response.status_code == 201
        created_category_id = create_response.data["id"]

        create_response = auth_client.post(
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

        create_response = auth_client.post(
            "/api/cast_members/",
            data={
                "name": "John Doe",
                "type": "ACTOR",
            },
        )
        assert create_response.status_code == 201
        created_cast_member_id = create_response.data["id"]

        create_response = auth_client.post(
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
        auth_client = APIClient()

        create_response = auth_client.post(
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
