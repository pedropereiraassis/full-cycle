from datetime import datetime
import logging
from typing import Generator
from unittest.mock import create_autospec
from uuid import uuid4
from elasticsearch import Elasticsearch
import pytest

from src.application.list_cast_member import CastMemberSortableFields
from src.domain.cast_member import CastMember, CastMemberType
from src.domain.repository import SortDirection
from src.infra.elasticsearch.elasticsearch_cast_member_repository import (
    CAST_MEMBER_INDEX,
    ELASTICSEARCH_HOST_TEST,
    ElasticsearchCastMemberRepository,
)


@pytest.fixture
def es() -> Generator[Elasticsearch, None, None]:
    es = Elasticsearch(hosts=[ELASTICSEARCH_HOST_TEST])

    if not es.indices.exists(index=CAST_MEMBER_INDEX):
        es.indices.create(index=CAST_MEMBER_INDEX)

    yield es

    es.indices.delete(index=CAST_MEMBER_INDEX)


@pytest.fixture
def populated_es(es, director, actor) -> Generator[Elasticsearch, None, None]:
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


class TestSearch:
    def test_can_reach_test_elasticsearch(self, es: Elasticsearch):
        assert es.ping()

    def test_when_index_is_empty_then_return_empty_list(self, es: Elasticsearch):
        repository = ElasticsearchCastMemberRepository(client=es)

        cast_members = repository.search()

        assert cast_members == []

    def test_when_index_has_cast_members_return_mapped_cast_members(
        self, es: Elasticsearch, director, actor
    ):
        es.index(
            index=CAST_MEMBER_INDEX,
            id=str(actor.id),
            body=actor.model_dump(mode="json"),
            refresh=True,
        )
        es.index(
            index=CAST_MEMBER_INDEX,
            id=str(director.id),
            body=director.model_dump(mode="json"),
            refresh=True,
        )

        repository = ElasticsearchCastMemberRepository(client=es)

        assert repository.search() == [actor, director]

    def test_when_index_has_malformed_cast_members(
        self, es: Elasticsearch, director, actor
    ):
        actor.id = "abc123"
        es.index(
            index=CAST_MEMBER_INDEX,
            id=str(actor.id),
            body=actor.model_dump(mode="json"),
            refresh=True,
        )
        es.index(
            index=CAST_MEMBER_INDEX,
            id=str(director.id),
            body=director.model_dump(mode="json"),
            refresh=True,
        )

        mock_logger = create_autospec(logging.Logger)
        repository = ElasticsearchCastMemberRepository(client=es, logger=mock_logger)

        assert repository.search() == [director]
        mock_logger.error.assert_called_once()

    def test_when_search_term_matches(
        self, populated_es: Elasticsearch, director, actor
    ):
        repository = ElasticsearchCastMemberRepository(client=populated_es)

        assert repository.search(search="John") == [actor]
        assert repository.search(
            search="",
            sort=CastMemberSortableFields.NAME,
            direction=SortDirection.DESC,
        ) == [actor, director]


class TestSort:
    def test_when_no_sorting_is_specified(
        self, populated_es: Elasticsearch, director, actor
    ):
        repository = ElasticsearchCastMemberRepository(client=populated_es)

        assert repository.search() == [director, actor]

    def test_return_cast_members_orders_by_name_asc(
        self, populated_es: Elasticsearch, director, actor
    ):
        repository = ElasticsearchCastMemberRepository(client=populated_es)

        assert repository.search(
            sort=CastMemberSortableFields.NAME, direction=SortDirection.ASC
        ) == [
            director,
            actor,
        ]

    def test_return_cast_members_ordered_by_name_desc(
        self, populated_es: Elasticsearch, director, actor
    ):
        repository = ElasticsearchCastMemberRepository(client=populated_es)

        assert repository.search(
            sort=CastMemberSortableFields.NAME, direction=SortDirection.DESC
        ) == [
            actor,
            director,
        ]


class TestPagination:
    def test_when_no_page_is_specified(
        self, populated_es: Elasticsearch, director, actor
    ):
        repository = ElasticsearchCastMemberRepository(client=populated_es)

        assert repository.search() == [director, actor]

    def test_when_page_is_specified(self, populated_es: Elasticsearch, director, actor):
        repository = ElasticsearchCastMemberRepository(client=populated_es)

        assert repository.search(
            page=1,
            per_page=1,
            sort=CastMemberSortableFields.NAME,
            direction=SortDirection.ASC,
        ) == [director]
        assert repository.search(
            page=2,
            per_page=1,
            sort=CastMemberSortableFields.NAME,
            direction=SortDirection.ASC,
        ) == [actor]

    def test_when_page_is_specified_but_out_of_bounds(
        self, populated_es: Elasticsearch
    ):
        repository = ElasticsearchCastMemberRepository(client=populated_es)

        assert repository.search(page=2) == []
