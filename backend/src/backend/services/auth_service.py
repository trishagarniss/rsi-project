from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.backend.repositories import user_repo
from src.backend.dto.user_dto import UserLoginDTO
from src.backend.middlewares.auth import verify_password, create_access_token

def login_user(db: Session, login_data: UserLoginDTO):
    user = user_repo.get_user_by_email(db, email=login_data.email)
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email atau password salah")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akun dinonaktifkan")

    access_token = create_access_token(data={"sub": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "fullname": user.fullname, "role": user.role.value, "tenant_id": user.tenant_id}
    }