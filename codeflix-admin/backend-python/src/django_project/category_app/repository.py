from uuid import UUID
from src.core.category.domain.category import Category
from src.core.category.domain.category_repository import CategoryRepository
from src.django_project.category_app.models import Category as CategoryORM


class DjangoORMCategoryRepository(CategoryRepository):
    def __init__(self, category_model: CategoryORM = CategoryORM):
        self.category_model = category_model

    def save(self, category: Category) -> None:
        category_model = CategoryModelMapper.to_model(category)
        category_model.save()

    def get_by_id(self, id: UUID) -> Category | None:
        try:
            category_model = self.category_model.objects.get(id=id)
            return CategoryModelMapper.to_entity(category_model)
        except self.category_model.DoesNotExist:
            return None

    def delete(self, id: UUID) -> None:
        self.category_model.objects.filter(id=id).delete()

    def update(self, category: Category) -> None:
        self.category_model.objects.filter(pk=category.id).update(
            name=category.name,
            description=category.description,
            is_active=category.is_active,
        )

    def list(self) -> list[Category]:
        return [
            CategoryModelMapper.to_entity(category_model)
            for category_model in self.category_model.objects.all()
        ]


class CategoryModelMapper:
    @staticmethod
    def to_model(category: Category) -> CategoryORM:
        return CategoryORM(
            id=category.id,
            name=category.name,
            description=category.description,
            is_active=category.is_active,
        )

    @staticmethod
    def to_entity(category_orm: CategoryORM) -> Category:
        return Category(
            id=category_orm.id,
            name=category_orm.name,
            description=category_orm.description,
            is_active=category_orm.is_active,
        )
