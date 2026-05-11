"""Service catalog and service area schemas."""

from pydantic import BaseModel, ConfigDict

from app.models.service import ServiceCategory


class ServiceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name_en: str
    name_es: str
    description_en: str
    description_es: str
    category: ServiceCategory
    icon: str
    starts_at_price: float
    duration_min: int
    is_emergency: bool
    is_featured: bool


class ServiceAreaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str
    zip_codes: list[str]
    geojson: dict
    response_time_min: int


class ZipCheckRequest(BaseModel):
    zip_code: str


class ZipCheckResponse(BaseModel):
    zip_code: str
    in_service_area: bool
    area_name: str | None = None
    response_time_min: int | None = None
