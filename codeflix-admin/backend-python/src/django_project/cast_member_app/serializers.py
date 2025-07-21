from rest_framework import serializers

from src.core.cast_member.domain.cast_member import CastMemberType
from src.django_project._shared.serializers import ListOutputMetaSerializer


class CastMemberTypeField(serializers.ChoiceField):
    def __init__(self, **kwargs):
        choices = [(type.name, type.value) for type in CastMemberType]
        super().__init__(choices=choices, **kwargs)

    def to_internal_value(self, data):
        return CastMemberType(super().to_internal_value(data))

    def to_representation(self, value):
        return str(super().to_representation(value))


class CastMemberOutputSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField(max_length=255)
    type = CastMemberTypeField(required=True)


class ListCastMemberOutputSerializer(serializers.Serializer):
    data = CastMemberOutputSerializer(many=True)
    meta = ListOutputMetaSerializer()


class CreateCastMemberInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    type = CastMemberTypeField(required=True)


class CreateCastMemberOutputSerializer(serializers.Serializer):
    id = serializers.UUIDField()


class UpdateCastMemberInputSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True)
    name = serializers.CharField(required=True)
    type = CastMemberTypeField(required=True)


class DeleteCastMemberInputSerializer(serializers.Serializer):
    id = serializers.UUIDField()
