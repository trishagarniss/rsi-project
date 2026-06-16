from sqlalchemy.orm import Session
from src.backend.models.user import User
from src.backend.services import notification_service

def get_my_notifications(db: Session, current_user: User, skip: int = 0, limit: int = 50):
    return notification_service.fetch_user_notifications(db, current_user.id, skip, limit)

def get_recent_unread(db: Session, current_user: User, limit: int = 5):
    return notification_service.fetch_recent_unread(db, current_user.id, limit)

def read_notification(db: Session, notif_id: str, current_user: User):
    return notification_service.mark_notification_read(db, notif_id, current_user.id)

def read_all_notifications(db: Session, current_user: User):
    return notification_service.mark_all_notifications_read(db, current_user.id)
