from datetime import datetime
from typing import Generator
from uuid import uuid4
from elasticsearch import Elasticsearch
import pytest

from src.application.listing import ListOutputMeta
from src.domain.category import Category
from src.domain.repository import SortDirection
from src.infra.elasticsearch.elasticsearch_category_repository import (
    CATEGORY_INDEX,
    ELASTICSEARCH_HOST_TEST,
    ElasticsearchCategoryRepository,
)
from src.application.list_category import (
    CategorySortableFields,
    ListCategory,
    ListCategoryInput,
)


@pytest.fixture
def movie() -> Category:
    return Category(
        id=uuid4(),
        name="Movie",
        description="Movie category",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


@pytest.fixture
def series() -> Category:
    return Category(
        id=uuid4(),
        name="Series",
        description="Series category",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


@pytest.fixture
def documentary() -> Category:
    return Category(
        id=uuid4(),
        name="Documentary",
        description="Documentary category",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


@pytest.fixture
def es() -> Generator[Elasticsearch, None, None]:
    es = Elasticsearch(hosts=[ELASTICSEARCH_HOST_TEST])

    if not es.indices.exists(index=CATEGORY_INDEX):
        es.indices.create(index=CATEGORY_INDEX)

    yield es

    es.indices.delete(index=CATEGORY_INDEX)


@pytest.fixture
def populated_es(es, series, movie, documentary) -> Elasticsearch:
    es.index(
        index=CATEGORY_INDEX,
        id=str(series.id),
        body=series.model_dump(mode="json"),
        refresh=True,
    )
    es.index(
        index=CATEGORY_INDEX,
        id=str(movie.id),
        body=movie.model_dump(mode="json"),
        refresh=True,
    )
    es.index(
        index=CATEGORY_INDEX,
        id=str(documentary.id),
        body=documentary.model_dump(mode="json"),
        refresh=True,
    )

    return es


class TestListCategory:
    def test_list_categories_with_default_input(
        self, populated_es: Elasticsearch, movie, series, documentary
    ):
        repository = ElasticsearchCategoryRepository(client=populated_es)
        list_category = ListCategory(repository=repository)

        input = ListCategoryInput()

        output = list_category.execute(input=input)

        assert output.data == [documentary, movie, series]
        assert output.meta == ListOutputMeta(
            page=1,
            per_page=5,
            sort=CategorySortableFields.NAME,
            direction=SortDirection.ASC,
        )

    def test_list_categories_with_pagination_sorting_and_search(
        self, populated_es: Elasticsearch, movie, series, documentary
    ):
        repository = ElasticsearchCategoryRepository(client=populated_es)
        list_category = ListCategory(repository=repository)

        # Page 1
        input = ListCategoryInput(
            page=1,
            per_page=1,
            search="Movie",
            sort=CategorySortableFields.NAME,
            direction=SortDirection.ASC,
        )

        output = list_category.execute(input=input)

        assert output.data == [movie]
        assert output.meta == ListOutputMeta(
            page=1,
            per_page=1,
            sort=CategorySortableFields.NAME,
            direction=SortDirection.ASC,
        )

        # Page 2
        input = ListCategoryInput(
            page=2,
            per_page=1,
            search="Movie",
            sort=CategorySortableFields.NAME,
            direction=SortDirection.ASC,
        )

        output = list_category.execute(input=input)

        assert output.data == []
        assert output.meta == ListOutputMeta(
            page=2,
            per_page=1,
            sort=CategorySortableFields.NAME,
            direction=SortDirection.ASC,
        )
