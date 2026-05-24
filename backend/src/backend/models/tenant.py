# backend/src/backend/models/tenant.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
import enum
from sqlalchemy import Enum as SQLEnum
from ..core.database import Base

class TenantStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    
class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)                # Nama Sekolah
    domain = Column(String, unique=True, nullable=False) # Domain/Subdomain
    status = Column(SQLEnum(TenantStatus), default=TenantStatus.ACTIVE)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
     # contact_email = Column(String, nullable=True)   # nanti
    # logo_url = Column(String, nullable=True)        # nanti