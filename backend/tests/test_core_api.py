"""Core API regression tests for dashboard, moods, journals, tarot, and companion."""

import os
from pathlib import Path

import pytest
import requests
from dotenv import load_dotenv


load_dotenv(Path("/app/frontend/.env"))
BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
API_BASE = f"{BASE_URL}/api"


@pytest.fixture
def api_client():
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


def test_dashboard_returns_metrics(api_client):
    response = api_client.get(f"{API_BASE}/dashboard", timeout=15)
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data.get("mood_count"), int)
    assert isinstance(data.get("journal_count"), int)
    assert isinstance(data.get("weekly_rhythm"), list)


def test_mood_create_and_list_persistence(api_client):
    payload = {"mood": "Open", "energy": 3, "note": "TEST_mood_checkin"}
    create_response = api_client.post(f"{API_BASE}/moods", json=payload, timeout=15)
    assert create_response.status_code == 200

    created = create_response.json()
    assert isinstance(created.get("id"), str)
    assert created["mood"] == payload["mood"]
    assert created["note"] == payload["note"]

    list_response = api_client.get(f"{API_BASE}/moods", timeout=15)
    assert list_response.status_code == 200

    moods = list_response.json()
    found = next((item for item in moods if item.get("id") == created["id"]), None)
    assert found is not None
    assert found["note"] == payload["note"]


def test_journal_create_and_list_persistence(api_client):
    payload = {
        "title": "TEST_journal_title",
        "content": "TEST_journal_content",
        "prompt": "TEST_journal_prompt",
    }
    create_response = api_client.post(f"{API_BASE}/journals", json=payload, timeout=15)
    assert create_response.status_code == 200

    created = create_response.json()
    assert isinstance(created.get("id"), str)
    assert created["title"] == payload["title"]
    assert created["content"] == payload["content"]

    list_response = api_client.get(f"{API_BASE}/journals", timeout=15)
    assert list_response.status_code == 200

    journals = list_response.json()
    found = next((item for item in journals if item.get("id") == created["id"]), None)
    assert found is not None
    assert found["title"] == payload["title"]


def test_tarot_draw_returns_three_cards(api_client):
    response = api_client.get(f"{API_BASE}/tarot/draw", timeout=15)
    assert response.status_code == 200

    cards = response.json()
    assert len(cards) == 3
    for card in cards:
        assert isinstance(card.get("name"), str)
        assert isinstance(card.get("archetype"), str)
        assert isinstance(card.get("reflection"), str)
        assert isinstance(card.get("question"), str)


def test_companion_returns_guided_response(api_client):
    payload = {"message": "I feel anxious and a little stuck today"}
    response = api_client.post(f"{API_BASE}/companion", json=payload, timeout=15)
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data.get("response"), str)
    assert isinstance(data.get("invitation"), str)
    assert len(data["response"].strip()) > 0
    assert len(data["invitation"].strip()) > 0
