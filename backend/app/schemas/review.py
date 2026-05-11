"""Review schemas."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=255)
    customer_location: str | None = Field(default=None, max_length=128)
    rating: int = Field(ge=1, le=5)
    title: str | None = Field(default=None, max_length=255)
    comment: str = Field(min_length=10, max_length=2000)
    service_type: str | None = Field(default=None, max_length=128)


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_name: str
    customer_location: str | None = None
    rating: int
    title: str | None = None
    comment: str
    service_type: str | None = None
    is_featured: bool
    created_at: datetime
