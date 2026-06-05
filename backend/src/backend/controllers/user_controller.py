from sqlalchemy.orm import Session
from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO, UserResponseDTO
from src.backend.services import user_service

def register_user(db: Session, user_data: UserCreateDTO):
    new_user = user_service.register_new_user(db, user_data)
    safe_data = UserResponseDTO.model_validate(new_user)
    return {
        "status": "success",
        "message": "Akun berhasil didaftarkan!",
        "data": safe_data
    }

def fetch_all_users(db: Session, skip: int = 0, limit: int = 100):
    users = user_service.get_users_list(db, skip, limit)
    safe_data = [UserResponseDTO.model_validate(u) for u in users]
    return {
        "status": "success",
        "data": safe_data
    }

def fetch_user_detail(db: Session, user_id: str):
    user = user_service.get_user_detail(db, user_id)
    safe_data = UserResponseDTO.model_validate(user)
    return {
        "status": "success",
        "data": safe_data
    }

def update_user_profile(db: Session, user_id: str, update_data: UserUpdateDTO):
    updated = user_service.modify_existing_user(db, user_id, update_data)
    safe_data = UserResponseDTO.model_validate(updated)
    return {
        "status": "success",
        "message": "Profil berhasil diperbarui",
        "data": safe_data
    }