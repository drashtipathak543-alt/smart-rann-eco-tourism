from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(120), nullable=False)
    email      = Column(String(255), unique=True, index=True, nullable=False)
    hashed_pw  = Column(String(255), nullable=False)
    language   = Column(String(10), default="en")
    is_active  = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    bookings   = relationship("Booking",   back_populates="user")
    itineraries = relationship("Itinerary", back_populates="user")
