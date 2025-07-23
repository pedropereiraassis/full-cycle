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
class TestCreateAndEditCategory:
    def test_user_can_create_and_edit_category(self, auth_client) -> None:

        list_response = auth_client.get("/api/categories/")
        assert list_response.data == {
            "data": [],
            "meta": {"current_page": 1, "per_page": 2, "total": 0},
        }

        create_response = auth_client.post(
            "/api/categories/",
            data={"name": "Movie", "description": "Movie description"},
        )
        assert create_response.status_code == 201
        created_category_id = create_response.data["id"]

        list_response = auth_client.get("/api/categories/")
        assert list_response.data == {
            "data": [
                {
                    "id": created_category_id,
                    "name": "Movie",
                    "description": "Movie description",
                    "is_active": True,
                }
            ],
            "meta": {
                "current_page": 1,
                "per_page": 2,
                "total": 1,
            },
        }

        update_request = auth_client.put(
            f"/api/categories/{created_category_id}/",
            data={
                "name": "Documentary",
                "description": "Documentary description",
                "is_active": False,
            },
        )
        assert update_request.status_code == 204

        list_response = auth_client.get("/api/categories/")
        assert list_response.data == {
            "data": [
                {
                    "id": created_category_id,
                    "name": "Documentary",
                    "description": "Documentary description",
                    "is_active": False,
                }
            ],
            "meta": {
                "current_page": 1,
                "per_page": 2,
                "total": 1,
            },
        }
