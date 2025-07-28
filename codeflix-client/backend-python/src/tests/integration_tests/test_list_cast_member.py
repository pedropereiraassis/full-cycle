from datetime import datetime
from typing import Generator
from uuid import uuid4
from elasticsearch import Elasticsearch
import pytest

from src.application.listing import ListOutputMeta
from src.domain.cast_member import CastMember, CastMemberType
from src.domain.repository import SortDirection
from src.infra.elasticsearch.elasticsearch_cast_member_repository import (
    CAST_MEMBER_INDEX,
    ELASTICSEARCH_HOST_TEST,
    ElasticsearchCastMemberRepository,
)
from src.application.list_cast_member import (
    CastMemberSortableFields,
    ListCastMember,
    ListCastMemberInput,
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


class TestListCastMember:
    def test_list_cast_members_with_default_input(
        self, populated_es: Elasticsearch, actor, director
    ):
        repository = ElasticsearchCastMemberRepository(client=populated_es)
        list_cast_member = ListCastMember(repository=repository)

        input = ListCastMemberInput()

        output = list_cast_member.execute(input=input)

        assert output.data == [director, actor]
        assert output.meta == ListOutputMeta(
            page=1,
            per_page=5,
            sort=CastMemberSortableFields.NAME,
            direction=SortDirection.ASC,
        )

    def test_list_cast_members_with_pagination_sorting_and_search(
        self, populated_es: Elasticsearch, actor, director
    ):
        repository = ElasticsearchCastMemberRepository(client=populated_es)
        list_cast_member = ListCastMember(repository=repository)

        # Page 1
        input = ListCastMemberInput(
            page=1,
            per_page=1,
            search="John Doe",
            sort=CastMemberSortableFields.NAME,
            direction=SortDirection.ASC,
        )

        output = list_cast_member.execute(input=input)

        assert output.data == [actor]
        assert output.meta == ListOutputMeta(
            page=1,
            per_page=1,
            sort=CastMemberSortableFields.NAME,
            direction=SortDirection.ASC,
        )

        # Page 2
        input = ListCastMemberInput(
            page=2,
            per_page=1,
            search="John Doe",
            sort=CastMemberSortableFields.NAME,
            direction=SortDirection.ASC,
        )

        output = list_cast_member.execute(input=input)

        assert output.data == []
        assert output.meta == ListOutputMeta(
            page=2,
            per_page=1,
            sort=CastMemberSortableFields.NAME,
            direction=SortDirection.ASC,
        )
