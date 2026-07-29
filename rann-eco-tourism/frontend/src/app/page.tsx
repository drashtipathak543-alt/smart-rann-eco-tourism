import { useTranslations } from "next-intl";
import Link from "next/link";
import { Map, TrendingUp, Sparkles, CloudSun, BarChart2, Bot } from "lucide-react";

const FEATURES = [
  { icon: Bot,       keyPrefix: "feature_ai",        href: "/chatbot",   color: "bg-sand-100   text-sand-600"   },
  { icon: TrendingUp,keyPrefix: "feature_crowd",      href: "/crowd",     color: "bg-amber-100  text-amber-600"  },
  { icon: Sparkles,  keyPrefix: "feature_itinerary",  href: "/itinerary", color: "bg-emerald-100 text-emerald-600"},
  { icon: CloudSun,  keyPrefix: "feature_weather",    href: "/weather",   color: "bg-blue-100   text-blue-600"   },
  { icon: Map,       keyPrefix: "feature_map",        href: "/map",       color: "bg-teal-100   text-teal-600"   },
  { icon: BarChart2, keyPrefix: "feature_analytics",  href: "/analytics", color: "bg-purple-100 text-purple-600" },
];

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sand-400 via-sand-500 to-rann-rust">
        {/* Abstract desert bg */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-5">
            🏜️ Kuch's Rann · Gujarat, India
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
            {t("hero_title")}
          </h1>
          <p className="text-lg text-sand-100 max-w-2xl mx-auto mb-8">
            {t("hero_subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/itinerary" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-sand-600 font-semibold hover:bg-sand-50 transition-colors shadow">
              <Sparkles size={16} /> {t("cta_plan")}
            </Link>
            <Link href="/map" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 text-white font-semibold border border-white/30 hover:bg-white/30 transition-colors">
              <Map size={16} /> {t("cta_explore")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 text-center mb-10">
          {t("features_title")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, keyPrefix, href, color }) => (
            <Link
              key={href}
              href={href}
              className="card p-6 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-stone-900 mb-1 group-hover:text-sand-600 transition-colors">
                {t(keyPrefix as any)}
              </h3>
              <p className="text-sm text-stone-500">{t(`${keyPrefix}_desc` as any)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section className="bg-stone-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "Size of Rann", value: "7,500 km²" },
            { label: "Bird Species", value: "200+" },
            { label: "Visitor Season", value: "Oct–Feb" },
            { label: "Eco Score Goal", value: "9/10" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-bold text-sand-300">{s.value}</p>
              <p className="text-sm text-stone-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
