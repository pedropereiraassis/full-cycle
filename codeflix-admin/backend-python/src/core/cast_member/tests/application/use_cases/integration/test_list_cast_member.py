from uuid import UUID

import pytest
from src.core.cast_member.application.use_cases.list_cast_member import (
    CastMemberOutput,
    ListCastMember,
)
from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.core.cast_member.infra.in_memory_cast_member_repository import (
    InMemoryCastMemberRepository,
)


class TestListCastMember:
    @pytest.fixture
    def actor(self) -> CastMember:
        return CastMember(
            name="John Doe",
            type=CastMemberType.ACTOR,
        )

    @pytest.fixture
    def director(self) -> CastMember:
        return CastMember(
            name="Jane Unknown",
            type=CastMemberType.DIRECTOR,
        )

    def test_when_no_cast_members_then_return_empty_list(self):
        repository = InMemoryCastMemberRepository()

        use_case = ListCastMember(repository=repository)
        input = ListCastMember.Input()

        output = use_case.execute(input)

        assert output == ListCastMember.Output(data=[])

    def test_list_cast_member(self, actor, director):
        repository = InMemoryCastMemberRepository()
        repository.save(actor)
        repository.save(director)

        use_case = ListCastMember(repository=repository)
        input = ListCastMember.Input()

        output = use_case.execute(input)

        assert output == ListCastMember.Output(
            data=[
                CastMemberOutput(
                    id=actor.id,
                    name=actor.name,
                    type=actor.type,
                ),
                CastMemberOutput(
                    id=director.id,
                    name=director.name,
                    type=director.type,
                ),
            ]
        )
