/**
 * Centralised API client — all backend calls go through here.
 * Base URL reads from NEXT_PUBLIC_API_BASE_URL env variable.
 */
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token from localStorage when available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("rann_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Chat ──────────────────────────────────────────────────────────────────────
export interface ChatMessage { role: "user" | "assistant"; content: string }
export const sendChatMessage = (messages: ChatMessage[], language = "en") =>
  api.post<{ reply: string; language: string }>("/chatbot", { messages, language });

// ── Crowd ─────────────────────────────────────────────────────────────────────
export interface CrowdResult {
  location: string; date: string; predicted_count: number;
  confidence: number; level: "low" | "medium" | "high"; recommendation: string;
}
export const predictCrowd = (location: string, date: string) =>
  api.post<CrowdResult>("/crowd/predict", { location, date });

export const getCrowdLocations = () =>
  api.get<{ locations: string[] }>("/crowd/locations");

// ── Weather ───────────────────────────────────────────────────────────────────
export interface CurrentWeather {
  location: string; temp_c: number; feels_like_c: number; humidity: number;
  description: string; icon: string; wind_speed: number; visibility_m: number;
}
export interface ForecastDay {
  date: string; temp_max: number; temp_min: number; description: string; icon: string;
}
export const getCurrentWeather = (location: string) =>
  api.get<CurrentWeather>("/weather/current", { params: { location } });

export const getWeatherForecast = (location: string, days = 5) =>
  api.get<{ location: string; forecast: ForecastDay[] }>("/weather/forecast", {
    params: { location, days },
  });

// ── Itinerary ─────────────────────────────────────────────────────────────────
export interface Activity {
  day: number; time: string; title: string; location: string;
  description: string; eco_tip: string; duration_hours: number; carbon_kg: number;
}
export interface ItineraryResult {
  id: number; title: string; days: number; eco_score: number;
  carbon_kg: number; activities: Activity[]; created_at: string;
}
export const generateItinerary = (days: number, interests: string[], group_size = 2, language = "en") =>
  api.post<ItineraryResult>("/itinerary", { days, interests, group_size, language });

export const getMyItineraries = () => api.get<ItineraryResult[]>("/itinerary");

// ── Analytics ─────────────────────────────────────────────────────────────────
export interface AnalyticsData {
  summary: {
    total_visitors_ytd: number; avg_eco_score: number;
    top_location: string; avg_stay_days: number; revenue_ytd_inr: number;
  };
  daily_visitors: { date: string; count: number; location: string }[];
  crowd_heatmap: Record<string, string>;
}
export const getAnalytics = (days = 30) =>
  api.get<AnalyticsData>("/analytics", { params: { days } });

export const seedAnalytics = () => api.post("/analytics/seed");

// ── Locations ─────────────────────────────────────────────────────────────────
export interface Location {
  id: number; name: string; type: string; lat: number; lon: number;
  description: string; eco_rating: number; best_months: string[]; activities: string[];
}
export const getLocations = () =>
  api.get<{ locations: Location[] }>("/locations");

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = (email: string, password: string) => {
  const form = new URLSearchParams({ username: email, password });
  return api.post<{ access_token: string; token_type: string }>(
    "/auth/token",
    form.toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );
};
export const register = (name: string, email: string, password: string, language = "en") =>
  api.post("/auth/register", { name, email, password, language });

export const getMe = () => api.get("/auth/me");
