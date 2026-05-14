import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AnimatedCounter from "./AnimatedCounter";
import { Leaf, Users, Wrench, Gift, Globe, Heart, TrendingUp } from "lucide-react";
import { useMemo } from "react";

const STAT_CONFIG = [
  { icon: Leaf, label: "kg CO₂ évité", color: "from-emerald-500 to-teal-600", key: "co2" },
  { icon: Gift, label: "Objets sauvés", color: "from-blue-500 to-cyan-600", key: "objects" },
  { icon: Users, label: "Utilisateurs actifs", color: "from-purple-500 to-violet-600", key: "users" },
  { icon: Wrench, label: "Réparations effectuées", color: "from-amber-500 to-orange-600", key: "repairs" },
  { icon: Globe, label: "Pays/Régions", color: "from-pink-500 to-rose-600", key: "countries" },
  { icon: Heart, label: "Donations", color: "from-red-500 to-pink-600", key: "donations" },
];

export default function GlobalImpactStats() {
  const { data: listings = [] } = useQuery({
    queryKey: ["listings-all"],
    queryFn: () => base44.entities.Listing.list("-created_date", 10000),
    staleTime: 30_000,
  });

  const stats = useMemo(() => {
    const donations = listings.filter(l => l.type === "don").length;
    const repairs = listings.filter(l => l.type === "réparation").length;
    const co2 = listings.reduce((sum, l) => sum + (l.co2_saved || 0), 0);
    const objects = listings.filter(l => l.status !== "vendu").length;
    const users = new Set(listings.map(l => l.created_by)).size;
    const countries = new Set(listings.map(l => l.location).filter(Boolean)).size;

    return {
      co2: Math.round(co2),
      objects,
      users,
      repairs,
      countries: Math.max(countries, 1),
      donations,
    };
  }, [listings]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {STAT_CONFIG.map(({ icon: Icon, label, color, key }) => (
          <div
            key={key}
            className={`relative rounded-2xl p-4 overflow-hidden border border-white/5 bg-gradient-to-br ${color} opacity-20`}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-white/80" />
                <p className="text-[10px] font-medium text-white/70">{label}</p>
              </div>
              <p className="text-2xl font-bold text-white">
                <AnimatedCounter target={stats[key]} />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Projection */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          <p className="text-xs font-semibold text-white/70">PROJECTION 2030</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50">CO₂ évité (cumulé)</span>
            <span className="text-emerald-400 font-bold">
              {(stats.co2 * 500).toLocaleString()} kg
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50">Emplois verts soutenus</span>
            <span className="text-blue-400 font-bold">{(stats.repairs * 12).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50">Objets sauvés mondiaux</span>
            <span className="text-purple-400 font-bold">{(stats.objects * 250).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}