from datetime import datetime
from unittest.mock import create_autospec
from uuid import uuid4
import pytest

from src.application.listing import ListOutputMeta
from src.domain.cast_member import CastMember, CastMemberType
from src.domain.cast_member_repository import CastMemberRepository
from src.application.list_cast_member import (
    ListCastMember,
    ListCastMemberInput,
)


class TestListCastMember:
    @pytest.fixture
    def actor(self) -> CastMember:
        return CastMember(
            id=uuid4(),
            name="John Doe",
            type=CastMemberType.ACTOR,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            is_active=True,
        )

    @pytest.fixture
    def director(self) -> CastMember:
        return CastMember(
            id=uuid4(),
            name="Jane Unknown",
            type=CastMemberType.DIRECTOR,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            is_active=True,
        )

    def test_list_cast_members_with_default_values(self, director, actor):
        repository = create_autospec(CastMemberRepository)
        repository.search.return_value = [director, actor]

        list_cast_member = ListCastMember(repository)
        output = list_cast_member.execute(input=ListCastMemberInput())

        assert output.data == [director, actor]
        assert output.meta == ListOutputMeta(
            page=1, per_page=5, sort="name", direction="asc"
        )
        repository.search.assert_called_once_with(
            search=None, page=1, per_page=5, sort="name", direction="asc"
        )
