from unittest.mock import MagicMock, create_autospec
import uuid

import pytest

from src.core.cast_member.application.use_cases.delete_cast_member import (
    DeleteCastMember,
)
from src.core.cast_member.application.use_cases.exceptions import (
    CastMemberNotFound,
)
from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.core.cast_member.domain.cast_member_repository import CastMemberRepository


class TestDeleteCastMember:
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

    def test_delete_cast_member(self, actor, mock_repository):
        use_case = DeleteCastMember(repository=mock_repository)
        input = DeleteCastMember.Input(id=actor.id)

        use_case.execute(input)

        mock_repository.delete.assert_called_once_with(actor.id)

    def test_when_cast_member_not_found_then_raise_exception(self):
        mock_repository = create_autospec(CastMemberRepository)
        mock_repository.get_by_id.return_value = None

        use_case = DeleteCastMember(repository=mock_repository)
        input = DeleteCastMember.Input(id=uuid.uuid4())

        with pytest.raises(CastMemberNotFound) as exec_info:
            use_case.execute(input)

        mock_repository.delete.assert_not_called()
        assert str(exec_info.value) == f"CastMember with {input.id} not found"
