from dataclasses import dataclass, field
from uuid import UUID

from src.core._shared.dto import ListOutputMeta
from src.core.category.domain.category_repository import CategoryRepository


@dataclass
class CategoryOutput:
    id: UUID
    name: str
    description: str
    is_active: bool


class ListCategory:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    @dataclass
    class Input:
        order_by: str = "name"
        current_page: int = 1

    @dataclass
    class Output:
        data: list[CategoryOutput]
        meta: ListOutputMeta = field(default_factory=ListOutputMeta)

    def execute(self, input: Input) -> Output:
        categories = self.repository.list()

        sorted_categories = sorted(
            [
                CategoryOutput(
                    id=category.id,
                    name=category.name,
                    description=category.description,
                    is_active=category.is_active,
                )
                for category in categories
            ],
            key=lambda category: getattr(category, input.order_by),
        )

        DEFAULT_PAGE_SIZE = 2
        page_offset = (input.current_page - 1) * DEFAULT_PAGE_SIZE
        categories_page = sorted_categories[
            page_offset : page_offset + DEFAULT_PAGE_SIZE
        ]

        return self.Output(
            data=categories_page,
            meta=ListOutputMeta(
                current_page=input.current_page,
                per_page=DEFAULT_PAGE_SIZE,
                total=len(sorted_categories),
            ),
        )
