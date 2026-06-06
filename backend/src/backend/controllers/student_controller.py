from sqlalchemy.orm import Session
from src.backend.dto.student_dto import StudentCreateDTO, StudentResponseDTO
from src.backend.services import student_service
from src.backend.models.user import User

def register_student(db: Session, student_data: StudentCreateDTO, current_user: User):
    new_student = student_service.register_student(db, student_data, current_user)
    return {
        "status": "success",
        "message": "Data siswa berhasil disimpan",
        "data": StudentResponseDTO.model_validate(new_student)
    }

def fetch_students(db: Session, current_user: User, skip: int, limit: int):
    students = student_service.get_all_students(db, current_user, skip, limit)
    return {
        "status": "success",
        "data": [StudentResponseDTO.model_validate(s) for s in students]
    }
    
def delete_student(db: Session, student_id: str, current_user: User):
    student_service.soft_delete_student(db, student_id, current_user)
    return {"status": "success", "message": "Data siswa berhasil dihapus!"}

def update_student(db: Session, student_id: str, student_data: StudentCreateDTO, current_user: User):
    updated = student_service.update_student(db, student_id, student_data, current_user)
    return {
        "status": "success", 
        "message": "Data siswa berhasil diperbarui", 
        "data": StudentResponseDTO.model_validate(updated)
    }

def fetch_student_detail(db: Session, student_id: str, current_user: User):
    student = student_service.get_student_detail(db, student_id, current_user)
    return {"status": "success", "data": StudentResponseDTO.model_validate(student)}