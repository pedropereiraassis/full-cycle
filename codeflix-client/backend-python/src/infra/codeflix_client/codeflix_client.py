from abc import ABC, abstractmethod
from uuid import UUID

from src.infra.codeflix_client.dtos import VideoResponse


class CodeflixClient(ABC):
    @abstractmethod
    def get_video(self, id: UUID) -> VideoResponse:
        raise NotImplementedError
