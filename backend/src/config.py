from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    database_url: str = (
        "postgresql+asyncpg://slideshow:slideshow@localhost:5432/slideshow"
    )
    secret_key: str
    session_cookie_name: str = "session"
    session_cookie_samesite: Literal["lax", "strict", "none"] = "lax"
    session_max_age: int = 86400 * 30
    uploads_dir: str = "uploads"
    max_upload_size_bytes: int = 20 * 1024 * 1024
    storage_backend: Literal["local", "s3"] = "local"
    s3_endpoint_url: str | None = None
    s3_bucket: str | None = None
    s3_access_key_id: str | None = None
    s3_secret_access_key: str | None = None
    s3_region: str = "auto"
    s3_presigned_url_ttl_seconds: int = 300
    allowed_origins: list[str] = ["http://localhost:5173"]
    environment: str = "development"

    # user seeds
    admin_username: str = "admin"
    admin_password: str
    viewer_username: str = "viewer"
    viewer_password: str

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


settings = Settings()  # type: ignore[call-arg]
