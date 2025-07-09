import uuid
from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.core.cast_member.infra.in_memory_cast_member_repository import (
    InMemoryCastMemberRepository,
)


class TestSave:
    def test_can_save_cast_member(self):
        repository = InMemoryCastMemberRepository()
        cast_member = CastMember(name="John Doe", type=CastMemberType.ACTOR)

        repository.save(cast_member)

        assert len(repository.cast_members) == 1
        assert repository.cast_members[0] == cast_member


class TestGetById:
    def test_can_get_cast_member_by_id(self):
        actor = CastMember(name="John Doe", type=CastMemberType.ACTOR)
        repository = InMemoryCastMemberRepository(cast_members=[actor])

        cast_member = repository.get_by_id(actor.id)

        assert cast_member == actor

    def test_when_cast_member_does_not_exists_should_return_none(self):
        repository = InMemoryCastMemberRepository()

        cast_member = repository.get_by_id(uuid.uuid4())

        assert cast_member is None


class TestDelete:
    def test_delete_cast_member(self):
        actor = CastMember(name="John Doe", type=CastMemberType.ACTOR)
        repository = InMemoryCastMemberRepository(cast_members=[actor])

        assert len(repository.cast_members) == 1

        repository.delete(actor.id)

        assert len(repository.cast_members) == 0


class TestUpdate:
    def test_update_cast_member(self):
        actor = CastMember(name="John Doe", type=CastMemberType.ACTOR)
        repository = InMemoryCastMemberRepository(cast_members=[actor])

        assert repository.cast_members[0].id == actor.id
        assert repository.cast_members[0].name == "John Doe"
        assert repository.cast_members[0].type == CastMemberType.ACTOR

        actor.update_cast_member(name="Jane Unknown", type=CastMemberType.DIRECTOR)

        repository.update(actor)

        assert repository.cast_members[0].id == actor.id
        assert repository.cast_members[0].name == "Jane Unknown"
        assert repository.cast_members[0].type == CastMemberType.DIRECTOR
