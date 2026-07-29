from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class Activity(BaseModel):
    day: int
    time: str
    title: str
    location: str
    description: str
    eco_tip: str
    duration_hours: float
    carbon_kg: float


class ItineraryRequest(BaseModel):
    days: int
    interests: List[str]        # e.g. ["wildlife", "photography", "cultural"]
    group_size: int = 2
    language: str = "en"


class ItineraryOut(BaseModel):
    id: int
    title: str
    days: int
    eco_score: float
    carbon_kg: float
    activities: List[Activity]
    created_at: datetime

    model_config = {"from_attributes": True}
