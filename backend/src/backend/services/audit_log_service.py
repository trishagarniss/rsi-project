from sqlalchemy.orm import Session
from src.backend.dto.audit_log_dto import AuditLogCreateDTO
from src.backend.repositories import audit_log_repo
from src.backend.models.user import User

def record_activity(db: Session, action: str, entity_name: str, current_user: User, entity_id: str = None, details: dict = None, ip_address: str = None):
    """
    Fungsi ini tidak dipanggil langsung oleh route, 
    melainkan disisipkan di dalam service lain (seperti saat sukses create student).
    """
    log_data = AuditLogCreateDTO(
        user_id=current_user.id,
        tenant_id=current_user.tenant_id,
        action=action,
        entity_name=entity_name,
        entity_id=entity_id,
        ip_address=ip_address,
        details=details
    )
    return audit_log_repo.create_log(db, log_data)

def fetch_tenant_audit_logs(db: Session, current_user: User, skip: int = 0, limit: int = 100):
    # Asumsikan yang boleh melihat log hanya ADMIN
    return audit_log_repo.get_logs_by_tenant(db, current_user.tenant_id, skip, limit)