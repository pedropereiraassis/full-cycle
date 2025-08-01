import pytest
from uuid import UUID, uuid4

from src.core.category.domain.category import Category


class TestCategory:
    def test_name_is_required(self):
        with pytest.raises(
            TypeError, match="missing 1 required positional argument: 'name'"
        ):
            Category()

    def test_name_must_have_less_than_255_characters(self):
        with pytest.raises(ValueError, match="name cannot be longer than 255"):
            Category(name="a" * 256)

    def test_category_must_be_created_with_id_as_uuid_by_default(self):
        category = Category(name="movie")
        assert isinstance(category.id, UUID)

    def test_created_category_with_default_values(self):
        category = Category(name="movie")
        assert category.name == "movie"
        assert category.description == ""
        assert category.is_active is True

    def test_category_is_created_as_active_by_default(self):
        category = Category(name="movie")
        assert category.is_active is True

    def test_category_is_created_with_provided_values(self):
        cat_id = uuid4()
        category = Category(
            id=cat_id, name="movie", description="movie description", is_active=False
        )
        assert category.id == cat_id
        assert category.name == "movie"
        assert category.description == "movie description"
        assert category.is_active is False

    def test_str_of_category_is_correct(self):
        category = Category(name="movie", description="description")
        assert str(category) == "movie - description - True"

    def test_repr_of_category_is_correct(self):
        cat_id = uuid4()
        category = Category(id=cat_id, name="movie", description="description")
        assert repr(category) == f"<Category movie ({cat_id})>"

    def test_cannot_create_category_with_empty_name(self):
        with pytest.raises(ValueError, match="name cannot be empty"):
            Category(name="")

    def test_description_must_have_less_than_1024_characters(self):
        with pytest.raises(ValueError, match="description cannot be longer than 1024"):
            Category(name="Movie", description="d" * 1025)

    def test_name_and_description_are_invalid(self):
        with pytest.raises(
            ValueError,
            match="^name cannot be empty,description cannot be longer than 1024$",
        ):
            Category(name="", description="d" * 1025)


class TestUpdateCategory:
    def test_update_category_with_name_and_description(self):
        category = Category(name="Movie", description="General movies")

        category.update_category(name="TV Show", description="General TV Shows")

        assert category.name == "TV Show"
        assert category.description == "General TV Shows"

    def test_update_category_with_invalid_name(self):
        category = Category(name="Movie", description="General movies")

        with pytest.raises(ValueError, match="name cannot be longer than 255"):
            category.update_category(name="a" * 256, description="General TV Shows")

    def test_cannot_update_category_with_empty_name(self):
        category = Category(name="Movie", description="General movies")

        with pytest.raises(ValueError, match="name cannot be empty"):
            category.update_category(name="", description="General TV Shows")


class TestActivateCategory:
    def test_activate_inactive_category(self):
        category = Category(name="Movie", description="General movies", is_active=False)

        assert category.is_active is False

        category.activate()

        assert category.is_active is True

    def test_activate_active_category(self):
        category = Category(name="Movie", description="General movies")

        assert category.is_active is True

        category.activate()

        assert category.is_active is True


class TestDectivateCategory:
    def test_deactivate_active_category(self):
        category = Category(name="Movie", description="General movies")

        assert category.is_active is True

        category.deactivate()

        assert category.is_active is False

    def test_deactivate_inactive_category(self):
        category = Category(name="Movie", description="General movies", is_active=False)

        assert category.is_active is False

        category.deactivate()

        assert category.is_active is False


class TestEquality:
    def test_when_categories_have_same_id_they_are_equal(self):
        common_id = uuid4()
        category_1 = Category(id=common_id, name="Movie")
        category_2 = Category(id=common_id, name="Movie")

        assert category_1 == category_2

    def test_equality_different_classes(self):
        class Dummy:
            pass

        common_id = uuid4()
        category = Category(id=common_id, name="Movie")
        dummy = Dummy()
        dummy.id = common_id

        assert category != dummy
