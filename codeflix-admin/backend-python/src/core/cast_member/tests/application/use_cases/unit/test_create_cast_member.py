from unittest.mock import MagicMock
from uuid import UUID

import pytest

from src.core.cast_member.application.use_cases.create_cast_member import (
    CreateCastMember,
)
from src.core.cast_member.application.use_cases.exceptions import InvalidCastMember
from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.core.cast_member.domain.cast_member_repository import CastMemberRepository


class TestCreateCastMember:
    def test_create_cast_member_with_valid_data(self):
        mock_repository = MagicMock(CastMemberRepository)
        use_case = CreateCastMember(repository=mock_repository)
        input = CreateCastMember.Input(
            name="John Doe",
            type=CastMemberType.ACTOR,
        )

        output = use_case.execute(input)

        assert output.id is not None
        assert isinstance(output, CreateCastMember.Output)
        assert isinstance(output.id, UUID)
        assert mock_repository.save.called is True

    def test_create_cast_member_with_invalid_data(self):
        mock_repository = MagicMock(CastMemberRepository)
        use_case = CreateCastMember(repository=mock_repository)
        input = CreateCastMember.Input(
            name="",
            type="",
        )

        with pytest.raises(
            InvalidCastMember, match="name cannot be empty"
        ) as exec_info:
            use_case.execute(input)

        assert exec_info.type is InvalidCastMember
        assert str(exec_info.value) == "name cannot be empty"
