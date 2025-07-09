from uuid import UUID
from src.core.cast_member.application.use_cases.update_cast_member import (
    UpdateCastMember,
)
from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.core.cast_member.infra.in_memory_cast_member_repository import (
    InMemoryCastMemberRepository,
)


class TestUpdateCastMember:
    def test_update_cast_member(self):
        cast_member = CastMember(
            name="John Doe",
            type=CastMemberType.ACTOR,
        )
        repository = InMemoryCastMemberRepository()
        repository.save(cast_member)

        use_case = UpdateCastMember(repository=repository)

        input = UpdateCastMember.Input(
            id=cast_member.id,
            name="John Unknown",
            type=CastMemberType.DIRECTOR,
        )

        output = use_case.execute(input)

        assert output is None

        persisted_cast_member = repository.cast_members[0]
        assert persisted_cast_member.id == input.id
        assert persisted_cast_member.name == "John Unknown"
        assert persisted_cast_member.type == CastMemberType.DIRECTOR
