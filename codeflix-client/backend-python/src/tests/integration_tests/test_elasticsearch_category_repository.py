from datetime import datetime
import logging
from typing import Generator
from unittest.mock import create_autospec
from uuid import uuid4
from elasticsearch import Elasticsearch
import pytest

from src.application.list_category import CategorySortableFields
from src.domain.category import Category
from src.domain.repository import SortDirection
from src.infra.elasticsearch.elasticsearch_category_repository import (
    CATEGORY_INDEX,
    ELASTICSEARCH_HOST_TEST,
    ElasticsearchCategoryRepository,
)


@pytest.fixture
def es() -> Generator[Elasticsearch, None, None]:
    es = Elasticsearch(hosts=[ELASTICSEARCH_HOST_TEST])

    if not es.indices.exists(index=CATEGORY_INDEX):
        es.indices.create(index=CATEGORY_INDEX)

    yield es

    es.indices.delete(index=CATEGORY_INDEX)


@pytest.fixture
def populated_es(
    es, series_category, movie_category
) -> Generator[Elasticsearch, None, None]:
    es.index(
        index=CATEGORY_INDEX,
        id=str(series_category.id),
        body=series_category.model_dump(mode="json"),
        refresh=True,
    )
    es.index(
        index=CATEGORY_INDEX,
        id=str(movie_category.id),
        body=movie_category.model_dump(mode="json"),
        refresh=True,
    )

    return es


@pytest.fixture
def movie_category() -> Category:
    return Category(
        id=uuid4(),
        name="Movie",
        description="Movie category",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


@pytest.fixture
def series_category() -> Category:
    return Category(
        id=uuid4(),
        name="Series",
        description="Series category",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


class TestSearch:
    def test_can_reach_test_elasticsearch(self, es: Elasticsearch):
        assert es.ping()

    def test_when_index_is_empty_then_return_empty_list(self, es: Elasticsearch):
        repository = ElasticsearchCategoryRepository(client=es)

        categories = repository.search()

        assert categories == []

    def test_when_index_has_categories_return_mapped_categories(
        self, es: Elasticsearch, series_category, movie_category
    ):
        es.index(
            index=CATEGORY_INDEX,
            id=str(movie_category.id),
            body=movie_category.model_dump(mode="json"),
            refresh=True,
        )
        es.index(
            index=CATEGORY_INDEX,
            id=str(series_category.id),
            body=series_category.model_dump(mode="json"),
            refresh=True,
        )

        repository = ElasticsearchCategoryRepository(client=es)

        assert repository.search() == [movie_category, series_category]

    def test_when_index_has_malformed_categories(
        self, es: Elasticsearch, series_category, movie_category
    ):
        movie_category.id = "abc123"
        es.index(
            index=CATEGORY_INDEX,
            id=str(movie_category.id),
            body=movie_category.model_dump(mode="json"),
            refresh=True,
        )
        es.index(
            index=CATEGORY_INDEX,
            id=str(series_category.id),
            body=series_category.model_dump(mode="json"),
            refresh=True,
        )

        mock_logger = create_autospec(logging.Logger)
        repository = ElasticsearchCategoryRepository(client=es, logger=mock_logger)

        assert repository.search() == [series_category]
        mock_logger.error.assert_called_once()

    def test_when_search_term_matches(
        self, populated_es: Elasticsearch, series_category, movie_category
    ):
        repository = ElasticsearchCategoryRepository(client=populated_es)

        assert repository.search(search="Movie") == [movie_category]
        assert repository.search(
            search="category",
            sort=CategorySortableFields.NAME,
            direction=SortDirection.DESC,
        ) == [series_category, movie_category]


class TestSort:
    def test_when_no_sorting_is_specified(
        self, populated_es: Elasticsearch, series_category, movie_category
    ):
        repository = ElasticsearchCategoryRepository(client=populated_es)

        assert repository.search() == [series_category, movie_category]

    def test_return_categories_orders_by_name_asc(
        self, populated_es: Elasticsearch, series_category, movie_category
    ):
        repository = ElasticsearchCategoryRepository(client=populated_es)

        assert repository.search(
            sort=CategorySortableFields.NAME, direction=SortDirection.ASC
        ) == [
            movie_category,
            series_category,
        ]

    def test_return_categories_ordered_by_name_desc(
        self, populated_es: Elasticsearch, series_category, movie_category
    ):
        repository = ElasticsearchCategoryRepository(client=populated_es)

        assert repository.search(
            sort=CategorySortableFields.NAME, direction=SortDirection.DESC
        ) == [
            series_category,
            movie_category,
        ]


class TestPagination:
    def test_when_no_page_is_specified(
        self, populated_es: Elasticsearch, series_category, movie_category
    ):
        repository = ElasticsearchCategoryRepository(client=populated_es)

        assert repository.search() == [series_category, movie_category]

    def test_when_page_is_specified(
        self, populated_es: Elasticsearch, series_category, movie_category
    ):
        repository = ElasticsearchCategoryRepository(client=populated_es)

        assert repository.search(
            page=1,
            per_page=1,
            sort=CategorySortableFields.NAME,
            direction=SortDirection.ASC,
        ) == [movie_category]
        assert repository.search(
            page=2,
            per_page=1,
            sort=CategorySortableFields.NAME,
            direction=SortDirection.ASC,
        ) == [series_category]

    def test_when_page_is_specified_but_out_of_bounds(
        self, populated_es: Elasticsearch
    ):
        repository = ElasticsearchCategoryRepository(client=populated_es)

        assert repository.search(page=2) == []
