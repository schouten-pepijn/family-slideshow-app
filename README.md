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
cd C:\Users\71861\Own\Projects\family-slideshow-app\slideshow-app
Copy-Item backend\.env.template backend\.env
task backend:install
docker compose -f compose.dev.yml up postgres -d
task backend:migrate
task backend:dev
```

The backend now uses PostgreSQL. For direct local backend runs, `backend/.env` should point at the local Postgres instance from `compose.dev.yml`:

```text
DATABASE_URL=postgresql+asyncpg://slideshow:slideshow@localhost:5432/slideshow
```

Set `SECRET_KEY`, `ADMIN_PASSWORD`, and `VIEWER_PASSWORD` in `backend/.env` before using the app beyond local smoke testing.

The backend runs on `http://localhost:8000` by default. Health check:

```powershell
Invoke-RestMethod http://localhost:8000/health
```

## Frontend

```powershell
cd C:\Users\71861\Own\Projects\family-slideshow-app\slideshow-app
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

## Docker

The production-shaped local setup runs three services:

- `postgres`: local PostgreSQL for app data
- `backend`: FastAPI plus Alembic migrations on startup
- `frontend`: static frontend served by Nginx

The backend stores uploads in a separate Docker volume mounted at `/data/uploads`.

Create a local Compose env file:

```powershell
Copy-Item .env.compose.template .env
```

Set real values for `SECRET_KEY`, `ADMIN_PASSWORD`, and `VIEWER_PASSWORD`, then run:

```powershell
task init
```

Open `http://localhost:8080`.

Use `task docker:logs` to follow the container logs, and `task docker:down` to stop the stack.

If port `8080` is already in use, set `FRONTEND_PORT` and `ALLOWED_ORIGINS` in `.env` before running Compose.

For Docker-based development with backend and frontend reload on source changes, run:

```powershell
task docker:dev
```

Open `http://localhost:5173`. Use `task docker:dev:down` to stop the dev stack. If ports are in use, set `FRONTEND_DEV_PORT`, `BACKEND_DEV_PORT`, or `POSTGRES_DEV_PORT` in `.env`.

For a real production deployment, run behind HTTPS and set:

```text
ENVIRONMENT=production
ALLOWED_ORIGINS=["https://your-domain.example"]
```

For production, point `DATABASE_URL` at a managed PostgreSQL instance instead of running the local `postgres` container. For larger or multi-instance deployments, also move uploads from the Docker volume to object storage.
