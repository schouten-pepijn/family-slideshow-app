from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CollectionCreateRequest(BaseModel):
    name: str
    description: str | None = None
    is_public: bool = False
    sort_order: int = 0


class CollectionUpdateRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    is_public: bool | None = None
    sort_order: int | None = None


class CollectionResponse(BaseModel):
    id: int
    name: str
    description: str | None
    is_public: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
    photo_count: int | None = None

    model_config = ConfigDict(from_attributes=True)


class CollectionDetailResponse(CollectionResponse):
    # from Photo
    photo_ids: list[int] = Field(default_factory=list)
