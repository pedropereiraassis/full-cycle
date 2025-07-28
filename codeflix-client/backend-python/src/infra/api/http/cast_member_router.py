from typing import Any
from fastapi import APIRouter, Depends, Query

from src.application.list_cast_member import (
    CastMemberSortableFields,
    ListCastMember,
    ListCastMemberInput,
)
from src.application.listing import ListOutput
from src.domain.cast_member import CastMember
from src.domain.cast_member_repository import CastMemberRepository
from src.infra.api.http.dependencies import (
    common_parameters,
    get_cast_member_repository,
)


cast_member_router = APIRouter()


@cast_member_router.get("/", response_model=ListOutput[CastMember])
def list_cast_members(
    repository: CastMemberRepository = Depends(get_cast_member_repository),
    sort: CastMemberSortableFields = Query(
        CastMemberSortableFields.NAME, description="Field to sort by"
    ),
    common: dict[str, Any] = Depends(common_parameters),
) -> ListOutput[CastMember]:
    use_case = ListCastMember(repository=repository)

    input = ListCastMemberInput(
        search=common["search"],
        page=common["page"],
        per_page=common["per_page"],
        sort=sort,
        direction=common["direction"],
    )

    output = use_case.execute(input)

    return output
