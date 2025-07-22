from rest_framework import serializers

from src.core.video.domain.value_objects import Rating


class VideoRatingField(serializers.ChoiceField):
    def __init__(self, **kwargs):
        choices = [(type.name, type.value) for type in Rating]
        super().__init__(choices=choices, **kwargs)

    def to_internal_value(self, data):
        return Rating(super().to_internal_value(data))

    def to_representation(self, value):
        return str(super().to_representation(value))


class SetField(serializers.ListField):
    def to_internal_value(self, data):
        return set(super().to_internal_value(data))

    def to_representation(self, data):
        return list(super().to_representation(data))


class CreateVideoRequestSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(allow_blank=True, allow_null=False)
    launch_year = serializers.IntegerField()
    rating = VideoRatingField(required=True)
    duration = serializers.DecimalField(max_digits=10, decimal_places=2)
    categories = SetField(child=serializers.UUIDField())
    genres = SetField(child=serializers.UUIDField())
    cast_members = SetField(child=serializers.UUIDField())


class CreateVideoResponseSerializer(serializers.Serializer):
    id = serializers.UUIDField()
