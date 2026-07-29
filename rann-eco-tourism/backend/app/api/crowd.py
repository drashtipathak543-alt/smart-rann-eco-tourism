"""
Crowd Prediction API — uses a trained RandomForest model to forecast
visitor density at Rann locations.
"""
from fastapi import APIRouter
from app.schemas.crowd import CrowdRequest, CrowdResponse
from app.services.crowd_service import predict_crowd

router = APIRouter()


@router.post("/predict", response_model=CrowdResponse)
def predict(payload: CrowdRequest):
    return predict_crowd(payload)


@router.get("/locations")
def get_locations():
    """Return the list of Rann locations tracked for crowd prediction."""
    return {
        "locations": [
            "White Rann, Dhordo",
            "Kalo Dungar (Black Hill)",
            "Flamingo City",
            "Chhari Dhand Wetland",
            "Rann Utsav Camp",
            "Indian Wild Ass Sanctuary",
            "Mandvi Beach",
            "Vijay Vilas Palace",
        ]
    }
