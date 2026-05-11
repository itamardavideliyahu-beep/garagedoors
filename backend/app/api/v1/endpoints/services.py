"""Public services catalog + service area endpoints."""

from fastapi import APIRouter
from sqlalchemy import select

from app.core.deps import DbSession
from app.models.service import Service, ServiceArea
from app.schemas.service import (
    ServiceAreaOut,
    ServiceOut,
    ZipCheckRequest,
    ZipCheckResponse,
)
from app.services.service_area import lookup_zip

router = APIRouter()


@router.get("", response_model=list[ServiceOut])
async def list_services(db: DbSession) -> list[Service]:
    result = await db.execute(
        select(Service)
        .where(Service.is_active.is_(True))
        .order_by(Service.sort_order, Service.id)
    )
    return list(result.scalars().all())


@router.get("/featured", response_model=list[ServiceOut])
async def list_featured_services(db: DbSession) -> list[Service]:
    result = await db.execute(
        select(Service)
        .where(Service.is_active.is_(True), Service.is_featured.is_(True))
        .order_by(Service.sort_order, Service.id)
    )
    return list(result.scalars().all())


@router.get("/areas", response_model=list[ServiceAreaOut])
async def list_service_areas(db: DbSession) -> list[ServiceArea]:
    result = await db.execute(
        select(ServiceArea).where(ServiceArea.is_active.is_(True)).order_by(ServiceArea.id)
    )
    return list(result.scalars().all())


@router.post("/check-zip", response_model=ZipCheckResponse)
async def check_zip(payload: ZipCheckRequest, db: DbSession) -> ZipCheckResponse:
    area = await lookup_zip(db, payload.zip_code)
    if not area:
        return ZipCheckResponse(
            zip_code=payload.zip_code,
            in_service_area=False,
        )
    return ZipCheckResponse(
        zip_code=payload.zip_code,
        in_service_area=True,
        area_name=area.name,
        response_time_min=area.response_time_min,
    )
