"""FastAPI application entry-point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse

from app import __version__
from app.api.v1.router import api_router
from app.core.config import settings
from app.core.db import Base, engine
from app.seed import seed_initial_data


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Idempotent table creation - safe to run on every boot.
    # For schema migrations over time, use Alembic.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # Seed is idempotent: it only inserts when tables are empty,
    # so we can run it in every environment.
    await seed_initial_data()
    yield
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version=__version__,
    debug=settings.DEBUG,
    default_response_class=ORJSONResponse,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root() -> dict[str, str]:
    return {
        "service": settings.APP_NAME,
        "version": __version__,
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
