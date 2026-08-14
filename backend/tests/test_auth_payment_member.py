"""Auth, profile preview, payments, and premium-member endpoint regression tests."""

import os
from pathlib import Path

import pytest
import requests
from dotenv import load_dotenv


load_dotenv(Path("/app/frontend/.env"))
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API_BASE = f"{BASE_URL}/api"
FREE_TOKEN = "test_session_shane_free_2026"
PREMIUM_TOKEN = "test_session_shane_premium_2026"


@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


def test_auth_me_rejects_missing_session(api_client):
    response = api_client.get(f"{API_BASE}/auth/me", timeout=20)
    assert response.status_code == 401
    assert "required" in response.text.lower() or "session" in response.text.lower()


def test_auth_me_accepts_seeded_free_bearer_session(api_client):
    response = api_client.get(
        f"{API_BASE}/auth/me",
        headers={"Authorization": f"Bearer {FREE_TOKEN}"},
        timeout=20,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test.user.shane@example.com"
    assert data["is_premium"] is False


def test_auth_me_accepts_seeded_premium_bearer_session(api_client):
    response = api_client.get(
        f"{API_BASE}/auth/me",
        headers={"Authorization": f"Bearer {PREMIUM_TOKEN}"},
        timeout=20,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test.premium.shane@example.com"
    assert data["is_premium"] is True


def test_profile_preview_known_date_and_numerology_values(api_client):
    payload = {
        "birth_name": "JOHN DOE",
        "birth_date": "1990-01-15",
        "birth_time": "11:30",
        "birthplace": "Pittsburgh",
    }
    response = api_client.post(f"{API_BASE}/profile/preview", json=payload, timeout=20)
    assert response.status_code == 200
    data = response.json()

    assert data["astrology"]["sun_sign"] == "Capricorn"
    assert data["astrology"]["element"] == "Earth"
    assert data["astrology"]["modality"] == "Cardinal"

    assert data["numerology"]["life_path"] == 8
    assert data["numerology"]["expression"] == 8
    assert data["numerology"]["soul_urge"] == 8
    assert data["numerology"]["personality"] == 9
    assert data["numerology"]["birthday"] == 6
    assert isinstance(data["numerology"]["personal_year"], int)

    assert data["chinese_astrology"]["animal"] == "Horse"
    assert data["chinese_astrology"]["element"] == "Metal"
    assert data["chinese_astrology"]["polarity"] == "Yang"
    assert "lunar new year" in data["chinese_astrology"]["uncertainty"].lower()


def test_human_design_and_kabbalah_are_transparent_not_fake(api_client):
    payload = {
        "birth_name": "JANE DOE",
        "birth_date": "1988-03-20",
        "birth_time": "08:15",
        "birthplace": "Seattle",
    }
    response = api_client.post(f"{API_BASE}/profile/preview", json=payload, timeout=20)
    assert response.status_code == 200
    data = response.json()
    assert data["human_design"]["status"] == "requires_full_calculation"
    assert "first layer" in data["human_design"]["preview"].lower()
    assert data["kabbalah"]["status"] == "contextual_reading"
    assert "context" in data["kabbalah"]["preview"].lower() or "jewish" in data["kabbalah"]["preview"].lower()


def test_payment_plans_return_expected_prices(api_client):
    response = api_client.get(f"{API_BASE}/payments/plans", timeout=20)
    assert response.status_code == 200
    plans = {item["lookup_key"]: item["price"] for item in response.json()["plans"]}
    assert plans["shane_premium_monthly"] == 22.0
    assert plans["shane_premium_yearly"] == 220.0


def test_checkout_requires_authenticated_user(api_client):
    payload = {
        "lookup_key": "shane_premium_monthly",
        "origin_url": BASE_URL,
    }
    response = api_client.post(f"{API_BASE}/payments/checkout", json=payload, timeout=25)
    assert response.status_code == 401


def test_checkout_rejects_unknown_lookup_key(api_client):
    payload = {
        "lookup_key": "unknown_plan",
        "origin_url": BASE_URL,
    }
    response = api_client.post(
        f"{API_BASE}/payments/checkout",
        json=payload,
        headers={"Authorization": f"Bearer {FREE_TOKEN}"},
        timeout=25,
    )
    assert response.status_code == 422
    assert "unknown" in response.text.lower()


def test_checkout_rejects_malicious_origin_url(api_client):
    payload = {
        "lookup_key": "shane_premium_monthly",
        "origin_url": "https://evil.example",
    }
    response = api_client.post(
        f"{API_BASE}/payments/checkout",
        json=payload,
        headers={"Authorization": f"Bearer {FREE_TOKEN}"},
        timeout=25,
    )
    assert response.status_code == 403
    assert "origin" in response.text.lower()


def test_checkout_creates_real_test_mode_session_for_allowed_origin(api_client):
    payload = {
        "lookup_key": "shane_premium_monthly",
        "origin_url": BASE_URL,
    }
    response = api_client.post(
        f"{API_BASE}/payments/checkout",
        json=payload,
        headers={"Authorization": f"Bearer {FREE_TOKEN}"},
        timeout=30,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"].startswith("cs_test_")
    assert "checkout.stripe.com" in data["checkout_url"]

    # Transaction should already be persisted before redirect flow completes
    status = api_client.get(f"{API_BASE}/payments/status/{data['session_id']}", timeout=30)
    assert status.status_code == 200
    status_data = status.json()
    assert status_data["session_id"] == data["session_id"]
    assert status_data["payment_status"] in {"pending", "paid"}


def test_payment_status_unknown_session_is_safe(api_client):
    response = api_client.get(f"{API_BASE}/payments/status/not_a_real_session", timeout=20)
    assert response.status_code == 404
    assert "not found" in response.text.lower()


def test_free_member_cannot_access_premium_member_endpoints(api_client):
    headers = {"Authorization": f"Bearer {FREE_TOKEN}"}
    events = api_client.get(f"{API_BASE}/member/events", headers=headers, timeout=20)
    message = api_client.post(
        f"{API_BASE}/member/messages",
        headers=headers,
        json={"subject": "TEST_free_subject", "message": "TEST_free_message"},
        timeout=20,
    )
    booking = api_client.post(
        f"{API_BASE}/member/bookings",
        headers=headers,
        json={"preferred_date": "2026-02-20T14:30", "session_type": "TEST_session", "note": "TEST_note"},
        timeout=20,
    )
    assert events.status_code == 403
    assert message.status_code == 403
    assert booking.status_code == 403


def test_premium_member_can_access_events_send_message_and_booking(api_client):
    headers = {"Authorization": f"Bearer {PREMIUM_TOKEN}"}

    events = api_client.get(f"{API_BASE}/member/events", headers=headers, timeout=20)
    assert events.status_code == 200
    events_data = events.json()["events"]
    assert len(events_data) >= 1
    assert isinstance(events_data[0]["title"], str)

    message_payload = {
        "subject": "TEST_premium_subject",
        "message": "TEST_premium_private_message",
    }
    sent = api_client.post(f"{API_BASE}/member/messages", headers=headers, json=message_payload, timeout=20)
    assert sent.status_code == 200
    sent_data = sent.json()
    assert sent_data["subject"] == message_payload["subject"]
    assert sent_data["status"] == "sent"

    booking_payload = {
        "preferred_date": "2026-03-01T16:00",
        "session_type": "TEST_private_higher_self_session",
        "note": "TEST_booking_context",
    }
    booked = api_client.post(f"{API_BASE}/member/bookings", headers=headers, json=booking_payload, timeout=20)
    assert booked.status_code == 200
    booked_data = booked.json()
    assert booked_data["session_type"] == booking_payload["session_type"]
    assert booked_data["status"] == "requested"
