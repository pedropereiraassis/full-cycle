from abc import ABC, abstractmethod


class AuthServiceInerface(ABC):
    @abstractmethod
    def is_authenticated(self) -> bool:
        pass

    @abstractmethod
    def has_role(self, role: str) -> bool:
        pass
