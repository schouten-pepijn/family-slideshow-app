from typing import Annotated
from fastapi import Depends, HTTPException, status, Request

from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.user import User
from src.config import settings
from src.services.auth_service import get_user_by_session_id


get_db_dependency = Annotated[AsyncSession, Depends(get_db)]


def get_session_ids_from_request(
    request: Request,
    *,
    allow_query_token: bool = False,
) -> list[str]:
    session_ids: list[str] = []

    authorization = request.headers.get("authorization")
    if authorization:
        scheme, _, token = authorization.partition(" ")
        if scheme.lower() == "bearer" and token.strip():
            session_ids.append(token.strip())

    session_id = request.cookies.get(settings.session_cookie_name)
    if session_id:
        session_ids.append(session_id)

    if allow_query_token:
        access_token = request.query_params.get("access_token")
        if access_token:
            session_ids.append(access_token)

    return session_ids


def get_session_id_from_request(
    request: Request,
    *,
    allow_query_token: bool = False,
) -> str | None:
    session_ids = get_session_ids_from_request(
        request,
        allow_query_token=allow_query_token,
    )

    return session_ids[0] if session_ids else None


async def get_user_from_request(
    request: Request,
    db: AsyncSession,
    *,
    allow_query_token: bool = False,
) -> User:
    session_ids = get_session_ids_from_request(
        request,
        allow_query_token=allow_query_token,
    )
    if not session_ids:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    user = None
    for session_id in session_ids:
        user = await get_user_by_session_id(db, session_id)
        if user is not None:
            break

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return user


async def get_current_user(
    request: Request,
    db: get_db_dependency,
) -> User:
    return await get_user_from_request(request, db)


async def get_current_user_with_query_token(
    request: Request,
    db: get_db_dependency,
) -> User:
    return await get_user_from_request(
        request,
        db,
        allow_query_token=True,
    )


get_current_user_dependency = Annotated[User, Depends(get_current_user)]
get_current_user_with_query_token_dependency = Annotated[
    User,
    Depends(get_current_user_with_query_token),
]


async def require_admin(
    current_user: get_current_user_dependency,
) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user
