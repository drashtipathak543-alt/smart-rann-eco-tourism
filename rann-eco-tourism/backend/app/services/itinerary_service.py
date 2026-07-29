"""
Eco Itinerary Service — GPT-4 generates a structured JSON itinerary.
Falls back to a curated template when no API key is set.
"""
import json
from openai import AsyncOpenAI
from app.core.config import settings
from app.schemas.itinerary import ItineraryRequest

SYSTEM_PROMPT = """You are an expert Rann of Kutch eco-tourism itinerary planner.
Generate a detailed, eco-friendly day-by-day itinerary as a JSON object.

Output ONLY valid JSON with this exact shape:
{
  "title": "string — engaging itinerary name",
  "eco_score": float (1-10, where 10 is most eco-friendly),
  "carbon_kg": float (estimated CO2 in kg for the trip),
  "activities": [
    {
      "day": 1,
      "time": "08:00",
      "title": "Activity name",
      "location": "Exact Rann location",
      "description": "2-3 sentence description",
      "eco_tip": "One specific eco-friendly tip",
      "duration_hours": 2.5,
      "carbon_kg": 0.5
    }
  ]
}

Rules:
- Prefer low-carbon transport (cycling, walking, electric vehicles)
- Include at least one cultural experience and one wildlife activity per 2 days
- Each day should have 3-4 activities (morning, afternoon, evening)
- eco_score reflects sustainable choices made in the itinerary
- Keep carbon_kg realistic (5-15 kg per day depending on transport)
"""


async def generate_itinerary(payload: ItineraryRequest) -> dict:
    if not settings.OPENAI_API_KEY:
        return _fallback_itinerary(payload)

    user_msg = (
        f"Create a {payload.days}-day eco-itinerary for the Rann of Kutch.\n"
        f"Interests: {', '.join(payload.interests)}\n"
        f"Group size: {payload.group_size}\n"
        f"Language for descriptions: {payload.language}"
    )

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
        response_format={"type": "json_object"},
        max_tokens=2000,
        temperature=0.7,
    )

    raw = response.choices[0].message.content or "{}"
    data = json.loads(raw)
    return data


def _fallback_itinerary(payload: ItineraryRequest) -> dict:
    """Curated 3-day template — used when no OpenAI key is set."""
    activities = []
    templates = [
        {
            "day": 1,
            "slots": [
                {"time": "06:00", "title": "Sunrise at White Rann", "location": "White Rann, Dhordo",
                 "description": "Witness the magical sunrise over the salt desert. The white expanse glows golden as the sun rises, creating a surreal landscape.",
                 "eco_tip": "Walk barefoot on the salt crust — leave no waste behind.", "duration_hours": 2.0, "carbon_kg": 0.1},
                {"time": "09:00", "title": "Camel Safari Across the Salt Flats", "location": "White Rann, Dhordo",
                 "description": "Explore the vast Rann on camelback with a local guide. Camels are the most eco-friendly transport here.",
                 "eco_tip": "Choose licensed local camel operators to support the community.", "duration_hours": 3.0, "carbon_kg": 0.2},
                {"time": "15:00", "title": "Kutchi Handicraft Workshop", "location": "Rann Utsav Camp",
                 "description": "Learn traditional Kutchi embroidery from local artisans. Purchase directly from craftspeople to support fair trade.",
                 "eco_tip": "Buy handmade items — avoid plastic souvenirs.", "duration_hours": 2.5, "carbon_kg": 0.3},
                {"time": "19:00", "title": "Cultural Evening Show", "location": "Rann Utsav Camp",
                 "description": "Enjoy folk music, dance, and Kutchi cuisine under the stars.",
                 "eco_tip": "Use a reusable water bottle at the event.", "duration_hours": 2.0, "carbon_kg": 0.1},
            ],
        },
        {
            "day": 2,
            "slots": [
                {"time": "05:30", "title": "Flamingo City Bird Walk", "location": "Flamingo City",
                 "description": "One of Asia's largest flamingo nesting colonies. Thousands of pink flamingos create a breathtaking spectacle.",
                 "eco_tip": "Maintain 100m distance from nesting birds. No flash photography.", "duration_hours": 3.0, "carbon_kg": 2.5},
                {"time": "10:00", "title": "Kalo Dungar Trek", "location": "Kalo Dungar (Black Hill)",
                 "description": "Trek to the highest point in Kutch for panoramic desert views. The ancient Dattatreya temple here feeds crows daily.",
                 "eco_tip": "Carry out all waste. Stick to marked trails.", "duration_hours": 3.5, "carbon_kg": 1.8},
                {"time": "16:00", "title": "Chhari Dhand Wetland Watch", "location": "Chhari Dhand Wetland",
                 "description": "200+ bird species inhabit this freshwater lake. A paradise for birdwatchers and nature photographers.",
                 "eco_tip": "No single-use plastics near the wetland.", "duration_hours": 2.0, "carbon_kg": 1.2},
            ],
        },
        {
            "day": 3,
            "slots": [
                {"time": "07:00", "title": "Wild Ass Safari", "location": "Indian Wild Ass Sanctuary",
                 "description": "Spot the endangered Indian Wild Ass (Ghudkhur) in its only remaining habitat. A rare wildlife experience.",
                 "eco_tip": "Stay in the vehicle. No feeding wildlife.", "duration_hours": 4.0, "carbon_kg": 3.5},
                {"time": "13:00", "title": "Mandvi Beach Heritage Walk", "location": "Mandvi Beach",
                 "description": "Visit the 400-year-old dhow shipbuilding yard and pristine beach. Watch master craftsmen build traditional wooden ships.",
                 "eco_tip": "Help with a beach clean-up — collect 10 pieces of litter.", "duration_hours": 2.5, "carbon_kg": 2.0},
                {"time": "16:30", "title": "Vijay Vilas Palace Sunset", "location": "Vijay Vilas Palace",
                 "description": "Magnificent Rajput-era palace by the Arabian Sea. Catch the golden sunset from the palace terrace.",
                 "eco_tip": "Respect the heritage site — no littering or graffiti.", "duration_hours": 2.0, "carbon_kg": 0.5},
            ],
        },
    ]

    day_limit = min(payload.days, len(templates))
    total_carbon = 0.0
    for t in templates[:day_limit]:
        for slot in t["slots"]:
            a = {"day": t["day"], **slot}
            activities.append(a)
            total_carbon += slot["carbon_kg"]

    return {
        "title": f"{payload.days}-Day Rann Eco Adventure",
        "eco_score": 8.7,
        "carbon_kg": round(total_carbon, 1),
        "activities": activities,
    }
