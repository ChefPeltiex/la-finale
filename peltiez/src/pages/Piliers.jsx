import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Crown, Zap, Globe, Lock, Users, Flame } from "lucide-react";
import { Link } from "react-router-dom";

const TOTAL_SPOTS = 144000;
const CLAIMED = 143618; // dynamic-looking static
const REMAINING = TOTAL_SPOTS - CLAIMED;

const PILIER_TIERS = [
  {
    id: "fondateur",
    name: "Pilier Fondateur",
    emoji: "🏛️",
    price: "97$/mois",
    color: "from-amber-600 to-yellow-700",
    border: "rgba(255,215,0,0.5)",
    glow: "rgba(255,215,0,0.15)",
    benefits: [
      "Accès PRIORITAIRE aux Golden Nuggets avant tout le monde",
      "Rapport exécutif IA quotidien personnalisé",
      "Badge Pilier Fondateur permanent dans le Hub",
      "Vote sur la direction de CirculAI Hub",
      "Accès direct au Dashboard Royal",
    ],
    spots: 1000,
    filled: 998,
  },
  {
    id: "gardien",
    name: "Pilier Gardien",
    emoji: "⚔️",
    price: "47$/mois",
    color: "from-violet-700 to-purple-900",
    border: "rgba(139,92,246,0.5)",
    glow: "rgba(139,92,246,0.15)",
    benefits: [
      "Zelda Tower — scan quotidien exclusif",
      "Plans d'action commerciaux IA illimités",
      "Alertes subventions en temps réel",
      "Communauté privée des Gardiens",
      "FastTrack entreprises prioritaire",
    ],
    spots: 10000,
    filled: 9847,
  },
  {
    id: "veilleur",
    name: "Pilier Veilleur",
    emoji: "🌱",
    price: "19$/mois",
    color: "from-emerald-700 to-teal-900",
    border: "rgba(16,185,129,0.5)",
    glow: "rgba(16,185,129,0.15)",
    benefits: [
      "Accès complet au Marketplace circulaire",
      "3 plans d'action IA / mois",
      "Réseau des Piliers (forum privé)",
      "Badge Veilleur dans le profil",
    ],
    spots: 133000,
    filled: 132773,
  },
];

const URGENCY_MESSAGES = [
  "⚡ Un Pilier vient de rejoindre",
  "🔥 2 places Fondateur restantes",
  "👁️ 47 personnes consultent cette page",
  "⏰ Offre expire dans 3h 22min",
];

export default function Piliers() {
  const [urgencyMsg, setUrgencyMsg] = useState(URGENCY_MESSAGES[0]);
  const [countdown, setCountdown] = useState(3 * 3600 + 22 * 60);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % URGENCY_MESSAGES.length;
      setUrgencyMsg(URGENCY_MESSAGES[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleJoin = (e) => {
    e.preventDefault();
    setSubmitted(true);
    base44.auth.redirectToLogin();
  };

  const pctClaimed = Math.round((CLAIMED / TOTAL_SPOTS) * 100);

  return (
    <div className="min-h-screen pb-20"
      style={{ background: "linear-gradient(160deg, hsl(220,40%,4%) 0%, hsl(158,40%,4%) 100%)" }}>

      {/* Urgency bar */}
      <div className="sticky top-0 z-50 py-2 px-4 text-center font-mono text-xs font-bold transition-all"
        style={{ background: "rgba(239,68,68,0.9)", backdropFilter: "blur(8px)" }}>
        <span className="text-white animate-pulse">{urgencyMsg}</span>
        <span className="ml-4 text-white/70">⏰ {formatTime(countdown)}</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-16 pb-20 space-y-16">

        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold"
            style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.4)", color: "#FFD700" }}>
            <Crown className="h-4 w-4" /> PROGRAMME EXCLUSIF · LES 144 000 PILIERS
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-black text-white leading-tight">
            Seuls <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">{REMAINING.toLocaleString("fr-FR")}</span><br />
            places restent.
          </h1>

          <p className="text-white/60 text-xl max-w-2xl mx-auto leading-relaxed">
            Il y a des gens qui regardent. Et des gens qui <strong className="text-white">bâtissent</strong>.<br />
            Les Piliers des 144 000 sont ceux qui ont dit <em className="text-emerald-400">oui</em> quand tout le monde attendait.
          </p>

          {/* Global progress */}
          <div className="max-w-lg mx-auto space-y-2">
            <div className="flex justify-between text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
              <span>{CLAIMED.toLocaleString("fr-FR")} Piliers actifs</span>
              <span>{pctClaimed}% occupé</span>
            </div>
            <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${pctClaimed}%`,
                  background: "linear-gradient(90deg, #065f46, #10b981, #FFD700)",
                  boxShadow: "0 0 20px rgba(255,215,0,0.4)"
                }} />
            </div>
            <p className="text-xs font-mono font-bold animate-pulse" style={{ color: "#f87171" }}>
              🔴 {REMAINING} places restantes sur 144 000
            </p>
          </div>
        </section>

        {/* Why 144 000 */}
        <section className="rounded-2xl p-8 text-center space-y-4"
          style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.15)" }}>
          <p className="font-mono text-xs font-bold tracking-widest" style={{ color: "rgba(255,215,0,0.5)" }}>POURQUOI 144 000 ?</p>
          <p className="text-white/70 leading-relaxed max-w-xl mx-auto">
            144 000 est le nombre de bâtisseurs nécessaires pour atteindre la <strong className="text-white">masse critique</strong>
            — le point où l'économie circulaire devient irréversible. Quand 144 000 agents de changement
            utilisent CirculAI Hub chaque jour, le système bascule. <strong className="text-emerald-400">Irrévocablement.</strong>
          </p>
        </section>

        {/* Tiers */}
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-white text-center mb-8">Choisissez votre rang</h2>
          {PILIER_TIERS.map((tier) => {
            const spotsLeft = tier.spots - tier.filled;
            const tierPct = Math.round((tier.filled / tier.spots) * 100);
            return (
              <div key={tier.id} className="rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
                style={{ background: `rgba(5,10,25,0.8)`, border: `2px solid ${tier.border}`, boxShadow: `0 0 40px ${tier.glow}` }}>
                <div className={`p-6 bg-gradient-to-r ${tier.color}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{tier.emoji}</span>
                      <div>
                        <h3 className="font-display font-black text-white text-xl">{tier.name}</h3>
                        <p className="text-white/60 text-sm">{tier.spots.toLocaleString("fr-FR")} places au total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">{tier.price}</p>
                      {spotsLeft < 200 && (
                        <p className="text-xs font-mono font-bold text-red-300 animate-pulse">
                          🔴 {spotsLeft} restantes!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <span>Remplissage</span><span>{tierPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${tierPct}%`, background: `linear-gradient(90deg, #065f46, #10b981)` }} />
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {tier.benefits.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                        <Zap className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-emerald-400" /> {b}
                      </li>
                    ))}
                  </ul>
                  <Link to="/abonnement">
                    <button className="w-full py-3 rounded-xl font-mono font-black text-sm transition-all hover:scale-105 hover:shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${tier.color.replace("from-", "").replace(/ to-.*/, "")}, transparent)`, border: `1px solid ${tier.border}`, color: "white" }}>
                      REJOINDRE — {tier.price} →
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {/* Social proof */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { icon: Users, val: CLAIMED.toLocaleString("fr-FR"), label: "Piliers actifs", color: "text-emerald-400" },
            { icon: Globe, val: "80+", label: "Pays représentés", color: "text-blue-400" },
            { icon: Flame, val: "2.1M$", label: "Valeur générée en CAD", color: "text-amber-400" },
          ].map(({ icon: Icon, val, label, color }) => (
            <div key={label} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
              <p className={`text-3xl font-black ${color}`}>{val}</p>
              <p className="text-white/40 text-xs mt-1">{label}</p>
            </div>
          ))}
        </section>

        {/* Email capture */}
        <section className="rounded-2xl p-8 text-center space-y-5"
          style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(99,102,241,0.1))", border: "2px solid rgba(16,185,129,0.3)" }}>
          <Lock className="h-8 w-8 text-emerald-400 mx-auto" />
          <h2 className="font-display text-2xl font-bold text-white">Réservez votre place maintenant.</h2>
          <p className="text-white/60">Une fois les 144 000 atteints, la porte se ferme. Pour toujours.</p>
          {!submitted ? (
            <form onSubmit={handleJoin} className="flex gap-3 max-w-sm mx-auto">
              <input type="email" required placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl text-sm text-white bg-white/10 border border-white/20 outline-none focus:border-emerald-400 placeholder:text-white/30" />
              <button type="submit"
                className="px-5 py-3 rounded-xl font-mono font-black text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #065f46, #10b981)", color: "white" }}>
                REJOINDRE →
              </button>
            </form>
          ) : (
            <p className="text-emerald-400 font-bold">✅ Redirection en cours…</p>
          )}
          <p className="text-[10px] text-white/30">Annulation sans frais à tout moment · RGPD · Zéro spam</p>
        </section>

      </div>
    </div>
  );
}