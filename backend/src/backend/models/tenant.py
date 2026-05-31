from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy import Enum as SQLEnum
from ..database.engine import Base
from .enums import TenantStatus
    
class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)                # Nama Sekolah
    subdomain = Column(String, unique=True, nullable=False) # Domain/Subdomain
    status = Column(SQLEnum(TenantStatus), default=TenantStatus.ACTIVE)
    contact_email = Column(String, nullable=True) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())