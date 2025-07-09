import uuid
from rest_framework.test import APIClient
import pytest
from rest_framework import status

from src.core.cast_member.domain.cast_member import CastMember, CastMemberType
from src.django_project.cast_member_app.repository import DjangoORMCastMemberRepository


@pytest.fixture
def actor():
    return CastMember(
        name="John Doe",
        type=CastMemberType.ACTOR,
    )


@pytest.fixture
def director():
    return CastMember(
        name="Jane Unknown",
        type=CastMemberType.DIRECTOR,
    )


@pytest.fixture
def cast_member_repository() -> DjangoORMCastMemberRepository:
    return DjangoORMCastMemberRepository()


@pytest.mark.django_db
class TestListAPI:
    def test_list_cast_members(
        self,
        actor,
        director,
        cast_member_repository,
    ):
        cast_member_repository.save(actor)
        cast_member_repository.save(director)

        url = "/api/cast_members/"
        response = APIClient().get(url)

        expected_response = {
            "data": [
                {
                    "id": str(actor.id),
                    "name": "John Doe",
                    "type": "ACTOR",
                },
                {
                    "id": str(director.id),
                    "name": "Jane Unknown",
                    "type": "DIRECTOR",
                },
            ]
        }

        assert response.status_code == status.HTTP_200_OK
        assert response.data == expected_response


@pytest.mark.django_db
class TestCreateAPI:
    def test_create_cast_member(
        self,
        cast_member_repository,
    ):
        url = "/api/cast_members/"
        data = {
            "name": "John Doe",
            "type": "ACTOR",
        }
        response = APIClient().post(url, data=data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["id"] is not None

        saved_cast_member = cast_member_repository.get_by_id(response.data["id"])
        assert saved_cast_member == CastMember(
            id=uuid.UUID(response.data["id"]),
            name="John Doe",
            type=CastMemberType.ACTOR,
        )


@pytest.mark.django_db
class TestUpdateAPI:
    def test_update_cast_member(
        self,
        actor,
        cast_member_repository,
    ):
        cast_member_repository.save(actor)

        url = f"/api/cast_members/{str(actor.id)}/"
        data = {
            "name": "Jane Updated",
            "type": "DIRECTOR",
        }
        response = APIClient().put(url, data=data)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert response.data is None

        updated_cast_member = cast_member_repository.get_by_id(actor.id)
        assert updated_cast_member == CastMember(
            id=actor.id,
            name="Jane Updated",
            type=CastMemberType.DIRECTOR,
        )


@pytest.mark.django_db
class TestDeleteAPI:
    def test_delete_cast_member(
        self,
        actor,
        cast_member_repository,
    ):
        cast_member_repository.save(actor)

        url = f"/api/cast_members/{str(actor.id)}/"
        response = APIClient().delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert response.data is None

        deleted_cast_member = cast_member_repository.get_by_id(actor.id)
        assert deleted_cast_member is None
