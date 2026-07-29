"""
Locations API — static POI data for Google Maps integration.
"""
from fastapi import APIRouter

router = APIRouter()

LOCATIONS = [
    {
        "id": 1,
        "name": "White Rann, Dhordo",
        "type": "natural",
        "lat": 23.622,
        "lon": 69.930,
        "description": "Iconic salt desert spanning 7,500 sq km; best visited Oct–Mar.",
        "eco_rating": 9.2,
        "best_months": ["October", "November", "December", "January", "February"],
        "activities": ["Photography", "Sunset viewing", "Camel safari", "Cultural shows"],
    },
    {
        "id": 2,
        "name": "Kalo Dungar (Black Hill)",
        "type": "natural",
        "lat": 23.740,
        "lon": 69.560,
        "description": "Highest point in Kutch offering panoramic desert views.",
        "eco_rating": 8.7,
        "best_months": ["October", "November", "December", "January"],
        "activities": ["Trekking", "Birdwatching", "Panoramic views"],
    },
    {
        "id": 3,
        "name": "Flamingo City",
        "type": "wildlife",
        "lat": 23.435,
        "lon": 68.981,
        "description": "Seasonal flamingo nesting site — one of Asia's largest.",
        "eco_rating": 9.5,
        "best_months": ["February", "March", "April"],
        "activities": ["Birdwatching", "Wildlife photography", "Boat safari"],
    },
    {
        "id": 4,
        "name": "Chhari Dhand Wetland",
        "type": "wildlife",
        "lat": 23.530,
        "lon": 69.780,
        "description": "Freshwater lake attracting over 200 bird species.",
        "eco_rating": 9.0,
        "best_months": ["November", "December", "January", "February"],
        "activities": ["Birdwatching", "Photography", "Nature walks"],
    },
    {
        "id": 5,
        "name": "Rann Utsav Camp",
        "type": "cultural",
        "lat": 23.618,
        "lon": 69.925,
        "description": "Festival camp celebrating Kutchi crafts, music, and cuisine.",
        "eco_rating": 7.8,
        "best_months": ["November", "December", "January", "February"],
        "activities": ["Cultural performances", "Handicraft shopping", "Local cuisine"],
    },
    {
        "id": 6,
        "name": "Indian Wild Ass Sanctuary",
        "type": "wildlife",
        "lat": 23.666,
        "lon": 71.185,
        "description": "Last refuge of the Indian Wild Ass (Ghudkhur) in the world.",
        "eco_rating": 9.8,
        "best_months": ["October", "November", "December", "January", "February", "March"],
        "activities": ["Safari", "Wildlife photography", "Research visits"],
    },
    {
        "id": 7,
        "name": "Mandvi Beach",
        "type": "coastal",
        "lat": 22.830,
        "lon": 69.351,
        "description": "Pristine beach with traditional dhow ship-building yard.",
        "eco_rating": 8.1,
        "best_months": ["October", "November", "December", "January", "February", "March"],
        "activities": ["Beach walk", "Wind farm visit", "Dhow building tour"],
    },
    {
        "id": 8,
        "name": "Vijay Vilas Palace",
        "type": "heritage",
        "lat": 22.834,
        "lon": 69.326,
        "description": "Ornate Rajput palace by the sea, a Bollywood filming location.",
        "eco_rating": 7.5,
        "best_months": ["October", "November", "December", "January", "February"],
        "activities": ["Heritage tour", "Photography", "Beach access"],
    },
]


@router.get("")
def all_locations():
    return {"locations": LOCATIONS}


@router.get("/{location_id}")
def get_location(location_id: int):
    for loc in LOCATIONS:
        if loc["id"] == location_id:
            return loc
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Location not found")
