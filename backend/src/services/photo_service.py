from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.photo import Photo
from src.services.collection_service import replace_photo_memberships


async def list_photos(db: AsyncSession) -> list[Photo]:
    result = await db.execute(select(Photo).order_by(Photo.sort_order.asc()))
    return list(result.scalars().all())


async def get_photo_by_id(
    db: AsyncSession,
    photo_id: int,
) -> Photo | None:
    result = await db.execute(select(Photo).where(Photo.id == photo_id))
    return result.scalar_one_or_none()


async def create_photo(
    db: AsyncSession,
    *,
    filename: str,
    stored_filename: str,
    mime_type: str,
    file_size: int,
    title: str | None = None,
    description: str | None = None,
    collection_ids: list[int] | None = None,
) -> Photo:
    result = await db.execute(select(func.max(Photo.sort_order)))
    max_sort_order = result.scalar_one()
    sort_order = 0 if max_sort_order is None else max_sort_order + 1

    photo = Photo(
        filename=filename,
        stored_filename=stored_filename,
        mime_type=mime_type,
        file_size=file_size,
        title=title,
        description=description,
        is_active=True,
        sort_order=sort_order,
    )
    db.add(photo)
    await db.commit()
    await db.refresh(photo)

    # If memberships were provided, replace to exactly match the payload.
    if collection_ids is not None:
        await replace_photo_memberships(
            db,
            photo_id=photo.id,
            collection_ids=collection_ids,
        )
        await db.refresh(photo)

    return photo


async def update_photo(
    db: AsyncSession,
    photo: Photo,
    *,
    title: str | None = None,
    description: str | None = None,
    is_active: bool | None = None,
    collection_ids: list[int] | None = None,
) -> Photo:
    if title is not None:
        photo.title = title

    if description is not None:
        photo.description = description

    if is_active is not None:
        photo.is_active = is_active

    await db.commit()
    await db.refresh(photo)

    # None means no membership change, [] means clear all memberships.
    if collection_ids is not None:
        await replace_photo_memberships(
            db,
            photo_id=photo.id,
            collection_ids=collection_ids,
        )
        await db.refresh(photo)

    return photo


async def resequence_sort_order(db: AsyncSession) -> None:
    result = await db.execute(
        select(Photo).order_by(Photo.sort_order.asc(), Photo.id.asc())
    )
    photos = list(result.scalars().all())

    for index, photo in enumerate(photos):
        photo.sort_order = index

    await db.commit()


async def delete_photo(db: AsyncSession, photo: Photo) -> None:
    await db.delete(photo)
    await db.commit()
    await resequence_sort_order(db)
