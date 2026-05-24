# backend/src/backend/models/tenant.py

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..core.database import Base

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)                # Nama Sekolah
    domain = Column(String, unique=True, nullable=False) # Domain/Subdomain
    status = Column(String, default="active")            # active / inactive
    created_at = Column(DateTime, server_default=func.now())  # Tanggal dibuat