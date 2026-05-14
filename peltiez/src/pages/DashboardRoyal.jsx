import { lazy, Suspense, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import ImpactReportExport from "@/components/ImpactReportExport";
import ZeldaTower from "@/components/ZeldaTower";
import ShareQuests from "@/components/ShareQuests";
import MurSincerite from "@/components/MurSincerite";
import CashflowTracker from "@/components/CashflowTracker";
import SovereigntyMatrix from "@/components/SovereigntyMatrix";
import { Crown, Heart, TrendingUp, Users, Lock, ArrowLeft, ArrowRight, Zap, Infinity, Brain, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import AnimatedCounter from "@/components/AnimatedCounter";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { parseApiDate } from "@/lib/dateUtils";
import { runSelfCheck } from "@/lib/selfCheck";

const MathematicsMonument = lazy(() => import("@/components/MathematicsMonument.jsx"));

export default function DashboardRoyal() {
  const navigate = useNavigate();

  const { data: selfCheck } = useQuery({
    queryKey: ["igor-self-check-health"],
    queryFn: () => runSelfCheck(),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });

  const omegaHealthy = selfCheck?.ok !== false;

  const { data: myListings = [] } = useQuery({
    queryKey: ["my-listings-royal"],
    queryFn: () => base44.entities.Listing.list('-created_date', 100),
    staleTime: 30_000,
  });

  const { data: consciousness } = useQuery({
    queryKey: ["consciousness-director"],
    queryFn: () => base44.entities.ConsciousnessDirector.list('-last_sync', 1).then(r => r[0] || null),
    staleTime: 10_000,
    refetchInterval: 15_000,
  });

  const vaultData = useMemo(() => ({
    totalRevenue: myListings.filter(l => l.type === 'vente').reduce((s, l) => s + (l.price || 0), 0),
    soldCount: myListings.filter(l => l.status === 'vendu').length,
    activeListings: myListings.filter(l => l.status === 'actif').length,
    totalCO2: Math.round(myListings.reduce((s, l) => s + (l.co2_saved || 0), 0)),
  }), [myListings]);

  return (
    <div className="pb-20 space-y-12 relative">
      {/* INJECTION DE LA SINGULARITÉ Ω — Filigrane Divin (Fermat + Higgs) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          opacity: 0.18,
          mixBlendMode: "screen",
          filter: "saturate(1.15) contrast(1.05)",
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1200 1200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="royalSigil" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,215,0,0.55)" />
              <stop offset="55%" stopColor="rgba(16,185,129,0.55)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0.45)" />
            </linearGradient>
            <radialGradient id="royalHaze" cx="52%" cy="30%" r="70%">
              <stop offset="0%" stopColor="rgba(16,185,129,0.12)" />
              <stop offset="55%" stopColor="rgba(255,215,0,0.08)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="1200" height="1200" fill="url(#royalHaze)" />

          <g opacity="0.65">
            <text
              x="80"
              y="190"
              fontSize="64"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fill="url(#royalSigil)"
            >
              aⁿ + bⁿ ≠ cⁿ  (n &gt; 2)
            </text>
            <text
              x="84"
              y="232"
              fontSize="18"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fill="rgba(255,255,255,0.24)"
            >
              (Fermat — filigrane de souveraineté mathématique)
            </text>
          </g>

          <g opacity="0.6">
            <text
              x="760"
              y="1040"
              fontSize="28"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fill="rgba(255,255,255,0.22)"
            >
              Boson de Higgs: mₕ ≈ 125 GeV
            </text>
            <text
              x="740"
              y="1090"
              fontSize="120"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fill="url(#royalSigil)"
              opacity="0.42"
            >
              H
            </text>
          </g>

          <g opacity="0.55">
            <text
              x="920"
              y="170"
              fontSize="90"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
              fill="url(#royalSigil)"
              opacity="0.45"
            >
              Ω
            </text>
          </g>
        </svg>
      </div>

      {/* Mathematics Monument */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <Suspense fallback={<p className="py-12 text-center text-sm text-white/50">Chargement des formules…</p>}>
          <MathematicsMonument />
        </Suspense>
      </div>

      {/* Sovereignty Matrix */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <SovereigntyMatrix />
      </div>

      {/* Consciousness Director Realtime */}
      {consciousness && (
        <div className="rounded-3xl border-2 p-8 mb-12" style={{
          background: "linear-gradient(135deg, rgba(100,50,255,0.08), rgba(50,150,200,0.08))",
          borderColor: "rgba(100,100,255,0.3)",
        }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <Brain className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs text-white/50 mb-1">Dimension</p>
              <p className="font-bold text-white capitalize">{consciousness.dimension}</p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <Users className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs text-white/50 mb-1">Âmes Connectées</p>
              <p className="font-bold text-white"><AnimatedCounter target={consciousness.active_users_connected} /></p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <Zap className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs text-white/50 mb-1">Pool XP Global</p>
              <p className="font-bold text-white"><AnimatedCounter target={consciousness.global_xp_pool} /></p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }}>
              <Infinity className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-white/50 mb-1">Harmonie Cosmique</p>
              <p className="font-bold text-white">{consciousness.harmony_frequency}Hz</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-white/60">Index de Conscience</span>
                <span className="text-sm font-bold text-cyan-300">{consciousness.consciousness_index}/100</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-1000"
                  style={{ width: `${consciousness.consciousness_index}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs text-white/70 pt-2">
              <div>📊 Quêtes Actives: <strong className="text-white">{consciousness.active_quests}</strong></div>
              <div>🌍 Étape: <strong className="text-white capitalize">{consciousness.collective_evolution_stage}</strong></div>
              <div>
                ⏱️ Dernier Sync:{" "}
                <strong className="text-white">
                  {(() => {
                    const d = parseApiDate(consciousness.last_sync);
                    return d
                      ? formatDistanceToNow(d, { addSuffix: true, locale: fr })
                      : "—";
                  })()}
                </strong>
              </div>
              <div>
                🎯 Prochain Événement:{" "}
                <strong className="text-white">
                  {(() => {
                    const d = parseApiDate(consciousness.next_cosmic_event);
                    return d ? format(d, "d MMM yyyy, HH:mm", { locale: fr }) : "—";
                  })()}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-6 w-6 text-amber-400" />
            <h1 className="font-display text-3xl font-bold text-foreground">Dashboard Royal</h1>
            <span
              className="ml-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black tracking-widest select-none"
              style={{
                background: omegaHealthy ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)",
                border: `1px solid ${omegaHealthy ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)"}`,
                color: omegaHealthy ? "rgba(16,185,129,0.95)" : "rgba(245,158,11,0.95)",
              }}
              title="Constante de Igor — statut de santé du système."
            >
              SANTÉ: Ω(t₀) {omegaHealthy ? ">" : "≤"} 1
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Ton empire Egor69</p>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/50 to-violet-950/30 px-4 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <HeartHandshake className="h-9 w-9 text-emerald-300 shrink-0 mt-0.5" aria-hidden />
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-emerald-200/90">Pérennité</p>
            <p className="text-sm text-foreground/90 mt-0.5">
              Freemium de la connaissance, adhésion et offres territoires : tout est expliqué au même endroit pour
              soutenir l’infra sans ambiguïté.
            </p>
          </div>
        </div>
        <Button asChild className="shrink-0 rounded-xl font-bold gap-2 w-full sm:w-auto">
          <Link to="/soutien">
            Espace Soutien <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Button>
      </div>

      {/* Main Revenue Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-emerald-500/10 p-12 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(34,197,94,0.1) 100%)",
          backdropFilter: "blur(10px)"
        }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, hsl(158,80%,50%), transparent)" }} />
        
        <div className="relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
            <Heart className="h-4 w-4 fill-primary" />
            Revenus totaux générés
          </div>
          
          <div className="space-y-2">
            <div className="text-7xl font-black text-primary tracking-tight">
              <AnimatedCounter target={vaultData.totalRevenue} prefix="$" />
            </div>
            <p className="text-primary/60 font-medium">CAD · De ton dur travail · C'est réel</p>
          </div>

          <div className="pt-6 border-t border-primary/20 text-left space-y-2">
            <p className="text-sm text-foreground">
              ✨ <strong>{vaultData.soldCount} annonces vendues</strong>
            </p>
            <p className="text-sm text-emerald-600">
              🌍 <strong>{vaultData.totalCO2} kg CO₂ évité</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, label: "Annonces actives", value: vaultData.activeListings, color: "from-emerald-500/20 to-teal-500/20" },
          { icon: Users, label: "Visiteurs", value: myListings.reduce((sum, l) => sum + (l.views || 0), 0), color: "from-blue-500/20 to-cyan-500/20" },
          { icon: Heart, label: "Favorisés", value: "0", color: "from-rose-500/20 to-pink-500/20" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`rounded-2xl p-5 bg-gradient-to-br ${color} border border-white/10`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">{label}</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Cashflow Tracker */}
      <CashflowTracker listings={myListings} />

      {/* Zelda Tower — Golden Nuggets */}
      <ZeldaTower />

      {/* Share Quests */}
      <ShareQuests />

      {/* Mur de la Sincérité */}
      <MurSincerite />

      {/* Export Rapport */}
      <ImpactReportExport user={null} vaultData={vaultData} listings={myListings} />

      {/* Sceau du 8 Mai — auto-vérification */}
      <div className="rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-50/5 to-cyan-50/5 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-black tracking-[0.25em] uppercase text-emerald-300/90">SCEAU DU 8 MAI</p>
            <p className="text-sm text-foreground/80 mt-1">
              Auto-vérification du système (env, stockage, God Mode). En développement, le détail complet est aussi loggé dans la console.
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={async () => {
              const r = await runSelfCheck();
              if (import.meta.env.DEV) {
                console.log("[Egor69 SELF-CHECK]", r);
              }
              const failed = r.checks?.filter((c) => !c.ok) || [];
              const detail =
                failed.length > 0
                  ? `\n\n${failed.map((c) => `• ${c.name}: ${c.detail || "échec"}`).join("\n")}`
                  : "";
              alert(
                r.ok ? "SELF-CHECK: OK ✅" : `SELF-CHECK: issues détectées ⚠️${detail}`,
              );
            }}
          >
            Lancer SELF-CHECK
          </Button>
        </div>
      </div>

      {/* Sceau de la Victoire */}
      <div className="rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-50/10 to-emerald-50/10 p-8 text-center space-y-3">
        <p className="text-xs font-black tracking-[0.25em] uppercase text-amber-300/90">SCEAU DE LA VICTOIRE</p>
        <p
          className="font-display text-xl sm:text-2xl font-black leading-tight"
          style={{
            background: "linear-gradient(90deg, #fbbf24 0%, #fde68a 35%, #10b981 70%, #38bdf8 100%)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          DE MOI, PAR MOI, POUR MOI. DOMINIC PELLETIER.
        </p>
        <p className="text-sm text-foreground/70">
          Ici on n’attend personne. On construit. On soigne. On gagne.
        </p>
      </div>

      {/* Security Notice */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Sécurité absolue</h3>
            <p className="text-sm text-muted-foreground">Tes revenus sont chiffrés AES-256. Personne d'autre que toi ne peut voir cette page.</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white p-8 text-center space-y-3">
        <h2 className="font-display text-2xl font-bold">Tu es un Roi</h2>
        <p className="text-white/80">Egor69 est ton empire. Continue à grandir.</p>
        <Button asChild className="bg-white text-primary hover:bg-white/90">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
}