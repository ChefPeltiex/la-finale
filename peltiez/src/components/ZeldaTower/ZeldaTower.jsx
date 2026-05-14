import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { fetchGoldenNuggetsScan } from "@/components/ZeldaTower/scanner";
import { createStripeCheckout } from "@/payments/checkout";
import { computeBfRate, computeOmega } from "@/payments/omega";
import { auditTransaction } from "@/lib/auditLog";
import { emitStardust } from "@/lib/godMode";
import { toast } from "sonner";
import {
  Telescope, Loader2, RefreshCw, Zap, TrendingUp, DollarSign,
  Cpu, AlertTriangle, Star, Crown, Globe, Lightbulb,
  Shield, Play, Copy, Check, CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  opportunite: { icon: TrendingUp,    label: "Opportunité",  color: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.5)",  text: "#10b981", badge: "#065f46" },
  tendance:    { icon: Zap,           label: "Tendance",     color: "rgba(139,92,246,0.15)",   border: "rgba(139,92,246,0.5)",   text: "#a78bfa", badge: "#4c1d95" },
  financement: { icon: DollarSign,    label: "Financement",  color: "rgba(245,158,11,0.15)",   border: "rgba(245,158,11,0.5)",   text: "#fbbf24", badge: "#78350f" },
  tech:        { icon: Cpu,           label: "Tech",         color: "rgba(6,182,212,0.15)",    border: "rgba(6,182,212,0.5)",    text: "#22d3ee", badge: "#164e63" },
  alerte:      { icon: AlertTriangle, label: "Alerte",       color: "rgba(239,68,68,0.15)",    border: "rgba(239,68,68,0.5)",    text: "#f87171", badge: "#7f1d1d" },
};

const URGENCY_DOT = {
  critique: "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]",
  haute:    "bg-orange-400 animate-pulse",
  moyenne:  "bg-yellow-400",
  faible:   "bg-slate-500",
};

const URGENCY_LABEL = { critique: "CRITIQUE", haute: "HAUTE", moyenne: "MOYENNE", faible: "FAIBLE" };

function ConquestBar({ nuggets }) {
  const avgScore = nuggets.length ? Math.round(nuggets.reduce((s, n) => s + (n.value_score || 0), 0) / nuggets.length * 10) : 0;
  const critiques = nuggets.filter(n => n.urgency === "critique").length;
  const milestones = [
    { pct: 20, icon: "📡" }, { pct: 40, icon: "🧠" },
    { pct: 60, icon: "♟️" }, { pct: 80, icon: "👑" }, { pct: 100, icon: "🌍" },
  ];
  return (
    <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,215,0,0.1)" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[10px] tracking-widest" style={{ color: "rgba(255,215,0,0.5)" }}>⚔️ CONQUÊTE DU MARCHÉ</span>
        <span className="font-mono text-xs font-bold" style={{ color: "#FFD700" }}>{avgScore}%</span>
      </div>
      <div className="relative w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${avgScore}%`, background: "linear-gradient(90deg, #065f46, #10b981, #FFD700)", boxShadow: "0 0 12px rgba(255,215,0,0.4)" }} />
        {milestones.map(m => (
          <div key={m.pct} className="absolute top-0 h-full w-px" style={{ left: `${m.pct}%`, background: "rgba(255,215,0,0.2)" }} />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {milestones.map(m => (
          <span key={m.pct} className="text-[8px] font-mono" style={{ color: avgScore >= m.pct ? "#FFD700" : "rgba(255,255,255,0.2)" }}>{m.icon}</span>
        ))}
      </div>
      {critiques > 0 && (
        <p className="mt-2 text-[10px] font-mono font-bold animate-pulse" style={{ color: "#f87171" }}>
          ⚡ {critiques} OPPORTUNITÉ(S) CRITIQUE(S) — AGIR MAINTENANT
        </p>
      )}
    </div>
  );
}

function SynthesisCard({ synthesis }) {
  if (!synthesis) return null;
  return (
    <div className="mx-6 mb-4 rounded-xl p-4" style={{ background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.3)" }}>
      <div className="flex items-center gap-2 mb-3">
        <Crown className="h-4 w-4" style={{ color: "#FFD700" }} />
        <span className="font-mono text-xs font-bold tracking-widest" style={{ color: "#FFD700" }}>SYNTHÈSE IA — RAPPORT EXÉCUTIF DU JOUR</span>
      </div>
      <div className="space-y-2">
        <div className="flex gap-2 text-xs">
          <span className="font-mono font-bold flex-shrink-0" style={{ color: "#10b981" }}>🎯 OPPORTUNITÉ :</span>
          <span style={{ color: "rgba(255,255,255,0.8)" }}>{synthesis.opportunite}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="font-mono font-bold flex-shrink-0" style={{ color: "#a78bfa" }}>♟️ STRATÉGIE :</span>
          <span style={{ color: "rgba(255,255,255,0.8)" }}>{synthesis.strategie}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="font-mono font-bold flex-shrink-0" style={{ color: "#fbbf24" }}>💰 GAIN POTENTIEL :</span>
          <span className="font-bold" style={{ color: "#fbbf24" }}>{synthesis.gain_cad}</span>
        </div>
      </div>
    </div>
  );
}

function ActionPlanModal({ nugget, onClose }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    const res = await base44.functions.invoke("executeNugget", { nugget });
    setPlan(res.data);
    setLoading(false);
  };

  const copyPlan = () => {
    if (!plan) return;
    const text = `# ${nugget.title}\n\n## PLAN D'ACTION\n${plan.plan_action}\n\n## DEMANDE DE SUBVENTION\n${plan.brouillon_subvention || "N/A"}\n\n## RESSOURCES\n${(plan.ressources || []).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden" style={{ background: "linear-gradient(160deg, rgba(5,10,25,0.99), rgba(5,20,12,0.99))", border: "2px solid rgba(255,215,0,0.4)" }}
        onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,215,0,0.15)", background: "rgba(255,215,0,0.04)" }}>
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4" style={{ color: "#FFD700" }} />
            <span className="font-mono text-xs font-bold tracking-widest" style={{ color: "#FFD700" }}>PLAN D'EXÉCUTION IA</span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 text-xl leading-none">×</button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-bold text-white text-lg">{nugget.emoji} {nugget.title}</h3>
            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{nugget.insight}</p>
          </div>

          {!plan && !loading && (
            <button onClick={generate}
              className="w-full py-4 rounded-xl font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(16,185,129,0.2))", border: "2px solid rgba(255,215,0,0.5)", color: "#FFD700" }}>
              <Zap className="h-5 w-5" /> ⚡ GÉNÉRER LE PLAN D'ACTION COMPLET
            </button>
          )}

          {loading && (
            <div className="flex flex-col items-center py-10 gap-3">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#FFD700" }} />
              <p className="font-mono text-xs" style={{ color: "rgba(255,215,0,0.6)" }}>L'IA forge votre plan d'action…</p>
            </div>
          )}

          {plan && (
            <div className="space-y-4">
              <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.3)" }}>
                <p className="font-mono text-xs font-bold" style={{ color: "#10b981" }}>📋 PLAN D'ACTION COMMERCIAL</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>{plan.plan_action}</p>
              </div>
              {plan.brouillon_subvention && (
                <div className="rounded-xl p-4 space-y-2" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)" }}>
                  <p className="font-mono text-xs font-bold" style={{ color: "#fbbf24" }}>📝 BROUILLON DEMANDE DE SUBVENTION</p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>{plan.brouillon_subvention}</p>
                </div>
              )}
              {plan.ressources && plan.ressources.length > 0 && (
                <div className="rounded-xl p-4" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.3)" }}>
                  <p className="font-mono text-xs font-bold mb-2" style={{ color: "#a78bfa" }}>🔗 RESSOURCES</p>
                  <ul className="space-y-1">
                    {plan.ressources.map((r, i) => <li key={i} className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>• {r}</li>)}
                  </ul>
                </div>
              )}
              <button onClick={copyPlan}
                className="w-full py-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
                {copied ? <><Check className="h-3.5 w-3.5 text-emerald-400" /> Copié !</> : <><Copy className="h-3.5 w-3.5" /> Copier le plan</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ZeldaTower() {
  const [scanKey, setScanKey] = useState(0);
  const [activeNugget, setActiveNugget] = useState(null);
  const [checkoutLoadingId, setCheckoutLoadingId] = useState(null);
  const [omegaPreview, setOmegaPreview] = useState(null);

  const nuggetPriceId = import.meta.env.VITE_STRIPE_NUGGET_PRICE_ID || null;
  const checkoutEnabled = !!(import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT && nuggetPriceId);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["golden-nuggets", scanKey],
    queryFn: () => fetchGoldenNuggetsScan(),
    staleTime: 15 * 60_000,
  });

  const nuggets = data?.nuggets || [];

  const buyNugget = async (nugget) => {
    if (!checkoutEnabled) return;
    const id = nugget?.title || "nugget";
    setCheckoutLoadingId(id);
    try {
      const vp = Number(nugget?.vp_cad || nugget?.vp || 49) || 49;
      const bfRate = computeBfRate({ nugget });
      const omega = computeOmega({ vp, bfRate });
      setOmegaPreview({ nuggetTitle: nugget?.title, ...omega });
      emitStardust({ x: window.innerWidth * 0.5, y: 120, power: 2.2 });

      await auditTransaction({
        channel: "zeldatower",
        action: "checkout_start",
        nugget: {
          title: nugget?.title,
          type: nugget?.type,
          urgency: nugget?.urgency,
          value_score: nugget?.value_score,
          source_url: nugget?.source_url || nugget?.sourceUrl,
        },
        omega,
      });

      const res = await createStripeCheckout({ priceId: nuggetPriceId, mode: "payment" });
      if (res?.url) window.location.href = res.url;
      else toast.error(res?.error || "Checkout indisponible. Vérifie ton endpoint Stripe.", { icon: "⚠️" });
    } finally {
      setCheckoutLoadingId(null);
    }
  };

  return (
    <>
      {activeNugget && <ActionPlanModal nugget={activeNugget} onClose={() => setActiveNugget(null)} />}

      <div className="rounded-3xl overflow-hidden relative"
        style={{
          background: "linear-gradient(160deg, rgba(5,10,25,0.98) 0%, rgba(5,20,12,0.98) 100%)",
          border: "2px solid rgba(255,215,0,0.35)",
          boxShadow: "0 0 60px rgba(255,215,0,0.08), inset 0 0 60px rgba(0,0,0,0.4)",
        }}>

        <style>{`
          @keyframes omegaBlinkSoft {
            0%, 100% { opacity: 0.25; filter: drop-shadow(0 0 0 rgba(16,185,129,0)); }
            50% { opacity: 0.85; filter: drop-shadow(0 0 10px rgba(16,185,129,0.55)); }
          }
          @keyframes sigilDrift {
            0%, 100% { transform: translate3d(0,0,0); opacity: 0.55; }
            50% { transform: translate3d(0,-6px,0); opacity: 0.75; }
          }
        `}</style>

        {/* INJECTION DU SCEAU DE LA SINGULARITÉ (fond graphique) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.22,
            mixBlendMode: "screen",
            filter: "saturate(1.2) contrast(1.05)",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="sigilGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,215,0,0.55)" />
                <stop offset="45%" stopColor="rgba(16,185,129,0.55)" />
                <stop offset="100%" stopColor="rgba(167,139,250,0.45)" />
              </linearGradient>
              <radialGradient id="sigilCore" cx="50%" cy="40%" r="65%">
                <stop offset="0%" stopColor="rgba(16,185,129,0.18)" />
                <stop offset="55%" stopColor="rgba(255,215,0,0.10)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <filter id="sigilBlur">
                <feGaussianBlur stdDeviation="1.4" />
              </filter>
            </defs>

            {/* soft core haze */}
            <rect x="0" y="0" width="1200" height="800" fill="url(#sigilCore)" />

            {/* Ω glyphs */}
            <g style={{ animation: "sigilDrift 8s ease-in-out infinite" }}>
              <text x="90" y="165" fontSize="120" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="url(#sigilGlow)" opacity="0.55">Ω</text>
              <text x="1040" y="690" fontSize="140" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="url(#sigilGlow)" opacity="0.45">Ω</text>
              <text x="880" y="150" fontSize="72" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="rgba(255,215,0,0.45)" opacity="0.55">Ω(t₀)&gt;1</text>
            </g>

            {/* “équation de la masse” (stylisée, décorative) */}
            <g filter="url(#sigilBlur)" opacity="0.65">
              <text x="120" y="720" fontSize="34" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="rgba(255,255,255,0.35)">
                m = ρ · V
              </text>
              <text x="120" y="755" fontSize="18" fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" fill="rgba(255,255,255,0.20)">
                (preuve par absurdité : la Matrice n'aime pas l'humour)
              </text>
            </g>

            {/* “mutation du tore” (tore -> tore tordu), lignes décoratives */}
            <g opacity="0.55">
              <path
                d="M 340 420 C 420 300, 610 300, 690 420 C 770 540, 610 610, 520 560 C 440 515, 410 520, 340 420 Z"
                fill="none"
                stroke="url(#sigilGlow)"
                strokeWidth="2.2"
              />
              <path
                d="M 390 420 C 450 330, 585 330, 650 420 C 710 505, 600 565, 520 530 C 455 500, 430 495, 390 420 Z"
                fill="none"
                stroke="rgba(16,185,129,0.45)"
                strokeWidth="1.2"
                strokeDasharray="6 10"
              />
              <path
                d="M 520 290 C 500 360, 520 420, 560 450 C 610 485, 650 520, 630 590"
                fill="none"
                stroke="rgba(255,215,0,0.35)"
                strokeWidth="1.4"
              />
            </g>
          </svg>
        </div>

        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,215,0,0.15)", background: "rgba(255,215,0,0.03)" }}>
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 flex-shrink-0">
              <div className="absolute inset-0 rounded-2xl animate-spin" style={{ border: "1px solid rgba(255,215,0,0.3)", animationDuration: "8s" }} />
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: "rgba(255,215,0,0.1)" }}>
                <Telescope className="h-5 w-5" style={{ color: "#FFD700" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display font-black text-white text-base">🗼 ZELDA TOWER</p>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(16,185,129,0.2)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>LIVE</span>
              </div>
              <p className="text-[10px] font-mono" style={{ color: "rgba(255,215,0,0.45)" }}>Tour d'Observation · Scanner IA · Golden Nuggets · Web Mondial</p>
            </div>
          </div>
          <button onClick={() => setScanKey(k => k + 1)} disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
            style={{ background: "rgba(255,215,0,0.12)", border: "1px solid rgba(255,215,0,0.4)", color: "#FFD700" }}>
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
            {isFetching ? "Scan…" : "⚡ Scanner"}
          </button>
        </div>

        {data?.top_opportunity && (
          <div className="px-6 py-2.5 flex items-center gap-2" style={{ background: "rgba(255,215,0,0.05)", borderBottom: "1px solid rgba(255,215,0,0.08)" }}>
            <Star className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#FFD700" }} />
            <p className="text-xs font-mono" style={{ color: "rgba(255,215,0,0.85)" }}>
              <strong>TOP NUGGET DU JOUR :</strong> {data.top_opportunity}
            </p>
          </div>
        )}

        {nuggets.length > 0 && <ConquestBar nuggets={nuggets} />}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(255,215,0,0.6)", animationDuration: "2s" }} />
              <div className="absolute inset-3 rounded-full border animate-spin" style={{ borderColor: "rgba(16,185,129,0.4)", animationDuration: "3s", animationDirection: "reverse" }} />
              <div className="absolute inset-0 m-auto flex items-center justify-center text-2xl">🗼</div>
            </div>
            <p className="font-mono text-xs font-bold" style={{ color: "rgba(255,215,0,0.7)" }}>SCAN DU WEB MONDIAL EN COURS…</p>
          </div>
        ) : nuggets.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="text-5xl mb-4">🗺️</div>
            <p className="font-mono text-xs" style={{ color: "rgba(255,215,0,0.4)" }}>Lance un scan pour révéler les Golden Nuggets du jour.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {data?.synthesis && <SynthesisCard synthesis={data.synthesis} />}

            {/* Ω Breakdown (transparence totale) */}
            {omegaPreview ? (
              <div className="rounded-xl p-4"
                style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.25)" }}>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" style={{ color: "#10b981" }} />
                    <span className="font-mono text-xs font-bold tracking-widest" style={{ color: "#10b981" }}>
                      Ω BREAKDOWN — ÉQUITABLE & AUDITABLE
                    </span>
                  </div>
                  <button
                    className="text-[10px] font-mono font-bold px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.25)", color: "#FFD700" }}
                    onClick={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      emitStardust({ x: r.left + r.width / 2, y: r.top + r.height / 2, power: 1.9 });
                    }}
                  >
                    ✨ Ω VALIDÉ
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                  <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[10px] font-mono text-white/50">Vp (Valeur partagée)</p>
                    <p className="text-lg font-black text-white">${Math.round(omegaPreview.vp)}</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[10px] font-mono text-white/50">Ca (10% commission)</p>
                    <p className="text-lg font-black text-amber-300">${omegaPreview.commission.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p className="text-[10px] font-mono text-white/50">Bƒ (bonus fondateur)</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-lg font-black text-emerald-300">${omegaPreview.bonus.toFixed(2)}</p>
                      <span
                        className="font-mono text-[10px] font-black tracking-widest select-none"
                        style={{
                          color: "rgba(16,185,129,0.95)",
                          opacity: 0.65,
                          animation: "omegaBlinkSoft 2.8s ease-in-out infinite",
                        }}
                        title="Code secret: preuve humoristique de singularité."
                      >
                        Ω(t₀) &gt; 1
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs flex-wrap gap-2">
                  <p className="text-white/60">
                    Ω = (Vp × Ca) + (Bƒ × Vp) → <span className="font-black" style={{ color: "#10b981" }}>${omegaPreview.omega.toFixed(2)}</span>
                  </p>
                  <p className="text-white/40 font-mono text-[10px]">
                    {omegaPreview.nuggetTitle ? `NUGGET: ${omegaPreview.nuggetTitle}` : "NUGGET: —"}
                  </p>
                </div>
              </div>
            ) : null}

            {data?.scan_summary && (
              <p className="text-[11px] font-mono pb-3" style={{ color: "rgba(255,255,255,0.35)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {data.scan_summary}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nuggets.map((nugget, i) => {
                const cfg = TYPE_CONFIG[nugget.type] || TYPE_CONFIG.tendance;
                return (
                  <div key={i} className="rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.01]"
                    style={{ background: cfg.color, border: `1px solid ${cfg.border}`, boxShadow: `0 0 20px ${cfg.color}` }}>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{nugget.emoji}</span>
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded text-white" style={{ background: cfg.badge }}>
                            {cfg.label.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${URGENCY_DOT[nugget.urgency] || URGENCY_DOT.faible}`} />
                          <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{URGENCY_LABEL[nugget.urgency]}</span>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: 10 }).map((_, si) => (
                          <div key={si} className="h-1 flex-1 rounded-full"
                            style={{ background: si < (nugget.value_score || 0) ? cfg.text : "rgba(255,255,255,0.08)" }} />
                        ))}
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1 leading-snug">{nugget.title}</h4>
                      <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>{nugget.insight}</p>
                      {nugget.action && (
                        <p className="text-[10px] font-bold font-mono mb-3" style={{ color: cfg.text }}>
                          <Zap className="h-3 w-3 inline mr-1" />ACTION : {nugget.action}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2">
                      <button onClick={() => setActiveNugget(nugget)}
                        className="py-3 flex items-center justify-center gap-2 font-mono text-[11px] font-black tracking-widest transition-all hover:brightness-125"
                        style={{ background: `linear-gradient(135deg, ${cfg.badge}, rgba(0,0,0,0.3))`, borderTop: `1px solid ${cfg.border}`, color: cfg.text }}>
                        <Play className="h-3.5 w-3.5" /> EXÉCUTER
                      </button>
                      <button
                        onClick={() => buyNugget(nugget)}
                        disabled={!checkoutEnabled || checkoutLoadingId === (nugget?.title || "nugget")}
                        className="py-3 flex items-center justify-center gap-2 font-mono text-[11px] font-black tracking-widest transition-all disabled:opacity-50 hover:brightness-125"
                        style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.35), rgba(0,0,0,0.35))", borderTop: `1px solid ${cfg.border}`, borderLeft: `1px solid ${cfg.border}`, color: "#FFD700" }}
                        title={checkoutEnabled ? "Acheter maintenant (Stripe)" : "Configure VITE_STRIPE_CHECKOUT_ENDPOINT + VITE_STRIPE_NUGGET_PRICE_ID"}
                      >
                        <CreditCard className={cn("h-3.5 w-3.5", checkoutLoadingId ? "animate-pulse" : "")} /> ACHETER
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,215,0,0.08)", background: "rgba(0,0,0,0.3)" }}>
          <div className="flex items-center gap-3 text-[9px] font-mono" style={{ color: "rgba(255,215,0,0.3)" }}>
            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> Web Mondial</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Filtrage Éthique</span>
            <span className="flex items-center gap-1"><Lightbulb className="h-3 w-3" /> IA Gemini Pro</span>
          </div>
          <span className="text-[9px] font-mono" style={{ color: "rgba(255,215,0,0.2)" }}>Egor69 · ZELDA-TOWER v2.1</span>
        </div>
      </div>
    </>
  );
}


