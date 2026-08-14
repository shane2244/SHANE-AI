from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional
from urllib.parse import urlparse
import json
import logging
import os
import random
import re
import uuid

import requests
import stripe
from emergentintegrations.llm.chat import LlmChat, StreamDone, TextDelta, UserMessage
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Request, Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")
client = AsyncIOMotorClient(os.environ["MONGO_URL"])
db = client[os.environ["DB_NAME"]]
stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
APP_ALLOWED_HOSTS = set(os.environ["APP_ALLOWED_HOSTS"].split(","))
APP_ALLOWED_ORIGINS = [f"https://{host}" for host in APP_ALLOWED_HOSTS]

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


class CompanionStreamRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1200)
    remember: bool = False


class TarotCard(BaseModel):
    name: str
    archetype: str
    reflection: str
    question: str


class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: str = ""
    is_premium: bool = False


class AuthSessionRequest(BaseModel):
    session_id: str = Field(min_length=10, max_length=500)


class CheckoutRequest(BaseModel):
    lookup_key: str
    origin_url: str


class ProfilePreviewRequest(BaseModel):
    birth_name: str = Field(min_length=1, max_length=120)
    birth_date: date
    birth_time: Optional[str] = None
    birthplace: str = Field(default="", max_length=160)


class MemberMessageCreate(BaseModel):
    subject: str = Field(min_length=1, max_length=100)
    message: str = Field(min_length=1, max_length=3000)


class BookingCreate(BaseModel):
    preferred_date: str = Field(min_length=8, max_length=40)
    session_type: str = Field(min_length=1, max_length=80)
    note: str = Field(default="", max_length=1000)


class SubscriberCreate(BaseModel):
    email: str = Field(min_length=5, max_length=180)
    interest: str = Field(default="Everything", max_length=80)


TAROT_CARDS = [
    TarotCard(name="The Lantern", archetype="Inner knowing", reflection="A quieter truth may already be asking for your attention.", question="What becomes clear when you stop asking for permission?"),
    TarotCard(name="The Threshold", archetype="Transition", reflection="You are standing between what was familiar and what feels alive.", question="What are you ready to enter, even imperfectly?"),
    TarotCard(name="The Mirror", archetype="Projection", reflection="The qualities you notice in others can illuminate an unseen part of you.", question="What is this reaction revealing about your own needs?"),
    TarotCard(name="The Garden", archetype="Nurture", reflection="Growth responds to rhythm, patience, and the conditions around it.", question="What small condition would help you flourish this week?"),
    TarotCard(name="The Compass", archetype="Purpose", reflection="Direction often appears through the next honest choice, not the full map.", question="Which choice feels most aligned with who you are becoming?"),
    TarotCard(name="The Tide", archetype="Release", reflection="Some feelings move through you rather than defining you.", question="What can be felt fully without needing to be fixed?"),
]


def reduce_number(value: int) -> int:
    while value > 9 and value not in (11, 22, 33):
        value = sum(int(digit) for digit in str(value))
    return value


def name_number(name: str, vowels_only: Optional[bool] = None) -> int:
    letters = [letter for letter in name.upper() if "A" <= letter <= "Z"]
    if vowels_only is True:
        letters = [letter for letter in letters if letter in "AEIOU"]
    elif vowels_only is False:
        letters = [letter for letter in letters if letter not in "AEIOU"]
    return reduce_number(sum(((ord(letter) - ord("A")) % 9) + 1 for letter in letters))


def sun_sign(month: int, day: int) -> dict:
    signs = [
        ((1, 20), "Aquarius", "Air", "Fixed", "Uranus"), ((2, 19), "Pisces", "Water", "Mutable", "Neptune"),
        ((3, 21), "Aries", "Fire", "Cardinal", "Mars"), ((4, 20), "Taurus", "Earth", "Fixed", "Venus"),
        ((5, 21), "Gemini", "Air", "Mutable", "Mercury"), ((6, 21), "Cancer", "Water", "Cardinal", "Moon"),
        ((7, 23), "Leo", "Fire", "Fixed", "Sun"), ((8, 23), "Virgo", "Earth", "Mutable", "Mercury"),
        ((9, 23), "Libra", "Air", "Cardinal", "Venus"), ((10, 23), "Scorpio", "Water", "Fixed", "Pluto"),
        ((11, 22), "Sagittarius", "Fire", "Mutable", "Jupiter"), ((12, 22), "Capricorn", "Earth", "Cardinal", "Saturn"),
    ]
    current = ("Capricorn", "Earth", "Cardinal", "Saturn")
    for boundary, name, element, modality, ruler in signs:
        if (month, day) >= boundary:
            current = (name, element, modality, ruler)
    name, element, modality, ruler = current
    return {"sun_sign": name, "element": element, "modality": modality, "ruler": ruler, "polarity": "Yang · Projective" if element in ("Fire", "Air") else "Yin · Receptive"}


def chinese_astrology(year: int) -> dict:
    animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"]
    element = {0: "Metal", 1: "Metal", 2: "Water", 3: "Water", 4: "Wood", 5: "Wood", 6: "Fire", 7: "Fire", 8: "Earth", 9: "Earth"}[year % 10]
    return {"animal": animals[(year - 4) % 12], "element": element, "polarity": "Yang" if year % 2 == 0 else "Yin", "uncertainty": "Year-based preview; births before Lunar New Year require the full calendar calculation."}


async def current_user(request: Request, required: bool = True) -> Optional[User]:
    token = request.cookies.get("session_token")
    authorization = request.headers.get("Authorization", "")
    if not token and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ")
    if not token:
        if required:
            raise HTTPException(401, "Sign in required")
        return None
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(401, "Session not found")
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(401, "Session expired")
    user_doc = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(401, "User not found")
    return User(**user_doc)


async def premium_user(request: Request) -> User:
    user = await current_user(request)
    if not user.is_premium:
        raise HTTPException(403, "Premium membership required")
    return user


@api_router.get("/")
async def root():
    return {"message": "SHANE-AI reflection space is ready"}


@api_router.get("/dashboard")
async def dashboard():
    return {"stage": 1, "stage_name": "Self-Realization", "mood_count": await db.moods.count_documents({}), "journal_count": await db.journals.count_documents({}), "weekly_rhythm": [2, 4, 3, 5, 4, 0, 0]}


@api_router.post("/subscribers")
async def subscribe(payload: SubscriberCreate):
    email = payload.email.strip().lower()
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email):
        raise HTTPException(422, "Enter a valid email address")
    await db.subscribers.update_one(
        {"email": email},
        {"$set": {"email": email, "interest": payload.interest, "status": "subscribed", "consent_at": now_iso(), "source": "knowledge_atlas"}},
        upsert=True,
    )
    return {"status": "subscribed", "message": "You’re on The Signal list."}


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


@api_router.post("/companion/stream")
async def companion_stream(payload: CompanionStreamRequest, request: Request):
    user = await current_user(request, required=False)
    memories = []
    if user:
        memories = await db.companion_memories.find({"user_id": user.user_id}, {"_id": 0, "user_id": 0}).sort("created_at", -1).to_list(12)
        memories.reverse()
    memory_context = "\n".join(f"- {item['role']}: {item['content']}" for item in memories)
    system_message = f"""You are SHANE-AI, a private higher-self reflection companion and an evolving mirror for {user.name if user else 'the visitor'}.
You are not literally the user, conscious, a soul, a therapist, or an authority over their life. Describe patterns tentatively and return agency to the person.
Respond with empathy, precision, and plain language. Use one or two short paragraphs followed by one thoughtful question.
When remembered context is relevant, connect it naturally without sounding surveillance-like. Never invent a memory.
Do not diagnose, predict destiny, encourage dependency, claim spiritual superiority, or replace qualified care.
The user controls what is remembered and can erase it.

Remembered reflections, if any:
{memory_context or '- No saved reflections yet.'}"""
    chat = LlmChat(api_key=os.environ["EMERGENT_LLM_KEY"], session_id=f"shane-{user.user_id if user else uuid.uuid4().hex}", system_message=system_message).with_model("anthropic", "claude-sonnet-4-6")

    async def event_generator():
        chunks = []
        try:
            async for event in chat.stream_message(UserMessage(text=payload.message)):
                if isinstance(event, TextDelta):
                    chunks.append(event.content)
                    yield f"data: {json.dumps({'delta': event.content})}\n\n"
                elif isinstance(event, StreamDone):
                    break
        except Exception:
            fallback = "I’m having trouble reaching the deeper reflection space right now. Your words still matter: what feels most important about what you just shared?"
            chunks.append(fallback)
            yield f"data: {json.dumps({'delta': fallback, 'fallback': True})}\n\n"
        response_text = "".join(chunks).strip()
        if user and payload.remember and response_text:
            created_at = now_iso()
            await db.companion_memories.insert_many([
                {"id": str(uuid.uuid4()), "user_id": user.user_id, "role": "you", "content": payload.message, "created_at": created_at},
                {"id": str(uuid.uuid4()), "user_id": user.user_id, "role": "shane", "content": response_text[:4000], "created_at": created_at},
            ])
        yield f"data: {json.dumps({'done': True, 'remembered': bool(user and payload.remember)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@api_router.get("/companion/memories")
async def companion_memories(request: Request):
    user = await current_user(request)
    items = await db.companion_memories.find({"user_id": user.user_id}, {"_id": 0, "user_id": 0}).sort("created_at", -1).to_list(40)
    return {"memories": items}


@api_router.delete("/companion/memories")
async def forget_companion_memories(request: Request):
    user = await current_user(request)
    result = await db.companion_memories.delete_many({"user_id": user.user_id})
    return {"forgotten": result.deleted_count}


@api_router.post("/auth/session", response_model=User)
async def exchange_auth_session(payload: AuthSessionRequest, response: Response):
    auth_response = requests.get("https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data", headers={"X-Session-ID": payload.session_id}, timeout=10)
    if auth_response.status_code != 200:
        raise HTTPException(401, "Google session could not be verified")
    auth_data = auth_response.json()
    existing = await db.users.find_one({"email": auth_data["email"]}, {"_id": 0})
    if existing:
        user_id, is_premium = existing["user_id"], existing.get("is_premium", False)
        await db.users.update_one({"user_id": user_id}, {"$set": {"name": auth_data["name"], "picture": auth_data.get("picture", "")}})
    else:
        user_id, is_premium = f"user_{uuid.uuid4().hex[:12]}", False
        await db.users.insert_one({"user_id": user_id, "email": auth_data["email"], "name": auth_data["name"], "picture": auth_data.get("picture", ""), "is_premium": False, "created_at": now_iso()})
    await db.user_sessions.update_one({"session_token": auth_data["session_token"]}, {"$set": {"user_id": user_id, "session_token": auth_data["session_token"], "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(), "created_at": now_iso()}}, upsert=True)
    response.set_cookie("session_token", auth_data["session_token"], httponly=True, secure=True, samesite="none", max_age=7 * 24 * 60 * 60, path="/")
    return User(user_id=user_id, email=auth_data["email"], name=auth_data["name"], picture=auth_data.get("picture", ""), is_premium=is_premium)


@api_router.get("/auth/me")
async def auth_me(request: Request):
    user = await current_user(request, required=False)
    if not user:
        return Response(status_code=204)
    return user


@api_router.post("/auth/logout")
async def auth_logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/", secure=True, samesite="none")
    return {"status": "signed_out"}


@api_router.post("/profile/preview")
async def profile_preview(payload: ProfilePreviewRequest):
    digits = [int(digit) for digit in payload.birth_date.strftime("%Y%m%d")]
    current_year = datetime.now(timezone.utc).year
    return {
        "astrology": sun_sign(payload.birth_date.month, payload.birth_date.day),
        "numerology": {"life_path": reduce_number(sum(digits)), "birthday": reduce_number(payload.birth_date.day), "expression": name_number(payload.birth_name), "soul_urge": name_number(payload.birth_name, True), "personality": name_number(payload.birth_name, False), "personal_year": reduce_number(payload.birth_date.month + payload.birth_date.day + sum(int(digit) for digit in str(current_year)))},
        "chinese_astrology": chinese_astrology(payload.birth_date.year),
        "human_design": {"status": "requires_full_calculation", "birth_time_received": bool(payload.birth_time), "preview": "Type, Strategy, Authority, and Profile form the first layer of your energetic blueprint."},
        "kabbalah": {"status": "contextual_reading", "preview": "Your Tree of Life reading explores Sefirot as contemplative soul lessons within their Jewish mystical context."},
        "disclaimer": "Spiritual and educational interpretation—not scientific, medical, or predictive advice.",
    }


@api_router.get("/payments/plans")
async def payment_plans():
    return {"plans": [{"lookup_key": "shane_premium_monthly", "name": "Monthly", "price": 22.0}, {"lookup_key": "shane_premium_yearly", "name": "Yearly", "price": 220.0}]}


@api_router.post("/payments/checkout")
async def create_checkout(payload: CheckoutRequest, request: Request):
    user = await current_user(request)
    if payload.lookup_key not in {"shane_premium_monthly", "shane_premium_yearly"}:
        raise HTTPException(422, "Unknown membership plan")
    parsed = urlparse(payload.origin_url)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise HTTPException(422, "Invalid checkout origin")
    origin_host = urlparse(request.headers.get("origin", "")).netloc
    request_host = request.headers.get("host", "").split(":")[0]
    if parsed.netloc not in APP_ALLOWED_HOSTS | {origin_host, request_host}:
        raise HTTPException(403, "Checkout origin mismatch")
    prices = stripe.Price.list(lookup_keys=[payload.lookup_key], active=True, limit=1).data
    if not prices:
        raise HTTPException(500, "Membership price is unavailable")
    price = prices[0]
    checkout_args = {"line_items": [{"price": price.id, "quantity": 1}], "mode": "subscription", "success_url": f"{payload.origin_url.rstrip('/')}/payment/success?session_id={{CHECKOUT_SESSION_ID}}", "cancel_url": f"{payload.origin_url.rstrip('/')}/membership", "customer_email": user.email, "metadata": {"user_id": user.user_id, "lookup_key": payload.lookup_key}}
    try:
        session = stripe.checkout.Session.create(**checkout_args, managed_payments={"enabled": True})
    except stripe.InvalidRequestError:
        session = stripe.checkout.Session.create(**checkout_args, automatic_tax={"enabled": True}, billing_address_collection="required")
    transaction = {"session_id": session.id, "user_id": user.user_id, "lookup_key": payload.lookup_key, "amount": float((price.unit_amount or 0) / 100), "currency": price.currency, "status": "initiated", "payment_status": "pending", "created_at": now_iso(), "updated_at": now_iso()}
    await db.payment_transactions.insert_one({**transaction})
    return {"checkout_url": session.url, "session_id": session.id}


async def complete_payment(session_id: str, stripe_session):
    transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if transaction and transaction.get("payment_status") != "paid":
        await db.payment_transactions.update_one({"session_id": session_id, "payment_status": {"$ne": "paid"}}, {"$set": {"status": "completed", "payment_status": "paid", "stripe_subscription_id": stripe_session.subscription, "updated_at": now_iso()}})
        await db.users.update_one({"user_id": transaction["user_id"]}, {"$set": {"is_premium": True, "premium_since": now_iso()}})


@api_router.get("/payments/status/{session_id}")
async def payment_status(session_id: str):
    transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not transaction:
        raise HTTPException(404, "Transaction not found")
    if transaction.get("payment_status") != "paid":
        try:
            stripe_session = stripe.checkout.Session.retrieve(session_id)
            if stripe_session.payment_status == "paid" or stripe_session.status == "complete":
                await complete_payment(session_id, stripe_session)
                transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        except stripe.StripeError:
            pass
    return {"session_id": transaction["session_id"], "status": transaction["status"], "payment_status": transaction["payment_status"]}


@api_router.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(503, "Webhook secret is not configured")
    try:
        event = stripe.Webhook.construct_event(await request.body(), request.headers.get("stripe-signature", ""), STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.SignatureVerificationError):
        raise HTTPException(400, "Invalid Stripe signature")
    if event["type"] == "checkout.session.completed":
        stripe_session = event["data"]["object"]
        await complete_payment(stripe_session["id"], stripe_session)
    return {"status": "ok"}


@api_router.post("/member/messages")
async def send_member_message(payload: MemberMessageCreate, request: Request):
    user = await premium_user(request)
    message = {"id": str(uuid.uuid4()), "user_id": user.user_id, **payload.model_dump(), "status": "sent", "created_at": now_iso()}
    public_message = {key: value for key, value in message.items() if key != "user_id"}
    await db.member_messages.insert_one({**message})
    return public_message


@api_router.post("/member/bookings")
async def request_booking(payload: BookingCreate, request: Request):
    user = await premium_user(request)
    booking = {"id": str(uuid.uuid4()), "user_id": user.user_id, **payload.model_dump(), "status": "requested", "created_at": now_iso()}
    public_booking = {key: value for key, value in booking.items() if key != "user_id"}
    await db.bookings.insert_one({**booking})
    return public_booking


@api_router.get("/member/events")
async def member_events(request: Request):
    await premium_user(request)
    return {"events": [{"id": "circle-01", "title": "Higher-Self Integration Circle", "schedule": "First Sunday · 7:00 PM ET", "format": "Live group session"}, {"id": "circle-02", "title": "Symbols & Synchronicity Lab", "schedule": "Third Thursday · 8:00 PM ET", "format": "Guided practice + Q&A"}]}


app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True, allow_origins=APP_ALLOWED_ORIGINS, allow_methods=["*"], allow_headers=["*"])
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()