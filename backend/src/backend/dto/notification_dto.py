from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationCreateDTO(BaseModel):
    user_id: str
    tenant_id: Optional[str] = None
    title: str
    message: Optional[str] = None
    type: str = "info"
    reference_type: Optional[str] = None
    reference_id: Optional[str] = None

class NotificationResponseDTO(BaseModel):
    id: str
    user_id: Optional[str] = None
    tenant_id: Optional[str] = None
    title: str
    message: Optional[str] = None
    type: str
    is_read: bool
    reference_type: Optional[str] = None
    reference_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationListResponse(BaseModel):
    status: str
    data: list[NotificationResponseDTO]
    unread_count: int
