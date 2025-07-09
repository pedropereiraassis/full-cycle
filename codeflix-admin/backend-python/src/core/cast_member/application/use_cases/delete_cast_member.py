from dataclasses import dataclass
from uuid import UUID

from src.core.cast_member.application.use_cases.exceptions import (
    CastMemberNotFound,
)
from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.core.cast_member.domain.cast_member_repository import CastMemberRepository


class DeleteCastMember:
    def __init__(self, repository: CastMemberRepository):
        self.repository = repository

    @dataclass
    class Input:
        id: UUID

    def execute(self, input: Input) -> None:
        cast_member = self.repository.get_by_id(input.id)
        if cast_member is None:
            raise CastMemberNotFound(f"CastMember with {input.id} not found")

        self.repository.delete(cast_member.id)
