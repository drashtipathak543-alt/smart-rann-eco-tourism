from app.core.config import settings
from app.core.database import Base, engine
from app.models import user, booking, itinerary, analytics  # noqa: F401 — register models


def init_db() -> None:
    """Create all tables if they don't exist yet."""
    Base.metadata.create_all(bind=engine)
