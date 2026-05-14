import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import AnimatedCounter from "./AnimatedCounter";
import { TrendingUp, Users, Globe, Leaf, DollarSign, Gift, Wrench, RefreshCw } from "lucide-react";

export default function ImpactDashboard() {
  const { data: allListings = [] } = useQuery({
    queryKey: ["listings-all-impact"],
    queryFn: () => base44.entities.Listing.list("-created_date", 10000),
    staleTime: 120_000,
    gcTime: 300_000,
  });

  const stats = useMemo(() => {
    const activeCount = allListings.filter(l => l.status === "actif").length;
    const totalCO2 = allListings.reduce((sum, l) => sum + (l.co2_saved || 0), 0);
    const uniqueUsers = new Set(allListings.map(l => l.created_by)).size;
    const uniqueCountries = new Set(allListings.map(l => l.location).filter(Boolean)).size;
    const totalRevenue = allListings.filter(l => l.type === "vente").reduce((sum, l) => sum + (l.price || 0), 0);
    const totalDons = allListings.filter(l => l.type === "don").length;
    const totalRepairs = allListings.filter(l => l.type === "réparation").length;
    const totalExchanges = allListings.filter(l => l.type === "échange").length;

    return [
      { icon: TrendingUp, label: "Annonces actives", value: activeCount, color: "from-emerald-500 to-teal-600", gradient: "from-emerald-500/20 to-teal-600/20" },
      { icon: Leaf, label: "kg CO₂ économisés", value: Math.round(totalCO2), color: "from-green-500 to-emerald-600", gradient: "from-green-500/20 to-emerald-600/20" },
      { icon: Users, label: "Utilisateurs actifs", value: uniqueUsers, color: "from-violet-500 to-purple-600", gradient: "from-violet-500/20 to-purple-600/20" },
      { icon: Globe, label: "Pays/régions", value: uniqueCountries, color: "from-blue-500 to-cyan-600", gradient: "from-blue-500/20 to-cyan-600/20" },
      { icon: DollarSign, label: "Revenus générés", value: Math.round(totalRevenue), color: "from-amber-500 to-orange-600", gradient: "from-amber-500/20 to-orange-600/20", prefix: "$" },
      { icon: Gift, label: "Dons effectués", value: totalDons, color: "from-rose-500 to-pink-600", gradient: "from-rose-500/20 to-pink-600/20" },
      { icon: Wrench, label: "Réparations", value: totalRepairs, color: "from-orange-500 to-red-600", gradient: "from-orange-500/20 to-red-600/20" },
      { icon: RefreshCw, label: "Échanges", value: totalExchanges, color: "from-cyan-500 to-blue-600", gradient: "from-cyan-500/20 to-blue-600/20" },
    ];
  }, [allListings]);

  return (
    <section className="py-12 px-6 rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(220,30%,7%) 0%, hsl(240,30%,8%) 50%, hsl(158,40%,8%) 100%)"
      }}>
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          Impact en temps réel
        </div>
        <h2 className="font-display text-3xl font-bold text-white">La force de notre communauté</h2>
        <p className="text-white/50 text-sm mt-2">Chaque chiffre = une vie changée · Un objet sauvé · Une connexion établie</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ icon: Icon, label, value, color, gradient, prefix = "" }) => (
          <div key={label} 
            className="relative overflow-hidden rounded-2xl p-4 border border-white/5 transition-all duration-300 hover:border-white/15 hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${gradient})` }}>
            
            {/* Animated gradient background */}
            <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity"
              style={{ background: `linear-gradient(135deg, hsl(158,60%,40%), transparent)` }} />

            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none"
              style={{ background: `radial-gradient(circle, hsl(158,80%,50%), transparent)` }} />

            <div className="relative z-10 space-y-2">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br ${color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>

              {/* Value */}
              <div className="space-y-0.5">
                <p className="text-2xl font-black text-white tracking-tight">
                  {prefix}<AnimatedCounter target={value} />
                </p>
                <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">{label}</p>
              </div>
            </div>

            {/* Live indicator pulse */}
            <div className="absolute bottom-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Footer message */}
      <div className="mt-8 text-center pt-6 border-t border-white/10">
        <p className="text-white/60 text-xs">
          Mis à jour en temps réel · Tous les chiffres sont vérifiables · 
          <span className="text-emerald-400 font-semibold"> Zéro manipulation</span>
        </p>
      </div>
    </section>
  );
}