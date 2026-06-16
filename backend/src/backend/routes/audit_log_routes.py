from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.controllers import audit_log_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/audit-logs", tags=["Audit Logs"])

@router.get("/")
def get_audit_logs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.SUPERADMIN])) # Admin sekolah & Superadmin bisa lihat log
):
    return audit_log_controller.get_audit_logs(db, current_user, skip, limit)