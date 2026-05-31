from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MlModelResponse(BaseModel):
    id: int
    version: str
    algorithm: str
    is_active: bool
    uploaded_by: Optional[int] = None
    metrics: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class MlModelListResponse(BaseModel):
    items: list[MlModelResponse]
    total: int

class MlModelUploadResponse(BaseModel):
    id: int
    version: str
    algorithm: str
    is_active: bool
    message: str
