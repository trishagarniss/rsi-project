# backend/src/backend/models/tenant.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
import enum
from sqlalchemy import Enum as SQLEnum
from ..core.database import Base

class TenantStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRIAL = "trial"
    
class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)                # Nama Sekolah
    subdomain = Column(String, unique=True, nullable=False) # Domain/Subdomain
    status = Column(SQLEnum(TenantStatus), default=TenantStatus.ACTIVE)
    contact_email = Column(String, nullable=True) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())