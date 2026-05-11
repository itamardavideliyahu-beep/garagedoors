"""Customer reviews and testimonials."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    customer_location: Mapped[str | None] = mapped_column(String(128), nullable=True)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    service_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    source: Mapped[str] = mapped_column(String(32), default="website", nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
