from sqlalchemy.orm import Session
from typing import List, Optional
from src.backend.models.notification import Notification
from src.backend.dto.notification_dto import NotificationCreateDTO

def create_notification(db: Session, data: NotificationCreateDTO) -> Notification:
    notif = Notification(
        user_id=data.user_id,
        tenant_id=data.tenant_id,
        title=data.title,
        message=data.message,
        type=data.type,
        reference_type=data.reference_type,
        reference_id=data.reference_id,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif

def get_notifications_by_user(db: Session, user_id: str, skip: int = 0, limit: int = 50) -> List[Notification]:
    return db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()

def get_unread_count(db: Session, user_id: str) -> int:
    return db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).count()

def get_recent_unread(db: Session, user_id: str, limit: int = 5) -> List[Notification]:
    return db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).order_by(Notification.created_at.desc()).limit(limit).all()

def mark_as_read(db: Session, notif_id: str) -> Optional[Notification]:
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if notif:
        notif.is_read = True
        db.commit()
        db.refresh(notif)
    return notif

def mark_all_as_read(db: Session, user_id: str) -> int:
    count = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return count

def delete_old_notifications(db: Session, days: int = 30) -> int:
    from sqlalchemy.sql import func
    cutoff = func.now() - func.make_interval(0, 0, 0, days)
    deleted = db.query(Notification).filter(Notification.created_at < cutoff).delete()
    db.commit()
    return deleted
