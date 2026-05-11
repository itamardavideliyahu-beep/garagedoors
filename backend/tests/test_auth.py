"""Tests for /api/v1/auth: register, login, refresh, role-based access."""
from __future__ import annotations

import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user import User, UserRole

API = "/api/v1"


async def _register(client: AsyncClient, email: str, password: str = "Password123!") -> dict:
    resp = await client.post(
        f"{API}/auth/register",
        json={"email": email, "password": password, "full_name": "Test User"},
    )
    assert resp.status_code == 201, resp.text
    return resp.json()


@pytest.mark.asyncio
async def test_register_creates_customer(client: AsyncClient) -> None:
    data = await _register(client, "alice@example.com")
    assert data["token_type"] == "bearer"
    assert data["access_token"]
    assert data["refresh_token"]
    assert data["user"]["email"] == "alice@example.com"
    assert data["user"]["role"] == "customer"
    assert data["user"]["is_active"] is True


@pytest.mark.asyncio
async def test_register_rejects_duplicate_email(client: AsyncClient) -> None:
    await _register(client, "dup@example.com")
    resp = await client.post(
        f"{API}/auth/register",
        json={"email": "dup@example.com", "password": "Password123!"},
    )
    assert resp.status_code == 409


@pytest.mark.asyncio
async def test_register_downgrades_admin_role(client: AsyncClient) -> None:
    resp = await client.post(
        f"{API}/auth/register",
        json={
            "email": "sneaky@example.com",
            "password": "Password123!",
            "role": "admin",
        },
    )
    assert resp.status_code == 201
    assert resp.json()["user"]["role"] == "customer"


@pytest.mark.asyncio
async def test_login_returns_tokens(client: AsyncClient) -> None:
    await _register(client, "bob@example.com", "SuperSecret1!")
    resp = await client.post(
        f"{API}/auth/login",
        json={"email": "bob@example.com", "password": "SuperSecret1!"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["access_token"]
    assert body["refresh_token"]
    assert body["user"]["email"] == "bob@example.com"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient) -> None:
    await _register(client, "carol@example.com", "GoodPass1!")
    resp = await client.post(
        f"{API}/auth/login",
        json={"email": "carol@example.com", "password": "WrongPass!"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_unknown_user(client: AsyncClient) -> None:
    resp = await client.post(
        f"{API}/auth/login",
        json={"email": "ghost@example.com", "password": "AnyPass1!"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_refresh_issues_new_pair(client: AsyncClient) -> None:
    tokens = await _register(client, "dan@example.com")
    resp = await client.post(
        f"{API}/auth/refresh",
        json={"refresh_token": tokens["refresh_token"]},
    )
    assert resp.status_code == 200
    new_tokens = resp.json()
    assert new_tokens["access_token"]
    assert new_tokens["refresh_token"]


@pytest.mark.asyncio
async def test_refresh_rejects_access_token(client: AsyncClient) -> None:
    tokens = await _register(client, "erin@example.com")
    resp = await client.post(
        f"{API}/auth/refresh",
        json={"refresh_token": tokens["access_token"]},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_refresh_rejects_garbage(client: AsyncClient) -> None:
    resp = await client.post(
        f"{API}/auth/refresh",
        json={"refresh_token": "not-a-token"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_me_requires_auth(client: AsyncClient) -> None:
    resp = await client.get(f"{API}/auth/me")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_me_returns_current_user(client: AsyncClient) -> None:
    tokens = await _register(client, "frank@example.com")
    resp = await client.get(
        f"{API}/auth/me",
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
    )
    assert resp.status_code == 200
    assert resp.json()["email"] == "frank@example.com"


@pytest.mark.asyncio
async def test_oauth_password_flow(client: AsyncClient) -> None:
    await _register(client, "grace@example.com", "MyPass1234!")
    resp = await client.post(
        f"{API}/auth/login/oauth",
        data={"username": "grace@example.com", "password": "MyPass1234!"},
    )
    assert resp.status_code == 200
    assert resp.json()["access_token"]


@pytest.mark.asyncio
async def test_admin_only_endpoint_blocks_customer(client: AsyncClient) -> None:
    tokens = await _register(client, "henry@example.com")
    resp = await client.get(
        f"{API}/users",
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_admin_can_list_users(
    client: AsyncClient, db: AsyncSession, session_factory
) -> None:
    # Promote a user to admin directly in the DB using the test session factory
    async with session_factory() as s:
        admin = User(
            email="admin@example.com",
            hashed_password=hash_password("AdminPass1!"),
            full_name="Admin",
            role=UserRole.ADMIN,
            is_active=True,
            is_verified=True,
        )
        s.add(admin)
        await s.commit()

    login = await client.post(
        f"{API}/auth/login",
        json={"email": "admin@example.com", "password": "AdminPass1!"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]

    resp = await client.get(
        f"{API}/users",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)


@pytest.mark.asyncio
async def test_update_me(client: AsyncClient) -> None:
    tokens = await _register(client, "ivy@example.com")
    resp = await client.patch(
        f"{API}/users/me",
        headers={"Authorization": f"Bearer {tokens['access_token']}"},
        json={"full_name": "Ivy Updated", "locale": "es"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["full_name"] == "Ivy Updated"
    assert body["locale"] == "es"


@pytest.mark.asyncio
async def test_admin_can_change_role(
    client: AsyncClient, session_factory
) -> None:
    async with session_factory() as s:
        admin = User(
            email="boss@example.com",
            hashed_password=hash_password("BossPass1!"),
            role=UserRole.ADMIN,
            is_active=True,
        )
        s.add(admin)
        await s.commit()

    # Create a customer through the API
    customer_tokens = await _register(client, "promoteme@example.com")
    customer_id = customer_tokens["user"]["id"]

    login = await client.post(
        f"{API}/auth/login",
        json={"email": "boss@example.com", "password": "BossPass1!"},
    )
    admin_token = login.json()["access_token"]

    resp = await client.patch(
        f"{API}/users/{customer_id}/role",
        headers={"Authorization": f"Bearer {admin_token}"},
        params={"new_role": "technician"},
    )
    assert resp.status_code == 200, resp.text
    assert resp.json()["role"] == "technician"

    async with session_factory() as s:
        result = await s.execute(select(User).where(User.id == customer_id))
        promoted = result.scalar_one()
        assert promoted.role == UserRole.TECHNICIAN


@pytest.mark.asyncio
async def test_inactive_user_cannot_login(
    client: AsyncClient, session_factory
) -> None:
    async with session_factory() as s:
        u = User(
            email="disabled@example.com",
            hashed_password=hash_password("Disabled1!"),
            role=UserRole.CUSTOMER,
            is_active=False,
        )
        s.add(u)
        await s.commit()
    resp = await client.post(
        f"{API}/auth/login",
        json={"email": "disabled@example.com", "password": "Disabled1!"},
    )
    assert resp.status_code == 403
