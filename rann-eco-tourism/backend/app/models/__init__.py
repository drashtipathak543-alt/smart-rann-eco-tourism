"""Package init — importing models makes SQLAlchemy register them with Base.metadata."""
from . import user, booking, itinerary, analytics  # noqa: F401
