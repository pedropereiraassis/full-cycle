from abc import ABC
from dataclasses import asdict, dataclass
from typing import TypeVar


@dataclass(frozen=True, kw_only=True)
class Event(ABC):
    @property
    def type(self) -> str:
        return self.__class__.__name__

    @property
    def payload(self) -> dict:
        return asdict(self)

    def __str__(self):
        return f"{self.type}: {self.payload}"

    def __repr__(self):
        return self.__str__()


TEvent = TypeVar("TEvent", bound=Event)
