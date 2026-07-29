from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    location     = Column(String(120), nullable=False)
    visit_date   = Column(DateTime(timezone=True), nullable=False)
    visitors     = Column(Integer, default=1)
    status       = Column(String(20), default="pending")   # pending / confirmed / cancelled
    eco_score    = Column(Float, nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="bookings")
