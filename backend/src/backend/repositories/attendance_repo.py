from sqlalchemy.orm import Session
from typing import List, Optional
from src.backend.models.attendance import Attendance

def create_attendance(db: Session, data: dict, tenant_id: str) -> Attendance:
    new_record = Attendance(**data, tenant_id=tenant_id)
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

def get_by_student(db: Session, student_id: str, tenant_id: str) -> List[Attendance]:
    return db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.tenant_id == tenant_id
    ).order_by(Attendance.semester.asc()).all()

def get_by_student_and_semester(db: Session, student_id: str, semester: int, academic_year: str, tenant_id: str) -> Optional[Attendance]:
    return db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.semester == semester,
        Attendance.academic_year == academic_year,
        Attendance.tenant_id == tenant_id
    ).first()

def get_by_id(db: Session, attendance_id: str, tenant_id: str) -> Optional[Attendance]:
    return db.query(Attendance).filter(
        Attendance.id == attendance_id,
        Attendance.tenant_id == tenant_id
    ).first()

def update_attendance(db: Session, db_obj: Attendance, update_data: dict) -> Attendance:
    for key, value in update_data.items():
        setattr(db_obj, key, value)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_attendance(db: Session, db_obj: Attendance) -> bool:
    db.delete(db_obj)
    db.commit()
    return True