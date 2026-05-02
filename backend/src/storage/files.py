from pathlib import Path
import shutil
import uuid

from fastapi import UploadFile

from src.config import settings

_ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def get_uploads_dir() -> Path:
    uploads_dir = Path(settings.uploads_dir)
    uploads_dir.mkdir(parents=True, exist_ok=True)
    return uploads_dir


def make_stored_filename(original_filename: str) -> str:
    ext = Path(original_filename).suffix.lower()
    safe_ext = ext if ext in _ALLOWED_EXTENSIONS else ".bin"
    return f"{uuid.uuid4().hex}{safe_ext}"


def get_file_path(stored_filename: str) -> Path:
    return get_uploads_dir() / stored_filename


async def save_upload_file(upload: UploadFile, stored_filename: str) -> Path:
    file_path = get_file_path(stored_filename)

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(upload.file, buffer)

    await upload.close()
    return file_path


def delete_file(stored_filename: str) -> None:
    file_path = get_file_path(stored_filename)
    if file_path.exists():
        file_path.unlink()
