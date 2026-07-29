"""
Weather API — proxies OpenWeatherMap for Rann locations.
"""
import httpx
from fastapi import APIRouter, HTTPException, Query
from app.core.config import settings

router = APIRouter()

RANN_COORDS = {
    "White Rann, Dhordo":           {"lat": 23.622, "lon": 69.930},
    "Kalo Dungar (Black Hill)":     {"lat": 23.740, "lon": 69.560},
    "Flamingo City":                {"lat": 23.435, "lon": 68.981},
    "Chhari Dhand Wetland":         {"lat": 23.530, "lon": 69.780},
    "Rann Utsav Camp":              {"lat": 23.618, "lon": 69.925},
    "Indian Wild Ass Sanctuary":    {"lat": 23.666, "lon": 71.185},
    "Mandvi Beach":                 {"lat": 22.830, "lon": 69.351},
    "Vijay Vilas Palace":           {"lat": 22.834, "lon": 69.326},
}

OWM_BASE = "https://api.openweathermap.org/data/2.5"


@router.get("/current")
async def current_weather(location: str = Query(..., description="Location name")):
    coords = RANN_COORDS.get(location)
    if not coords:
        raise HTTPException(status_code=404, detail=f"Location '{location}' not found")

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{OWM_BASE}/weather",
            params={
                "lat": coords["lat"],
                "lon": coords["lon"],
                "appid": settings.OPENWEATHER_API_KEY,
                "units": "metric",
            },
            timeout=10,
        )
    resp.raise_for_status()
    data = resp.json()

    return {
        "location": location,
        "temp_c": data["main"]["temp"],
        "feels_like_c": data["main"]["feels_like"],
        "humidity": data["main"]["humidity"],
        "description": data["weather"][0]["description"],
        "icon": data["weather"][0]["icon"],
        "wind_speed": data["wind"]["speed"],
        "visibility_m": data.get("visibility"),
    }


@router.get("/forecast")
async def forecast(location: str = Query(...), days: int = Query(5, ge=1, le=7)):
    coords = RANN_COORDS.get(location)
    if not coords:
        raise HTTPException(status_code=404, detail=f"Location '{location}' not found")

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{OWM_BASE}/forecast",
            params={
                "lat": coords["lat"],
                "lon": coords["lon"],
                "appid": settings.OPENWEATHER_API_KEY,
                "units": "metric",
                "cnt": days * 8,     # OWM returns 3-hourly; 8 per day
            },
            timeout=10,
        )
    resp.raise_for_status()
    raw = resp.json()

    daily: dict = {}
    for entry in raw["list"]:
        day = entry["dt_txt"][:10]
        if day not in daily:
            daily[day] = {
                "date": day,
                "temp_max": entry["main"]["temp_max"],
                "temp_min": entry["main"]["temp_min"],
                "description": entry["weather"][0]["description"],
                "icon": entry["weather"][0]["icon"],
            }
        else:
            daily[day]["temp_max"] = max(daily[day]["temp_max"], entry["main"]["temp_max"])
            daily[day]["temp_min"] = min(daily[day]["temp_min"], entry["main"]["temp_min"])

    return {"location": location, "forecast": list(daily.values())[:days]}
