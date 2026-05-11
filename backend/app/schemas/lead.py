"""Lead schemas: contact form + quote estimate."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.lead import LeadSource, LeadStatus, LeadUrgency


class LeadCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    phone: str = Field(min_length=7, max_length=32)
    email: EmailStr | None = None
    zip_code: str | None = Field(default=None, max_length=16)
    address: str | None = Field(default=None, max_length=512)
    message: str | None = Field(default=None, max_length=2000)
    source: LeadSource = LeadSource.WEB_CONTACT
    urgency: LeadUrgency = LeadUrgency.FLEXIBLE
    door_type: str | None = Field(default=None, max_length=64)
    door_material: str | None = Field(default=None, max_length=64)
    issue_type: str | None = Field(default=None, max_length=64)
    locale: Literal["en", "es"] = "en"


class LeadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    phone: str
    email: str | None = None
    zip_code: str | None = None
    status: LeadStatus
    source: LeadSource
    urgency: LeadUrgency
    estimated_low: float | None = None
    estimated_high: float | None = None
    created_at: datetime


DoorType = Literal["single", "double", "commercial"]
DoorMaterial = Literal["steel", "aluminum", "wood", "fiberglass", "vinyl", "unknown"]
IssueType = Literal[
    "spring_broken",
    "opener_failure",
    "off_track",
    "panel_damage",
    "cable_snapped",
    "noisy",
    "remote_issue",
    "new_install",
    "tune_up",
    "other",
]


class QuoteEstimateRequest(BaseModel):
    door_type: DoorType
    door_material: DoorMaterial = "steel"
    issue_type: IssueType
    zip_code: str | None = Field(default=None, max_length=16)
    is_emergency: bool = False
    locale: Literal["en", "es"] = "en"


class QuoteEstimateResponse(BaseModel):
    estimated_low: float
    estimated_high: float
    currency: str = "USD"
    typical_duration_min: int
    issue_label_en: str
    issue_label_es: str
    notes_en: str
    notes_es: str
    in_service_area: bool | None = None
    response_time_min: int | None = None


class LeadSubmitRequest(BaseModel):
    """Combines a quote estimate + the contact details for the lead."""

    quote: QuoteEstimateRequest
    full_name: str = Field(min_length=2, max_length=255)
    phone: str = Field(min_length=7, max_length=32)
    email: EmailStr | None = None
    address: str | None = Field(default=None, max_length=512)
    message: str | None = Field(default=None, max_length=2000)
    urgency: LeadUrgency = LeadUrgency.FLEXIBLE
    consent: bool = True
