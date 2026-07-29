"""
Crowd Prediction Service — RandomForest model trained on Rann visitor patterns.

Features used:
  - month (1–12)          — captures Rann Utsav seasonality
  - day_of_week (0–6)     — weekends are busier
  - is_festival (0/1)     — Rann Utsav window (Nov 1 – Feb 28)
  - is_holiday (0/1)      — major Indian public holidays
  - location_idx (int)    — encoded location
"""
from datetime import date
import numpy as np
from sklearn.ensemble import RandomForestRegressor

from app.schemas.crowd import CrowdRequest, CrowdResponse

LOCATIONS = [
    "White Rann, Dhordo",
    "Kalo Dungar (Black Hill)",
    "Flamingo City",
    "Chhari Dhand Wetland",
    "Rann Utsav Camp",
    "Indian Wild Ass Sanctuary",
    "Mandvi Beach",
    "Vijay Vilas Palace",
]

LOCATION_IDX = {loc: i for i, loc in enumerate(LOCATIONS)}

# ── Synthetic training data ────────────────────────────────────────────────────
_rng = np.random.default_rng(42)

def _is_festival(m: int, d: int) -> int:
    return 1 if (m in (11, 12)) or (m == 1) or (m == 2 and d <= 28) else 0


def _base_visitors(month: int, dow: int, festival: int, loc_idx: int) -> int:
    seasonal = {11: 1.8, 12: 2.2, 1: 2.0, 2: 1.7, 10: 1.3}.get(month, 0.6)
    weekend  = 1.3 if dow >= 5 else 1.0
    fest     = 1.5 if festival else 1.0
    loc_mod  = [1.4, 0.8, 0.7, 0.6, 1.0, 0.9, 0.5, 0.4][loc_idx % 8]
    return int(200 * seasonal * weekend * fest * loc_mod)


X_train, y_train = [], []
for _ in range(4000):
    m   = _rng.integers(1, 13)
    d   = _rng.integers(1, 29)
    dow = _rng.integers(0, 7)
    li  = _rng.integers(0, len(LOCATIONS))
    fes = _is_festival(int(m), int(d))
    hol = _rng.integers(0, 2)
    base = _base_visitors(int(m), int(dow), fes, int(li))
    noise = _rng.integers(-40, 60)
    X_train.append([m, dow, fes, hol, li])
    y_train.append(max(50, base + noise))

_model = RandomForestRegressor(n_estimators=100, random_state=42)
_model.fit(X_train, y_train)

# ── Prediction helper ──────────────────────────────────────────────────────────
INDIAN_HOLIDAYS = {
    (1, 26), (8, 15), (10, 2), (11, 1), (12, 25),
}


def predict_crowd(payload: CrowdRequest) -> CrowdResponse:
    dt = date.fromisoformat(payload.date)
    loc_idx = LOCATION_IDX.get(payload.location, 0)
    festival = _is_festival(dt.month, dt.day)
    holiday = 1 if (dt.month, dt.day) in INDIAN_HOLIDAYS else 0
    dow = dt.weekday()

    features = [[dt.month, dow, festival, holiday, loc_idx]]
    predicted = int(_model.predict(features)[0])

    # Confidence: use std from estimators
    preds = [tree.predict(features)[0] for tree in _model.estimators_]
    std = float(np.std(preds))
    confidence = round(max(0.5, 1 - std / (predicted + 1)), 2)

    level = "low" if predicted < 300 else "medium" if predicted < 600 else "high"

    recs = {
        "low":    "Great time to visit — peaceful and uncrowded. Book in advance to confirm availability.",
        "medium": "Moderate crowds expected. Arrive early morning for the best experience.",
        "high":   "High season — book at least 2 weeks ahead. Consider visiting nearby quieter spots.",
    }

    return CrowdResponse(
        location=payload.location,
        date=payload.date,
        predicted_count=predicted,
        confidence=confidence,
        level=level,
        recommendation=recs[level],
    )
