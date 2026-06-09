from sqlalchemy.orm import Session
from src.backend.services import audit_log_service
from src.backend.models.user import User
from src.backend.dto.audit_log_dto import AuditLogResponseDTO

def get_audit_logs(db: Session, current_user: User, skip: int = 0, limit: int = 100):
    logs = audit_log_service.fetch_tenant_audit_logs(db, current_user, skip, limit)
    return {
        "status": "success",
        "data": [AuditLogResponseDTO.model_validate(log) for log in logs]
    }