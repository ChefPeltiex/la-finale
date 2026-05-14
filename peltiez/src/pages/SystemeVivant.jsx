import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import {
  Activity, Zap, Shield, Globe, Leaf, Package,
  Gift, Wrench, RefreshCw, Crown, Brain, CheckCircle, AlertTriangle,
  ArrowRight, Infinity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Auto-Diagnostic Engine ────────────────────────────────────────
function useDiagnostic(listings, ecoProfiles) {
  return useMemo(() => {
    const checks = [];
    const total = listings.length;
    const actifs = listings.filter(l => l.status === "actif").length;
    const dons = listings.filter(l => l.type === "don").length;
    const co2 = listings.reduce((s, l) => s + (l.co2_saved || 0), 0);
    const villes = new Set(listings.map(l => l.location).filter(Boolean)).size;
    const taux = total > 0 ? Math.round((actifs / total) * 100) : 0;

    checks.push({
      label: "Flux d'annonces actives",
      status: actifs >= 5 ? "ok" : actifs >= 1 ? "warn" : "alert",
      valeur: `${actifs} annonces en direct`,
      action: actifs < 5 ? { label: "Publier", path: "/publier" } : null,
    });
    checks.push({
      label: "Couverture géographique",
      status: villes >= 5 ? "ok" : villes >= 2 ? "warn" : "alert",
      valeur: `${villes} ville${villes > 1 ? "s" : ""} représentée${villes > 1 ? "s" : ""}`,
      action: villes < 3 ? { label: "Activer un Hub", path: "/city-hubs" } : null,
    });
    checks.push({
      label: "Économie du don",
      status: dons >= 3 ? "ok" : dons >= 1 ? "warn" : "alert",
      valeur: `${dons} don${dons > 1 ? "s" : ""} actif${dons > 1 ? "s" : ""}`,
      action: dons < 2 ? { label: "Offrir un objet", path: "/publier" } : null,
    });
    checks.push({
      label: "Impact carbone mesuré",
      status: co2 >= 100 ? "ok" : co2 >= 10 ? "warn" : "alert",
      valeur: `${co2.toFixed(1)} kg CO₂ évité`,
      action: null,
    });
    checks.push({
      label: "Taux de conversion",
      status: taux >= 60 ? "ok" : taux >= 30 ? "warn" : "alert",
      valeur: `${taux}% des annonces actives`,
      action: taux < 30 ? { label: "Négociation IA", path: "/negociation-ia" } : null,
    });
    checks.push({
      label: "Réseau Artisans",
      status: "ok",
      valeur: "Hub Artisans opérationnel",
      action: null,
    });

    const score = Math.round((checks.filter(c => c.status === "ok").length / checks.length) * 100);
    return { checks, score, total, co2, dons, villes, actifs };
  }, [listings, ecoProfiles]);
}

const STATUS_MAP = {
  ok:    { color: "#10b981", bg: "rgba(16,185,129,0.1)",  icon: CheckCircle, label: "Optimal" },
  warn:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: AlertTriangle, label: "À améliorer" },
  alert: { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: Zap, label: "Action requise" },
};

// ── Flux Financier Transparent ────────────────────────────────────
const REDISTRIBUTION = [
  { label: "Artisans locaux", pct: 40, color: "#f59e0b", icon: Wrench },
  { label: "Piliers 144K",    pct: 25, color: "#6366f1", icon: Crown },
  { label: "Infra CirculAI",  pct: 20, color: "#10b981", icon: Shield },
  { label: "Fonds Planète",   pct: 15, color: "#22c55e", icon: Leaf },
];

// ── Actions Autonomes (recommendations auto) ───────────────────────
function AutoActions({ diagnostic }) {
  const actions = diagnostic.checks.filter(c => c.action);
  if (actions.length === 0) return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
      <p className="text-sm font-semibold text-foreground">Système optimal. Aucune action prioritaire détectée.</p>
    </div>
  );
  return (
    <div className="space-y-2">
      {actions.map((a, i) => (
        <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{a.label}</p>
            <p className="text-xs text-muted-foreground">{a.valeur}</p>
          </div>
          <Button asChild size="sm" className="rounded-xl shrink-0 text-xs font-bold h-8">
            <Link to={a.action.path}>{a.action.label} <ArrowRight className="h-3 w-3 ml-1" /></Link>
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function SystemeVivant() {
  const [, setTick] = useState(0);
  const [uptime] = useState(() => Date.now());

  const { data: listings = [], refetch, isFetching } = useQuery({
    queryKey: ["listings-systeme"],
    queryFn: () => base44.entities.Listing.list("-created_date", 500),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const { data: ecoProfiles = [] } = useQuery({
    queryKey: ["eco-systeme"],
    queryFn: () => base44.entities.EcoProfile.list("-created_date", 100),
    staleTime: 60_000,
  });

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const diagnostic = useDiagnostic(listings, ecoProfiles);

  const uptimeSecs = Math.floor((Date.now() - uptime) / 1000);
  const uptimeStr = uptimeSecs < 60
    ? `${uptimeSecs}s`
    : uptimeSecs < 3600
      ? `${Math.floor(uptimeSecs / 60)}m ${uptimeSecs % 60}s`
      : `${Math.floor(uptimeSecs / 3600)}h ${Math.floor((uptimeSecs % 3600) / 60)}m`;

  const scoreColor = diagnostic.score >= 80 ? "#10b981" : diagnostic.score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="pb-20 space-y-8 max-w-4xl mx-auto px-4 pt-6">

      {/* ── HEADER ── */}
      <div className="rounded-3xl p-8 border border-border relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(99,102,241,0.04))" }}>
        <div className="absolute top-3 right-5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-xs text-emerald-500 font-bold">SYSTÈME VIVANT · EN LIGNE</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground mb-1 flex items-center gap-3">
              <Activity className="h-8 w-8 text-emerald-500" /> Système Vivant
            </h1>
            <p className="text-muted-foreground">Auto-diagnostic · Flux financier transparent · Actions autonomes</p>
          </div>
          <div className="ml-auto flex gap-3 items-center">
            <div className="text-right text-xs text-muted-foreground">
              <p>Uptime : <strong className="text-foreground">{uptimeStr}</strong></p>
              <p>{listings.length} annonces indexées</p>
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm" className="rounded-xl gap-2"
              disabled={isFetching}>
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              Sync
            </Button>
          </div>
        </div>
      </div>

      {/* ── SCORE GLOBAL ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Score circulaire */}
        <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center justify-center">
          <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest">Score Santé Hub</p>
          <div className="relative h-28 w-28 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor} strokeWidth="2.5"
                strokeDasharray={`${diagnostic.score} 100`} strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s ease" }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black" style={{ color: scoreColor }}>{diagnostic.score}</span>
              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
          </div>
          <Badge className="font-bold text-white border-0" style={{ background: scoreColor }}>
            {diagnostic.score >= 80 ? "🟢 Excellent" : diagnostic.score >= 50 ? "🟡 Correct" : "🔴 À optimiser"}
          </Badge>
        </div>

        {/* Stats vitales */}
        <div className="sm:col-span-2 grid grid-cols-2 gap-3">
          {[
            { icon: Package, label: "Annonces actives",   val: diagnostic.actifs,             color: "text-blue-500" },
            { icon: Leaf,    label: "kg CO₂ évité",       val: diagnostic.co2.toFixed(1),     color: "text-emerald-500" },
            { icon: Gift,    label: "Dons en circulation", val: diagnostic.dons,               color: "text-rose-500" },
            { icon: Globe,   label: "Villes connectées",  val: diagnostic.villes,             color: "text-violet-500" },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="bg-card rounded-2xl border border-border p-4 text-center">
              <Icon className={`h-5 w-5 mx-auto mb-1.5 ${color}`} />
              <p className={`text-xl font-black ${color}`}>{val}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── DIAGNOSTIC CHECKS ── */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-bold text-foreground flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" /> Auto-Diagnostic du Système
        </h2>
        <div className="space-y-2">
          {diagnostic.checks.map((check, i) => {
            const cfg = STATUS_MAP[check.status];
            const Icon = cfg.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
                <Icon className="h-4 w-4 flex-shrink-0" style={{ color: cfg.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{check.label}</p>
                  <p className="text-xs" style={{ color: cfg.color }}>{check.valeur}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full text-white"
                  style={{ background: cfg.color }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ACTIONS AUTONOMES ── */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <h2 className="font-bold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" /> Actions Prioritaires Détectées
        </h2>
        <AutoActions diagnostic={diagnostic} />
      </div>

      {/* ── FLUX FINANCIER TRANSPARENT ── */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
        <h2 className="font-bold text-foreground flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-500" /> Redistribution Financière Transparente
        </h2>
        <p className="text-sm text-muted-foreground">
          Chaque transaction sur CirculAI Hub est répartie selon ces règles immuables de justice économique.
        </p>
        <div className="space-y-3">
          {REDISTRIBUTION.map(({ label, pct, color, icon: Icon }) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" style={{ color }} />
                  <span className="font-semibold text-foreground">{label}</span>
                </div>
                <span className="font-black" style={{ color }}>{pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-4 border border-emerald-400/20 text-xs text-muted-foreground leading-relaxed"
          style={{ background: "rgba(16,185,129,0.04)" }}>
          ✦ Ces règles sont inscrites dans la structure du Hub et ne peuvent pas être modifiées par une entité unique.
          La transparence est la seule protection contre la corruption.
        </div>
      </div>

      {/* ── MODULES CONNECTÉS ── */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-3">
        <h2 className="font-bold text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" /> Modules Actifs
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: "Recommandations IA", path: "/recommandations", ok: true },
            { label: "Négociation IA",     path: "/negociation-ia",  ok: true },
            { label: "Hubs Urbains",       path: "/city-hubs",       ok: true },
            { label: "Smart Contrats",     path: "/smart-contrats",  ok: true },
            { label: "Artisans Hub",       path: "/artisans",        ok: true },
            { label: "Conseil Jedi",       path: "/conseil-jedi",    ok: true },
          ].map(m => (
            <Link key={m.path} to={m.path}
              className="flex items-center gap-2 p-3 rounded-xl bg-muted hover:bg-muted/70 transition-colors">
              <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-xs font-semibold text-foreground truncate">{m.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── MANIFESTE ── */}
      <div className="rounded-3xl p-8 text-center space-y-4 border"
        style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(99,102,241,0.04))", borderColor: "rgba(16,185,129,0.15)" }}>
        <Infinity className="h-8 w-8 text-emerald-500 mx-auto" />
        <h2 className="font-display text-2xl font-bold text-foreground">
          Le Hub est vivant. <span className="text-primary">Il s'améliore en permanence.</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Chaque donnée publiée, chaque échange conclu, chaque don offert nourrit le système.
          La transparence est notre armure. La circularité est notre loi. La dignité humaine est notre but.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button asChild className="rounded-xl font-bold gap-2">
            <Link to="/publier"><Zap className="h-4 w-4" /> Contribuer</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl gap-2">
            <Link to="/maitre"><Crown className="h-4 w-4" /> Centre de Commandement</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}