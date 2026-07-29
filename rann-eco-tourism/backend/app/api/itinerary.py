"""
Eco Itinerary API — GPT-4 powered personalised eco-itinerary generation.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.itinerary import Itinerary
from app.schemas.itinerary import ItineraryRequest, ItineraryOut
from app.services.itinerary_service import generate_itinerary

router = APIRouter()


@router.post("", response_model=ItineraryOut)
async def create_itinerary(
    payload: ItineraryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await generate_itinerary(payload)

    record = Itinerary(
        user_id=current_user.id,
        title=result["title"],
        days=payload.days,
        eco_score=result["eco_score"],
        carbon_kg=result["carbon_kg"],
        activities=result["activities"],
        language=payload.language,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("", response_model=list[ItineraryOut])
def list_itineraries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Itinerary)
        .filter(Itinerary.user_id == current_user.id)
        .order_by(Itinerary.created_at.desc())
        .limit(20)
        .all()
    )
