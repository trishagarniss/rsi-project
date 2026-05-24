from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    aksi = Column(String(30), nullable=False)                   # create, update, delete, login, dll
    target_type = Column(String(30), nullable=False)            # student, user, tenant, dll
    target_id = Column(Integer, nullable=True)
    detail = Column(Text, nullable=True)                        # JSON dengan info tambahan
    ip_address = Column(String(45), nullable=True)              # support IPv6
    created_at = Column(DateTime(timezone=True), server_default=func.now())