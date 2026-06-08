from sqlalchemy.orm import Session
from typing import Optional, List
from src.backend.models.user import User
from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO
from src.backend.models.enums import UserRole

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_all_users(db: Session, skip: int = 0, limit: int = 100, tenant_id: str = None) -> List[User]:
    query = db.query(User)
    if tenant_id:
        query = query.filter(User.tenant_id == tenant_id)
    return query.offset(skip).limit(limit).all()

def get_admin_by_tenant(db: Session, tenant_id: str):
    return db.query(User).filter(
        User.tenant_id == tenant_id,
        User.role == UserRole.ADMIN
    ).first()

def create_user(
    db: Session, 
    fullname: str, 
    email: str, 
    hashed_password: str, 
    tenant_id: str, 
    role: UserRole
) -> User:
    new_user = User(
        tenant_id=tenant_id,
        fullname=fullname,
        email=email,
        password_hash=hashed_password, 
        role=role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def update_user(db: Session, user_id: str, update_data: UserUpdateDTO) -> Optional[User]:
    db_user = get_user_by_id(db, user_id)
    if db_user:
        data_dict = update_data.model_dump(exclude_unset=True)
        for key, value in data_dict.items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: str) -> bool:
    db_user = get_user_by_id(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False