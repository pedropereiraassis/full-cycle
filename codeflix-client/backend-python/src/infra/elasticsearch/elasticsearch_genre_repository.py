from collections import defaultdict
import logging
import os
from elasticsearch import Elasticsearch
from pydantic import ValidationError
from src.application.list_genre import GenreSortableFields
from src.domain.genre import Genre
from src.domain.genre_repository import (
    GenreRepository,
)
from src.domain.repository import DEFAULT_PAGINATION_SIZE, SortDirection


GENRE_INDEX = "catalog-db.codeflix.genres"
GENRE_CATEGORIES_INDEX = "catalog-db.codeflix.genre_categories"

ELASTICSEARCH_HOST = os.getenv("ELASTICSEARCH_HOST", "http://localhost:9200")
ELASTICSEARCH_HOST_TEST = os.getenv("ELASTICSEARCH_TEST_HOST", "http://localhost:9201")


class ElasticsearchGenreRepository(GenreRepository):
    def __init__(
        self, client: Elasticsearch | None = None, logger: logging.Logger | None = None
    ):
        self.client = client or Elasticsearch(hosts=[ELASTICSEARCH_HOST])
        self.logger = logger or logging.getLogger(__name__)

    def search(
        self,
        page: int = 1,
        per_page: int = DEFAULT_PAGINATION_SIZE,
        search: str | None = None,
        sort: GenreSortableFields | None = None,
        direction: SortDirection = SortDirection.ASC,
    ) -> list[Genre]:
        response = self.client.search(
            index=GENRE_INDEX,
            body={
                "sort": [{f"{sort}.keyword": {"order": direction}}] if sort else [],
                "from": (page - 1) * per_page,
                "size": per_page,
                "query": {
                    "bool": {
                        "must": (
                            [
                                {
                                    "multi_match": {
                                        "query": search,
                                        "fields": ["name"],
                                    }
                                }
                            ]
                            if search
                            else [{"match_all": {}}]
                        )
                    }
                },
            },
        )

        genre_hits = response["hits"]["hits"]

        genre_ids = [genre["_source"]["id"] for genre in genre_hits]
        categories_by_genres = self.fetch_categories_by_genres(genre_ids=genre_ids)

        parsed_genres = []
        for genre in genre_hits:
            try:
                categories = categories_by_genres[genre["_source"]["id"]]
                parsed_genres.append(
                    Genre(**{**genre["_source"], "categories": categories})
                )
            except ValidationError:
                self.logger.error(f"Invalid genre: {genre}")

        return parsed_genres

    def fetch_categories_by_genres(self, genre_ids: list[str]) -> dict[str, list[str]]:
        query = {"query": {"terms": {"genre_id.keyword": genre_ids}}}
        hits = self.client.search(index=GENRE_CATEGORIES_INDEX, body=query)["hits"][
            "hits"
        ]

        categories_by_genres = defaultdict(list)
        for hit in hits:
            categories_by_genres[hit["_source"]["genre_id"]].append(
                hit["_source"]["category_id"]
            )

        return categories_by_genres
