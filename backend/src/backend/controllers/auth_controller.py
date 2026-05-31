from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database.engine import get_db
from ..middlewares.auth import (
    verify_password, create_access_token, create_refresh_token,
    verify_refresh_token, extend_refresh_token, revoke_refresh_token,
    get_current_user, get_password_hash, require_role,
)
from ..database.redis import redis_client
from ..models.user import User
from ..dto.user import (
    UserLogin, UserResponse, UserCreate, UserCreateResponse,
    RefreshRequest, LoginResponse, ChangePasswordRequest,
)
from ..services.user_service import create_user
from ..services.audit_service import log_action
from ..repositories.user_repository import find_user_by_email, find_user_by_id

async def login(user_cred: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await find_user_by_email(db, user_cred.email)
    if not user or not verify_password(user_cred.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email atau password salah")

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role.value,
            "tenant_id": str(user.tenant_id) if user.tenant_id else None,
        }
    )
    refresh_token = await create_refresh_token(user.id)

    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            tenant_id=user.tenant_id,
            is_active=user.is_active,
            created_at=user.created_at,
        ),
    )

async def refresh_token(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    user_id = await verify_refresh_token(data.refresh_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Refresh token tidak valid atau expired")

    user = await find_user_by_id(db, int(user_id))
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User tidak ditemukan atau tidak aktif")

    await extend_refresh_token(data.refresh_token)

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "role": user.role.value,
            "tenant_id": str(user.tenant_id) if user.tenant_id else None,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 900,
    }

async def logout(data: RefreshRequest):
    await revoke_refresh_token(data.refresh_token)
    return {"message": "Berhasil logout"}

async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

async def change_password(
    data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(data.old_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Password lama salah")

    current_user.password_hash = get_password_hash(data.new_password)
    await db.commit()
    await log_action(
        db, current_user.tenant_id, current_user.id,
        "update", "user", current_user.id,
        "Password diubah",
    )
    return {"message": "Password berhasil diubah"}

async def create_user_endpoint(
    data: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role(["superadmin"])),
):
    user, password = await create_user(db, data, current_user.id)
    return UserCreateResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        tenant_id=user.tenant_id,
        is_active=user.is_active,
        created_at=user.created_at,
        generated_password=password,
    )
