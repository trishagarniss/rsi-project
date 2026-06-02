import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID, JSONB

from src.backend.database.engine import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    action = Column(String(100), nullable=False) # Contoh: 'UPDATE_STUDENT', 'BULK_UPLOAD'
    details = Column(JSONB, nullable=True) # Payload perubahan
    ip_address = Column(String(45), nullable=True) # 45 karakter cukup untuk IPv6
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())