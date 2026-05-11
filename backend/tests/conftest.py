"""Pytest fixtures: isolated in-memory SQLite DB + async HTTP client."""
from __future__ import annotations

import os
from collections.abc import AsyncIterator

import pytest
import pytest_asyncio

os.environ.setdefault("ENVIRONMENT", "test")
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")
os.environ.setdefault("SYNC_DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-do-not-use-in-prod-32+")
os.environ.setdefault("DEBUG", "false")

from httpx import ASGITransport, AsyncClient  # noqa: E402
from sqlalchemy.ext.asyncio import (  # noqa: E402
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core import db as db_module  # noqa: E402
from app.core.db import Base  # noqa: E402
from app.main import create_app  # noqa: E402


@pytest.fixture(scope="session")
def anyio_backend() -> str:
    return "asyncio"


@pytest_asyncio.fixture
async def test_engine():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", future=True)
    async with engine.begin() as conn:
        from app import models  # noqa: F401

        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def session_factory(test_engine) -> async_sessionmaker[AsyncSession]:
    return async_sessionmaker(test_engine, expire_on_commit=False, class_=AsyncSession)


@pytest_asyncio.fixture
async def client(test_engine, session_factory) -> AsyncIterator[AsyncClient]:
    # Build an app that doesn't run the lifespan create_all (we did it above)
    # and override get_db to use our in-memory engine.
    original_engine = db_module.engine
    original_session = db_module.AsyncSessionLocal
    db_module.engine = test_engine
    db_module.AsyncSessionLocal = session_factory

    app = create_app()

    async def _override_get_db() -> AsyncIterator[AsyncSession]:
        async with session_factory() as s:
            yield s

    from app.core.db import get_db

    app.dependency_overrides[get_db] = _override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac

    db_module.engine = original_engine
    db_module.AsyncSessionLocal = original_session


@pytest_asyncio.fixture
async def db(session_factory) -> AsyncIterator[AsyncSession]:
    async with session_factory() as session:
        yield session
