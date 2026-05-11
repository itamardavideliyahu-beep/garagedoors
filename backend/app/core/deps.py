"""FastAPI dependencies for authentication and authorization."""

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.db import get_db
from app.core.security import decode_token
from app.models.user import User, UserRole
from sqlalchemy import select

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login",
    auto_error=False,
)

DbSession = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    db: DbSession,
    token: Annotated[str | None, Depends(oauth2_scheme)] = None,
) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise ValueError("Wrong token type")
        user_id = int(payload["sub"])
    except (ValueError, KeyError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_role(*roles: UserRole):
    """Dependency factory that enforces role-based access."""

    async def _checker(user: CurrentUser) -> User:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires role(s): {', '.join(r.value for r in roles)}",
            )
        return user

    return _checker


require_admin = require_role(UserRole.ADMIN)
require_technician = require_role(UserRole.TECHNICIAN, UserRole.ADMIN)
require_dispatcher = require_role(UserRole.DISPATCHER, UserRole.ADMIN)
