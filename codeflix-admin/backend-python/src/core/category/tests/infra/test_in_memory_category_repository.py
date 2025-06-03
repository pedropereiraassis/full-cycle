from src.core.category.domain.category import Category
from src.core.category.infra.in_memory_category_repository import InMemoryCategoryRepository


class TestSave:
    def test_can_save_category(self):
        repository = InMemoryCategoryRepository()

        category = Category(
            name="Movie",
            description="Movies category"
        )

        repository.save(category)

        assert len(repository.categories) == 1
        assert repository.categories[0] == category

class TestGetById:
    def test_can_get_category_by_id(self):
        category = Category(
            name="Movie",
            description="Movies category"
        )

        repository = InMemoryCategoryRepository(categories=[category])

        category_found = repository.get_by_id(id=category.id)

        assert category_found == repository.categories[0]
        assert category_found == Category(
            id=category.id,
            name="Movie",
            description="Movies category"
        )

class TestDelete:
    def test_can_delete_category(self):
        category = Category(
            name="Movie",
            description="Movies category"
        )

        repository = InMemoryCategoryRepository(categories=[category])

        assert repository.get_by_id(category.id) is not None

        repository.delete(id=category.id)

        assert repository.get_by_id(category.id) is None
