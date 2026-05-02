# Migrate `slideshow_backend` and `slideshow_frontend` into `slideshow_app`

## Goal

Move the separate backend and frontend repositories into one monorepo named `slideshow_app`, while preserving the current development behavior:

- Backend: FastAPI, SQLAlchemy async, Alembic, SQLite by default, `uv`, Python 3.13.
- Frontend: React 18, Vite, TypeScript, Mantine, React Query, npm.
- Runtime contract: the frontend calls `/api/...`, uses cookie-based auth with `credentials: "include"`, and receives image URLs from the backend.

The migration should separate source files from runtime/generated data, make local development reproducible, and avoid behavior changes unless they are necessary for the new layout.

## Current State

### `slideshow_backend`

Tracked source and config:

- `src/`: FastAPI app, routers, models, schemas, services, storage helpers.
- `alembic/` and `alembic.ini`: database migrations.
- `pyproject.toml`, `uv.lock`, `.python-version`: Python project metadata and lockfile.
- `Taskfile.yml`: current backend tasks.
- `.env.template`: local environment template.
- `.gitignore`.

Local/generated files and directories that should not be committed:

- `.env`
- `.venv/`
- `slideshow.db`
- `uploads/`
- `notes/` unless intentionally migrated as documentation.

Important behavior:

- Backend routes are mounted at `/api/auth`, `/api/photos`, and `/api/collections`.
- The root and health endpoints are `/` and `/health`.
- `src/config.py` loads `.env` from the current working directory.
- The default database URL is `sqlite+aiosqlite:///./slideshow.db`.
- The default upload directory is `uploads`.
- `Taskfile.yml` runs the app from the backend directory with `uv run fastapi dev src/main.py --reload`.
- CORS defaults to `["http://localhost:5173"]`.

### `slideshow_frontend`

Tracked source and config:

- `src/`: React pages, components, hooks, API client, types, CSS.
- `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`.
- `.gitignore`, `README.MD`.

Local/generated files and directories that should not be committed:

- `node_modules/`
- `dist/`
- `.env`, `.env.*`
- `.devcontainer/` unless intentionally migrated.
- `notes/` unless intentionally migrated as documentation.

Migration-sensitive issue:

- `src/index.css` references `/backgrounds/standard_dark_bg.jpg` and `/backgrounds/madeliefje_bg.png`.
- Those files currently exist under `public/backgrounds/`, but they are ignored because the frontend `.gitignore` has `backgrounds/`, which matches nested `backgrounds` directories too.
- `package-lock.json` exists locally but is ignored. For reproducible monorepo installs, either commit it or intentionally switch package managers. The simplest option is to keep npm and commit `frontend/package-lock.json`.

Important behavior:

- `src/lib/api.ts` builds API URLs from `VITE_API_BASE_URL`; if unset, requests stay relative.
- `vite.config.ts` proxies `/api` to `http://host.docker.internal:8000`.
- The app expects cookie auth and sends credentials with API requests.

### `slideshow_app`

Current state:

- Contains `notes/`.
- Is not currently a git repository.

## Recommended Target Layout

Use a simple two-package monorepo and keep each project mostly intact:

```text
slideshow_app/
  README.md
  .gitignore
  .env.template
  Taskfile.yml
  notes/
    migrate_to_monorepo.md
  backend/
    .python-version
    pyproject.toml
    uv.lock
    alembic.ini
    alembic/
    src/
    .env.template
    README.md
  frontend/
    package.json
    package-lock.json
    tsconfig.json
    vite.config.ts
    index.html
    public/
      backgrounds/
    src/
    README.md
```

Rationale:

- Keeps backend Python paths, Alembic paths, and frontend Vite paths close to their current shape.
- Avoids a risky package/import rename during the move.
- Allows each tool to run from its package directory.
- Leaves room for root-level orchestration without forcing Python and Node into one dependency manager.

## Git History Strategy

Choose one before moving files.

### Option A: Preserve both histories

Recommended if either existing repo history matters.

1. Initialize `slideshow_app` as a new git repository.
2. Import backend history under `backend/`.
3. Import frontend history under `frontend/`.
4. Commit root-level monorepo files.

Use `git subtree` or `git filter-repo`. `git subtree` is simpler for this migration:

```powershell
cd C:\Users\71861\Own\Projects\photo_slideshow\slideshow_app
git init
git commit --allow-empty -m "Initialize monorepo"
git remote add backend ..\slideshow_backend
git fetch backend
git subtree add --prefix backend backend/main
git remote add frontend ..\slideshow_frontend
git fetch frontend
git subtree add --prefix frontend frontend/main
```

If the branch names are not `main`, replace `main` with the actual branch name from each repo.

### Option B: Copy current source only

Recommended only if history is not important.

1. Initialize `slideshow_app` as a new git repository.
2. Copy tracked backend files into `backend/`.
3. Copy tracked frontend files into `frontend/`.
4. Copy required untracked runtime assets explicitly, such as `frontend/public/backgrounds/`.
5. Commit everything once.

This is faster but loses the separate repo histories.

## Migration Steps

### 1. Freeze and verify the source repos

Run this first:

```powershell
cd C:\Users\71861\Own\Projects\photo_slideshow\slideshow_backend
git status --short

cd C:\Users\71861\Own\Projects\photo_slideshow\slideshow_frontend
git status --short
```

Both repos were clean when this plan was written. If they are no longer clean, commit or intentionally stash the pending work before migration.

Record each current branch:

```powershell
git branch --show-current
```

Use those branch names in the history-preserving import commands.

### 2. Initialize `slideshow_app`

If preserving history, follow Option A above.

If copying source only, initialize the repo and create package directories:

```powershell
cd C:\Users\71861\Own\Projects\photo_slideshow\slideshow_app
git init
New-Item -ItemType Directory -Force backend, frontend, notes
```

### 3. Move backend source

Target contents for `backend/`:

- `.env.template`
- `.gitignore` initially, then fold its rules into the root `.gitignore`
- `.python-version`
- `README.md`
- `Taskfile.yml` initially, then replace or complement with root tasks
- `alembic.ini`
- `alembic/`
- `pyproject.toml`
- `uv.lock`
- `src/`

Do not commit:

- `.env`
- `.venv/`
- `slideshow.db`
- `uploads/`

For local continuity only, copy runtime state after source migration:

```powershell
Copy-Item ..\slideshow_backend\.env backend\.env
Copy-Item ..\slideshow_backend\slideshow.db backend\slideshow.db
Copy-Item ..\slideshow_backend\uploads backend\uploads -Recurse
```

These files must remain ignored.

### 4. Move frontend source

Target contents for `frontend/`:

- `index.html`
- `package.json`
- `package-lock.json`
- `README.MD`, preferably renamed to `README.md`
- `tsconfig.json`
- `vite.config.ts`
- `src/`
- `public/backgrounds/`

Do not commit:

- `node_modules/`
- `dist/`
- `.env`
- `.env.*`

Do not copy the root-level `backgrounds/` directory unless it is still needed as source artwork. The app uses `public/backgrounds/` at runtime.

Fix the ignored asset issue by using monorepo-specific ignore rules. Do not ignore every directory named `backgrounds`.

### 5. Create the root `.gitignore`

Use a root `.gitignore` that is explicit by package path:

```gitignore
# Python
backend/__pycache__/
backend/**/*.py[oc]
backend/build/
backend/dist/
backend/wheels/
backend/*.egg-info/
backend/.venv/

# Backend local config and runtime state
backend/.env
backend/slideshow.db
backend/*.db
backend/uploads/

# Frontend dependencies and build output
frontend/node_modules/
frontend/dist/
frontend/.env
frontend/.env.*
frontend/npm-debug.log*
frontend/yarn-debug.log*
frontend/yarn-error.log*

# Local editor/system files
.vscode/
.DS_Store
```

Do not ignore:

- `notes/`
- `frontend/package-lock.json`
- `frontend/public/backgrounds/`

### 6. Create root orchestration tasks

Keep package-local commands, but add root commands so contributors can work from `slideshow_app`.

Recommended root `Taskfile.yml`:

```yaml
version: '3'

tasks:
  backend:install:
    dir: backend
    cmds:
      - uv sync

  backend:dev:
    dir: backend
    cmds:
      - uv run fastapi dev src/main.py --reload

  backend:migrate:
    dir: backend
    cmds:
      - uv run alembic upgrade head

  frontend:install:
    dir: frontend
    cmds:
      - npm install

  frontend:dev:
    dir: frontend
    cmds:
      - npm run dev

  frontend:typecheck:
    dir: frontend
    cmds:
      - npm run typecheck

  frontend:build:
    dir: frontend
    cmds:
      - npm run build
```

Keeping `dir: backend` is important because backend config currently resolves `.env`, `slideshow.db`, and `uploads/` relative to the current working directory.

### 7. Create root environment templates

Keep `backend/.env.template` as the authoritative backend env template.

Add a root `.env.template` only as an onboarding pointer, not as a runtime file:

```text
# Copy backend/.env.template to backend/.env for backend development.
# Optional frontend settings can go in frontend/.env.
```

For frontend, add `frontend/.env.template` if you want explicit frontend config:

```text
# Leave empty to use Vite's /api proxy during local development.
VITE_API_BASE_URL=
```

### 8. Adjust Vite proxy for monorepo development

Current frontend config proxies to `http://host.docker.internal:8000`, which is useful when Vite runs in a container and the backend runs on the host. In a monorepo, support both local and container development.

Recommended behavior:

- Default proxy target: `http://localhost:8000` or `http://127.0.0.1:8000`.
- Optional override: `VITE_API_PROXY_TARGET`.
- Keep `/api` relative in the browser unless `VITE_API_BASE_URL` is explicitly set.

This preserves the current frontend API client behavior and avoids hardcoding a Docker-only backend location.

### 9. Dev container decision

The frontend currently has a Node-only devcontainer. After migration, choose one of these:

- Minimal option: do not migrate `.devcontainer/`; document local install commands.
- Better monorepo option: create one root `.devcontainer/devcontainer.json` with Python 3.13, Node 20, `uv`, npm, and port forwarding for `8000` and `5173`.

If using one container for both processes, the Vite proxy target should be `http://127.0.0.1:8000`, not `host.docker.internal`.

### 10. Update documentation

Create root `README.md` with:

- Project overview.
- Target layout.
- Prerequisites: Python 3.13, `uv`, Node 20/npm, Task.
- Backend setup:
  - copy `backend/.env.template` to `backend/.env`
  - set `SECRET_KEY`, `ADMIN_PASSWORD`, `VIEWER_PASSWORD`
  - run `task backend:migrate`
  - run `task backend:dev`
- Frontend setup:
  - run `task frontend:install`
  - run `task frontend:dev`
- Validation commands:
  - `task frontend:typecheck`
  - `task frontend:build`
  - backend smoke check at `http://localhost:8000/health`

Also update package READMEs so paths and commands refer to the monorepo layout.

### 11. Validate after migration

Run backend setup:

```powershell
cd C:\Users\71861\Own\Projects\photo_slideshow\slideshow_app
task backend:install
task backend:migrate
task backend:dev
```

In another terminal, run frontend setup:

```powershell
cd C:\Users\71861\Own\Projects\photo_slideshow\slideshow_app
task frontend:install
task frontend:typecheck
task frontend:build
task frontend:dev
```

Manual smoke test:

- Open `http://localhost:5173`.
- Log in as the seeded admin user.
- Confirm `/api/auth/me` succeeds.
- Confirm collections load.
- Upload an image as admin.
- Confirm the uploaded image renders in the slideshow.
- Confirm `backend/uploads/` receives the uploaded file.
- Confirm `backend/slideshow.db` receives database changes.

### 12. Commit the monorepo

Before the first monorepo commit:

```powershell
git status --short
```

Expected committed files include:

- `backend/src/`
- `backend/alembic/`
- `backend/pyproject.toml`
- `backend/uv.lock`
- `frontend/src/`
- `frontend/public/backgrounds/`
- `frontend/package.json`
- `frontend/package-lock.json`
- root `.gitignore`
- root `Taskfile.yml`
- root `README.md`
- `notes/migrate_to_monorepo.md`

Expected ignored or absent files:

- `backend/.env`
- `backend/.venv/`
- `backend/slideshow.db`
- `backend/uploads/`
- `frontend/node_modules/`
- `frontend/dist/`
- `frontend/.env`

## Risks and Mitigations

### Backend relative paths

Risk: Running FastAPI from the monorepo root changes where `.env`, SQLite, and uploads are resolved.

Mitigation: Run backend commands with working directory `backend/`. Root tasks should use `dir: backend`.

### Frontend background assets

Risk: Required background files remain ignored and are missing from a fresh clone.

Mitigation: Track `frontend/public/backgrounds/` and remove broad `backgrounds/` ignore behavior.

### Frontend dependency reproducibility

Risk: `package-lock.json` remains ignored.

Mitigation: Commit `frontend/package-lock.json` or intentionally adopt another lockfile. For the current npm project, commit `package-lock.json`.

### Vite proxy target

Risk: `host.docker.internal` fails outside the current frontend devcontainer workflow.

Mitigation: Make the proxy target configurable and default to local backend development.

### Runtime data accidentally committed

Risk: `.env`, SQLite DB, uploads, virtualenvs, and build output get committed during the move.

Mitigation: Add root ignore rules before copying local runtime state. Check `git status --short` before every commit.

### CORS and cookies

Risk: If frontend and backend origins change, cookie auth can fail.

Mitigation: Keep frontend on `http://localhost:5173`, backend on `http://localhost:8000`, and retain `ALLOWED_ORIGINS=["http://localhost:5173"]` for local development. Revisit cookie `secure` and `samesite` settings only for production deployment.

## Suggested Implementation Order

1. Decide whether to preserve git history.
2. Initialize `slideshow_app` using the chosen git strategy.
3. Add root `.gitignore` before copying runtime-adjacent files.
4. Import or copy backend into `backend/`.
5. Import or copy frontend into `frontend/`.
6. Explicitly add `frontend/public/backgrounds/`.
7. Commit `frontend/package-lock.json`.
8. Add root `Taskfile.yml`.
9. Adjust `frontend/vite.config.ts` proxy target handling.
10. Add or update root and package READMEs.
11. Run backend and frontend validation.
12. Make the first monorepo commit.

## Files Inspected While Writing This Plan

Backend:

- `pyproject.toml`
- `uv.lock`
- `Taskfile.yml`
- `.env.template`
- `.gitignore`
- `src/main.py`
- `src/config.py`
- `src/database.py`
- `src/routers/auth.py`
- `src/routers/photos.py`
- `src/routers/collections.py`
- tracked file list from `git ls-files`

Frontend:

- `package.json`
- `package-lock.json` presence
- `vite.config.ts`
- `tsconfig.json`
- `.gitignore`
- `README.MD`
- `.devcontainer/devcontainer.json`
- `src/App.tsx`
- `src/lib/api.ts`
- `src/api/auth.ts`
- `src/api/photos.ts`
- `src/api/collections.ts`
- `src/index.css` asset references
- `public/backgrounds/` local assets
- tracked file list from `git ls-files`

Target:

- `slideshow_app/notes/`
