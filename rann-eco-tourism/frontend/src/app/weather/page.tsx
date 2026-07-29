import { WeatherWidget } from "@/components/features/WeatherWidget";

export const metadata = { title: "Weather | Rann Eco Planner" };

export default function WeatherPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <WeatherWidget />
    </div>
  );
}
