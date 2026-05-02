from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import settings
from src.models import User
from src.services.auth_service import hash_password


async def seed_users(db: AsyncSession) -> None:
    existing_users = await db.scalar(select(User.id).limit(1))

    if existing_users is not None:
        return

    db.add_all(
        [
            User(
                username=settings.admin_username,
                password_hash=hash_password(settings.admin_password),
                role="admin",
                is_active=True,
            ),
            User(
                username=settings.viewer_username,
                password_hash=hash_password(settings.viewer_password),
                role="viewer",
                is_active=True,
            ),
        ]
    )

    await db.commit()
