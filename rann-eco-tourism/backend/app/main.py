from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.init_db import init_db
from app.api import auth, chatbot, crowd, itinerary, weather, analytics, locations

app = FastAPI(
    title="Smart Rann Eco Tourism Planner API",
    version="1.0.0",
    description="Backend API for the Rann Eco Tourism Planner platform",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    init_db()


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,       prefix="/auth",      tags=["auth"])
app.include_router(chatbot.router,    prefix="/chatbot",   tags=["chatbot"])
app.include_router(crowd.router,      prefix="/crowd",     tags=["crowd"])
app.include_router(itinerary.router,  prefix="/itinerary", tags=["itinerary"])
app.include_router(weather.router,    prefix="/weather",   tags=["weather"])
app.include_router(analytics.router,  prefix="/analytics", tags=["analytics"])
app.include_router(locations.router,  prefix="/locations", tags=["locations"])


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
