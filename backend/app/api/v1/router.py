"""v1 API router aggregator."""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, business, leads, public, reviews, services

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(public.router, prefix="/public", tags=["public"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
api_router.include_router(leads.router, prefix="/leads", tags=["leads"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(business.router, prefix="/business", tags=["business"])
