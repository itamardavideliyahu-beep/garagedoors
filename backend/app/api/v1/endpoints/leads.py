"""Leads + quote estimation endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy import desc, select

from app.core.deps import DbSession, require_admin, require_dispatcher
from app.models.lead import Lead, LeadSource
from app.schemas.lead import (
    LeadCreate,
    LeadOut,
    LeadSubmitRequest,
    QuoteEstimateRequest,
    QuoteEstimateResponse,
)
from app.services.pricing import estimate_quote
from app.services.service_area import lookup_zip

router = APIRouter()


@router.post(
    "",
    response_model=LeadOut,
    status_code=status.HTTP_201_CREATED,
    summary="Public contact form / lead capture",
)
async def create_lead(payload: LeadCreate, db: DbSession) -> Lead:
    lead = Lead(**payload.model_dump())
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    return lead


@router.post(
    "/quote",
    response_model=QuoteEstimateResponse,
    summary="Instant quote estimate (no lead created)",
)
async def quote_estimate(payload: QuoteEstimateRequest, db: DbSession) -> QuoteEstimateResponse:
    response = estimate_quote(payload)
    if payload.zip_code:
        area = await lookup_zip(db, payload.zip_code)
        response.in_service_area = area is not None
        response.response_time_min = area.response_time_min if area else None
    return response


@router.post(
    "/submit",
    response_model=LeadOut,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a quote + contact details (one-step form)",
)
async def submit_quote_lead(payload: LeadSubmitRequest, db: DbSession) -> Lead:
    quote = estimate_quote(payload.quote)
    source = LeadSource.EMERGENCY if payload.quote.is_emergency else LeadSource.WEB_QUOTE
    lead = Lead(
        full_name=payload.full_name,
        phone=payload.phone,
        email=payload.email,
        zip_code=payload.quote.zip_code,
        address=payload.address,
        message=payload.message,
        source=source,
        urgency=payload.urgency,
        door_type=payload.quote.door_type,
        door_material=payload.quote.door_material,
        issue_type=payload.quote.issue_type,
        estimated_low=quote.estimated_low,
        estimated_high=quote.estimated_high,
        locale=payload.quote.locale,
        extra_data={"consent": payload.consent},
    )
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    return lead


@router.get(
    "",
    response_model=list[LeadOut],
    dependencies=[Depends(require_dispatcher)],
    summary="List recent leads (staff only)",
)
async def list_leads(db: DbSession, limit: int = 50) -> list[Lead]:
    result = await db.execute(
        select(Lead).order_by(desc(Lead.created_at)).limit(min(limit, 200))
    )
    return list(result.scalars().all())


@router.delete(
    "/{lead_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin)],
)
async def delete_lead(lead_id: int, db: DbSession) -> None:
    lead = await db.get(Lead, lead_id)
    if lead is not None:
        await db.delete(lead)
        await db.commit()
