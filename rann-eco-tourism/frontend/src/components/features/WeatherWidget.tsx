"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Cloud, Droplets, Wind, Eye, Thermometer, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather, getWeatherForecast } from "@/lib/api";
import { cn } from "@/lib/utils";

const LOCATIONS = [
  "White Rann, Dhordo",
  "Kalo Dungar (Black Hill)",
  "Flamingo City",
  "Chhari Dhand Wetland",
  "Rann Utsav Camp",
  "Indian Wild Ass Sanctuary",
  "Mandvi Beach",
  "Vijay Vilas Palace",
];

function WeatherIcon({ icon, size = 40 }: { icon: string; size?: number }) {
  return (
    <img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt="weather icon"
      width={size}
      height={size}
    />
  );
}

export function WeatherWidget() {
  const t = useTranslations("weather");
  const [location, setLocation] = useState(LOCATIONS[0]);

  const currentQ = useQuery({
    queryKey: ["weather-current", location],
    queryFn: () => getCurrentWeather(location).then((r) => r.data),
    staleTime: 5 * 60_000,
    retry: false,
  });

  const forecastQ = useQuery({
    queryKey: ["weather-forecast", location],
    queryFn: () => getWeatherForecast(location, 5).then((r) => r.data),
    staleTime: 10 * 60_000,
    retry: false,
  });

  const w = currentQ.data;
  const forecast = forecastQ.data?.forecast ?? [];

  return (
    <div className="space-y-5">
      {/* Header + Location picker */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="section-heading">{t("title")}</h2>
            <p className="section-sub">{t("subtitle")}</p>
          </div>
          <button
            onClick={() => { currentQ.refetch(); forecastQ.refetch(); }}
            className="p-2 hover:bg-stone-100 rounded-lg text-stone-500"
          >
            <RefreshCw size={16} className={cn(currentQ.isFetching && "animate-spin")} />
          </button>
        </div>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="input-field w-full sm:w-72"
        >
          {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>

      {/* Current weather */}
      {currentQ.isLoading ? (
        <div className="card p-6 text-center text-stone-400 text-sm animate-pulse">Loading weather…</div>
      ) : currentQ.isError ? (
        <div className="card p-6 text-center text-red-500 text-sm">
          Weather unavailable — check your API key.
        </div>
      ) : w ? (
        <div className="card p-6 bg-gradient-to-br from-rann-blue to-rann-teal text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">{location}</p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-5xl font-bold">{Math.round(w.temp_c)}°C</span>
                <WeatherIcon icon={w.icon} size={50} />
              </div>
              <p className="capitalize text-sm opacity-90 mt-1">{w.description}</p>
              <p className="text-xs opacity-70 mt-0.5">{t("feels_like")} {Math.round(w.feels_like_c)}°C</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Droplets size={16} className="mx-auto mb-1 opacity-80" />
              <p className="text-xs opacity-70">{t("humidity")}</p>
              <p className="font-semibold">{w.humidity}%</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Wind size={16} className="mx-auto mb-1 opacity-80" />
              <p className="text-xs opacity-70">{t("wind")}</p>
              <p className="font-semibold">{w.wind_speed} m/s</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <Eye size={16} className="mx-auto mb-1 opacity-80" />
              <p className="text-xs opacity-70">Visibility</p>
              <p className="font-semibold">{w.visibility_m ? `${(w.visibility_m / 1000).toFixed(1)}km` : "—"}</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Forecast */}
      {forecast.length > 0 && (
        <div className="card p-6">
          <h3 className="text-base font-semibold text-stone-800 mb-4">{t("forecast")}</h3>
          <div className="grid grid-cols-5 gap-2">
            {forecast.map((day) => (
              <div key={day.date} className="text-center bg-stone-50 rounded-xl p-3">
                <p className="text-xs text-stone-500 font-medium">
                  {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
                </p>
                <WeatherIcon icon={day.icon} size={32} />
                <p className="text-sm font-semibold text-stone-800">{Math.round(day.temp_max)}°</p>
                <p className="text-xs text-stone-400">{Math.round(day.temp_min)}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
