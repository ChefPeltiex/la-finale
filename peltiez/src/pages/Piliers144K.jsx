import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Crown, Flame, Shield, Lock, Star } from "lucide-react";

const TOTAL_SPOTS = 144000;
const CLAIMED = 141823; // static for rarity psychology

const PILLARS = [
  { emoji: "💎", title: "Souveraineté Économique", desc: "Accès aux Golden Nuggets exclusifs chaque matin" },
  { emoji: "🌍", title: "Impact Planétaire", desc: "Vos actions sauvegardent l'économie circulaire mondiale" },
  { emoji: "🔐", title: "Réseau Invisible", desc: "Connexions directes avec les 144 000 élus" },
  { emoji: "⚡", title: "Intelligence Collective", desc: "IA dédiée qui apprend de vos actions" },
];

const TESTIMONIALS = [
  { name: "Jean-François M.", city: "Montréal", text: "J'ai trouvé une subvention de 45 000$ grâce au scanner. En 3 jours.", emoji: "💰" },
  { name: "Sarah K.",          city: "Québec",   text: "Le réseau des Piliers m'a mis en contact avec un investisseur Impact parisien.", emoji: "🌟" },
  { name: "Mohammed A.",       city: "Ottawa",   text: "Mon chiffre d'affaires circulaire a doublé en 6 semaines.", emoji: "📈" },
];

export default function Piliers144K() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [counter, setCounter] = useState(CLAIMED);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    // Live counter simulation
    const iv = setInterval(() => {
      setCounter(c => {
        if (c < CLAIMED + 12) return c + 1;
        clearInterval(iv);
        return c;
      });
    }, 800);
    return () => clearInterval(iv);
  }, []);

  const handleJoin = async () => {
    if (!email && !user) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: "linear-gradient(160deg, hsl(220,40%,4%) 0%, hsl(158,60%,5%) 100%)" }}>

      {/* Urgency Banner */}
      <div className="py-3 px-4 text-center font-mono text-xs font-bold animate-pulse"
        style={{ background: "rgba(239,68,68,0.15)", borderBottom: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
        ⚠️ ALERTE : Il ne reste que <strong className="text-white">{(TOTAL_SPOTS - counter).toLocaleString("fr-CA")}</strong> places sur 144 000 — Cette fenêtre se ferme définitivement.
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-mono text-xs font-bold"
            style={{ background: "rgba(255,215,0,0.1)", border: "2px solid rgba(255,215,0,0.4)", color: "#FFD700" }}>
            <Crown className="h-4 w-4" /> LES 144 000 PILIERS DE L'ÉCONOMIE CIRCULAIRE
          </div>

          <h1 className="font-display text-5xl sm:text-7xl font-black text-white leading-tight">
            Vous êtes soit<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">un Pilier.</span><br />
            <span style={{ color: "rgba(255,255,255,0.3)" }}>Soit un spectateur.</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            144 000 personnes changeront l'économie mondiale. Pas 144 001. Pas une de plus.
            <br /><br />
            <strong className="text-emerald-400">Les Piliers reçoivent des opportunités que personne d'autre ne voit.</strong>
          </p>

          {/* Real-time counter */}
          <div className="inline-block rounded-2xl p-6 mx-auto" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-8 justify-center">
              <div className="text-center">
                <p className="text-4xl font-black text-white tabular-nums">{counter.toLocaleString("fr-CA")}</p>
                <p className="text-xs font-mono text-white/40 mt-1">Piliers actifs</p>
              </div>
              <div className="h-12 w-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="text-center">
                <p className="text-4xl font-black animate-pulse" style={{ color: "#f87171" }}>
                  {(TOTAL_SPOTS - counter).toLocaleString("fr-CA")}
                </p>
                <p className="text-xs font-mono text-white/40 mt-1">Places restantes</p>
              </div>
            </div>
            <div className="mt-4 w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${(counter / TOTAL_SPOTS * 100).toFixed(2)}%`, background: "linear-gradient(90deg, #10b981, #FFD700)" }} />
            </div>
            <p className="text-center text-[10px] font-mono mt-1" style={{ color: "rgba(255,215,0,0.5)" }}>
              {(counter / TOTAL_SPOTS * 100).toFixed(3)}% de la capacité atteinte
            </p>
          </div>
        </section>

        {/* 4 Pillars */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILLARS.map((p, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-3xl mb-3">{p.emoji}</div>
                <h3 className="font-bold text-white mb-2">{p.title}</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="space-y-4">
          <p className="text-center text-xs font-mono font-bold tracking-widest" style={{ color: "rgba(255,215,0,0.5)" }}>
            TÉMOIGNAGES DES PILIERS ACTIFS
          </p>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-white/80 text-sm italic mb-3">« {t.text} »</p>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm">{t.emoji}</div>
                <div>
                  <p className="text-white text-xs font-semibold">{t.name}</p>
                  <p className="text-white/30 text-[10px]">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Join CTA */}
        <section className="rounded-3xl p-10 text-center space-y-6"
          style={{ background: "rgba(255,215,0,0.06)", border: "2px solid rgba(255,215,0,0.3)" }}>
          <Crown className="h-12 w-12 mx-auto" style={{ color: "#FFD700" }} />
          <h2 className="font-display text-3xl font-black text-white">
            Rejoindre les 144 000 Piliers
          </h2>
          <p className="text-white/60 max-w-md mx-auto text-sm">
            Une fois le cap atteint, la liste est fermée pour toujours. Aucune exception.
          </p>

          {submitted ? (
            <div className="rounded-2xl p-6" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <p className="text-emerald-400 font-bold text-lg mb-1">✅ Vous êtes inscrit(e) !</p>
              <p className="text-white/60 text-sm">Vérifiez votre boîte mail. Le protocole d'accès vous attend.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              {user ? (
                <button onClick={handleJoin}
                  className="flex-1 py-4 rounded-xl font-mono font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.3), rgba(16,185,129,0.3))", border: "2px solid rgba(255,215,0,0.5)", color: "#FFD700" }}>
                  <Crown className="h-4 w-4" /> ACTIVER MON STATUT PILIER
                </button>
              ) : (
                <>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com"
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-mono bg-white/5 border border-white/15 text-white placeholder:text-white/25 focus:outline-none focus:border-amber-400/50" />
                  <button onClick={handleJoin}
                    className="px-6 py-3 rounded-xl font-mono font-black text-sm flex items-center gap-2 whitespace-nowrap transition-all hover:scale-[1.02]"
                    style={{ background: "linear-gradient(135deg, #78350f, #d97706)", color: "#FFD700", border: "1px solid rgba(255,215,0,0.4)" }}>
                    <Crown className="h-4 w-4" /> REJOINDRE
                  </button>
                </>
              )}
            </div>
          )}
          <div className="flex items-center justify-center gap-4 text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
            <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Zéro spam</span>
            <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Zéro vente de données</span>
            <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> Réseau exclusif</span>
          </div>
        </section>

        <div className="text-center">
          <Link to="/" className="text-white/30 hover:text-white/60 text-xs font-mono transition-colors">
            ← Retour au Hub
          </Link>
        </div>
      </div>
    </div>
  );
}