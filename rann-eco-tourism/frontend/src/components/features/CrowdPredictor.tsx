"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Users, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { predictCrowd, CrowdResult } from "@/lib/api";
import { cn, formatNumber } from "@/lib/utils";
import toast from "react-hot-toast";

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

const LEVEL_CONFIG = {
  low:    { className: "badge-low",    icon: CheckCircle,  bar: "bg-emerald-500", width: "33%" },
  medium: { className: "badge-medium", icon: AlertCircle,  bar: "bg-amber-500",   width: "66%" },
  high:   { className: "badge-high",   icon: AlertCircle,  bar: "bg-red-500",     width: "100%" },
};

export function CrowdPredictor() {
  const t = useTranslations("crowd");
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [result, setResult] = useState<CrowdResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePredict() {
    setLoading(true);
    try {
      const res = await predictCrowd(location, date);
      setResult(res.data);
    } catch {
      toast.error(t("../common.error"));
    } finally {
      setLoading(false);
    }
  }

  const level = result?.level as keyof typeof LEVEL_CONFIG | undefined;
  const config = level ? LEVEL_CONFIG[level] : null;
  const LevelIcon = config?.icon;

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="card p-6">
        <h2 className="section-heading">{t("title")}</h2>
        <p className="section-sub">{t("subtitle")}</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              {t("select_location")}
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input-field"
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              {t("select_date")}
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="btn-primary mt-5 disabled:opacity-50"
        >
          <TrendingUp size={15} />
          {loading ? "Predicting..." : t("predict")}
        </button>
      </div>

      {/* Result */}
      {result && config && LevelIcon && (
        <div className="card p-6 animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-semibold text-stone-800">{result.location}</p>
              <p className="text-sm text-stone-500">{result.date}</p>
            </div>
            <span className={config.className}>
              <LevelIcon size={12} className="mr-1" />
              {t(`level_${level}` as any)}
            </span>
          </div>

          {/* Bar */}
          <div className="mb-5">
            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-700", config.bar)}
                style={{ width: config.width }}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-stone-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
                <Users size={14} />
                {t("predicted_visitors")}
              </div>
              <p className="text-2xl font-bold text-stone-900">
                {formatNumber(result.predicted_count)}
              </p>
            </div>
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-stone-500 text-xs mb-1">{t("confidence")}</p>
              <p className="text-2xl font-bold text-stone-900">
                {Math.round(result.confidence * 100)}%
              </p>
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-700 mb-1">{t("recommendation")}</p>
            <p className="text-sm text-blue-800">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
