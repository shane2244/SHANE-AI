"""CORS regression checks for app-layer localhost behavior versus preview ingress behavior."""

import os
from pathlib import Path

import requests
from dotenv import load_dotenv


load_dotenv(Path("/app/frontend/.env"))
PREVIEW_BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API_PATH = "/api/dashboard"
LOCAL_APP_URL = "http://localhost:8001"
ALLOWED_ORIGIN = PREVIEW_BASE_URL
DISALLOWED_ORIGIN = "https://evil.example"


# CORS app-layer checks (localhost)
def test_localhost_preflight_allows_configured_origin_exactly():
    response = requests.options(
        f"{LOCAL_APP_URL}{API_PATH}",
        headers={
            "Origin": ALLOWED_ORIGIN,
            "Access-Control-Request-Method": "GET",
        },
        timeout=20,
    )
    assert response.status_code in (200, 204)
    assert response.headers.get("access-control-allow-origin") == ALLOWED_ORIGIN
    assert response.headers.get("access-control-allow-origin") != "*"
    assert response.headers.get("access-control-allow-credentials") == "true"


# CORS app-layer checks (localhost)
def test_localhost_preflight_rejects_disallowed_origin():
    response = requests.options(
        f"{LOCAL_APP_URL}{API_PATH}",
        headers={
            "Origin": DISALLOWED_ORIGIN,
            "Access-Control-Request-Method": "GET",
        },
        timeout=20,
    )
    assert response.status_code == 400
    assert response.headers.get("access-control-allow-origin") is None


# CORS ingress behavior documentation checks (public preview)
def test_preview_preflight_allowed_origin_is_currently_wildcard():
    response = requests.options(
        f"{PREVIEW_BASE_URL}{API_PATH}",
        headers={
            "Origin": ALLOWED_ORIGIN,
            "Access-Control-Request-Method": "GET",
        },
        timeout=20,
    )
    assert response.status_code in (200, 204)
    assert response.headers.get("access-control-allow-origin") == "*"


# CORS ingress behavior documentation checks (public preview)
def test_preview_preflight_disallowed_origin_is_currently_wildcard():
    response = requests.options(
        f"{PREVIEW_BASE_URL}{API_PATH}",
        headers={
            "Origin": DISALLOWED_ORIGIN,
            "Access-Control-Request-Method": "GET",
        },
        timeout=20,
    )
    assert response.status_code in (200, 204)
    assert response.headers.get("access-control-allow-origin") == "*"
