from pydantic import BaseModel, EmailStr
from typing import Optional

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    tenant_id: Optional[int] = None
    is_active: bool

class Token(BaseModel):
    access_token: str
    token_type: str