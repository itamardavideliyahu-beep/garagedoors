"""Authentication endpoints: register, login, refresh, me."""

from fastapi import APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from app.core.config import settings
from app.core.deps import CurrentUser, DbSession
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User, UserRole
from app.schemas.auth import (
    RefreshRequest,
    TokenPair,
    UserCreate,
    UserOut,
)
from typing import Annotated

from fastapi import Depends

router = APIRouter()


async def _issue_tokens(user: User) -> TokenPair:
    access = create_access_token(user.id, user.role.value)
    refresh = create_refresh_token(user.id)
    return TokenPair(
        access_token=access,
        refresh_token=refresh,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.post("/register", response_model=TokenPair, status_code=status.HTTP_201_CREATED)
async def register(payload: UserCreate, db: DbSession) -> TokenPair:
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        phone=payload.phone,
        locale=payload.locale,
        role=UserRole.CUSTOMER,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return await _issue_tokens(user)


@router.post("/login", response_model=TokenPair)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: DbSession,
) -> TokenPair:
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User disabled")
    return await _issue_tokens(user)


@router.post("/refresh", response_model=TokenPair)
async def refresh_tokens(payload: RefreshRequest, db: DbSession) -> TokenPair:
    try:
        data = decode_token(payload.refresh_token)
        if data.get("type") != "refresh":
            raise ValueError("Wrong token type")
        user_id = int(data["sub"])
    except (ValueError, KeyError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        ) from exc

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    return await _issue_tokens(user)


@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser) -> User:
    return user
