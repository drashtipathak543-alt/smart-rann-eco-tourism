import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export function ecoScoreColor(score: number): string {
  if (score >= 8) return "text-emerald-600";
  if (score >= 6) return "text-amber-600";
  return "text-red-600";
}

export function crowdLevelColor(level: string): string {
  return { low: "text-emerald-600", medium: "text-amber-600", high: "text-red-600" }[level] ?? "text-stone-600";
}

export function setLocaleCookie(locale: string): void {
  document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}
