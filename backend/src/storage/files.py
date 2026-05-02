from pathlib import Path
import shutil
import uuid

import boto3
from anyio.to_thread import run_sync
from botocore.client import Config
from botocore.exceptions import ClientError
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


def _require_s3_setting(value: str | None, name: str) -> str:
    if value is None:
        raise RuntimeError(f"{name} must be set when STORAGE_BACKEND=s3")
    return value


def _get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=_require_s3_setting(
            settings.s3_endpoint_url,
            "S3_ENDPOINT_URL",
        ),
        aws_access_key_id=_require_s3_setting(
            settings.s3_access_key_id,
            "S3_ACCESS_KEY_ID",
        ),
        aws_secret_access_key=_require_s3_setting(
            settings.s3_secret_access_key,
            "S3_SECRET_ACCESS_KEY",
        ),
        region_name=settings.s3_region,
        config=Config(signature_version="s3v4"),
    )


def _get_s3_bucket() -> str:
    return _require_s3_setting(settings.s3_bucket, "S3_BUCKET")


def _is_s3_storage() -> bool:
    return settings.storage_backend == "s3"


async def save_upload_file(
    upload: UploadFile,
    stored_filename: str,
    content_type: str,
) -> Path | None:
    if _is_s3_storage():
        contents = await upload.read()

        def upload_to_s3() -> None:
            _get_s3_client().put_object(
                Bucket=_get_s3_bucket(),
                Key=stored_filename,
                Body=contents,
                ContentType=content_type,
            )

        await run_sync(upload_to_s3)
        await upload.close()
        return None

    file_path = get_file_path(stored_filename)

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(upload.file, buffer)

    await upload.close()
    return file_path


async def delete_file(stored_filename: str) -> None:
    if _is_s3_storage():
        def delete_from_s3() -> None:
            _get_s3_client().delete_object(
                Bucket=_get_s3_bucket(),
                Key=stored_filename,
            )

        await run_sync(delete_from_s3)
        return

    file_path = get_file_path(stored_filename)
    if file_path.exists():
        file_path.unlink()


async def file_exists(stored_filename: str) -> bool:
    if _is_s3_storage():
        def head_s3_object() -> bool:
            try:
                _get_s3_client().head_object(
                    Bucket=_get_s3_bucket(),
                    Key=stored_filename,
                )
                return True
            except ClientError as exc:
                error_code = exc.response.get("Error", {}).get("Code")
                if error_code in {"404", "NoSuchKey", "NotFound"}:
                    return False
                raise

        return await run_sync(head_s3_object)

    return get_file_path(stored_filename).exists()


def create_read_url(stored_filename: str) -> str:
    if not _is_s3_storage():
        raise RuntimeError("create_read_url is only available for S3 storage")

    return _get_s3_client().generate_presigned_url(
        "get_object",
        Params={
            "Bucket": _get_s3_bucket(),
            "Key": stored_filename,
        },
        ExpiresIn=settings.s3_presigned_url_ttl_seconds,
    )


def is_local_storage() -> bool:
    return not _is_s3_storage()
