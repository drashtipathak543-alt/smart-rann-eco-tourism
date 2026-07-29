from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func

from app.core.database import Base


class VisitorAnalytics(Base):
    __tablename__ = "visitor_analytics"

    id            = Column(Integer, primary_key=True, index=True)
    date          = Column(DateTime(timezone=True), nullable=False, index=True)
    location      = Column(String(120), nullable=False)
    visitor_count = Column(Integer, default=0)
    eco_impact    = Column(Float, default=0.0)    # composite eco-impact score
    avg_stay_days = Column(Float, default=1.0)
    revenue_inr   = Column(Float, default=0.0)
    recorded_at   = Column(DateTime(timezone=True), server_default=func.now())


class CrowdPrediction(Base):
    __tablename__ = "crowd_predictions"

    id              = Column(Integer, primary_key=True, index=True)
    location        = Column(String(120), nullable=False)
    predicted_date  = Column(DateTime(timezone=True), nullable=False)
    predicted_count = Column(Integer)
    confidence      = Column(Float)
    level           = Column(String(10))   # low / medium / high
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
