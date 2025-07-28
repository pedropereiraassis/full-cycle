from datetime import datetime
from typing import Generator, Iterator
from uuid import uuid4
from fastapi.testclient import TestClient
import pytest
from elasticsearch import Elasticsearch

from src.domain.cast_member import CastMember, CastMemberType
from src.domain.cast_member_repository import CastMemberRepository
from src.infra.api.http.dependencies import get_cast_member_repository
from src.infra.api.http.main import app
from src.infra.elasticsearch.elasticsearch_cast_member_repository import (
    CAST_MEMBER_INDEX,
    ElasticsearchCastMemberRepository,
)
from src.infra.elasticsearch.elasticsearch_category_repository import (
    ELASTICSEARCH_HOST_TEST,
)


@pytest.fixture
def actor() -> CastMember:
    return CastMember(
        id=uuid4(),
        name="John Doe",
        type=CastMemberType.ACTOR,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


@pytest.fixture
def director() -> CastMember:
    return CastMember(
        id=uuid4(),
        name="Jane Unknown",
        type=CastMemberType.DIRECTOR,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


@pytest.fixture
def es() -> Generator[Elasticsearch, None, None]:
    es = Elasticsearch(hosts=[ELASTICSEARCH_HOST_TEST])

    if not es.indices.exists(index=CAST_MEMBER_INDEX):
        es.indices.create(index=CAST_MEMBER_INDEX)

    yield es

    es.indices.delete(index=CAST_MEMBER_INDEX)


@pytest.fixture
def populated_es(es, director, actor) -> Elasticsearch:
    es.index(
        index=CAST_MEMBER_INDEX,
        id=str(director.id),
        body=director.model_dump(mode="json"),
        refresh=True,
    )
    es.index(
        index=CAST_MEMBER_INDEX,
        id=str(actor.id),
        body=actor.model_dump(mode="json"),
        refresh=True,
    )
    return es


@pytest.fixture
def populated_cast_member_repository(
    populated_es: Elasticsearch,
) -> Iterator[CastMemberRepository]:
    yield ElasticsearchCastMemberRepository(client=populated_es)


@pytest.fixture
def test_client_with_populated_repo(
    populated_cast_member_repository: CastMemberRepository,
) -> Iterator[TestClient]:
    app.dependency_overrides[get_cast_member_repository] = (
        lambda: populated_cast_member_repository
    )
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_list_cast_members(test_client_with_populated_repo, actor, director):
    response = test_client_with_populated_repo.get("/cast_members")

    assert response.status_code == 200
    assert response.json() == {
        "data": [
            {
                "id": str(director.id),
                "name": director.name,
                "type": director.type.value,
                "created_at": director.created_at.isoformat(),
                "updated_at": director.updated_at.isoformat(),
                "is_active": director.is_active,
            },
            {
                "id": str(actor.id),
                "name": actor.name,
                "type": actor.type.value,
                "created_at": actor.created_at.isoformat(),
                "updated_at": actor.updated_at.isoformat(),
                "is_active": actor.is_active,
            },
        ],
        "meta": {
            "page": 1,
            "per_page": 5,
            "sort": "name",
            "direction": "asc",
        },
    }
