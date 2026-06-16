from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class AuditLogCreateDTO(BaseModel):
    user_id: str
    tenant_id: Optional[str] = None
    action: str = Field(..., description="Contoh: CREATE, UPDATE, DELETE, LOGIN")
    entity_name: str = Field(..., description="Tabel yang diubah, misal: students, attendances")
    entity_id: Optional[str] = Field(None, description="ID dari baris yang diubah")
    details: Optional[Dict[str, Any]] = Field(None, description="Simpan perubahan data dalam format JSON")

class AuditLogResponseDTO(BaseModel):
    id: str
    user_id: str
    tenant_id: str
    action: str
    entity_name: str
    entity_id: Optional[str]
    details: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True