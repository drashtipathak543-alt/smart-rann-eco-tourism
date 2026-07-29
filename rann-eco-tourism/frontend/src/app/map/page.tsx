import { RannMap } from "@/components/features/RannMap";

export const metadata = { title: "Explore Map | Rann Eco Planner" };

export default function MapPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <RannMap />
    </div>
  );
}
