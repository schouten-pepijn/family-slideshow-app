# Photo Slideshow App

Monorepo for the photo slideshow backend and frontend.

## Layout

- `backend/`: FastAPI backend, SQLAlchemy models, Alembic migrations, upload storage.
- `frontend/`: React, Vite, TypeScript frontend.
- `notes/`: project notes and migration documentation.

## Prerequisites

- Python 3.13
- `uv`
- Node.js 20 or newer
- npm
- Task

## Backend

```powershell
cd C:\Users\71861\Own\Projects\photo_slideshow\slideshow_app
Copy-Item backend\.env.template backend\.env
task backend:install
task backend:migrate
task backend:dev
```

Set `SECRET_KEY`, `ADMIN_PASSWORD`, and `VIEWER_PASSWORD` in `backend/.env` before using the app beyond local smoke testing.

The backend runs on `http://localhost:8000` by default. Health check:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

## Frontend

```powershell
cd C:\Users\71861\Own\Projects\photo_slideshow\slideshow_app
task frontend:install
task frontend:dev
```

The frontend runs on `http://localhost:5173`. During local development, Vite proxies `/api` requests to `http://127.0.0.1:8000`. Override this with `VITE_API_PROXY_TARGET` in `frontend/.env` if needed.

## Validation

```powershell
task frontend:typecheck
task frontend:build
task backend:migrate
```
