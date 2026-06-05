from sqlalchemy.orm import Session
from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO, UserResponseDTO, CounselorCreateDTO
from src.backend.models.user import User
from src.backend.services import user_service

def register_user(db: Session, user_data: UserCreateDTO):
    new_user = user_service.register_new_user(db, user_data)
    safe_data = UserResponseDTO.model_validate(new_user)
    return {
        "status": "success",
        "message": "Akun admin sekolah berhasil didaftarkan!",
        "data": safe_data
    }

def register_counselor(db: Session, counselor_data: CounselorCreateDTO, admin_user: User):
    new_counselor = user_service.register_new_counselor(db, counselor_data, admin_user)
    safe_data = UserResponseDTO.model_validate(new_counselor)
    return {
        "status": "success",
        "message": "Akun konselor berhasil dibuat!",
        "data": safe_data
    }

def fetch_all_users(db: Session, current_user: User, skip: int = 0, limit: int = 100):
    users = user_service.get_users_list(db, current_user, skip, limit)
    return {"status": "success", "data": [UserResponseDTO.model_validate(u) for u in users]}

def fetch_user_detail(db: Session, user_id: str, current_user: User):
    user = user_service.get_user_detail(db, user_id, current_user)
    return {"status": "success", "data": UserResponseDTO.model_validate(user)}

def update_user_profile(db: Session, user_id: str, update_data: UserUpdateDTO, current_user: User):
    updated = user_service.modify_existing_user(db, user_id, update_data, current_user)
    return {"status": "success", "message": "Profil diperbarui", "data": UserResponseDTO.model_validate(updated)}
    
def delete_existing_user(db: Session, user_id: str, current_user: User):
    user_service.remove_user(db, user_id, current_user)
    return {
        "status": "success",
        "message": "Akun pengguna berhasil dihapus!"
    }