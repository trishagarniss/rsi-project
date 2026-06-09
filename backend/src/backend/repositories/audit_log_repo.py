from sqlalchemy.orm import Session
from typing import List
from src.backend.models.audit_log import AuditLog # Asumsi model sudah kamu buat
from src.backend.dto.audit_log_dto import AuditLogCreateDTO

def create_log(db: Session, data: AuditLogCreateDTO) -> AuditLog:
    new_log = AuditLog(**data.model_dump())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

def get_logs_by_tenant(db: Session, tenant_id: str, skip: int = 0, limit: int = 100) -> List[AuditLog]:
    return db.query(AuditLog).filter(
        AuditLog.tenant_id == tenant_id
    ).order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()