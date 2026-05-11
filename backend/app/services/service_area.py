"""Service-area lookup helpers."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.service import ServiceArea


async def lookup_zip(db: AsyncSession, zip_code: str) -> ServiceArea | None:
    zip_code = zip_code.strip()
    if not zip_code:
        return None
    result = await db.execute(select(ServiceArea).where(ServiceArea.is_active.is_(True)))
    areas = result.scalars().all()
    for area in areas:
        if zip_code in (area.zip_codes or []):
            return area
    return None
