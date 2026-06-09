from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MlModelCreateDTO(BaseModel):
    version: str = Field(..., max_length=50, description="Contoh: v1.0.0")
    algorithm: str = Field(..., max_length=100, description="Contoh: Random Forest")
    file_path: str = Field(..., max_length=255, description="Lokasi file .pkl")
    accuracy_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    is_active: bool = False

class MlModelUpdateDTO(BaseModel):
    version: Optional[str] = Field(None, max_length=50)
    algorithm: Optional[str] = Field(None, max_length=100)
    accuracy_score: Optional[float] = Field(None, ge=0.0, le=1.0)
    is_active: Optional[bool] = None

class MlModelResponseDTO(BaseModel):
    id: str
    version: str
    algorithm: str
    file_path: str
    accuracy_score: Optional[float]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True