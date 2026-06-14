from sqlalchemy.orm import Session
from src.backend.dto.user_dto import UserLoginDTO, UserCreateDTO
from src.backend.services import auth_service

def check_reg_code(reg_code: str):
    result = auth_service.validate_reg_code(reg_code)
    return {
        "status": "success",
        "message": "Kode registrasi valid.",
        "data": result
    }

def login(db: Session, login_data: UserLoginDTO):
    result = auth_service.login_user(db, login_data)
    return {
        "status": "success", 
        "message": "Login berhasil!", 
        "data": result
    }
    
def register_admin(db: Session, reg_code: str, admin_data: UserCreateDTO):
    result = auth_service.register_admin_with_code(db, reg_code, admin_data)
    return {
        "status": "success",
        "message": result["message"],
        "data": {
            "admin_email": result["admin_email"],
            "tenant_id": result["tenant_id"]
        }
    }