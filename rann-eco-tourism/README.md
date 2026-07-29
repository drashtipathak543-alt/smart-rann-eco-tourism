# 🏜️ Smart Rann Eco Tourism Planner

A full-stack eco-tourism planning platform for the Rann of Kutch, featuring AI chatbot, crowd prediction, eco itinerary generation, real-time weather, Google Maps integration, analytics dashboard, and multilingual support.

## Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | Next.js 14, TypeScript, Tailwind CSS     |
| Backend     | FastAPI (Python 3.11)                    |
| Database    | PostgreSQL 15 + SQLAlchemy ORM           |
| AI/ML       | OpenAI GPT-4, scikit-learn (crowd pred) |
| Maps        | Google Maps JavaScript API               |
| Weather     | OpenWeatherMap API                       |
| i18n        | next-intl (English, Hindi, Gujarati)     |
| Auth        | JWT (python-jose)                        |
| Deployment  | Docker + Docker Compose                  |

## Features

- 🤖 **AI Chatbot** — GPT-4 powered travel assistant for Rann queries
- 📊 **Crowd Prediction** — ML-based visitor density forecasting
- 🗺️ **Eco Itinerary** — Personalised, sustainability-scored itineraries
- 🌦️ **Live Weather** — Current & forecast for Rann locations
- 📍 **Google Maps** — Interactive POI map with eco zones
- 📈 **Analytics Dashboard** — Visitor trends, eco impact metrics
- 🌐 **Multilingual** — English, Hindi (हिन्दी), Gujarati (ગુજરાતી)
- 📱 **Responsive UI** — Mobile-first design

## Quick Start

```bash
# Clone and enter
cd rann-eco-tourism

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Start all services
docker-compose up --build
```

Frontend: http://localhost:3000  
Backend API: http://localhost:8000  
API Docs: http://localhost:8000/docs

## Project Structure

```
rann-eco-tourism/
├── frontend/          # Next.js 14 app
│   ├── src/
│   │   ├── app/       # App Router pages
│   │   ├── components/
│   │   ├── lib/       # API clients, utils
│   │   └── messages/  # i18n translation files
│   └── ...
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── api/       # Route handlers
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   ├── services/  # Business logic
│   │   └── core/      # Config, database, auth
│   └── ...
├── docker-compose.yml
└── .env.example
```

## Environment Variables

See `.env.example` for all required variables.
