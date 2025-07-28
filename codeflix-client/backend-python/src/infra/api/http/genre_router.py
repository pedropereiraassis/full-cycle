from typing import Any
from fastapi import APIRouter, Depends, Query

from src.application.list_genre import (
    GenreSortableFields,
    ListGenre,
    ListGenreInput,
)
from src.application.listing import ListOutput
from src.domain.genre import Genre
from src.domain.genre_repository import GenreRepository
from src.infra.api.http.dependencies import (
    common_parameters,
    get_genre_repository,
)


genre_router = APIRouter()


@genre_router.get("/", response_model=ListOutput[Genre])
def list_genres(
    repository: GenreRepository = Depends(get_genre_repository),
    sort: GenreSortableFields = Query(
        GenreSortableFields.NAME, description="Field to sort by"
    ),
    common: dict[str, Any] = Depends(common_parameters),
) -> ListOutput[Genre]:
    use_case = ListGenre(repository=repository)

    input = ListGenreInput(
        search=common["search"],
        page=common["page"],
        per_page=common["per_page"],
        sort=sort,
        direction=common["direction"],
    )

    output = use_case.execute(input)

    return output
