import logging
import os
from elasticsearch import Elasticsearch
from pydantic import ValidationError
from src.application.list_cast_member import CastMemberSortableFields
from src.domain.cast_member import CastMember
from src.domain.cast_member_repository import (
    CastMemberRepository,
)
from src.domain.repository import DEFAULT_PAGINATION_SIZE, SortDirection


CAST_MEMBER_INDEX = "catalog-db.codeflix.cast_members"

ELASTICSEARCH_HOST = os.getenv("ELASTICSEARCH_HOST", "http://localhost:9200")
ELASTICSEARCH_HOST_TEST = os.getenv("ELASTICSEARCH_TEST_HOST", "http://localhost:9201")


class ElasticsearchCastMemberRepository(CastMemberRepository):
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
        sort: CastMemberSortableFields | None = None,
        direction: SortDirection = SortDirection.ASC,
    ) -> list[CastMember]:
        response = self.client.search(
            index=CAST_MEMBER_INDEX,
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
                                        "fields": ["name", "type"],
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

        cast_member_hits = response["hits"]["hits"]

        parsed_cast_members = []
        for cast_member in cast_member_hits:
            try:
                parsed_cast_members.append(CastMember(**cast_member["_source"]))
            except ValidationError:
                self.logger.error(f"Invalid cast_member: {cast_member}")

        return parsed_cast_members
