from typing import Iterator
from unittest.mock import create_autospec
from fastapi.testclient import TestClient
import pytest

from src.domain.cast_member_repository import CastMemberRepository
from src.infra.api.http.dependencies import get_cast_member_repository
from src.infra.api.http.main import app


@pytest.fixture
def client() -> Iterator[TestClient]:
    app.dependency_overrides[get_cast_member_repository] = lambda: create_autospec(
        CastMemberRepository
    )
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_cast_members_endpoint_with_default_querystring(client):
    response = client.get("/cast_members")

    assert response.status_code == 200
    assert response.json()["meta"] == {
        "page": 1,
        "per_page": 5,
        "sort": "name",
        "direction": "asc",
    }


def test_cast_members_endpoint_with_custom_querystring(client):
    response = client.get("/cast_members?page=3&per_page=1&sort=type&direction=desc")

    assert response.status_code == 200
    assert response.json()["meta"] == {
        "page": 3,
        "per_page": 1,
        "sort": "type",
        "direction": "desc",
    }
