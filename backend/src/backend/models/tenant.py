import uuid
from sqlalchemy import Column, String, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from src.backend.database.engine import Base
from src.backend.models.enums import TenantStatus

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(150), nullable=False)
    address = Column(String(255), nullable=True)
    status = Column(SQLEnum(TenantStatus), default=TenantStatus.ACTIVE)
    contact_email = Column(String(100), nullable=True)
    
    logo_url = Column(String(255), nullable=True) # Opsional

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relasi ke tabel users
    users = relationship("User", back_populates="tenant", cascade="all, delete-orphan")