from pydantic import BaseModel
from typing import List
from datetime import datetime


class AnalyticsSummary(BaseModel):
    total_visitors_ytd: int
    avg_eco_score: float
    top_location: str
    avg_stay_days: float
    revenue_ytd_inr: float


class DailyVisitors(BaseModel):
    date: str
    count: int
    location: str


class AnalyticsOut(BaseModel):
    summary: AnalyticsSummary
    daily_visitors: List[DailyVisitors]
    crowd_heatmap: dict       # location -> predicted level
