import { CrowdPredictor } from "@/components/features/CrowdPredictor";

export const metadata = { title: "Crowd Forecast | Rann Eco Planner" };

export default function CrowdPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <CrowdPredictor />
    </div>
  );
}
