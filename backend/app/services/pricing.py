"""Pricing engine for instant quote estimates.

Prices are inspired by typical Los Angeles garage-door service rates.
They are intentionally returned as a range to encourage the customer
to book a precise on-site quote.
"""

from app.schemas.lead import (
    DoorMaterial,
    DoorType,
    IssueType,
    QuoteEstimateRequest,
    QuoteEstimateResponse,
)

# Base price ranges per issue (low, high, duration_min, en_label, es_label)
ISSUE_PRICING: dict[IssueType, tuple[float, float, int, str, str]] = {
    "spring_broken": (
        220,
        450,
        75,
        "Broken torsion / extension spring",
        "Resorte de torsion / extension roto",
    ),
    "opener_failure": (
        180,
        650,
        90,
        "Opener motor failure or replacement",
        "Falla o reemplazo del motor del abridor",
    ),
    "off_track": (
        150,
        380,
        60,
        "Door off its track",
        "Puerta fuera de la riel",
    ),
    "panel_damage": (
        280,
        950,
        120,
        "Damaged or dented panel",
        "Panel danado o abollado",
    ),
    "cable_snapped": (
        180,
        360,
        60,
        "Snapped lift cable",
        "Cable de elevacion roto",
    ),
    "noisy": (
        95,
        220,
        45,
        "Noisy door (rollers, hinges, lubrication)",
        "Puerta ruidosa (rodillos, bisagras, lubricacion)",
    ),
    "remote_issue": (
        65,
        180,
        30,
        "Remote control / keypad programming",
        "Programacion de control remoto / teclado",
    ),
    "new_install": (
        950,
        3200,
        240,
        "New garage door installation",
        "Instalacion de puerta de garaje nueva",
    ),
    "tune_up": (
        89,
        149,
        45,
        "Maintenance tune-up (25-point inspection)",
        "Mantenimiento (inspeccion de 25 puntos)",
    ),
    "other": (
        85,
        400,
        60,
        "Diagnostic visit",
        "Visita de diagnostico",
    ),
}

# Multiplier by door type
DOOR_TYPE_MULTIPLIER: dict[DoorType, float] = {
    "single": 1.0,
    "double": 1.35,
    "commercial": 1.85,
}

# Multiplier by material
MATERIAL_MULTIPLIER: dict[DoorMaterial, float] = {
    "steel": 1.0,
    "aluminum": 1.05,
    "wood": 1.45,
    "fiberglass": 1.15,
    "vinyl": 1.1,
    "unknown": 1.0,
}

EMERGENCY_FEE = 79.0


def estimate_quote(req: QuoteEstimateRequest) -> QuoteEstimateResponse:
    base_low, base_high, duration, label_en, label_es = ISSUE_PRICING.get(
        req.issue_type, ISSUE_PRICING["other"]
    )
    door_mult = DOOR_TYPE_MULTIPLIER.get(req.door_type, 1.0)
    mat_mult = MATERIAL_MULTIPLIER.get(req.door_material, 1.0)

    low = base_low * door_mult * mat_mult
    high = base_high * door_mult * mat_mult

    if req.is_emergency:
        low += EMERGENCY_FEE
        high += EMERGENCY_FEE

    notes_en = (
        "This is a free preliminary estimate. Final price is confirmed by your "
        "technician after inspection. No hidden fees."
    )
    notes_es = (
        "Esta es una estimacion preliminar gratuita. El precio final lo confirma "
        "el tecnico despues de la inspeccion. Sin cargos ocultos."
    )

    return QuoteEstimateResponse(
        estimated_low=round(low, 2),
        estimated_high=round(high, 2),
        typical_duration_min=duration,
        issue_label_en=label_en,
        issue_label_es=label_es,
        notes_en=notes_en,
        notes_es=notes_es,
    )
