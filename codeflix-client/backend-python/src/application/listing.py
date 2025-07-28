from enum import StrEnum
from pydantic import BaseModel, Field

from src.domain.entity import Entity
from src.domain.repository import DEFAULT_PAGINATION_SIZE, SortDirection

class ListInput[SortableFieldsType: StrEnum](BaseModel):
    page: int = 1
    per_page: int = DEFAULT_PAGINATION_SIZE
    sort: SortableFieldsType | None = None
    direction: SortDirection = SortDirection.ASC
    search: str | None = None


class ListOutputMeta(BaseModel):
    page: int = 1
    per_page: int = DEFAULT_PAGINATION_SIZE
    sort: str | None = None
    direction: SortDirection = SortDirection.ASC


class ListOutput[T: Entity](BaseModel):
    data: list[T] = Field(default_factory=list)
    meta: ListOutputMeta = Field(default_factory=ListOutputMeta)
