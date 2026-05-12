"""Leads + quote estimation endpoints."""

import logging
from contextlib import suppress

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, status
from sqlalchemy import desc, select

from app.core.config import settings
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

logger = logging.getLogger(__name__)
router = APIRouter()


async def _notify_lambda(lead: Lead) -> None:
    """Fire-and-forget POST to the Lambda notification function."""
    url = settings.LAMBDA_NOTIFY_URL
    if not url:
        return
    payload = {
        "formType": "new_lead",
        "data": {
            "leadId":    lead.id,
            "name":      lead.full_name,
            "phone":     lead.phone,
            "email":     lead.email or "",
            "zipCode":   lead.zip_code or "",
            "address":   lead.address or "",
            "issue":     lead.issue_type or "",
            "urgency":   lead.urgency,
            "source":    lead.source,
            "estLow":    float(lead.estimated_low)  if lead.estimated_low  else None,
            "estHigh":   float(lead.estimated_high) if lead.estimated_high else None,
            "siteId":    (lead.extra_data or {}).get("site", "main"),
            "areaName":  (lead.extra_data or {}).get("area", "Los Angeles"),
        },
    }
    with suppress(Exception):
        async with httpx.AsyncClient(timeout=8) as client:
            resp = await client.post(url, json=payload)
            logger.info("Lambda notify: %s", resp.status_code)


@router.post(
    "",
    response_model=LeadOut,
    status_code=status.HTTP_201_CREATED,
    summary="Public contact form / lead capture",
)
async def create_lead(
    payload: LeadCreate,
    db: DbSession,
    background_tasks: BackgroundTasks,
) -> Lead:
    lead = Lead(**payload.model_dump())
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    background_tasks.add_task(_notify_lambda, lead)
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
async def submit_quote_lead(
    payload: LeadSubmitRequest,
    db: DbSession,
    background_tasks: BackgroundTasks,
) -> Lead:
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
        extra_data={
            "consent": payload.consent,
            "site": getattr(payload, "site_id", "main"),
            "area": getattr(payload, "area_name", "Los Angeles"),
        },
    )
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    background_tasks.add_task(_notify_lambda, lead)
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
