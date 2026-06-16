import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from src.backend.database.engine import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: f"N_{uuid.uuid4().hex[:12]}")
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    tenant_id = Column(String, nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=True)
    type = Column(String(20), nullable=False, default="info")  # info, success, warning, error
    is_read = Column(Boolean, nullable=False, default=False)
    reference_type = Column(String(50), nullable=True)  # tenant, user, model, contact
    reference_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
