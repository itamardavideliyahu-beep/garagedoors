"""CI smoke test - verifies the app boots and core domain logic works.

Run with:  python scripts/smoke_test.py
Set env vars before running (CI workflow does this):
    APP_ENV=test
    SECRET_KEY=ci-test
    DATABASE_URL=sqlite+aiosqlite:///:memory:
"""

from __future__ import annotations

import sys


def test_app_loads() -> None:
    from app.main import app

    paths = [r.path for r in app.routes if hasattr(r, "path")]
    assert "/health" in paths, "health endpoint missing"
    assert any(
        p.startswith("/api/v1") for p in paths
    ), "v1 routes missing"
    print(f"App loads OK -- {len(paths)} routes registered")


def test_pricing_engine() -> None:
    from app.schemas.lead import QuoteEstimateRequest
    from app.services.pricing import estimate_quote

    cases = [
        ("single", "steel", "spring_broken", False),
        ("double", "wood", "new_install", False),
        ("commercial", "steel", "cable_snapped", True),
        ("single", "aluminum", "tune_up", False),
    ]
    for door, mat, issue, emerg in cases:
        q = estimate_quote(
            QuoteEstimateRequest(
                door_type=door,
                door_material=mat,
                issue_type=issue,
                is_emergency=emerg,
            )
        )
        assert q.estimated_low > 0, f"low must be positive: {q}"
        assert q.estimated_high > q.estimated_low, f"high>low: {q}"
        assert q.typical_duration_min > 0, f"duration: {q}"
    print(f"Pricing engine OK -- {len(cases)} cases pass")


def test_schemas_round_trip() -> None:
    from app.schemas.lead import LeadSubmitRequest, QuoteEstimateRequest

    payload = LeadSubmitRequest(
        quote=QuoteEstimateRequest(
            door_type="single",
            door_material="steel",
            issue_type="spring_broken",
        ),
        full_name="Test User",
        phone="3105551234",
        consent=True,
    )
    dumped = payload.model_dump()
    LeadSubmitRequest.model_validate(dumped)
    print("Schema round-trip OK")


def main() -> int:
    test_app_loads()
    test_pricing_engine()
    test_schemas_round_trip()
    print("ALL SMOKE TESTS PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
