import { Leaf, Gift, Wrench, Package, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function UserImpactDashboard({ listings = [], ecoProfile }) {
  const stats = {
    co2_saved: listings.reduce((sum, l) => sum + (l.co2_saved || 0), 0),
    objects_saved: listings.filter(l => l.type === "don").length,
    repairs: listings.filter(l => l.type === "réparation").length,
    donations: listings.filter(l => l.type === "don").length,
    sales: listings.filter(l => l.type === "vente").length,
    exchanges: listings.filter(l => l.type === "échange").length,
  };

  const equivalents = {
    trees: Math.round(stats.co2_saved / 21),
    miles: Math.round(stats.co2_saved / 0.411),
    bottles: Math.round(stats.co2_saved / 0.024),
  };

  const level = ecoProfile?.level || "Graine 🌱";
  const levelColors = {
    "Graine 🌱": { bg: "from-green-400 to-emerald-600", text: "Début d'un beau voyage" },
    "Pousse 🌿": { bg: "from-emerald-400 to-green-600", text: "Tu prends racine" },
    "Arbre 🌳": { bg: "from-teal-400 to-emerald-700", text: "Tu fais la différence" },
    "Forêt 🌲": { bg: "from-green-500 to-teal-700", text: "Tu inspires les autres" },
    "Gardien 🌍": { bg: "from-emerald-500 to-teal-800", text: "Guardian de la planète" },
  };

  const levelColor = levelColors[level] || levelColors["Graine 🌱"];

  return (
    <div className="space-y-6">
      {/* Main CO2 Hero */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${levelColor.bg} text-white p-8 shadow-lg`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, rgba(255,255,255,0.5), transparent)" }} />
        
        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">Impact total généré</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">{Math.round(stats.co2_saved)}</span>
              <span className="text-2xl font-bold">kg CO₂</span>
            </div>
            <p className="text-white/60 text-xs mt-2">Économisé du flux de déchets</p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold">{equivalents.trees}</p>
              <p className="text-xs text-white/70">Arbres plantés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{equivalents.miles}</p>
              <p className="text-xs text-white/70">Miles de voiture</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{equivalents.bottles}</p>
              <p className="text-xs text-white/70">Bouteilles plastique</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20">
            <Badge className="bg-white/20 text-white border-white/30">
              Niveau: {level}
            </Badge>
            <p className="text-xs text-white/70 mt-2">{levelColor.text}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: Gift, label: "Dons", value: stats.donations, color: "from-emerald-100 to-green-100 text-emerald-700" },
          { icon: Wrench, label: "Réparations", value: stats.repairs, color: "from-amber-100 to-orange-100 text-amber-700" },
          { icon: Package, label: "Ventes", value: stats.sales, color: "from-blue-100 to-cyan-100 text-blue-700" },
          { icon: TrendingUp, label: "Échanges", value: stats.exchanges, color: "from-purple-100 to-pink-100 text-purple-700" },
          { icon: Leaf, label: "Objets sauvés", value: stats.objects_saved, color: "from-teal-100 to-emerald-100 text-teal-700" },
          { icon: Users, label: "Membres aidés", value: "0", color: "from-rose-100 to-pink-100 text-rose-700" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl bg-gradient-to-br ${stat.color} p-4 text-center border border-white/30`}>
            <div className="flex justify-center mb-2">
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs font-medium mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Message d'impact */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center space-y-2">
        <p className="text-sm font-semibold text-emerald-900">
          🌍 Tu as un impact réel
        </p>
        <p className="text-xs text-emerald-700 leading-relaxed">
          Chaque objet donné, échangé ou réparé = moins de déchets, moins de CO₂, plus de vie.
          <br />
          <strong>Continue comme ça. Le monde a besoin de toi.</strong>
        </p>
      </div>
    </div>
  );
}