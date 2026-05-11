"""Public business info (phone, hours, license, badges)."""

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import settings

router = APIRouter()


class BusinessInfo(BaseModel):
    name: str
    phone: str
    emergency_phone: str
    email: str
    license: str
    whatsapp_number: str
    hours: dict[str, str]
    badges: list[str]
    rating: float
    review_count: int
    years_experience: int
    service_promise_min: int


@router.get("/info", response_model=BusinessInfo)
async def business_info() -> BusinessInfo:
    return BusinessInfo(
        name=settings.BUSINESS_NAME,
        phone=settings.BUSINESS_PHONE,
        emergency_phone=settings.EMERGENCY_PHONE,
        email=settings.BUSINESS_EMAIL,
        license=settings.BUSINESS_LICENSE,
        whatsapp_number=settings.WHATSAPP_NUMBER,
        hours={
            "mon_fri": "7:00 AM - 9:00 PM",
            "sat": "8:00 AM - 6:00 PM",
            "sun": "9:00 AM - 5:00 PM",
            "emergency": "24/7",
        },
        badges=[
            "Licensed",
            "Bonded",
            "Insured",
            "BBB A+",
            "Same-Day Service",
            "Lifetime Warranty",
        ],
        rating=4.9,
        review_count=1247,
        years_experience=15,
        service_promise_min=60,
    )
