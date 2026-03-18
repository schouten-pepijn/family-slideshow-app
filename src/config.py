from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    database_url: str = "sqlite+aiosqlite:///./slideshow.db"
    secret_key: str
    session_cookie_name: str = "session"
    session_max_age: int = 86400 * 30
    uploads_dir: str = "uploads"
    max_upload_size_bytes: int = 20 * 1024 * 1024
    allowed_origins: list[str] = ["http://localhost:5173"]
    environment: str = "development"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


settings = Settings()  # type: ignore[call-arg]
