"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Menu, X, Leaf, Globe } from "lucide-react";
import { setLocaleCookie } from "@/lib/utils";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "gu", label: "ગુજરાતી" },
];

export function Navbar() {
  const t = useTranslations("nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const links = [
    { href: "/",           label: t("home") },
    { href: "/map",        label: t("map") },
    { href: "/itinerary",  label: t("itinerary") },
    { href: "/weather",    label: t("weather") },
    { href: "/crowd",      label: t("crowd") },
    { href: "/analytics",  label: t("analytics") },
    { href: "/chatbot",    label: t("chatbot") },
  ];

  function handleLocale(code: string) {
    setLocaleCookie(code);
    window.location.reload();
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-sand-600 text-base">
            <Leaf size={20} className="text-rann-teal" />
            <span className="hidden sm:inline">Rann Eco Planner</span>
            <span className="sm:hidden">REP</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-1.5 text-sm text-stone-600 hover:text-sand-600 hover:bg-sand-50 rounded-lg transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Lang + Mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Language picker */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <Globe size={15} />
                <span className="hidden sm:inline">Lang</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-1 w-36 card py-1 shadow-lg">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => { handleLocale(loc.code); setLangOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 text-stone-700"
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth links */}
            <Link href="/auth/login"
              className="hidden sm:inline-flex btn-secondary text-xs px-3 py-1.5">
              {t("login")}
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-stone-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="lg:hidden py-3 border-t border-stone-100 space-y-0.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm text-stone-700 hover:bg-sand-50 hover:text-sand-700 rounded-lg"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-stone-100 pt-2 mt-2 flex gap-2 px-3">
              <Link href="/auth/login" className="btn-secondary text-xs py-1.5 px-3">
                {t("login")}
              </Link>
              <Link href="/auth/register" className="btn-primary text-xs py-1.5 px-3">
                {t("register")}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
