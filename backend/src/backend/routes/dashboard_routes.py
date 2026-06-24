from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.controllers import dashboard_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])

@router.get("/admin-summary")
def get_admin_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.COUNSELOR])),
):
    return dashboard_controller.get_admin_summary(db, current_user)
