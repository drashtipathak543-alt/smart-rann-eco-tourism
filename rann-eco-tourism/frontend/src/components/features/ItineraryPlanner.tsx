"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Leaf, Zap, Clock, MapPin } from "lucide-react";
import { generateItinerary, ItineraryResult } from "@/lib/api";
import { cn, ecoScoreColor, formatNumber } from "@/lib/utils";
import toast from "react-hot-toast";

const INTEREST_KEYS = ["wildlife", "photography", "cultural", "adventure", "wellness", "food"];

export function ItineraryPlanner({ language = "en" }: { language?: string }) {
  const t = useTranslations("itinerary");
  const [days, setDays] = useState(3);
  const [interests, setInterests] = useState<string[]>(["wildlife", "photography"]);
  const [groupSize, setGroupSize] = useState(2);
  const [result, setResult] = useState<ItineraryResult | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleInterest(key: string) {
    setInterests((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  }

  async function handleGenerate() {
    if (interests.length === 0) { toast.error("Select at least one interest."); return; }
    setLoading(true);
    try {
      const res = await generateItinerary(days, interests, groupSize, language);
      setResult(res.data);
    } catch (e: any) {
      const msg = e?.response?.status === 401
        ? "Sign in to save itineraries."
        : "Failed to generate itinerary.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // Group activities by day
  const byDay = result
    ? result.activities.reduce<Record<number, typeof result.activities>>((acc, a) => {
        acc[a.day] = [...(acc[a.day] ?? []), a];
        return acc;
      }, {})
    : {};

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="card p-6">
        <h2 className="section-heading">{t("title")}</h2>
        <p className="section-sub">{t("subtitle")}</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">{t("days")}</label>
            <select value={days} onChange={(e) => setDays(+e.target.value)} className="input-field">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => <option key={d} value={d}>{d} {d === 1 ? "day" : "days"}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">{t("group_size")}</label>
            <input
              type="number" min={1} max={30} value={groupSize}
              onChange={(e) => setGroupSize(+e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <label className="block text-xs font-medium text-stone-600 mb-2">{t("interests")}</label>
        <div className="flex flex-wrap gap-2 mb-5">
          {INTEREST_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => toggleInterest(key)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all",
                interests.includes(key)
                  ? "bg-sand-500 text-white border-sand-500"
                  : "bg-white text-stone-600 border-stone-200 hover:border-sand-400"
              )}
            >
              {(t as any)(`interests_options.${key}`)}
            </button>
          ))}
        </div>

        <button onClick={handleGenerate} disabled={loading} className="btn-primary disabled:opacity-50">
          <Sparkles size={15} />
          {loading ? t("generating") : t("generate")}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="animate-fade-in space-y-4">
          {/* Summary card */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-1">{result.title}</h3>
            <p className="text-sm text-stone-500 mb-4">{result.days} days · {interests.join(", ")}</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50 rounded-xl p-3 text-center">
                <Leaf size={16} className="mx-auto mb-1 text-emerald-600" />
                <p className="text-xs text-stone-500">{t("eco_score")}</p>
                <p className={cn("text-xl font-bold", ecoScoreColor(result.eco_score))}>
                  {result.eco_score}/10
                </p>
              </div>
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <Zap size={16} className="mx-auto mb-1 text-stone-500" />
                <p className="text-xs text-stone-500">{t("carbon")}</p>
                <p className="text-xl font-bold text-stone-800">{result.carbon_kg}kg</p>
              </div>
              <div className="bg-sand-50 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                <p className="text-xs text-stone-500">Group</p>
                <p className="text-xl font-bold text-stone-800">{groupSize} pax</p>
              </div>
            </div>
          </div>

          {/* Day-by-day activities */}
          {Object.entries(byDay).map(([day, activities]) => (
            <div key={day} className="card overflow-hidden">
              <div className="bg-gradient-to-r from-sand-500 to-sand-400 px-5 py-3">
                <h4 className="text-white font-semibold text-sm">{t("day")} {day}</h4>
              </div>
              <div className="divide-y divide-stone-100">
                {activities.map((act, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-14 text-center">
                        <div className="flex items-center gap-1 text-stone-400 text-xs">
                          <Clock size={11} /> {act.time}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-semibold text-stone-800 text-sm">{act.title}</p>
                          <span className="badge bg-stone-100 text-stone-500">{act.duration_hours}h</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-stone-400 mb-1.5">
                          <MapPin size={11} /> {act.location}
                        </div>
                        <p className="text-sm text-stone-600 mb-2">{act.description}</p>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                          <p className="text-xs font-medium text-emerald-700">
                            🌿 {t("eco_tip")}: {act.eco_tip}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
