import pytest
from uuid import UUID
import uuid

from category import Category

class TestCategory:
    def test_name_is_required(self):
        with pytest.raises(TypeError, match="missing 1 required positional argument: 'name'"):
            Category()

    def test_name_must_have_less_than_255_characters(self):
        with pytest.raises(ValueError, match="name must have less than 256 characters"):
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
        cat_id = uuid.uuid4()
        category = Category(
            id=cat_id,
            name="movie",
            description="movie description",
            is_active=False
        )
        assert category.id == cat_id
        assert category.name == "movie"
        assert category.description == "movie description"
        assert category.is_active is False

    def test_str_of_category_is_correct(self):
        category = Category(name="movie", description="description")
        assert str(category) == "movie - description - True"

    def test_repr_of_category_is_correct(self):
        cat_id = uuid.uuid4()
        category = Category(id=cat_id, name="movie", description="description")
        assert repr(category) == f"<Category movie ({cat_id})>"
