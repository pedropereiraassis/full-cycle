from typing import Iterator
from unittest.mock import create_autospec
from fastapi.testclient import TestClient
import pytest

from src.domain.category_repository import CategoryRepository
from src.infra.api.http.auth import authenticate
from src.infra.api.http.dependencies import get_category_repository
from src.infra.api.http.main import app


@pytest.fixture
def client() -> Iterator[TestClient]:
    app.dependency_overrides[get_category_repository] = lambda: create_autospec(
        CategoryRepository
    )
    app.dependency_overrides[authenticate] = lambda: None
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_categories_endpoint_with_default_querystring(client):
    response = client.get("/categories")

    assert response.status_code == 200
    assert response.json()["meta"] == {
        "page": 1,
        "per_page": 5,
        "sort": "name",
        "direction": "asc",
    }


def test_categories_endpoint_with_custom_querystring(client):
    response = client.get(
        "/categories?page=3&per_page=1&sort=description&direction=desc"
    )

    assert response.status_code == 200
    assert response.json()["meta"] == {
        "page": 3,
        "per_page": 1,
        "sort": "description",
        "direction": "desc",
    }
