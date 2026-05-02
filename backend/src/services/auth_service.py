from datetime import timedelta, datetime, timezone
import secrets

from argon2 import PasswordHasher
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from src.models import User, Session
from src.config import settings


ph = PasswordHasher()


def hash_password(password: str) -> str:
    return ph.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return ph.verify(hashed_password, password)
    except Exception:
        return False


def generate_session_id() -> str:
    return secrets.token_hex(32)


def _as_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


async def create_session(db: AsyncSession, user: User) -> Session:
    session = Session(
        id=generate_session_id(),
        user_id=user.id,
        expires_at=datetime.now(timezone.utc)
        + timedelta(seconds=settings.session_max_age),
    )

    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


async def get_session(db: AsyncSession, session_id: str) -> Session | None:
    result = await db.execute(select(Session).where(Session.id == session_id))
    return result.scalar_one_or_none()


async def get_user_by_username(db: AsyncSession, username: str) -> User | None:
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


async def get_user_by_session_id(db: AsyncSession, session_id: str) -> User | None:
    session = await get_session(db, session_id)
    if session is None:
        return None

    now = datetime.now(timezone.utc)
    if _as_utc(session.expires_at) <= now:
        await delete_session(db, session.id)
        return None

    result = await db.execute(select(User).where(User.id == session.user_id))
    return result.scalar_one_or_none()


async def delete_session(db: AsyncSession, session_id: str) -> None:
    await db.execute(delete(Session).where(Session.id == session_id))
    await db.commit()
