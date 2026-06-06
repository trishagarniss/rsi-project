from sqlalchemy.orm import Session
from src.backend.models.student import Student
from src.backend.dto.student_dto import StudentCreateDTO

def create_student(db: Session, student_data: StudentCreateDTO, tenant_id: str) -> Student:
    new_student = Student(
        **student_data.model_dump(),
        tenant_id=tenant_id
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student

def get_students_by_tenant(db: Session, tenant_id: str, skip: int, limit: int):
    return db.query(Student).filter(
        Student.tenant_id == tenant_id, 
        Student.is_active == True
    ).offset(skip).limit(limit).all()
    
def get_student_by_id_and_tenant(db: Session, student_id: str, tenant_id: str):
    return db.query(Student).filter(
        Student.id == student_id, 
        Student.tenant_id == tenant_id
    ).first()
    
def get_student_by_nis(db: Session, nis: str, tenant_id: str):
    return db.query(Student).filter(
        Student.nis == nis, 
        Student.tenant_id == tenant_id
    ).first()