"""Lead model - the entry-point for every new customer enquiry."""

import enum
from datetime import datetime

from sqlalchemy import JSON, DateTime, Numeric, String, Text, func
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class LeadSource(str, enum.Enum):
    WEB_QUOTE = "web_quote"
    WEB_CONTACT = "web_contact"
    EMERGENCY = "emergency"
    PHONE = "phone"
    WHATSAPP = "whatsapp"
    REFERRAL = "referral"
    OTHER = "other"


class LeadUrgency(str, enum.Enum):
    EMERGENCY = "emergency"
    SAME_DAY = "same_day"
    THIS_WEEK = "this_week"
    FLEXIBLE = "flexible"


class LeadStatus(str, enum.Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUOTED = "quoted"
    SCHEDULED = "scheduled"
    CONVERTED = "converted"
    LOST = "lost"


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), index=True, nullable=True)
    phone: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    zip_code: Mapped[str | None] = mapped_column(String(16), index=True, nullable=True)
    address: Mapped[str | None] = mapped_column(String(512), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[LeadSource] = mapped_column(
        SAEnum(LeadSource, name="lead_source"), default=LeadSource.WEB_CONTACT, nullable=False
    )
    urgency: Mapped[LeadUrgency] = mapped_column(
        SAEnum(LeadUrgency, name="lead_urgency"), default=LeadUrgency.FLEXIBLE, nullable=False
    )
    status: Mapped[LeadStatus] = mapped_column(
        SAEnum(LeadStatus, name="lead_status"), default=LeadStatus.NEW, nullable=False
    )
    door_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    door_material: Mapped[str | None] = mapped_column(String(64), nullable=True)
    issue_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    estimated_low: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    estimated_high: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    locale: Mapped[str] = mapped_column(String(8), default="en", nullable=False)
    extra_data: Mapped[dict] = mapped_column(JSON, default=dict, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
