from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ...core.database import get_db
from ...core.security import verify_password, create_access_token
from ...models.user import User
from ...schemas.user import UserLogin, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(user_cred: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_cred.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(user_cred.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role, "tenant_id": str(user.tenant_id) if user.tenant_id else None})
    return {"access_token": access_token}