import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from src.backend.database.engine import Base
from src.backend.models.enums import UserRole

def generate_user_id():
    return f"U_{uuid.uuid4()}"

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, default=generate_user_id, index=True)
    tenant_id = Column(String(50), ForeignKey("tenants.id"), index=True, nullable=True)

    fullname = Column(String(150), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    role = Column(SQLEnum(UserRole), default=UserRole.COUNSELOR, nullable=False)
    is_active = Column(Boolean, default=True)
    
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relasi balik ke Tenant
    tenant = relationship("Tenant", back_populates="users")
    

class Token(Base):
    __tablename__ = "token"

    email = Column(String(100), index=True, nullable=False)
    token = Column(String(10), index=True)
    expired = Column(DateTime(timezone=True))
    