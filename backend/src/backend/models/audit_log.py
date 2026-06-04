import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB

from src.backend.database.engine import Base

def generate_audit_log_id():
    return f"AL_{uuid.uuid4()}"

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True, default=generate_audit_log_id, index=True)
    tenant_id = Column(String(50), ForeignKey("tenants.id"), nullable=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)

    action = Column(String(100), nullable=False) # Contoh: 'UPDATE_STUDENT', 'BULK_UPLOAD'
    details = Column(JSONB, nullable=True) # Payload perubahan
    ip_address = Column(String(45), nullable=True) # 45 karakter cukup untuk IPv6
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())