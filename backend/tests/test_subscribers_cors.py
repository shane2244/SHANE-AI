"""Subscriber signup and CORS security regression tests."""

import os
from pathlib import Path

import requests
from dotenv import load_dotenv


load_dotenv(Path("/app/frontend/.env"))
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API_BASE = f"{BASE_URL}/api"
ALLOWED_ORIGIN = BASE_URL
DISALLOWED_ORIGIN = "https://evil.example"


def test_subscriber_create_and_duplicate_are_idempotent():
    email = "test_signal_idempotent@example.com"
    first = requests.post(
        f"{API_BASE}/subscribers",
        json={"email": email, "interest": "Everything"},
        timeout=20,
    )
    assert first.status_code == 200
    first_data = first.json()
    assert first_data["status"] == "subscribed"
    assert "signal" in first_data["message"].lower()

    second = requests.post(
        f"{API_BASE}/subscribers",
        json={"email": email, "interest": "Holistic practice"},
        timeout=20,
    )
    assert second.status_code == 200
    second_data = second.json()
    assert second_data["status"] == "subscribed"
    assert second_data["message"] == first_data["message"]


def test_subscriber_invalid_email_returns_422():
    response = requests.post(
        f"{API_BASE}/subscribers",
        json={"email": "bad-email", "interest": "Everything"},
        timeout=20,
    )
    assert response.status_code == 422
    assert "valid email" in response.text.lower()


def test_cors_preflight_allows_configured_origin_without_wildcard():
    response = requests.options(
        f"{API_BASE}/dashboard",
        headers={
            "Origin": ALLOWED_ORIGIN,
            "Access-Control-Request-Method": "GET",
        },
        timeout=20,
    )
    assert response.status_code in (200, 204)
    assert response.headers.get("access-control-allow-origin") == ALLOWED_ORIGIN
    assert response.headers.get("access-control-allow-credentials") == "true"
    assert response.headers.get("access-control-allow-origin") != "*"


def test_cors_preflight_blocks_disallowed_origin():
    response = requests.options(
        f"{API_BASE}/dashboard",
        headers={
            "Origin": DISALLOWED_ORIGIN,
            "Access-Control-Request-Method": "GET",
        },
        timeout=20,
    )
    assert response.status_code == 400
    assert response.headers.get("access-control-allow-origin") is None
