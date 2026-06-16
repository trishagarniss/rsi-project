from sqlalchemy.orm import Session
from typing import Optional, List
from src.backend.models.user import User
from src.backend.dto.user_dto import UserCreateDTO, UserUpdateDTO
from src.backend.models.enums import UserRole
from src.backend.middlewares.auth import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

# def get_user_by_email_token(db: Session, user_email: str) -> Optional[Token]:
#     return db.query(Token).filter(Token.email == user_email).first()

def get_all_users(db: Session, skip: int = 0, limit: int = 10000, tenant_id: str = None) -> List[User]:
    query = db.query(User)
    if tenant_id:
        query = query.filter(User.tenant_id == tenant_id)
    return query.order_by(User.last_login_at.desc().nullslast(), User.created_at.desc()).offset(skip).limit(limit).all()

def get_admin_by_tenant(db: Session, tenant_id: str):
    return db.query(User).filter(
        User.tenant_id == tenant_id,
        User.role == UserRole.ADMIN
    ).first()

def get_all_superadmins(db: Session) -> List[User]:
    return db.query(User).filter(User.role == UserRole.SUPERADMIN).all()

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

def soft_delete_user_sp(db: Session, user_id: str, deleted_by: str) -> str:
    """
    Executes the PostgreSQL stored procedure 'sp_delete_account'
    to deactivate a user account and insert an audit log.
    Returns the OUT parameter string: 'SUCCESS', 'USER_NOT_FOUND', 'CANNOT_DELETE_SELF', etc.
    """
    from sqlalchemy import text
    try:
        stmt = text("CALL sp_delete_account(:user_id, :deleted_by, :p_result)")
        result = db.execute(stmt, {"user_id": user_id, "deleted_by": deleted_by, "p_result": None})
        row = None
        try:
            row = result.fetchone()
        except Exception:
            pass
        db.commit()
        if row:
            return row[0]
        return "SUCCESS"
    except Exception as e:
        db.rollback()
        print(f"Error calling sp_delete_account: {e}")
        return "DELETE_FAILED"

def CheckOldPassword(db: Session, user_id: str, old_pw: str) -> bool:
    db_user = get_user_by_id(db, user_id)
    if not db_user:
        return False
    return verify_password(old_pw, db_user.password_hash)

# def CheckToken(db: Session, user_email: str, token : str) -> bool:
#     db_user = get_user_by_email_token(db, user_email)
#     token_hash = get_password_hash(token)
#     if db_user.token == token_hash:
#         return True
#     return False

def ChangePassword(db: Session, user_id: str, password: str) -> Optional[User]:
    db_user = get_user_by_id(db, user_id)
    if db_user:
        pw_hash = get_password_hash(password)
        setattr(db_user, "password_hash", pw_hash)
        db.commit()
        db.refresh(db_user)
    return db_user
