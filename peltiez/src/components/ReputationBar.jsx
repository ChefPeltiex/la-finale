import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Shield, ChevronRight } from "lucide-react";

const REP_LEVELS = [
  { level: 1, name: "Citoyen",      min: 0,    max: 99,   color: "#94a3b8", icon: "🌱", discount: 0  },
  { level: 2, name: "Contributeur", min: 100,  max: 299,  color: "#10b981", icon: "🌿", discount: 5  },
  { level: 3, name: "Artisan",      min: 300,  max: 699,  color: "#3b82f6", icon: "⚒️",  discount: 12 },
  { level: 4, name: "Gardien",      min: 700,  max: 1499, color: "#a855f7", icon: "🛡️",  discount: 20 },
  { level: 5, name: "Pilier",       min: 1500, max: 2999, color: "#f59e0b", icon: "👑",  discount: 30 },
  { level: 6, name: "Légende",      min: 3000, max: Infinity, color: "#FFD700", icon: "⭐", discount: 50 },
];

function calcPts(listings = []) {
  return (
    listings.length * 5 +
    listings.filter(l => l.status === "vendu").length * 20 +
    listings.filter(l => l.type === "don").length * 30 +
    listings.filter(l => l.type === "réparation").length * 40 +
    listings.filter(l => l.type === "échange").length * 25
  );
}

export default function ReputationBar({ listings = [] }) {
  const pts = useMemo(() => calcPts(listings), [listings]);

  const current = REP_LEVELS.filter(r => pts >= r.min).pop() || REP_LEVELS[0];
  const next = REP_LEVELS.find(r => r.min > pts);

  // 6 milestone dots across the full bar
  const milestones = REP_LEVELS.slice(1).map(r => ({
    pct: Math.min((r.min / (REP_LEVELS[5].min)) * 100, 100),
    icon: r.icon,
    unlocked: pts >= r.min,
    color: r.color,
  }));

  const globalPct = Math.min((pts / REP_LEVELS[5].min) * 100, 100);

  return (
    <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Réputation CirculAI</span>
        </div>
        <Link to="/reputation" className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
          Détails <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Level badge + pts */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: `${current.color}18`, border: `2px solid ${current.color}50` }}>
          {current.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-bold text-foreground">{current.name}</span>
            {current.discount > 0 && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${current.color}20`, color: current.color, border: `1px solid ${current.color}40` }}>
                -{current.discount}% rabais
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-mono">{pts} pts · {next ? `${next.min - pts} pts vers ${next.icon} ${next.name}` : "Niveau maximum ⭐"}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-black" style={{ color: current.color }}>{Math.round(globalPct)}%</p>
          <p className="text-[10px] text-muted-foreground">de la Légende</p>
        </div>
      </div>

      {/* Main progress bar with milestones */}
      <div className="space-y-2">
        <div className="relative w-full h-4 rounded-full overflow-visible" style={{ background: "hsl(var(--muted))" }}>
          {/* Filled portion */}
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${globalPct}%`, background: `linear-gradient(90deg, #10b981, #3b82f6, #a855f7, #f59e0b, #FFD700)` }} />
          {/* Milestone dots */}
          {milestones.map((m, i) => (
            <div key={i} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center"
              style={{ left: `${m.pct}%` }}>
              <div className="h-5 w-5 rounded-full border-2 border-background flex items-center justify-center text-[10px]"
                style={{ background: m.unlocked ? m.color : "hsl(var(--muted-foreground))", opacity: m.unlocked ? 1 : 0.35 }}>
                {m.unlocked ? "✓" : "·"}
              </div>
            </div>
          ))}
        </div>

        {/* Level labels row */}
        <div className="flex justify-between text-[9px] font-mono text-muted-foreground px-1">
          {REP_LEVELS.map(r => (
            <span key={r.level} style={{ color: pts >= r.min ? r.color : undefined, opacity: pts >= r.min ? 1 : 0.4 }}>
              {r.icon}
            </span>
          ))}
        </div>
      </div>

      {/* Next unlock */}
      {next && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{ background: `${next.color}10`, border: `1px solid ${next.color}30` }}>
          <span className="text-lg">{next.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: next.color }}>{next.name} — prochain palier</p>
            <p className="text-[10px] text-muted-foreground">-{next.discount}% rabais · Plus de pouvoir décisionnel</p>
          </div>
          <p className="text-xs font-mono font-black flex-shrink-0" style={{ color: next.color }}>
            +{next.min - pts} pts
          </p>
        </div>
      )}

      {/* Quick actions to earn pts */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Faire un don", pts: "+30", link: "/publier" },
          { label: "Réparer", pts: "+40", link: "/publier" },
          { label: "Vendre", pts: "+20", link: "/publier" },
          { label: "Inviter", pts: "+50", link: "/referral" },
        ].map(a => (
          <Link key={a.label} to={a.link}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            style={{ border: "1px solid hsl(var(--border))" }}>
            <span className="text-xs text-muted-foreground">{a.label}</span>
            <span className="text-xs font-mono font-bold text-primary">{a.pts}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}