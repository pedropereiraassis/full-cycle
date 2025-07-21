from uuid import UUID
from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.core.cast_member.domain.cast_member_repository import CastMemberRepository
from src.django_project.cast_member_app.models import CastMember as CastMemberORM


class DjangoORMCastMemberRepository(CastMemberRepository):
    def __init__(self, model: CastMemberORM | None = None):
        self.model = model or CastMemberORM

    def save(self, cast_member: CastMember):
        cast_member_model = CastMemberModelMapper.to_model(cast_member)
        cast_member_model.save()

    def get_by_id(self, id: UUID) -> CastMember | None:
        try:
            cast_member_model = CastMemberORM.objects.get(id=id)
            return CastMemberModelMapper.to_entity(cast_member_model)
        except self.model.DoesNotExist:
            return None

    def delete(self, id: UUID) -> None:
        self.model.objects.filter(id=id).delete()

    def list(self) -> list[CastMember]:
        return [
            CastMemberModelMapper.to_entity(cast_member_model)
            for cast_member_model in self.model.objects.all()
        ]

    def update(self, cast_member: CastMember) -> None:
        self.model.objects.filter(pk=cast_member.id).update(
            name=cast_member.name,
            type=cast_member.type,
        )


class CastMemberModelMapper:
    @staticmethod
    def to_model(cast_member: CastMember) -> CastMemberORM:
        return CastMemberORM(
            id=cast_member.id,
            name=cast_member.name,
            type=cast_member.type,
        )

    @staticmethod
    def to_entity(cast_member_orm: CastMemberORM) -> CastMember:
        return CastMember(
            id=cast_member_orm.id,
            name=cast_member_orm.name,
            type=CastMemberType(cast_member_orm.type),
        )
