import base64
from datetime import datetime, timedelta, timezone
import hmac
from hashlib import sha256

from src.config import settings


def _base64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("ascii").rstrip("=")


def _sign(payload: str) -> str:
    return _base64url_encode(
        hmac.new(
            settings.secret_key.encode("utf-8"),
            payload.encode("utf-8"),
            sha256,
        ).digest()
    )


def create_image_token(photo_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        seconds=settings.image_url_token_ttl_seconds,
    )
    expires_at_timestamp = int(expires_at.timestamp())
    payload = f"{photo_id}.{expires_at_timestamp}"
    signature = _sign(payload)

    return f"{payload}.{signature}"


def is_valid_image_token(token: str, photo_id: int) -> bool:
    try:
        token_photo_id, expires_at_timestamp, signature = token.split(".", 2)
        parsed_photo_id = int(token_photo_id)
        expires_at = datetime.fromtimestamp(
            int(expires_at_timestamp),
            timezone.utc,
        )
    except (OSError, OverflowError, ValueError):
        return False

    if parsed_photo_id != photo_id:
        return False

    if expires_at <= datetime.now(timezone.utc):
        return False

    expected_signature = _sign(f"{parsed_photo_id}.{expires_at_timestamp}")
    return hmac.compare_digest(signature, expected_signature)
