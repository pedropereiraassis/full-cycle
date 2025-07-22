from dataclasses import dataclass
from enum import Enum, StrEnum, auto, unique


@unique
class MediaStatus(Enum):
    PENDING = auto()
    PROCESSING = auto()
    COMPLETED = auto()
    ERROR = auto()


@unique
class Rating(StrEnum):
    ER = "ER"
    L = "L"
    AGE_10 = "AGE_10"
    AGE_12 = "AGE_12"
    AGE_14 = "AGE_14"
    AGE_16 = "AGE_16"
    AGE_18 = "AGE_18"


@dataclass(frozen=True)
class ImageMedia:
    check_sum: str
    name: str
    location: str


@dataclass(frozen=True)
class AudioVideoMedia:
    check_sum: str
    name: str
    raw_location: str
    encoded_location: str
    status: MediaStatus
