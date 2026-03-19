from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PhotoResponse(BaseModel):
    id: int
    filename: str
    stored_filename: str
    mime_type: str
    file_size: int
    title: str | None
    description: str | None
    is_active: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
    image_url: str

    # from Collection
    collection_ids: list[int] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class PhotoUpdateRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    is_active: bool | None = None
