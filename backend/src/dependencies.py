from typing import Annotated
from fastapi import Depends, HTTPException, status, Request

from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.user import User
from src.config import settings
from src.services.auth_service import get_user_by_session_id


get_db_dependency = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    request: Request,
    db: get_db_dependency,
) -> User:
    session_id = request.cookies.get(settings.session_cookie_name)
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    user = await get_user_by_session_id(db, session_id)
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


get_current_user_dependency = Annotated[User, Depends(get_current_user)]


async def require_admin(
    current_user: get_current_user_dependency,
) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required",
        )
    return current_user
