# Exposes GET /api/collections (viewer sees only public, admin sees all)
# Exposes GET /api/collections/{collection_id}
# Exposes POST /api/collections (admin only)
# Exposes PATCH /api/collections/{collection_id} (admin only)
# Exposes DELETE /api/collections/{collection_id} (admin only)


from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.dependencies import get_current_user, require_admin
from src.models.user import User
from src.models.collection import Collection
from src.schemas.collection import (
    CollectionCreateRequest,
    CollectionDetailResponse,
    CollectionResponse,
    CollectionUpdateRequest,
)
from src.services.collection_service import (
    create_collection,
    delete_collection,
    list_photo_ids_for_collection,
    list_readable_collections,
    get_readable_collection_by_id,
    update_collection,
)


router = APIRouter(prefix="/api/collections", tags=["collections"])

get_db_dependency = Annotated[AsyncSession, Depends(get_db)]
get_current_user_dependency = Annotated[User, Depends(get_current_user)]
require_admin_dependency = Annotated[User, Depends(require_admin)]


async def to_collection_response(
    db: AsyncSession, collection: Collection
) -> CollectionResponse:
    photo_ids = await list_photo_ids_for_collection(db, collection.id)

    return CollectionResponse(
        id=collection.id,
        name=collection.name,
        description=collection.description,
        is_public=collection.is_public,
        sort_order=collection.sort_order,
        created_at=collection.created_at,
        updated_at=collection.updated_at,
        photo_count=len(photo_ids),
    )


async def to_collection_detail_response(
    db: AsyncSession, collection: Collection
) -> CollectionDetailResponse:
    photo_ids = await list_photo_ids_for_collection(db, collection.id)

    return CollectionDetailResponse(
        id=collection.id,
        name=collection.name,
        description=collection.description,
        is_public=collection.is_public,
        sort_order=collection.sort_order,
        created_at=collection.created_at,
        updated_at=collection.updated_at,
        photo_ids=photo_ids,
    )


@router.get("", response_model=list[CollectionResponse])
async def get_collections(
    db: get_db_dependency,
    current_user: get_current_user_dependency,
) -> list[CollectionResponse]:
    collections = await list_readable_collections(db, current_user)
    return [await to_collection_response(db, collection) for collection in collections]


@router.get("/{collection_id}", response_model=CollectionDetailResponse)
async def get_collection(
    collection_id: int,
    db: get_db_dependency,
    current_user: get_current_user_dependency,
) -> CollectionDetailResponse:
    collection = await get_readable_collection_by_id(db, collection_id, current_user)

    if collection is None:
        raise HTTPException(
            status_code=404,
            detail="Collection not found",
        )

    return await to_collection_detail_response(db, collection)


@router.post("", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED)
async def post_collection(
    payload: CollectionCreateRequest,
    db: get_db_dependency,
    _: require_admin_dependency,
) -> CollectionResponse:
    collection = await create_collection(
        db,
        name=payload.name,
        description=payload.description,
        is_public=payload.is_public,
    )
    return await to_collection_response(db, collection)


@router.patch("/{collection_id}", response_model=CollectionResponse)
async def patch_collection(
    collection_id: int,
    payload: CollectionUpdateRequest,
    db: get_db_dependency,
    admin_user: require_admin_dependency,
) -> CollectionResponse:
    collection = await get_readable_collection_by_id(db, collection_id, admin_user)

    if collection is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found",
        )

    updates = payload.model_dump(exclude_unset=True)

    updated_collection = await update_collection(
        db,
        collection,
        name=updates.get("name"),
        description=updates.get("description"),
        is_public=updates.get("is_public"),
        sort_order=updates.get("sort_order"),
    )

    return await to_collection_response(db, updated_collection)


@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_collection_endpoint(
    collection_id: int,
    db: get_db_dependency,
    admin_user: require_admin_dependency,
) -> Response:
    collection = await get_readable_collection_by_id(db, collection_id, admin_user)

    if collection is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection not found",
        )

    await delete_collection(db, collection)

    return Response(status_code=status.HTTP_204_NO_CONTENT)
