import pytest

from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.django_project.cast_member_app.repository import DjangoORMCastMemberRepository
from src.django_project.cast_member_app.models import CastMember as CastMemberORM


@pytest.mark.django_db
class TestSave:
    def test_save_cast_member_in_database(self):
        cast_member = CastMember(
            name="John Doe",
            type=CastMemberType.ACTOR,
        )
        cast_member_repository = DjangoORMCastMemberRepository()

        assert CastMemberORM.objects.count() == 0

        cast_member_repository.save(cast_member)

        assert CastMemberORM.objects.count() == 1
        cast_member_model = CastMemberORM.objects.first()
        assert cast_member_model.id == cast_member.id
        assert cast_member_model.name == "John Doe"
        assert cast_member_model.type == CastMemberType.ACTOR
