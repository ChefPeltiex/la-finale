import { useMemo, useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MapPin, Loader2, Package, Gift, Wrench, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const TYPE_CONFIG = {
  vente:      { label: "Vente",      color: "#3b82f6", icon: Package },
  don:        { label: "Don",        color: "#10b981", icon: Gift },
  réparation: { label: "Réparation", color: "#f59e0b", icon: Wrench },
  échange:    { label: "Échange",    color: "#8b5cf6", icon: RefreshCw },
};

// Stable pseudo-random positions based on listing id (no flicker on re-render)
function getStablePos(id, index) {
  let hash = 0;
  const str = String(id || index);
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  const x = 5 + (Math.abs(hash * 1234567) % 90);
  const y = 5 + (Math.abs(hash * 7654321) % 80);
  return { x, y };
}

export default function InteractiveMap() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const mapRef = useRef(null);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings-map"],
    queryFn: () => base44.entities.Listing.filter({ status: "actif" }, "-created_date", 80),
    staleTime: 120_000,
    gcTime: 300_000,
  });

  // Close popup on outside click
  useEffect(() => {
    const handler = (e) => {
      if (mapRef.current && !mapRef.current.contains(e.target)) setSelected(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() =>
    filter === "all" ? listings : listings.filter(l => l.type === filter),
    [listings, filter]
  );

  const pins = useMemo(() =>
    filtered.map((l, i) => ({ listing: l, ...getStablePos(l.id, i) })),
    [filtered]
  );

  const counts = useMemo(() =>
    Object.fromEntries(Object.keys(TYPE_CONFIG).map(t => [t, listings.filter(l => l.type === t).length])),
    [listings]
  );

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Carte des Annonces
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">{listings.length} annonces actives dans le monde</p>
        </div>
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === "all" ? "bg-primary text-primary-foreground shadow-magic" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
            Tous ({listings.length})
          </button>
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
            <button key={type} onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filter === type ? "text-white shadow" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
              style={filter === type ? { backgroundColor: cfg.color } : {}}>
              {cfg.label} ({counts[type] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Map container */}
      <div ref={mapRef}
        className="relative rounded-3xl overflow-hidden border border-border"
        style={{
          height: "420px",
          background: "linear-gradient(135deg, hsl(210,45%,12%) 0%, hsl(228,40%,9%) 40%, hsl(200,45%,11%) 100%)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(16,185,129,0.08)"
        }}>

        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" style={{ pointerEvents: "none" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={`${i * 11.1}%`} y1="0" x2={`${i * 11.1}%`} y2="100%"
              stroke="rgba(16,185,129,0.5)" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${i * 16.6}%`} x2="100%" y2={`${i * 16.6}%`}
              stroke="rgba(16,185,129,0.5)" strokeWidth="0.5" />
          ))}
        </svg>

        {/* World map silhouette (subtle) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(ellipse 60% 40% at 30% 40%, rgba(16,185,129,0.6) 0%, transparent 70%), radial-gradient(ellipse 40% 35% at 70% 45%, rgba(16,185,129,0.4) 0%, transparent 70%)",
          }} />

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
          </div>
        ) : (
          <>
            {pins.map(({ listing, x, y }) => {
              const cfg = TYPE_CONFIG[listing.type] || TYPE_CONFIG.don;
              const isSelected = selected?.id === listing.id;
              return (
                <button
                  key={listing.id}
                  onClick={() => setSelected(isSelected ? null : listing)}
                  className="absolute transition-all duration-200 group"
                  style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", zIndex: isSelected ? 20 : 10 }}>
                  {/* Pulse ring */}
                  {isSelected && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-40"
                      style={{ backgroundColor: cfg.color }} />
                  )}
                  <div
                    className="rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-125"
                    style={{
                      width: isSelected ? 18 : 12,
                      height: isSelected ? 18 : 12,
                      backgroundColor: cfg.color,
                      boxShadow: `0 0 ${isSelected ? 16 : 8}px ${cfg.color}88, 0 2px 4px rgba(0,0,0,0.3)`,
                    }} />
                </button>
              );
            })}
          </>
        )}

        {/* Selected popup */}
        {selected && (() => {
          const cfg = TYPE_CONFIG[selected.type] || TYPE_CONFIG.don;
          const Icon = cfg.icon;
          return (
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 animate-fade-in-up z-30">
              <Link to={`/annonce/${selected.id}`}
                className="block bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20 hover:shadow-cosmic transition-all group">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 bg-muted"
                    style={{ border: `2px solid ${cfg.color}44` }}>
                    {selected.image_url
                      ? <img src={selected.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${cfg.color}18` }}>
                          <Icon className="h-5 w-5" style={{ color: cfg.color }} />
                        </div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 line-clamp-1">{selected.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{selected.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: cfg.color }}>{cfg.label}</span>
                      {selected.location && (
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5" />{selected.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })()}

        {/* Stats overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
            const count = counts[type] || 0;
            if (!count) return null;
            return (
              <div key={type} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold"
                style={{ backgroundColor: `${cfg.color}cc`, boxShadow: `0 2px 8px ${cfg.color}44` }}>
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                {cfg.label} · {count}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}