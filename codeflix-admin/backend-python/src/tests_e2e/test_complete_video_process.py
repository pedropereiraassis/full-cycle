import io
import time
from uuid import UUID
import pytest
from rest_framework.test import APIClient

import threading
from django.db import transaction
from django.core.management import call_command

import json
import pika

from src.core.video.domain.value_objects import MediaStatus
from src.django_project.video_app.repository import DjangoORMVideoRepository

import jwt
import os

from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

"""
OBSERVAÇÃO:
Este teste é um End-to-End completo para o fluxo de criação e processamento dO Video.
Requisitos:
- O servidor RabbitMQ deve estar rodando separadamente (exemplo via Docker):
  docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
Observação:
- Não é necessário rodar o comando `python manage.py startconsumer` manualmente.
- O próprio teste inicia o consumer em uma thread separada durante sua execução.

"""


def run_consumer():
    call_command("startconsumer")


def send_message_to_rabbitmq(video_id: str):
    QUEUE = "videos.converted"
    HOST = "localhost"
    PORT = 5672

    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=HOST,
            port=PORT,
        ),
    )
    channel = connection.channel()
    channel.queue_declare(queue=QUEUE)

    message = {
        "error": "",
        "video": {
            "resource_id": f"{video_id}.VIDEO",
            "encoded_video_folder": "/path/to/encoded/video",
        },
        "status": "COMPLETED",
    }
    channel.basic_publish(exchange="", routing_key=QUEUE, body=json.dumps(message))

    connection.close()


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


@pytest.mark.django_db(transaction=True)
class TestCompleteVideoProcess:
    def test_user_can_create_video_and_add_file_with_complete_process(
        self, auth_client
    ) -> None:
        consumer_thread = threading.Thread(target=run_consumer, daemon=True)
        consumer_thread.start()

        video_repository = DjangoORMVideoRepository()

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
                "title": "New Video",
                "description": "New Description",
                "launch_year": 2024,
                "opened": False,
                "rating": "L",
                "duration": 120,
                "categories": [created_category_id],
                "genres": [created_genre_id],
                "cast_members": [created_cast_member_id],
            },
        )
        assert create_response.status_code == 201
        created_video_id = create_response.data["id"]

        assert created_video_id is not None

        update_response = auth_client.patch(
            f"/api/videos/{created_video_id}/",
            format="multipart",
            data={"video_file": io.BytesIO(b"dummy binary data for the file")},
        )
        assert update_response.status_code == 200

        transaction.commit()

        video = video_repository.get_by_id(UUID(created_video_id))
        assert video is not None
        assert str(video.id) == created_video_id
        assert video.published is False
        assert video.video.status == MediaStatus.PENDING

        send_message_to_rabbitmq(video_id=created_video_id)

        time.sleep(1)

        video = video_repository.get_by_id(UUID(created_video_id))
        assert video is not None
        assert str(video.id) == created_video_id
        assert video.published is True
        assert video.video.status == MediaStatus.COMPLETED
