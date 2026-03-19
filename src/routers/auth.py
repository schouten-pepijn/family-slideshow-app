# Exposes POST /api/auth/login
# Exposes POST /api/auth/logout
# Exposes GET /api/auth/me

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.dependencies import get_current_user
from src.models import User
from src.schemas.auth import AuthUserResponse, LoginRequest
from src.services.auth_service import (
    create_session,
    delete_session,
    get_user_by_username,
    verify_password,
)
from src.config import settings


get_db_dependency = Annotated[AsyncSession, Depends(get_db)]
get_current_user_dependency = Annotated[User, Depends(get_current_user)]

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=AuthUserResponse)
async def login(
    payload: LoginRequest,
    response: Response,
    db: get_db_dependency,
) -> AuthUserResponse:
    user = await get_user_by_username(db, payload.username)

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    session = await create_session(db, user)

    response.set_cookie(
        key=settings.session_cookie_name,
        value=session.id,
        max_age=settings.session_max_age,
        httponly=True,
        secure=settings.is_production,
        samesite="lax",
        path="/",
    )

    return AuthUserResponse.model_validate(user)


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    request: Request,
    response: Response,
    db: get_db_dependency,
) -> dict:
    session_id = request.cookies.get(settings.session_cookie_name)

    if session_id:
        await delete_session(db, session_id)

    response.delete_cookie(
        key=settings.session_cookie_name,
        path="/",
        httponly=True,
        secure=settings.is_production,
        samesite="lax",
    )

    return {}


@router.get("/me", response_model=AuthUserResponse)
async def me(current_user: get_current_user_dependency) -> AuthUserResponse:
    return AuthUserResponse.model_validate(current_user)
