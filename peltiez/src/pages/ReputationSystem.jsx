import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const REP_LEVELS = [
  { level: 1, name: "Citoyen",     min: 0,    max: 99,   color: "#94a3b8", discount: 0,  icon: "🌱", perks: ["Accès standard marketplace"] },
  { level: 2, name: "Contributeur",min: 100,  max: 299,  color: "#10b981", discount: 5,  icon: "🌿", perks: ["5% rabais marketplace", "Badge visible", "Vote communautaire"] },
  { level: 3, name: "Artisan",     min: 300,  max: 699,  color: "#3b82f6", discount: 12, icon: "⚒️",  perks: ["12% rabais", "Priorité dans les résultats", "Accès contrats simplifiés"] },
  { level: 4, name: "Gardien",     min: 700,  max: 1499, color: "#a855f7", discount: 20, icon: "🛡️",  perks: ["20% rabais", "Poids x2 dans les votes", "Profil vérifié Gardien"] },
  { level: 5, name: "Pilier",      min: 1500, max: 2999, color: "#f59e0b", discount: 30, icon: "👑",  perks: ["30% rabais", "Accès VIP événements", "Co-décision stratégique"] },
  { level: 6, name: "Légende",     min: 3000, max: Infinity, color: "#FFD700", discount: 50, icon: "⭐", perks: ["50% rabais permanent", "Siège Conseil CirculAI", "Héritage numérique"] },
];

const HOW_TO_EARN = [
  { action: "Publier une annonce",         pts: "+5",   icon: "📦" },
  { action: "Vendre un objet",             pts: "+20",  icon: "💰" },
  { action: "Faire un don",                pts: "+30",  icon: "🎁" },
  { action: "Compléter une réparation",    pts: "+40",  icon: "🔧" },
  { action: "Faire un échange",            pts: "+25",  icon: "♻️" },
  { action: "Partager sur réseau social",  pts: "+15",  icon: "📡" },
  { action: "Inviter un membre actif",     pts: "+50",  icon: "👥" },
  { action: "Recevoir une évaluation 5★",  pts: "+35",  icon: "⭐" },
  { action: "Créer du contenu de qualité", pts: "+60",  icon: "✍️" },
  { action: "Résoudre un conflit communautaire", pts: "+100", icon: "🕊️" },
];

const LEADERBOARD = [
  { name: "Marie-Ève T.", city: "Québec",   pts: 3420, icon: "⭐", level: "Légende" },
  { name: "Jean-F. B.",   city: "Montréal", pts: 2890, icon: "👑", level: "Pilier" },
  { name: "Amara N.",     city: "Laval",    pts: 1870, icon: "👑", level: "Pilier" },
  { name: "Lucas M.",     city: "Longueuil",pts: 1240, icon: "🛡️",  level: "Gardien" },
  { name: "Yuki T.",      city: "Gatineau", pts: 890,  icon: "🛡️",  level: "Gardien" },
];

export default function ReputationSystem() {
  const [activeTab, setActiveTab] = useState("levels");

  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me(), staleTime: Infinity });
  const { data: listings = [] } = useQuery({
    queryKey: ["my-listings-rep", user?.email],
    queryFn: () => user ? base44.entities.Listing.filter({ created_by: user.email }, "-created_date", 100) : [],
    enabled: !!user,
  });

  const estimatedPts = listings.length * 5
    + listings.filter(l => l.status === "vendu").length * 20
    + listings.filter(l => l.type === "don").length * 30
    + listings.filter(l => l.type === "réparation").length * 40
    + listings.filter(l => l.type === "échange").length * 25;

  const currentLevel = REP_LEVELS.filter(r => estimatedPts >= r.min).pop() || REP_LEVELS[0];
  const nextLevel = REP_LEVELS.find(r => r.min > estimatedPts);
  const progressPct = nextLevel
    ? Math.min(((estimatedPts - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100, 100)
    : 100;

  return (
    <div className="min-h-screen pb-20" style={{ background: "linear-gradient(160deg, hsl(220,30%,5%) 0%, hsl(260,25%,6%) 100%)" }}>
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">

        {/* Hero */}
        <div className="text-center space-y-4">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 font-mono tracking-widest px-4 py-1.5">
            🏅 TOKENS DE RÉPUTATION — MITHRIL DIGITAL
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
            Ton aide = Ton pouvoir.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300">
              Infalsifiable. Permanent.
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Chaque action positive sur CirculAI Hub augmente ton poids décisionnel, tes rabais sur le marketplace et ton statut dans la communauté.
          </p>
        </div>

        {/* My Score */}
        <div className="rounded-3xl p-8" style={{ background: "rgba(255,215,0,0.06)", border: `2px solid ${currentLevel.color}50` }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">{currentLevel.icon}</div>
            <div className="flex-1">
              <p className="text-xs font-mono text-white/40 mb-1">TON NIVEAU ACTUEL</p>
              <h2 className="font-display text-3xl font-black text-white">{currentLevel.name}</h2>
              <p className="text-sm font-mono" style={{ color: currentLevel.color }}>{estimatedPts} pts de réputation</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-emerald-300">{currentLevel.discount}%</p>
              <p className="text-xs text-white/40">de rabais</p>
            </div>
          </div>
          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-white/40">
                <span>{estimatedPts} pts</span>
                <span>{nextLevel.name} dans {nextLevel.min - estimatedPts} pts →</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})` }} />
              </div>
            </div>
          )}
          {currentLevel.perks.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {currentLevel.perks.map(p => (
                <span key={p} className="text-xs flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: `${currentLevel.color}20`, color: currentLevel.color, border: `1px solid ${currentLevel.color}40` }}>
                  <CheckCircle className="h-3 w-3" /> {p}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-3">
          {[{ id: "levels", label: "Niveaux" }, { id: "earn", label: "Gagner des pts" }, { id: "board", label: "Classement" }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
              style={{
                background: activeTab === t.id ? "rgba(245,158,11,0.25)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeTab === t.id ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.08)"}`,
                color: activeTab === t.id ? "#fbbf24" : "rgba(255,255,255,0.5)",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "levels" && (
          <div className="space-y-3">
            {REP_LEVELS.map(r => (
              <div key={r.level} className="rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.01]"
                style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${estimatedPts >= r.min ? r.color + "60" : "rgba(255,255,255,0.06)"}` }}>
                <span className="text-3xl">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white">{r.name}</h3>
                    {estimatedPts >= r.min && <CheckCircle className="h-4 w-4" style={{ color: r.color }} />}
                  </div>
                  <p className="text-xs font-mono" style={{ color: r.color }}>{r.min === 0 ? "0" : r.min.toLocaleString("fr-FR")} pts → {r.max === Infinity ? "∞" : r.max.toLocaleString("fr-FR")} pts</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black" style={{ color: r.color }}>{r.discount}%</p>
                  <p className="text-[10px] text-white/30">rabais</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "earn" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {HOW_TO_EARN.map(a => (
              <div key={a.action} className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1">
                  <p className="text-sm text-white/80">{a.action}</p>
                </div>
                <span className="font-mono font-black text-emerald-300 text-sm">{a.pts}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "board" && (
          <div className="space-y-3">
            {LEADERBOARD.map((m, i) => (
              <div key={m.name} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: i === 0 ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "rgba(255,215,0,0.4)" : "rgba(255,255,255,0.06)"}` }}>
                <span className="text-xl font-black text-white/30 w-6">#{i + 1}</span>
                <span className="text-2xl">{m.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-white">{m.name}</p>
                  <p className="text-xs text-white/40">{m.city} · {m.level}</p>
                </div>
                <span className="font-mono font-black text-amber-300">{m.pts.toLocaleString("fr-FR")} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}