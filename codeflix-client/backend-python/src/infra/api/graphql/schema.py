from src.application.list_cast_member import (
    CastMemberSortableFields,
    ListCastMember,
    ListCastMemberInput,
)
import strawberry
from strawberry.fastapi import GraphQLRouter
from strawberry.schema.config import StrawberryConfig

from src.application.list_category import (
    CategorySortableFields,
    ListCategory,
    ListCategoryInput,
)
from src.application.listing import ListOutputMeta
from src.domain.category import Category
from src.domain.cast_member import CastMember
from src.domain.repository import DEFAULT_PAGINATION_SIZE, SortDirection
from src.infra.api.http.dependencies import (
    get_cast_member_repository,
    get_category_repository,
)


@strawberry.experimental.pydantic.type(model=Category)
class CategoryGraphQL:
    id: strawberry.auto
    name: strawberry.auto
    description: strawberry.auto


@strawberry.experimental.pydantic.type(model=CastMember)
class CastMemberGraphQL:
    id: strawberry.auto
    name: strawberry.auto
    type: strawberry.auto


@strawberry.experimental.pydantic.type(model=ListOutputMeta, all_fields=True)
class Meta:
    pass


@strawberry.type
class Result[T]:
    data: list[T]
    meta: Meta


def get_categories(
    page: int = 1,
    per_page: int = DEFAULT_PAGINATION_SIZE,
    sort: CategorySortableFields = CategorySortableFields.NAME,
    direction: SortDirection = SortDirection.ASC,
    search: str | None = None,
) -> Result[CategoryGraphQL]:
    repository = get_category_repository()
    input = ListCategoryInput(
        page=page, per_page=per_page, sort=sort, direction=direction, search=search
    )
    use_case = ListCategory(repository=repository)
    output = use_case.execute(input)
    return Result(
        data=[CategoryGraphQL.from_pydantic(category) for category in output.data],
        meta=Meta(
            page=output.meta.page,
            per_page=output.meta.per_page,
            sort=output.meta.sort,
            direction=output.meta.direction,
        ),
    )


def get_cast_members(
    page: int = 1,
    per_page: int = DEFAULT_PAGINATION_SIZE,
    sort: CastMemberSortableFields = CastMemberSortableFields.NAME,
    direction: SortDirection = SortDirection.ASC,
    search: str | None = None,
) -> Result[CastMemberGraphQL]:
    repository = get_cast_member_repository()
    input = ListCastMemberInput(
        page=page, per_page=per_page, sort=sort, direction=direction, search=search
    )
    use_case = ListCastMember(repository=repository)
    output = use_case.execute(input)
    return Result(
        data=[
            CastMemberGraphQL.from_pydantic(cast_member) for cast_member in output.data
        ],
        meta=Meta(
            page=output.meta.page,
            per_page=output.meta.per_page,
            sort=output.meta.sort,
            direction=output.meta.direction,
        ),
    )


@strawberry.type
class Query:
    categories: Result[CategoryGraphQL] = strawberry.field(resolver=get_categories)
    cast_members: Result[CastMemberGraphQL] = strawberry.field(
        resolver=get_cast_members
    )


schema = strawberry.Schema(query=Query, config=StrawberryConfig(auto_camel_case=False))

graphql_router = GraphQLRouter(schema)
