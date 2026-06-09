from sqlalchemy.orm import Session
from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO, UserResponseDTO, StaffCreateDTO, UserResponseDTO
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

def create_staff(db: Session, data: StaffCreateDTO, current_admin: User):
    new_staff = user_service.register_staff_member(db, data, current_admin)
    return {
        "status": "success",
        "message": f"Akun staf ({new_staff.role}) berhasil dibuat.",
        "data": UserResponseDTO.model_validate(new_staff)
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