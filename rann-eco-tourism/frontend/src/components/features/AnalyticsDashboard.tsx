"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from "recharts";
import { Users, Leaf, MapPin, Clock, TrendingUp, RefreshCw } from "lucide-react";
import { getAnalytics, seedAnalytics } from "@/lib/api";
import { formatNumber, formatCurrency, ecoScoreColor, crowdLevelColor, cn } from "@/lib/utils";
import toast from "react-hot-toast";

const LEVEL_COLORS = { low: "#10b981", medium: "#f59e0b", high: "#ef4444" };

function StatCard({
  icon: Icon, title, value, sub, color = "stone",
}: {
  icon: React.ElementType; title: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-stone-500">{title}</p>
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon size={16} className={`text-${color}-600`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

export function AnalyticsDashboard() {
  const t = useTranslations("analytics");
  const [days, setDays] = useState(30);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["analytics", days],
    queryFn: () => getAnalytics(days).then((r) => r.data),
    staleTime: 2 * 60_000,
  });

  async function handleSeed() {
    try {
      await seedAnalytics();
      toast.success("Demo data seeded!");
      refetch();
    } catch {
      toast.error("Seed failed — are you connected to the backend?");
    }
  }

  const chartData = data?.daily_visitors
    .reduce<{ date: string; visitors: number }[]>((acc, row) => {
      const existing = acc.find((d) => d.date === row.date);
      if (existing) existing.visitors += row.count;
      else acc.push({ date: row.date.slice(5), visitors: row.count });
      return acc;
    }, [])
    .slice(-30) ?? [];

  const heatmapEntries = Object.entries(data?.crowd_heatmap ?? {});

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 bg-stone-100 rounded-2xl" />)}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card p-8 text-center space-y-3">
        <p className="text-stone-500 text-sm">No analytics data yet.</p>
        <button onClick={handleSeed} className="btn-primary mx-auto">
          Seed Demo Data
        </button>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="section-heading">{t("title")}</h2>
          <p className="section-sub">{t("subtitle")}</p>
        </div>
        <div className="flex gap-2">
          <select
            value={days}
            onChange={(e) => setDays(+e.target.value)}
            className="input-field w-36 text-xs"
          >
            <option value={30}>{t("last_30")}</option>
            <option value={90}>{t("last_90")}</option>
          </select>
          <button
            onClick={() => refetch()}
            className="p-2 hover:bg-stone-100 rounded-xl text-stone-500"
          >
            <RefreshCw size={16} className={cn(isFetching && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title={t("total_visitors")}
          value={formatNumber(summary.total_visitors_ytd)}
          color="blue"
        />
        <StatCard
          icon={Leaf}
          title={t("avg_eco_score")}
          value={`${summary.avg_eco_score}/10`}
          color="emerald"
        />
        <StatCard
          icon={MapPin}
          title={t("top_location")}
          value={summary.top_location.split(",")[0]}
          sub={summary.top_location}
          color="sand"
        />
        <StatCard
          icon={Clock}
          title={t("avg_stay")}
          value={`${summary.avg_stay_days}${t("days_suffix")}`}
          color="stone"
        />
      </div>

      {/* Revenue card */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-sand-500" />
          <p className="text-sm font-semibold text-stone-700">{t("revenue")}</p>
        </div>
        <p className="text-3xl font-bold text-stone-900">
          {formatCurrency(summary.revenue_ytd_inr)}
        </p>
      </div>

      {/* Visitor trend chart */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-stone-800 mb-4">{t("visitor_trend")}</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc8f28" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#dc8f28" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0ede8" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#dc8f28"
              strokeWidth={2}
              fill="url(#visitorGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Crowd heatmap */}
      {heatmapEntries.length > 0 && (
        <div className="card p-6">
          <h3 className="text-base font-semibold text-stone-800 mb-4">{t("crowd_heatmap")}</h3>
          <div className="space-y-2">
            {heatmapEntries.map(([location, level]) => (
              <div key={location} className="flex items-center gap-3">
                <p className="text-sm text-stone-600 w-56 flex-shrink-0 truncate">{location}</p>
                <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: level === "high" ? "100%" : level === "medium" ? "60%" : "30%",
                      background: LEVEL_COLORS[level as keyof typeof LEVEL_COLORS] ?? "#6b7280",
                    }}
                  />
                </div>
                <span className={cn("text-xs font-medium w-14 text-right", crowdLevelColor(level))}>
                  {level}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seed button for dev */}
      <div className="text-right">
        <button onClick={handleSeed} className="btn-secondary text-xs">
          Seed Demo Data
        </button>
      </div>
    </div>
  );
}
