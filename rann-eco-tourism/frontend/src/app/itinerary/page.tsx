import { ItineraryPlanner } from "@/components/features/ItineraryPlanner";
import { getLocale } from "next-intl/server";

export const metadata = { title: "Plan Your Eco Trip | Rann Eco Planner" };

export default async function ItineraryPage() {
  const locale = await getLocale();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <ItineraryPlanner language={locale} />
    </div>
  );
}
