from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class Entity(BaseModel):
    id: UUID
    created_at: datetime
    updated_at: datetime
    is_active: bool
