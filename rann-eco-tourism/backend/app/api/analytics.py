"""
Analytics API — visitor statistics, eco-impact metrics, and heatmap data.
"""
from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.analytics import VisitorAnalytics, CrowdPrediction
from app.schemas.analytics import AnalyticsOut, AnalyticsSummary, DailyVisitors

router = APIRouter()


@router.get("", response_model=AnalyticsOut)
def get_analytics(
    days: int = Query(30, ge=7, le=365),
    db: Session = Depends(get_db),
):
    since = datetime.utcnow() - timedelta(days=days)

    rows: List[VisitorAnalytics] = (
        db.query(VisitorAnalytics)
        .filter(VisitorAnalytics.date >= since)
        .order_by(VisitorAnalytics.date.asc())
        .all()
    )

    total_visitors = sum(r.visitor_count for r in rows) or 0
    avg_eco = (sum(r.eco_impact for r in rows) / len(rows)) if rows else 0.0
    avg_stay = (sum(r.avg_stay_days for r in rows) / len(rows)) if rows else 0.0
    revenue = sum(r.revenue_inr for r in rows)

    # Top location by visitor count
    loc_counts: dict = {}
    for r in rows:
        loc_counts[r.location] = loc_counts.get(r.location, 0) + r.visitor_count
    top_location = max(loc_counts, key=loc_counts.get) if loc_counts else "White Rann, Dhordo"

    daily = [
        DailyVisitors(date=r.date.strftime("%Y-%m-%d"), count=r.visitor_count, location=r.location)
        for r in rows
    ]

    # Crowd heatmap from latest predictions
    predictions = db.query(CrowdPrediction).order_by(CrowdPrediction.created_at.desc()).limit(50).all()
    heatmap = {p.location: p.level for p in predictions}

    return AnalyticsOut(
        summary=AnalyticsSummary(
            total_visitors_ytd=total_visitors,
            avg_eco_score=round(avg_eco, 2),
            top_location=top_location,
            avg_stay_days=round(avg_stay, 2),
            revenue_ytd_inr=round(revenue, 2),
        ),
        daily_visitors=daily,
        crowd_heatmap=heatmap,
    )


@router.post("/seed")
def seed_demo_data(db: Session = Depends(get_db)):
    """Seed demo analytics data for development."""
    import random, math
    locations = [
        "White Rann, Dhordo", "Kalo Dungar (Black Hill)", "Flamingo City",
        "Rann Utsav Camp", "Indian Wild Ass Sanctuary",
    ]
    base = datetime.utcnow() - timedelta(days=90)
    entries = []
    for i in range(90):
        for loc in locations:
            # Seasonal sinusoidal pattern — peak in Nov-Jan (Rann Utsav)
            seasonal = 1 + 0.8 * math.sin(math.pi * (i / 90))
            count = int(random.uniform(150, 600) * seasonal)
            entries.append(
                VisitorAnalytics(
                    date=base + timedelta(days=i),
                    location=loc,
                    visitor_count=count,
                    eco_impact=round(random.uniform(6.0, 9.5), 2),
                    avg_stay_days=round(random.uniform(1.5, 4.0), 1),
                    revenue_inr=count * random.uniform(800, 2200),
                )
            )
    db.bulk_save_objects(entries)
    db.commit()
    return {"seeded": len(entries)}
