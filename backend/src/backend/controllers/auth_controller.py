from sqlalchemy.orm import Session
from src.backend.dto.user_dto import UserLoginDTO
from src.backend.services import auth_service

def login(db: Session, login_data: UserLoginDTO):
    result = auth_service.login_user(db, login_data)
    return {
        "status": "success", 
        "message": "Login berhasil!", 
        "data": result
    }