from abc import ABC, abstractmethod
from enum import StrEnum

from src.domain.entity import Entity

DEFAULT_PAGINATION_SIZE = 5


class SortDirection(StrEnum):
    ASC = "asc"
    DESC = "desc"


class Repository[T: Entity](ABC):
    @abstractmethod
    def search(
        self,
        page: int = 1,
        per_page: int = DEFAULT_PAGINATION_SIZE,
        search: str | None = None,
        sort: str | None = None,
        direction: SortDirection = SortDirection.ASC,
    ) -> list[T]:
        raise NotImplementedError
