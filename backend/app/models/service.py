"""Service catalog and service-area models."""

import enum
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, Integer, Numeric, String, Text, func
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class ServiceCategory(str, enum.Enum):
    REPAIR = "repair"
    INSTALLATION = "installation"
    MAINTENANCE = "maintenance"
    EMERGENCY = "emergency"
    COMMERCIAL = "commercial"


class Service(Base):
    """A service offered in the catalog (e.g. spring repair, opener install)."""

    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    name_en: Mapped[str] = mapped_column(String(255), nullable=False)
    name_es: Mapped[str] = mapped_column(String(255), nullable=False)
    description_en: Mapped[str] = mapped_column(Text, nullable=False)
    description_es: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[ServiceCategory] = mapped_column(
        SAEnum(ServiceCategory, name="service_category"), nullable=False
    )
    icon: Mapped[str] = mapped_column(String(64), default="wrench", nullable=False)
    base_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    starts_at_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    duration_min: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    is_emergency: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )


class ServiceArea(Base):
    """A polygonal service area in greater Los Angeles."""

    __tablename__ = "service_areas"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    zip_codes: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    geojson: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)
    response_time_min: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
