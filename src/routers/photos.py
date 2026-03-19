# Exposes GET api/photos
# Exposes POST api/photos/upload
# Exposes PATCH api/photos/{photo_id}
# Exposes DELETE api/photos/{photo_id}
# Exposes GET api/photos/{photo_id}/image

from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Response,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.dependencies import get_current_user, require_admin
from src.models.photo import Photo
from src.models.user import User
from src.schemas.photo import PhotoResponse, PhotoUpdateRequest
from src.services.photo_service import (
    create_photo,
    delete_photo,
    get_photo_by_id,
    list_photos,
    update_photo,
)
from src.storage.files import (
    delete_file,
    get_file_path,
    make_stored_filename,
    save_upload_file,
)

router = APIRouter(prefix="/api/photos", tags=["photos"])

get_db_dependency = Annotated[AsyncSession, Depends(get_db)]
get_current_user_dependency = Annotated[User, Depends(get_current_user)]
require_admin_dependency = Annotated[User, Depends(require_admin)]

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
}


def to_photo_response(photo: Photo) -> PhotoResponse:
    return PhotoResponse(
        id=photo.id,
        filename=photo.filename,
        stored_filename=photo.stored_filename,
        mime_type=photo.mime_type,
        file_size=photo.file_size,
        title=photo.title,
        description=photo.description,
        is_active=photo.is_active,
        sort_order=photo.sort_order,
        created_at=photo.created_at,
        updated_at=photo.updated_at,
        image_url=f"/api/photos/{photo.id}/image",
    )


@router.get("", response_model=list[PhotoResponse])
async def get_photos(
    db: get_db_dependency,
    _: get_current_user_dependency,
) -> list[PhotoResponse]:
    photos = await list_photos(db)
    return [to_photo_response(photo) for photo in photos]


@router.post(
    "/upload", response_model=PhotoResponse, status_code=status.HTTP_201_CREATED
)
async def upload_photo(
    db: get_db_dependency,
    _: require_admin_dependency,
    file: UploadFile = File(...),
    title: str | None = Form(None),
    description: str | None = Form(None),
) -> PhotoResponse:
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type",
        )

    contents = await file.read()
    file_size = len(contents)

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty file upload",
        )

    from src.config import settings

    if file_size > settings.max_upload_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large",
        )

    stored_filename = make_stored_filename(file.filename or "upload.bin")

    await file.seek(0)
    await save_upload_file(file, stored_filename)

    photo = await create_photo(
        db,
        filename=file.filename or stored_filename,
        stored_filename=stored_filename,
        mime_type=file.content_type,
        file_size=file_size,
        title=title,
        description=description,
    )

    return to_photo_response(photo)


@router.patch("/{photo_id}", response_model=PhotoResponse)
async def patch_photo(
    photo_id: int,
    payload: PhotoUpdateRequest,
    db: get_db_dependency,
    _: require_admin_dependency,
) -> PhotoResponse:
    photo = await get_photo_by_id(db, photo_id)
    if photo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found",
        )

    updates = payload.model_dump(exclude_unset=True)

    photo = await update_photo(
        db,
        photo,
        title=updates["title"] if "title" in updates else None,
        description=updates["description"] if "description" in updates else None,
        is_active=updates["is_active"] if "is_active" in updates else None,
    )

    return to_photo_response(photo)


@router.delete("/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_photo(
    photo_id: int,
    db: get_db_dependency,
    _: require_admin_dependency,
) -> Response:
    photo = await get_photo_by_id(db, photo_id)
    if photo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found",
        )

    stored_filename = photo.stored_filename
    await delete_photo(db, photo)
    delete_file(stored_filename)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{photo_id}/image")
async def get_photo_image(
    photo_id: int,
    db: get_db_dependency,
    _: get_current_user_dependency,
) -> FileResponse:
    photo = await get_photo_by_id(db, photo_id)
    if photo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Photo not found",
        )

    file_path = get_file_path(photo.stored_filename)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image file not found",
        )

    return FileResponse(path=file_path, media_type=photo.mime_type)
