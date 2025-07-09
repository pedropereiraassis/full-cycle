from unittest.mock import MagicMock, create_autospec
from uuid import UUID
import uuid

import pytest

from src.core.cast_member.application.use_cases.update_cast_member import (
    UpdateCastMember,
)
from src.core.cast_member.application.use_cases.exceptions import (
    CastMemberNotFound,
    InvalidCastMember,
)
from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.core.cast_member.domain.cast_member_repository import CastMemberRepository


class TestUpdateCastMember:
    @pytest.fixture
    def actor(self) -> CastMember:
        return CastMember(name="John Doe", type=CastMemberType.ACTOR)

    @pytest.fixture
    def mock_repository(
        self,
        actor: CastMember,
    ) -> CastMemberRepository:
        repository = create_autospec(CastMemberRepository)
        repository.get_by_id.return_value = actor
        return repository

    def test_update_cast_member_name_and_type(self, actor, mock_repository):
        use_case = UpdateCastMember(repository=mock_repository)
        input = UpdateCastMember.Input(
            id=actor.id, name="Jane Unknown", type=CastMemberType.DIRECTOR
        )

        use_case.execute(input)

        assert actor.name == "Jane Unknown"
        assert actor.type == CastMemberType.DIRECTOR

    def test_when_cast_member_not_found_then_raise_exception(self):
        mock_repository = create_autospec(CastMemberRepository)
        mock_repository.get_by_id.return_value = None

        use_case = UpdateCastMember(repository=mock_repository)
        input = UpdateCastMember.Input(
            id=uuid.uuid4(), name="Jane Unknown", type=CastMemberType.DIRECTOR
        )

        with pytest.raises(CastMemberNotFound) as exec_info:
            use_case.execute(input)

        mock_repository.update.assert_not_called()
        assert str(exec_info.value) == f"CastMember with {input.id} not found"

    def test_when_cast_member_is_updated_to_invalid_state_then_raise_exception(
        self,
        mock_repository,
        actor,
    ) -> None:
        use_case = UpdateCastMember(mock_repository)
        request = UpdateCastMember.Input(
            id=actor.id,
            name="",
            type="",
        )

        with pytest.raises(InvalidCastMember) as exec_info:
            use_case.execute(request)

        mock_repository.update.assert_not_called()
        assert str(exec_info.value) == "name cannot be empty"
