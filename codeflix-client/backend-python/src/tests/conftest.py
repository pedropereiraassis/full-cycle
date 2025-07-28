from datetime import datetime
from typing import Generator
from uuid import uuid4
from elasticsearch import Elasticsearch
import pytest

from src.domain.category import Category
from src.domain.genre import Genre
from src.infra.elasticsearch.elasticsearch_category_repository import (
    CATEGORY_INDEX,
    ELASTICSEARCH_HOST_TEST,
)
from src.infra.elasticsearch.elasticsearch_genre_repository import (
    GENRE_CATEGORIES_INDEX,
    GENRE_INDEX,
)


@pytest.fixture
def es() -> Generator[Elasticsearch, None, None]:
    client = Elasticsearch(hosts=[ELASTICSEARCH_HOST_TEST])

    if not client.indices.exists(index=CATEGORY_INDEX):
        client.indices.create(index=CATEGORY_INDEX)

    if not client.indices.exists(index=GENRE_INDEX):
        client.indices.create(index=GENRE_INDEX)

    if not client.indices.exists(index=GENRE_CATEGORIES_INDEX):
        client.indices.create(index=GENRE_CATEGORIES_INDEX)

    yield client

    client.indices.delete(index=CATEGORY_INDEX)
    client.indices.delete(index=GENRE_INDEX)
    client.indices.delete(index=GENRE_CATEGORIES_INDEX)


@pytest.fixture
def movie() -> Category:
    return Category(
        id=uuid4(),
        name="Filme",
        description="Categoria de filmes",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


@pytest.fixture
def series() -> Category:
    return Category(
        id=uuid4(),
        name="Séries",
        description="Categoria de séries",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


@pytest.fixture
def documentary() -> Category:
    return Category(
        id=uuid4(),
        name="Documentários",
        description="Categoria de documentários",
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


@pytest.fixture
def drama(movie, series) -> Genre:
    return Genre(
        id=uuid4(),
        name="Drama",
        categories={movie.id, series.id},
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


@pytest.fixture
def romance() -> Genre:
    return Genre(
        id=uuid4(),
        name="Romance",
        categories=set(),
        created_at=datetime.now(),
        updated_at=datetime.now(),
        is_active=True,
    )


@pytest.fixture
def populated_es(
    es: Elasticsearch,
    movie: Category,
    series: Category,
    documentary: Category,
    drama: Genre,
    romance: Genre,
) -> Elasticsearch:
    es.index(
        index=CATEGORY_INDEX,
        id=str(movie.id),
        body=movie.model_dump(mode="json"),
        refresh=True,
    )
    es.index(
        index=CATEGORY_INDEX,
        id=str(series.id),
        body=series.model_dump(mode="json"),
        refresh=True,
    )
    es.index(
        index=CATEGORY_INDEX,
        id=str(documentary.id),
        body=documentary.model_dump(mode="json"),
        refresh=True,
    )

    es.index(
        index=GENRE_INDEX,
        id=str(drama.id),
        body=drama.model_dump(mode="json"),
        refresh=True,
    )
    es.index(
        index=GENRE_INDEX,
        id=str(romance.id),
        body=romance.model_dump(mode="json"),
        refresh=True,
    )

    es.index(
        index=GENRE_CATEGORIES_INDEX,
        id=uuid4(),
        body={
            "genre_id": str(drama.id),
            "category_id": str(movie.id),
        },
        refresh=True,
    )
    es.index(
        index=GENRE_CATEGORIES_INDEX,
        id=uuid4(),
        body={
            "genre_id": str(drama.id),
            "category_id": str(series.id),
        },
        refresh=True,
    )

    return es
