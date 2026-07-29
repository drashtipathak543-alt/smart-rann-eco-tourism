import { AnalyticsDashboard } from "@/components/features/AnalyticsDashboard";

export const metadata = { title: "Analytics Dashboard | Rann Eco Planner" };

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <AnalyticsDashboard />
    </div>
  );
}
