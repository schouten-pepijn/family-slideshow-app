from src.routers.auth import router as auth_router
from src.routers.photos import router as photos_router
from src.routers.collections import router as collections_router

__all__ = [
    "auth_router",
    "photos_router",
    "collections_router",
]
