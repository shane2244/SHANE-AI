"""Regression tests for companion response branch coverage."""

import os
from pathlib import Path

import requests
from dotenv import load_dotenv


load_dotenv(Path("/app/frontend/.env"))
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API_BASE = f"{BASE_URL}/api"


def test_companion_default_path_returns_non_empty_response_and_invitation():
    payload = {"message": "Today I am reflecting quietly."}
    response = requests.post(f"{API_BASE}/companion", json=payload, timeout=15)
    assert response.status_code == 200

    data = response.json()
    assert data["response"].startswith("There is something important")
    assert data["invitation"].startswith("If this feeling had wisdom")


def test_companion_stuck_path_returns_specific_branch_copy():
    payload = {"message": "I feel stuck and lost."}
    response = requests.post(f"{API_BASE}/companion", json=payload, timeout=15)
    assert response.status_code == 200

    data = response.json()
    assert "certainty has gone quiet" in data["response"]
    assert "no longer want to abandon" in data["invitation"]


def test_companion_anxious_path_returns_specific_branch_copy():
    payload = {"message": "I am anxious and worried about tomorrow."}
    response = requests.post(f"{API_BASE}/companion", json=payload, timeout=15)
    assert response.status_code == 200

    data = response.json()
    assert "trying to protect you" in data["response"]
    assert "What feels true in this exact moment" in data["invitation"]
