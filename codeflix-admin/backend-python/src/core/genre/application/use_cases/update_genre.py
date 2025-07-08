from dataclasses import dataclass
from uuid import UUID

from src.core.category.domain.category_repository import CategoryRepository
from src.core.genre.domain.genre_repository import GenreRepository
from src.core.genre.application.exceptions import (
    GenreNotFound,
    InvalidGenre,
    RelatedCategoriesNotFound,
)


class UpdateGenre:
    def __init__(
        self, repository: GenreRepository, category_repository: CategoryRepository
    ):
        self.repository = repository
        self.category_repository = category_repository

    @dataclass
    class Input:
        id: UUID
        name: str
        categories: set[UUID]
        is_active: bool

    def execute(self, input: Input) -> None:
        genre = self.repository.get_by_id(id=input.id)

        if genre is None:
            raise GenreNotFound(f"Genre with {input.id} not found")

        try:
            genre.change_name(input.name)

            if input.is_active is True:
                genre.activate()

            if input.is_active is False:
                genre.deactivate()

        except ValueError as e:
            raise InvalidGenre(e)

        category_ids = {category.id for category in self.category_repository.list()}
        if not input.categories.issubset(category_ids):
            raise RelatedCategoriesNotFound(
                f"Categories not found: {input.categories - category_ids}"
            )

        genre.categories = input.categories

        self.repository.update(genre)
