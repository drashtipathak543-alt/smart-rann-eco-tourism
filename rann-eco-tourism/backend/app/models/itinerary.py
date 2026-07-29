from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Itinerary(Base):
    __tablename__ = "itineraries"

    id             = Column(Integer, primary_key=True, index=True)
    user_id        = Column(Integer, ForeignKey("users.id"), nullable=False)
    title          = Column(String(200), nullable=False)
    days           = Column(Integer, nullable=False)
    eco_score      = Column(Float, nullable=True)
    carbon_kg      = Column(Float, nullable=True)
    activities     = Column(JSON, nullable=True)   # list of activity dicts
    language       = Column(String(10), default="en")
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="itineraries")
