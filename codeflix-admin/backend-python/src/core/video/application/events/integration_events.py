from dataclasses import dataclass

from src.core._shared.events.event import Event


@dataclass(frozen=True)
class AudioVideoMediaUpdatedIntegrationEvent(Event):
    resource_id: str  # "<id>.<MediaType>" -> "123456.VIDEO"
    file_path: str
