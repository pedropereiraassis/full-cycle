from rest_framework import serializers

from src.django_project._shared.serializers import ListOutputMetaSerializer


class GenreOutputSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField(max_length=255)
    is_active = serializers.BooleanField()
    categories = serializers.ListField(child=serializers.UUIDField())


class ListGenreOutputSerializer(serializers.Serializer):
    data = GenreOutputSerializer(many=True)
    meta = ListOutputMetaSerializer()


class SetField(serializers.ListField):
    def to_internal_value(self, data):
        return set(super().to_internal_value(data))

    def to_representation(self, data):
        return list(super().to_representation(data))


class CreateGenreInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    is_active = serializers.BooleanField(default=True)
    categories = SetField(child=serializers.UUIDField(), required=False)


class CreateGenreOutputSerializer(serializers.Serializer):
    id = serializers.UUIDField()


class UpdateGenreInputSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=True)
    name = serializers.CharField(required=True)
    is_active = serializers.BooleanField(required=True)
    categories = SetField(
        child=serializers.UUIDField(), required=True, allow_empty=True
    )


class DeleteGenreInputSerializer(serializers.Serializer):
    id = serializers.UUIDField()
