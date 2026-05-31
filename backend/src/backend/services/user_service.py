import secrets
import string
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.user import User
from ..dto.user import UserCreate
from ..middlewares.auth import get_password_hash
from ..services.audit_service import log_action
from ..repositories.user_repository import create_user as repo_create_user


def generate_random_password(length: int = 12) -> str:
    uppercase = string.ascii_uppercase
    lowercase = string.ascii_lowercase
    digits = string.digits
    symbols = "!@#$%^&*(),.?\":{}|<>_-"

    all_chars = uppercase + lowercase + digits + symbols

    password = [
        secrets.choice(uppercase),
        secrets.choice(lowercase),
        secrets.choice(digits),
        secrets.choice(symbols),
    ]

    password += [secrets.choice(all_chars) for _ in range(length - 4)]
    secrets.SystemRandom().shuffle(password)
    return "".join(password)


async def create_user(
    db: AsyncSession,
    data: UserCreate,
    actor_id: int,
) -> tuple[User, str]:
    password = generate_random_password()
    hashed = get_password_hash(password)

    user = await repo_create_user(db, {
        "email": data.email,
        "password_hash": hashed,
        "full_name": data.full_name,
        "role": data.role,
        "tenant_id": data.tenant_id,
    })
    await db.commit()

    audit_tenant = data.tenant_id
    await log_action(
        db, audit_tenant, actor_id,
        "create", "user", user.id,
        f"Email: {data.email}, Role: {data.role.value}, Nama: {data.full_name}",
    )

    return user, password
