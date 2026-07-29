"use client";
import { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { useTranslations } from "next-intl";
import { Star, Calendar, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getLocations, Location } from "@/lib/api";
import { ecoScoreColor } from "@/lib/utils";

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const TYPE_COLORS: Record<string, string> = {
  natural:  "#2a9d8f",
  wildlife: "#e76f51",
  cultural: "#dc8f28",
  coastal:  "#1e6b8a",
  heritage: "#8b6f47",
};

function MapContainer({
  locations,
  selected,
  onSelect,
}: {
  locations: Location[];
  selected: Location | null;
  onSelect: (l: Location) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!ref.current) return;
    mapRef.current = new google.maps.Map(ref.current, {
      center: { lat: 23.5, lng: 70.0 },
      zoom: 8,
      mapTypeId: "terrain",
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "water", stylers: [{ color: "#a8dadc" }] },
      ],
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
    });

    locations.forEach((loc) => {
      const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lon },
        map: mapRef.current!,
        title: loc.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: TYPE_COLORS[loc.type] ?? "#6b7280",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });
      marker.addListener("click", () => onSelect(loc));
      markersRef.current.push(marker);
    });
  }, [locations]);

  // Pan to selected location
  useEffect(() => {
    if (selected && mapRef.current) {
      mapRef.current.panTo({ lat: selected.lat, lng: selected.lon });
      mapRef.current.setZoom(11);
    }
  }, [selected]);

  return <div ref={ref} className="w-full h-full" />;
}

function MapStatus({ status }: { status: Status }) {
  if (status === Status.LOADING) return <div className="flex items-center justify-center h-full text-stone-400 text-sm">Loading map…</div>;
  if (status === Status.FAILURE) return <div className="flex items-center justify-center h-full text-red-500 text-sm">Map failed to load. Check Google Maps API key.</div>;
  return null;
}

export function RannMap() {
  const t = useTranslations("map");
  const [selected, setSelected] = useState<Location | null>(null);

  const { data } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getLocations().then((r) => r.data.locations),
    staleTime: Infinity,
  });
  const locations = data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-heading">{t("title")}</h2>
        <p className="section-sub">{t("subtitle")}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 card overflow-hidden" style={{ height: 500 }}>
          {GOOGLE_MAPS_KEY ? (
            <Wrapper apiKey={GOOGLE_MAPS_KEY} render={(status) => <MapStatus status={status} />}>
              <MapContainer locations={locations} selected={selected} onSelect={setSelected} />
            </Wrapper>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 p-8 text-center">
              <p className="font-medium text-stone-600 mb-2">Google Maps Preview</p>
              <p className="text-sm">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the interactive map.</p>
              {/* Static fallback with location list */}
              <div className="mt-4 w-full space-y-2 text-left">
                {locations.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-sm text-stone-700 border border-stone-200 flex items-center gap-2"
                  >
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: TYPE_COLORS[l.type] }} />
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="card p-5 h-fit">
          {selected ? (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: TYPE_COLORS[selected.type] }} />
                <span className="text-xs font-medium uppercase tracking-wide text-stone-400">{selected.type}</span>
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">{selected.name}</h3>
              <p className="text-sm text-stone-600 mb-4">{selected.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <Star size={14} className="text-amber-500" />
                <span className="text-xs text-stone-500">{t("eco_rating")}</span>
                <span className={`text-sm font-bold ml-auto ${ecoScoreColor(selected.eco_rating)}`}>
                  {selected.eco_rating}/10
                </span>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
                  <Calendar size={12} /> {t("best_months")}
                </div>
                <div className="flex flex-wrap gap-1">
                  {selected.best_months.map((m) => (
                    <span key={m} className="badge bg-sand-100 text-sand-700">{m}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
                  <Activity size={12} /> {t("activities")}
                </div>
                <div className="flex flex-wrap gap-1">
                  {selected.activities.map((a) => (
                    <span key={a} className="badge bg-rann-sky/30 text-rann-blue">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-stone-400 py-8">
              <p className="text-sm">Click a location on the map to see details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="card p-4 flex flex-wrap gap-4">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-xs text-stone-600 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
