from pydantic import BaseModel
from typing import Literal, Optional


class CrowdRequest(BaseModel):
    location: str
    date: str          # ISO date string YYYY-MM-DD
    visitors_today: Optional[int] = None


class CrowdResponse(BaseModel):
    location: str
    date: str
    predicted_count: int
    confidence: float
    level: Literal["low", "medium", "high"]
    recommendation: str
