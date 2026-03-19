from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession


from src.models.collection import Collection
from src.models.photo_collection_junction import PhotoCollectionJunction
from src.models.user import User


async def list_readable_collections(
    db: AsyncSession,
    user: User,
) -> list[Collection]:
    query = select(Collection)

    # Viewer: only public collections
    if user.role == "viewer":
        query = query.where(Collection.is_public.is_(True))

    # Admin: all collections
    query = query.order_by(Collection.sort_order.asc())

    result = await db.execute(query)
    return list(result.scalars().all())


async def get_readable_collection_by_id(
    db: AsyncSession,
    collection_id: int,
    user: User,
) -> Collection | None:
    query = select(Collection).where(Collection.id == collection_id)

    # Viewer: only public collections
    if user.role == "viewer":
        query = query.where(Collection.is_public.is_(True))

    result = await db.execute(query)
    return result.scalar_one_or_none()


async def create_collection(
    db: AsyncSession,
    *,
    name: str,
    description: str | None = None,
    is_public: bool = False,
) -> Collection:
    result = await db.execute(
        select(func.max(Collection.sort_order)),
    )
    max_sort_order = result.scalar_one()
    sort_order = 0 if max_sort_order is None else max_sort_order + 1

    collection = Collection(
        name=name,
        description=description,
        is_public=is_public,
        sort_order=sort_order,
    )
    db.add(collection)
    await db.commit()
    await db.refresh(collection)
    return collection


async def resequence_sort_order(db: AsyncSession) -> None:
    result = await db.execute(
        select(Collection).order_by(Collection.sort_order.asc(), Collection.id.asc())
    )
    collections = list(result.scalars().all())

    for index, collection in enumerate(collections):
        collection.sort_order = index

    await db.commit()


async def update_collection(
    db: AsyncSession,
    collection: Collection,
    *,
    name: str | None = None,
    description: str | None = None,
    is_public: bool | None = None,
    sort_order: int | None = None,
) -> Collection:
    if name is not None:
        collection.name = name

    if description is not None:
        collection.description = description

    if is_public is not None:
        collection.is_public = is_public

    if sort_order is not None:
        collection.sort_order = sort_order

    await db.commit()
    await db.refresh(collection)

    if sort_order is not None:
        await resequence_sort_order(db)
        await db.refresh(collection)

    return collection


async def delete_collection(
    db: AsyncSession,
    collection: Collection,
) -> None:
    await db.delete(collection)
    await db.commit()
    await resequence_sort_order(db)


async def list_collection_photo_ids(
    db: AsyncSession,
    photo_id: int,
) -> list[int]:
    result = await db.execute(
        select(PhotoCollectionJunction.collection_id)
        .where(PhotoCollectionJunction.photo_id == photo_id)
        .order_by(PhotoCollectionJunction.collection_id.asc())
    )
    return list(result.scalars().all())


async def replace_photo_memberships(
    db: AsyncSession,
    *,
    photo_id: int,
    collection_ids: list[int],
) -> None:
    target_ids = set(collection_ids)

    if target_ids:
        result = await db.execute(
            select(Collection.id).where(Collection.id.in_(target_ids))
        )

        existing_ids = set(result.scalars().all())
        missing_ids = target_ids - existing_ids
        if missing_ids:
            raise ValueError(
                f"Collections with IDs {sorted(missing_ids)} do not exist."
            )

    result = await db.execute(
        select(PhotoCollectionJunction.collection_id).where(
            PhotoCollectionJunction.photo_id == photo_id
        )
    )
    current_ids = set(result.scalars().all())

    to_add = target_ids - current_ids
    to_remove = current_ids - target_ids

    if to_remove:
        await db.execute(
            delete(PhotoCollectionJunction).where(
                PhotoCollectionJunction.photo_id == photo_id,
                PhotoCollectionJunction.collection_id.in_(to_remove),
            )
        )

    for collection_id in to_add:
        junction = PhotoCollectionJunction(
            photo_id=photo_id,
            collection_id=collection_id,
            sort_order=0,
        )
        db.add(junction)

    await db.commit()
