from typing import Any
from fastapi import APIRouter, Depends, Query

from src.application.list_category import (
    CategorySortableFields,
    ListCategory,
    ListCategoryInput,
)
from src.application.listing import ListOutput
from src.domain.category import Category
from src.domain.category_repository import CategoryRepository
from src.infra.api.http.auth import authenticate
from src.infra.api.http.dependencies import common_parameters, get_category_repository


category_router = APIRouter()


@category_router.get("/", response_model=ListOutput[Category])
def list_categories(
    repository: CategoryRepository = Depends(get_category_repository),
    sort: CategorySortableFields = Query(
        CategorySortableFields.NAME, description="Field to sort by"
    ),
    common: dict[str, Any] = Depends(common_parameters),
    auth: None = Depends(authenticate),
) -> ListOutput[Category]:
    use_case = ListCategory(repository=repository)

    input = ListCategoryInput(
        search=common["search"],
        page=common["page"],
        per_page=common["per_page"],
        sort=sort,
        direction=common["direction"],
    )

    output = use_case.execute(input)

    return output
