from django.db import transaction
from uuid import UUID
from src.core.genre.domain.genre import Genre
from src.core.genre.domain.genre_repository import GenreRepository
from src.django_project.genre_app.models import Genre as GenreORM


class DjangoORMGenreRepository(GenreRepository):
    def save(self, genre: Genre):
        with transaction.atomic():
            genre_model = GenreModelMapper.to_model(genre)
            genre_model.save()

    def get_by_id(self, id: UUID) -> Genre | None:
        try:
            genre_model = GenreORM.objects.get(id=id)
        except:
            return None

        return GenreModelMapper.to_entity(genre_model)

    def delete(self, id: UUID) -> None:
        GenreORM.objects.filter(id=id).delete()

    def list(self) -> list[Genre]:
        return [
            GenreModelMapper.to_entity(genre_model)
            for genre_model in GenreORM.objects.all()
        ]

    def update(self, genre: Genre) -> None:
        try:
            genre_model = GenreORM.objects.get(id=genre.id)
        except GenreORM.DoesNotExist:
            return None

        with transaction.atomic():
            GenreORM.objects.filter(id=genre.id).update(
                name=genre.name, is_active=genre.is_active
            )

            genre_model.categories.set(genre.categories)


class GenreModelMapper:
    @staticmethod
    def to_model(genre: Genre) -> GenreORM:
        genre_orm = GenreORM(
            id=genre.id,
            name=genre.name,
            is_active=genre.is_active,
        )
        genre_orm.categories.set(genre.categories)

        return genre_orm

    @staticmethod
    def to_entity(genre_orm: GenreORM) -> Genre:
        return Genre(
            id=genre_orm.id,
            name=genre_orm.name,
            is_active=genre_orm.is_active,
            categories={category.id for category in genre_orm.categories.all()},
        )
