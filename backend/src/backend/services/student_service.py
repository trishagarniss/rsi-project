from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from fastapi import HTTPException
from src.backend.dto.student_dto import StudentCreateDTO, StudentUpdateDTO
from src.backend.repositories import student_repo
from src.backend.models.user import User
from src.backend.models.enums import UserRole

def register_student(db: Session, student_data: StudentCreateDTO, current_user: User):
    existing = student_repo.get_student_by_nis(db, student_data.nis, current_user.tenant_id)
    if existing:
        raise HTTPException(status_code=400, detail="NIS sudah terdaftar di sekolah ini.")
    
    return student_repo.create_student(db, student_data, current_user.tenant_id)

def get_all_students(db: Session, current_user: User, skip: int, limit: int):
    if current_user.role == UserRole.SUPERADMIN:
        return student_repo.get_all_students(db, skip, limit)
    return student_repo.get_students_by_tenant(db, current_user.tenant_id, skip, limit)

def count_students(db: Session, current_user: User) -> dict:
    if current_user.role == UserRole.SUPERADMIN:
        return {
            "total_active": student_repo.count_all_students(db),
            "total_all": student_repo.count_total_students(db)
        }
    return {
        "total_active": student_repo.count_students_by_tenant(db, current_user.tenant_id),
        "total_all": student_repo.count_total_students_by_tenant(db, current_user.tenant_id)
    }

def get_student_detail(db: Session, student_id: str, current_user: User):
    student = student_repo.get_student_by_id_and_tenant(db, student_id, current_user.tenant_id)
    if not student:
        raise HTTPException(status_code=404, detail="Data siswa tidak ditemukan.")
    return student

def update_student(db: Session, student_id: str, student_data: StudentUpdateDTO, current_user: User):
    db_student = get_student_detail(db, student_id, current_user)
    
    update_dict = student_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(db_student, key, value)
        
    db.commit()
    db.refresh(db_student)
    return db_student

def soft_delete_student(db: Session, student_id: str, current_user: User):
    student = get_student_detail(db, student_id, current_user)
    student.is_active = False
    student.deleted_at = func.now() 
    db.commit()
    return student