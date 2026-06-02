import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID

from src.backend.database.engine import Base

class MlModel(Base):
    __tablename__ = "ml_models"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    version = Column(String(50), unique=True, nullable=False)
    algorithm = Column(String(100), nullable=False) # misal: 'Random Forest'
    file_path = Column(String(255), nullable=False) # lokasi file
    accuracy_score = Column(Float, nullable=True)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())