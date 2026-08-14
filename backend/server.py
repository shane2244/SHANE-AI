from datetime import datetime, timezone
from pathlib import Path
from typing import List
import logging
import os
import random
import uuid

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from starlette.middleware.cors import CORSMiddleware


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="SHANE-AI Reflection API")
api_router = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class MoodCreate(BaseModel):
    mood: str
    energy: int = Field(ge=1, le=5)
    note: str = Field(default="", max_length=280)


class MoodEntry(MoodCreate):
    id: str
    created_at: str


class JournalCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    content: str = Field(min_length=1, max_length=5000)
    prompt: str = Field(default="", max_length=300)


class JournalEntry(JournalCreate):
    id: str
    created_at: str


class CompanionRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1200)


class CompanionResponse(BaseModel):
    response: str
    invitation: str


class TarotCard(BaseModel):
    name: str
    archetype: str
    reflection: str
    question: str


TAROT_CARDS = [
    TarotCard(name="The Lantern", archetype="Inner knowing", reflection="A quieter truth may already be asking for your attention.", question="What becomes clear when you stop asking for permission?"),
    TarotCard(name="The Threshold", archetype="Transition", reflection="You are standing between what was familiar and what feels alive.", question="What are you ready to enter, even imperfectly?"),
    TarotCard(name="The Mirror", archetype="Projection", reflection="The qualities you notice in others can illuminate an unseen part of you.", question="What is this reaction revealing about your own needs?"),
    TarotCard(name="The Garden", archetype="Nurture", reflection="Growth responds to rhythm, patience, and the conditions around it.", question="What small condition would help you flourish this week?"),
    TarotCard(name="The Compass", archetype="Purpose", reflection="Direction often appears through the next honest choice, not the full map.", question="Which choice feels most aligned with who you are becoming?"),
    TarotCard(name="The Tide", archetype="Release", reflection="Some feelings move through you rather than defining you.", question="What can be felt fully without needing to be fixed?"),
]


@api_router.get("/")
async def root():
    return {"message": "SHANE-AI reflection space is ready"}


@api_router.get("/dashboard")
async def dashboard():
    mood_count = await db.moods.count_documents({})
    journal_count = await db.journals.count_documents({})
    return {
        "stage": 1,
        "stage_name": "Self-Realization",
        "mood_count": mood_count,
        "journal_count": journal_count,
        "weekly_rhythm": [2, 4, 3, 5, 4, 0, 0],
    }


@api_router.post("/moods", response_model=MoodEntry)
async def create_mood(payload: MoodCreate):
    entry = MoodEntry(id=str(uuid.uuid4()), created_at=now_iso(), **payload.model_dump())
    await db.moods.insert_one(entry.model_dump())
    return entry


@api_router.get("/moods", response_model=List[MoodEntry])
async def list_moods():
    return await db.moods.find({}, {"_id": 0}).sort("created_at", -1).to_list(30)


@api_router.post("/journals", response_model=JournalEntry)
async def create_journal(payload: JournalCreate):
    entry = JournalEntry(id=str(uuid.uuid4()), created_at=now_iso(), **payload.model_dump())
    await db.journals.insert_one(entry.model_dump())
    return entry


@api_router.get("/journals", response_model=List[JournalEntry])
async def list_journals():
    return await db.journals.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)


@api_router.get("/tarot/draw", response_model=List[TarotCard])
async def draw_tarot():
    return random.sample(TAROT_CARDS, 3)


@api_router.post("/companion", response_model=CompanionResponse)
async def companion(payload: CompanionRequest):
    message = payload.message.lower()
    response = "There is something important in the way you named that. Rather than rushing toward an answer, we can listen for what this experience is asking you to notice."
    invitation = "If this feeling had wisdom rather than a problem, what might it be pointing toward?"
    if any(word in message for word in ["stuck", "lost", "confused"]):
        response = "It sounds like certainty has gone quiet for a moment. That does not mean your direction is gone—only that it may need more space than pressure."
        invitation = "What is one thing you know you no longer want to abandon in yourself?"
    elif any(word in message for word in ["anxious", "afraid", "worried"]):
        response = "I hear how much your mind is trying to protect you by rehearsing what could happen. Let’s separate the signal from the noise, gently."
        invitation = "What feels true in this exact moment, before the next moment arrives?"
    return CompanionResponse(response=response, invitation=invitation)


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()