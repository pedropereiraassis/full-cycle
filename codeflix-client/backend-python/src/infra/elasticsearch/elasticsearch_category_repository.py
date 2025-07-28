import logging
import os
from elasticsearch import Elasticsearch
from pydantic import ValidationError
from src.application.list_category import CategorySortableFields
from src.domain.category import Category
from src.domain.category_repository import (
    CategoryRepository,
)
from src.domain.repository import DEFAULT_PAGINATION_SIZE, SortDirection


CATEGORY_INDEX = "catalog-db.codeflix.categories"

ELASTICSEARCH_HOST = os.getenv("ELASTICSEARCH_HOST", "http://localhost:9200")
ELASTICSEARCH_HOST_TEST = os.getenv("ELASTICSEARCH_TEST_HOST", "http://localhost:9201")


class ElasticsearchCategoryRepository(CategoryRepository):
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
        sort: CategorySortableFields | None = None,
        direction: SortDirection = SortDirection.ASC,
    ) -> list[Category]:
        response = self.client.search(
            index=CATEGORY_INDEX,
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
                                        "fields": ["name", "description"],
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

        category_hits = response["hits"]["hits"]

        parsed_categories = []
        for category in category_hits:
            try:
                parsed_categories.append(Category(**category["_source"]))
            except ValidationError:
                self.logger.error(f"Invalid category: {category}")

        return parsed_categories
