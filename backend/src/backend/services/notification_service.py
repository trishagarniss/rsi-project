from sqlalchemy.orm import Session
from src.backend.repositories import notification_repo, user_repo
from src.backend.dto.notification_dto import NotificationCreateDTO, NotificationResponseDTO
from src.backend.models.notification import Notification

def send_notification_to_user(db: Session, user_id: str, title: str, message: str = None, type: str = "info", reference_type: str = None, reference_id: str = None) -> Notification:
    data = NotificationCreateDTO(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        reference_type=reference_type,
        reference_id=reference_id,
    )
    return notification_repo.create_notification(db, data)

def notify_all_superadmins(db: Session, title: str, message: str = None, type: str = "info", reference_type: str = None, reference_id: str = None):
    superadmins = user_repo.get_all_superadmins(db)
    for sa in superadmins:
        send_notification_to_user(db, sa.id, title, message, type, reference_type, reference_id)

def notify_tenant_admins(db: Session, tenant_id: str, title: str, message: str = None, type: str = "info", reference_type: str = None, reference_id: str = None):
    admins = user_repo.get_admins_by_tenant(db, tenant_id)
    for admin in admins:
        send_notification_to_user(db, admin.id, title, message, type, reference_type, reference_id)

def fetch_user_notifications(db: Session, user_id: str, skip: int = 0, limit: int = 50):
    notifications = notification_repo.get_notifications_by_user(db, user_id, skip, limit)
    unread_count = notification_repo.get_unread_count(db, user_id)
    return {
        "status": "success",
        "data": [NotificationResponseDTO.model_validate(n) for n in notifications],
        "unread_count": unread_count,
    }

def fetch_recent_unread(db: Session, user_id: str, limit: int = 5):
    notifications = notification_repo.get_recent_unread(db, user_id, limit)
    unread_count = notification_repo.get_unread_count(db, user_id)
    return {
        "status": "success",
        "data": [NotificationResponseDTO.model_validate(n) for n in notifications],
        "unread_count": unread_count,
    }

def mark_notification_read(db: Session, notif_id: str, user_id: str):
    notif = notification_repo.mark_as_read(db, notif_id)
    if not notif or notif.user_id != user_id:
        return {"status": "error", "message": "Notifikasi tidak ditemukan"}
    return {
        "status": "success",
        "data": NotificationResponseDTO.model_validate(notif),
    }

def mark_all_notifications_read(db: Session, user_id: str):
    count = notification_repo.mark_all_as_read(db, user_id)
    return {"status": "success", "message": f"{count} notifikasi ditandai sudah dibaca"}
