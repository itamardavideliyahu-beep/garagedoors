# LA Garage Doors Pro — Backend

FastAPI + SQLAlchemy 2.x (async) + Alembic + PostgreSQL backend for the LA
Garage Doors Pro platform.

## Quick start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp .env.example .env                 # then edit JWT_SECRET_KEY, DB URLs, etc.

# Run dev server (SQLite by default, no Postgres needed)
uvicorn app.main:app --reload
```

Open: <http://localhost:8000/docs>

## Auth endpoints

| Method | Path                          | Notes                                       |
| ------ | ----------------------------- | ------------------------------------------- |
| POST   | `/api/v1/auth/register`       | Create a customer account, returns tokens   |
| POST   | `/api/v1/auth/login`          | JSON body `{email, password}`               |
| POST   | `/api/v1/auth/login/oauth`    | OAuth2 password form-flow (Swagger button)  |
| POST   | `/api/v1/auth/refresh`        | Exchange refresh token for a new pair       |
| GET    | `/api/v1/auth/me`             | Current authenticated user                  |
| GET    | `/api/v1/users`               | List users (admin only)                     |
| PATCH  | `/api/v1/users/me`            | Update own profile                          |
| PATCH  | `/api/v1/users/{id}/role`     | Change a user's role (admin only)           |

### Roles

`customer` · `technician` · `dispatcher` · `admin`

Use the dependency helpers in `app/core/deps.py`:

```python
from app.core.deps import AdminUser, StaffUser, CurrentUser, require_roles
from app.models.user import UserRole

@router.get("/dispatch", dependencies=[Depends(require_roles(UserRole.DISPATCHER, UserRole.ADMIN))])
async def dispatch_board(): ...
```

## Migrations (Alembic)

```bash
alembic upgrade head                          # apply migrations
alembic revision --autogenerate -m "message"  # create a new one
```

Alembic uses `SYNC_DATABASE_URL` from `.env`; the app itself uses the async
`DATABASE_URL`.

## Tests

```bash
pytest
```

Tests run against an in-memory SQLite database — no external services
required.

## Project layout

```
backend/
├── app/
│   ├── api/v1/           # auth, users routers
│   ├── core/             # config, db, security, deps
│   ├── models/           # SQLAlchemy ORM
│   ├── schemas/          # Pydantic v2
│   ├── services/         # business logic
│   └── main.py           # FastAPI app factory
├── alembic/              # migrations
├── tests/
├── pyproject.toml
└── Dockerfile
```
