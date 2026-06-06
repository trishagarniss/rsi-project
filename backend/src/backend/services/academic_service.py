from sqlalchemy.orm import Session
from fastapi import HTTPException
from src.backend.repositories import academic_repo, student_repo

def add_academic_record(db: Session, data: AcademicCreateDTO, current_user: User):
    # Verifikasi apakah siswa milik tenant ini
    student = student_repo.get_student_by_id_and_tenant(db, data.student_id, current_user.tenant_id)
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan di sekolah Anda.")
    
    return academic_repo.create_academic(db, data.model_dump(), current_user.tenant_id)

# Di dalam src/backend/services/academic_service.py

def get_academic_by_student(db: Session, student_id: str, current_user: User):
    # 1. Validasi dulu apakah siswa tersebut ADA dan milik sekolah ini
    student = student_repo.get_student_by_id_and_tenant(db, student_id, current_user.tenant_id)
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    
    # 2. Jika valid, baru ambil data akademiknya
    return academic_repo.get_by_student(db, student_id, current_user.tenant_id)