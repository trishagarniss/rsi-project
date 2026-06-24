from sqlalchemy.orm import Session
from src.backend.models.user import User
from src.backend.services import dashboard_service


def get_admin_summary(db: Session, current_user: User):
    data = dashboard_service.build_admin_dashboard(db, current_user)
    return {"status": "success", "data": data}
