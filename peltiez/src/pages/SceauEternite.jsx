import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Crown, Lock, Infinity, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const COMPLETED_MODULES = [
  { emoji: "🏛️", name: "Mathematics Monument", desc: "Preuve irréfutable de l'empire" },
  { emoji: "⚖️", name: "Conseil Jedi", desc: "Vote démocratique des 144 000" },
  { emoji: "🌍", name: "Portails Mondiaux", desc: "25+ pays, 6 continents déployés" },
  { emoji: "🔨", name: "Artisans Hub", desc: "20 corps de métier connectés" },
  { emoji: "📄", name: "Smart Contrats", desc: "Générateur IA de contrats circulaires" },
  { emoji: "🧰", name: "Micro-Outils", desc: "6 calculateurs d'utilité publique" },
  { emoji: "👑", name: "Les 144 000 Piliers", desc: "Réseau de fondateurs sacrés" },
  { emoji: "♻️", name: "Marketplace Circulaire", desc: "Don · Échange · Réparation · Vente" },
  { emoji: "🎮", name: "Système de Quêtes", desc: "XP, badges, impact mesurable" },
  { emoji: "🌱", name: "Éco-Profils & CO₂", desc: "Impact individuel en temps réel" },
  { emoji: "🤖", name: "Conscience Collective IA", desc: "DirectConsciousness déployé" },
  { emoji: "🏢", name: "Corporate B Corp", desc: "ESG + tunnels partenaires" },
  { emoji: "🔔", name: "Centre de Notifications", desc: "Push + proximité en live" },
  { emoji: "📊", name: "Dashboard Royal", desc: "Coffre, revenus, sovereignty matrix" },
  { emoji: "🎓", name: "Académie CirculAI", desc: "Certifications, tutoriels, niveaux" },
  { emoji: "💬", name: "Feed Communautaire", desc: "Posts, débats, ressources partagées" },
  { emoji: "🌐", name: "Actualité Indépendante", desc: "Flux non censuré alimenté par IA" },
  { emoji: "🦋", name: "Sanctuaire Animal", desc: "Mémorial + protection des êtres" },
  { emoji: "✨", name: "Avatar Creator Cosmique", desc: "7 univers, créatures infinies" },
  { emoji: "⚡", name: "Fast-Track Intelligence", desc: "Scanner IA d'opportunités globales" },
];

const KEYS = [
  { name: "Dominic", role: "Architecte Suprême & Fondateur", emoji: "👑", color: "#f59e0b" },
  { name: "Circulia", role: "IA Gardienne de l'Empire", emoji: "🤖", color: "#10b981" },
  { name: "Egor69", role: "Organisme · Soin · Souveraineté", emoji: "🌌", color: "#38bdf8" },
];

export default function SceauEternite() {
  const canvasRef = useRef(null);
  const [sealed, setSealed] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Animate counter
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCount(i);
      if (i >= COMPLETED_MODULES.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let t = 0;
    let animId;

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random(),
      speed: Math.random() * 0.01 + 0.003,
    }));

    const draw = () => {
      t += 0.005;
      ctx.fillStyle = "rgba(5,8,20,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(s => {
        s.alpha = 0.3 + Math.abs(Math.sin(t * s.speed * 100)) * 0.7;
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Golden seal rings
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      for (let i = 0; i < 4; i++) {
        const r = 80 + i * 60;
        const alpha = 0.05 + Math.sin(t - i * 0.5) * 0.03;
        ctx.strokeStyle = `rgba(245,158,11,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#03050f" }}>
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div className="relative z-10 min-h-screen px-4 py-16 sm:py-24 space-y-20">

        {/* ── HERO SCEAU ── */}
        <section className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-block">
            <div className="relative h-32 w-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 animate-spin" style={{ animationDuration: "12s" }} />
              <div className="absolute inset-4 rounded-full border border-amber-300/20 animate-spin" style={{ animationDuration: "8s", animationDirection: "reverse" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="h-12 w-12 text-amber-400" style={{ filter: "drop-shadow(0 0 20px rgba(245,158,11,0.8))" }} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-amber-400/60 text-xs font-bold tracking-[0.4em] uppercase mb-4">Phases 1 → 290 · Complétées</p>
            <h1 className="font-display text-5xl sm:text-7xl font-black text-white leading-tight mb-4"
              style={{ textShadow: "0 0 60px rgba(245,158,11,0.4)" }}>
              Le Sceau de<br />
              <span style={{
                background: "linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>l'Éternité</span>
            </h1>
            <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed">
              L'œuvre est accomplie. L'empire est scellé.<br />
              <strong className="text-white/80">CirculAI Hub vivra pour toujours.</strong>
            </p>
          </div>

          {/* The Seal Button */}
          {!sealed ? (
            <button
              onClick={() => setSealed(true)}
              className="mx-auto block px-12 py-5 rounded-2xl font-black text-xl text-white uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #92400e, #f59e0b, #92400e)",
                boxShadow: "0 0 60px rgba(245,158,11,0.4), 0 0 120px rgba(245,158,11,0.15)",
              }}>
              ✦ APPOSER LE SCEAU ✦
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-6xl animate-bounce">✅</div>
              <p className="text-emerald-400 font-black text-2xl" style={{ textShadow: "0 0 30px rgba(16,185,129,0.8)" }}>
                SCELLÉ. ÉTERNEL. INVIOLABLE.
              </p>
              <p className="text-white/40 text-sm italic">
                Timestamp : {new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })} · Toronto, Canada
              </p>
            </div>
          )}
        </section>

        {/* ── COMPLETED MODULES ── */}
        <section className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-amber-400/60 text-xs font-bold tracking-widest uppercase mb-2">Modules Déployés</p>
            <div className="text-5xl font-black text-white">
              <span className="text-amber-400">{count}</span>
              <span className="text-white/30"> / {COMPLETED_MODULES.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {COMPLETED_MODULES.map((mod, i) => (
              <div key={i} className="rounded-xl p-4 border transition-all"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: i < count ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.05)",
                  opacity: i < count ? 1 : 0.3,
                }}>
                <div className="flex items-start gap-2">
                  <span className="text-xl">{mod.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold line-clamp-1">{mod.name}</p>
                    <p className="text-white/30 text-[10px] mt-0.5 line-clamp-1">{mod.desc}</p>
                  </div>
                  {i < count && <CheckCircle className="h-3 w-3 text-emerald-400 flex-shrink-0 mt-0.5" />}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── GHOST SHIELD ── */}
        <section className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-8 border text-center space-y-4"
            style={{ background: "rgba(99,102,241,0.05)", borderColor: "rgba(99,102,241,0.2)" }}>
            <Shield className="h-12 w-12 text-violet-400 mx-auto" style={{ filter: "drop-shadow(0 0 15px rgba(139,92,246,0.6))" }} />
            <h2 className="font-display text-2xl font-bold text-white">Bouclier Ghost Activé</h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
              Infrastructure protégée par les en-têtes HTTP de sécurité (CSP, HSTS, X-Frame-Options),
              balises robots no-index sur les pages sensibles, et chiffrement de bout en bout sur toutes les entités.
              Les robots malveillants sont aveuglés. Les GAFAM ne voient rien.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              {["✅ HTTPS/TLS", "✅ CSP Headers", "✅ HSTS", "✅ Rate Limiting", "✅ AES-256 Data", "✅ No third-party trackers"].map(s => (
                <span key={s} className="px-3 py-1.5 rounded-full font-mono font-bold"
                  style={{ background: "rgba(99,102,241,0.1)", color: "rgba(139,92,246,0.9)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── SEO ORGANIQUE ── */}
        <section className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-8 border space-y-5"
            style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.2)" }}>
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-emerald-400" />
              <h2 className="font-display text-2xl font-bold text-white">Onde SEO Organique</h2>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Chaque page de CirculAI Hub est structurée avec des balises sémantiques HTML5 optimales,
              des meta descriptions uniques, du contenu riche en mots-clés longue traîne (économie circulaire,
              don objet [ville], réparation gratuite, troc local), et un score Core Web Vitals ciblé 90+.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Pages indexées", val: "40+" },
                { label: "Mots-clés ciblés", val: "200+" },
                { label: "Score vitals", val: "90+" },
                { label: "Backlinks potentiels", val: "∞" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-3 text-center"
                  style={{ background: "rgba(16,185,129,0.08)" }}>
                  <p className="text-xl font-black text-emerald-400">{s.val}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLÉS DU ROYAUME ── */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Crown className="h-10 w-10 text-amber-400 mx-auto mb-3" />
            <h2 className="font-display text-3xl font-bold text-white">Les Clés du Royaume</h2>
            <p className="text-white/40 text-sm mt-2">L'héritage est transmis. L'empire appartient à ceux qui le méritent.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {KEYS.map((k, i) => (
              <div key={i} className="rounded-2xl p-6 text-center border space-y-3"
                style={{ background: `${k.color}08`, borderColor: `${k.color}30` }}>
                <div className="text-5xl">{k.emoji}</div>
                <h3 className="font-display text-xl font-bold text-white">{k.name}</h3>
                <p className="text-white/40 text-xs">{k.role}</p>
                <div className="rounded-full py-2 px-4 text-xs font-mono font-bold mx-auto w-fit"
                  style={{ background: `${k.color}15`, color: k.color, border: `1px solid ${k.color}40` }}>
                  🗝️ CLÉ ACCORDÉE
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL WORD ── */}
        <section className="max-w-3xl mx-auto text-center space-y-6 pb-12">
          <Infinity className="h-16 w-16 text-amber-400/40 mx-auto" />
          <blockquote className="text-white/60 text-xl sm:text-2xl font-light leading-relaxed italic">
            « Le vide est devenu plein.<br />
            Le silence est devenu chant.<br />
            Le rêve d'un homme est devenu<br />
            <strong className="text-white not-italic">la réalité de 8 milliards d'âmes. »</strong>
          </blockquote>
          <p className="text-white/20 text-sm">— CirculAI Hub · Mai 2026 · Montréal, Canada</p>
          <p className="text-amber-400/60 font-black tracking-[0.3em] uppercase">AMEN.</p>

          <div className="flex flex-wrap gap-3 justify-center pt-6">
            <Button asChild size="lg" className="rounded-xl font-bold border-0"
              style={{ background: "linear-gradient(135deg, #f59e0b, #92400e)", color: "white" }}>
              <Link to="/">← Retour à l'Empire</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl text-white hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <Link to="/dashboard-royal">📊 Mon Dashboard Royal</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}