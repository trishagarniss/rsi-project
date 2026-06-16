from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.backend.database.engine import get_db
from src.backend.controllers import notification_controller
from src.backend.middlewares.auth import require_role
from src.backend.models.enums import UserRole
from src.backend.models.user import User

router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])

@router.get("/")
def list_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.COUNSELOR])),
):
    return notification_controller.get_my_notifications(db, current_user, skip, limit)

@router.get("/recent")
def recent_unread(
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.COUNSELOR])),
):
    return notification_controller.get_recent_unread(db, current_user, limit)

@router.put("/{notif_id}/read")
def mark_read(
    notif_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.COUNSELOR])),
):
    return notification_controller.read_notification(db, notif_id, current_user)

@router.put("/read-all")
def mark_read_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.COUNSELOR])),
):
    return notification_controller.read_all_notifications(db, current_user)
