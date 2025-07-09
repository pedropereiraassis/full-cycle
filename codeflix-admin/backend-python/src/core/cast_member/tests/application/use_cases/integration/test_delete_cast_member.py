from uuid import UUID
from src.core.cast_member.application.use_cases.delete_cast_member import (
    DeleteCastMember,
)
from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.core.cast_member.infra.in_memory_cast_member_repository import (
    InMemoryCastMemberRepository,
)


class TestDeleteCastMember:
    def test_delete_cast_member(self):
        cast_member = CastMember(
            name="John Doe",
            type=CastMemberType.ACTOR,
        )
        repository = InMemoryCastMemberRepository()
        repository.save(cast_member)

        use_case = DeleteCastMember(repository=repository)

        input = DeleteCastMember.Input(
            id=cast_member.id,
        )

        assert repository.get_by_id(cast_member.id) is not None

        output = use_case.execute(input)

        assert output is None
        assert len(repository.cast_members) == 0
        assert repository.get_by_id(cast_member.id) is None
