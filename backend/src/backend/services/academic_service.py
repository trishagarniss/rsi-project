from sqlalchemy.orm import Session
from fastapi import HTTPException
from src.backend.repositories import academic_repo, student_repo
from src.backend.dto.academic_dto import AcademicCreateDTO, AcademicUpdateDTO
from src.backend.models.user import User
from src.backend.services.risk_prediction_service import auto_predict_on_data_change

def add_academic_record(db: Session, data: AcademicCreateDTO, current_user: User):
    # 1. Verifikasi apakah siswa milik tenant ini
    student = student_repo.get_student_by_id_and_tenant(db, data.student_id, current_user.tenant_id)
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan di sekolah Anda.")
    
    # 2. Cek Duplikasi Semester
    duplicate = academic_repo.get_duplicate_check(
        db, data.student_id, data.semester, data.academic_year, current_user.tenant_id
    )
    if duplicate:
        raise HTTPException(status_code=400, detail=f"Siswa sudah memiliki data akademik untuk semester {data.semester} tahun {data.academic_year}.")
    
    result = academic_repo.create_academic(db, data.model_dump(), current_user.tenant_id)
    
    auto_predict_on_data_change(db, data.student_id, current_user)
    
    return result

def get_academic_by_student(db: Session, student_id: str, current_user: User):
    student = student_repo.get_student_by_id_and_tenant(db, student_id, current_user.tenant_id)
    if not student:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan.")
    
    return academic_repo.get_by_student(db, student_id, current_user.tenant_id)

def modify_academic_record(db: Session, academic_id: str, data: AcademicUpdateDTO, current_user: User):
    # 1. Pastikan data ada dan milik tenant ini
    record = academic_repo.get_academic_by_id(db, academic_id, current_user.tenant_id)
    if not record:
        raise HTTPException(status_code=404, detail="Data akademik tidak ditemukan.")
    
    # 2. Cek Duplikasi JIKA user mencoba mengubah semester / tahun ajaran
    if data.semester is not None or data.academic_year is not None:
        new_sem = data.semester if data.semester is not None else record.semester
        new_year = data.academic_year if data.academic_year is not None else record.academic_year
        
        duplicate = academic_repo.get_duplicate_check(
            db, record.student_id, new_sem, new_year, current_user.tenant_id
        )
        # Jika ketemu duplikat DAN itu bukan record yang sedang kita edit ini, maka tolak!
        if duplicate and duplicate.id != academic_id:
            raise HTTPException(status_code=400, detail=f"Siswa sudah memiliki data akademik untuk semester {new_sem} tahun {new_year}.")
            
    # 3. Eksekusi Update
    update_data = data.model_dump(exclude_unset=True)
    result = academic_repo.update_academic(db, record, update_data)
    
    auto_predict_on_data_change(db, record.student_id, current_user)
    
    return result

def delete_academic_record(db: Session, academic_id: str, current_user: User):
    # 1. Pastikan data ada dan milik tenant ini
    record = academic_repo.get_academic_by_id(db, academic_id, current_user.tenant_id)
    if not record:
        raise HTTPException(status_code=404, detail="Data akademik tidak ditemukan.")
    
    # 2. Panggil fungsi delete dari Repo (Clean Architecture)
    academic_repo.delete_academic(db, record)
    return True