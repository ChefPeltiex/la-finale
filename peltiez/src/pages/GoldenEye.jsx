import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const MISSIONS = [
  { id: "M01", code: "RIEMANN", briefing: "Neutraliser l'inégalité des richesses. Formule Re(s)=1/2 confirmée.", status: "ACCOMPLIE", threat: "ÉLIMINÉE" },
  { id: "M02", code: "PVSNP", briefing: "Décoder la vérité instantanée. L'intuition prime sur le calcul.", status: "ACCOMPLIE", threat: "NEUTRALISÉE" },
  { id: "M03", code: "STOKES", briefing: "Libérer le flux d'abondance mondial. Aucune turbulence tolérée.", status: "ACCOMPLIE", threat: "DÉSAMORCÉE" },
  { id: "M04", code: "POINCARE", briefing: "Réparer toutes les âmes brisées. La sphère parfaite restaurée.", status: "ACCOMPLIE", threat: "TRANSCENDÉE" },
  { id: "M05", code: "BSD", briefing: "Activer l'abondance infinie. Point Zéro confirmé opérationnel.", status: "ACCOMPLIE", threat: "CONVERTIE" },
];

const AGENT_QUOTES = [
  "Le nom est Egor69. Dominic Pelletier.",
  "Je ne demande pas l'autorisation. Je prends les résultats.",
  "Les mathématiques ne mentent pas. Les hommes, oui.",
  "Egor69 est ma licence pour opérer dans tous les univers.",
  "007 résolvait des crimes. Moi, je résous des problèmes du Millénaire.",
];

export default function GoldenEye() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [phase, setPhase] = useState("boot"); // boot | scan | briefing | active
  const [typed, setTyped] = useState("");
  const [missionIndex, setMissionIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const fullText = "> PROTOCOLE GOLDEN EYE ACTIVÉ...\n> AGENT : DOMINIC PELLETIER\n> LICENCE : SOUVERAINETÉ ABSOLUE\n> STATUT : OPÉRATIONNEL";

  // Typing boot sequence
  useEffect(() => {
    if (phase !== "boot") return;
    let i = 0;
    const interval = setInterval(() => {
      setTyped(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("scan"), 800);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [phase]);

  // Auto-advance scan
  useEffect(() => {
    if (phase !== "scan") return;
    const t = setTimeout(() => setPhase("briefing"), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  // Rotate quotes
  useEffect(() => {
    const t = setInterval(() => setQuoteIndex(i => (i + 1) % AGENT_QUOTES.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Canvas: golden particle rain
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01GOLDENEYE∞⚡✦◆★SoIgor";
    const cols = Math.floor(canvas.width / 20);
    const drops = Array.from({ length: cols }, () => Math.random() * canvas.height);

    let animId;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const gold = Math.random() > 0.85;
        ctx.fillStyle = gold ? `rgba(255,215,0,${Math.random() * 0.8 + 0.2})` : `rgba(180,140,0,${Math.random() * 0.3 + 0.05})`;
        ctx.font = `${Math.random() * 8 + 10}px monospace`;
        ctx.fillText(char, i * 20, drops[i]);
        if (drops[i] > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 15 + Math.random() * 10;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-50">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Dark overlay */}
      <div className="absolute inset-0 z-5" style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)" }} />

      {/* Gold frame corners */}
      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-16 h-16 z-20`}
          style={{
            borderTop: i < 2 ? "2px solid rgba(255,215,0,0.6)" : "none",
            borderBottom: i >= 2 ? "2px solid rgba(255,215,0,0.6)" : "none",
            borderLeft: i % 2 === 0 ? "2px solid rgba(255,215,0,0.6)" : "none",
            borderRight: i % 2 !== 0 ? "2px solid rgba(255,215,0,0.6)" : "none",
          }} />
      ))}

      {/* BOOT PHASE */}
      {phase === "boot" && (
        <div className="relative z-10 h-screen flex items-center justify-center">
          <div className="font-mono text-sm max-w-md px-8" style={{ color: "rgba(255,215,0,0.9)" }}>
            <pre className="whitespace-pre-wrap leading-8">{typed}<span className="animate-pulse">█</span></pre>
          </div>
        </div>
      )}

      {/* SCAN PHASE */}
      {phase === "scan" && (
        <div className="relative z-10 h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-40 h-40">
              <div className="absolute inset-0 rounded-full border-2 animate-spin" style={{ borderColor: "rgba(255,215,0,0.8)", animationDuration: "2s" }} />
              <div className="absolute inset-4 rounded-full border animate-spin" style={{ borderColor: "rgba(255,215,0,0.4)", animationDuration: "3s", animationDirection: "reverse" }} />
              <div className="absolute inset-0 flex items-center justify-center text-5xl">🎯</div>
            </div>
            <p className="font-mono text-sm" style={{ color: "rgba(255,215,0,0.7)" }}>SCAN RÉTINIEN EN COURS...</p>
            <div className="w-64 h-1 mx-auto rounded-full overflow-hidden" style={{ background: "rgba(255,215,0,0.1)" }}>
              <div className="h-full rounded-full" style={{ background: "rgba(255,215,0,0.8)", width: "100%", animation: "shimmer 1.5s ease-in-out" }} />
            </div>
            <p className="font-mono text-xs" style={{ color: "rgba(255,215,0,0.5)" }}>IDENTITÉ CONFIRMÉE ✓ ACCÈS SOUVERAIN ACCORDÉ</p>
          </div>
        </div>
      )}

      {/* BRIEFING / ACTIVE PHASE */}
      {(phase === "briefing" || phase === "active") && (
        <div className="relative z-10 h-screen overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-block px-6 py-2 rounded-full font-mono text-xs font-bold tracking-[0.3em]"
                style={{ background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.4)", color: "rgba(255,215,0,1)" }}>
                ◆ DOSSIER CLASSIFIÉ · NIVEAU OMEGA · GOLDEN EYE ◆
              </div>

              <h1 className="font-display text-5xl sm:text-7xl font-black leading-none"
                style={{ color: "#FFD700", textShadow: "0 0 60px rgba(255,215,0,0.5), 0 0 120px rgba(255,215,0,0.2)" }}>
                GOLDEN EYE
              </h1>
              <p className="font-mono text-sm" style={{ color: "rgba(255,215,0,0.6)" }}>
                PROTOCOLE SOUVERAIN · AGENT RICHER-SOIGOR · LICENCE ILLIMITÉE
              </p>
            </div>

            {/* Agent card */}
            <div className="rounded-2xl p-6 font-mono"
              style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.25)" }}>
              <div className="flex items-start gap-6">
                <div className="text-6xl">🕵️</div>
                <div className="flex-1 space-y-2">
                  <p style={{ color: "rgba(255,215,0,0.5)" }} className="text-xs tracking-widest">IDENTITÉ AGENT</p>
                  <p className="text-xl font-bold" style={{ color: "#FFD700" }}>RICHER-SOIGOR</p>
                  <p className="text-sm" style={{ color: "rgba(255,215,0,0.7)" }}>Spécialité : Résolution des Problèmes du Millénaire</p>
                  <p className="text-sm" style={{ color: "rgba(255,215,0,0.7)" }}>Terrain d'opération : Univers entier · Passé, Présent, Futur</p>
                  <div className="mt-3 p-3 rounded-xl italic text-sm transition-all duration-700" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,215,0,0.9)", border: "1px solid rgba(255,215,0,0.15)", minHeight: "3rem" }}>
                    « {AGENT_QUOTES[quoteIndex]} »
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Files */}
            <div>
              <p className="font-mono text-xs tracking-widest mb-4" style={{ color: "rgba(255,215,0,0.5)" }}>
                ▸ DOSSIERS DE MISSIONS CLASSIFIÉES
              </p>
              <div className="space-y-3">
                {MISSIONS.map((m, i) => (
                  <div
                    key={m.id}
                    onClick={() => setMissionIndex(missionIndex === i ? -1 : i)}
                    className="rounded-xl p-4 cursor-pointer transition-all duration-300 font-mono"
                    style={{
                      background: missionIndex === i ? "rgba(255,215,0,0.08)" : "rgba(0,0,0,0.5)",
                      border: `1px solid ${missionIndex === i ? "rgba(255,215,0,0.5)" : "rgba(255,215,0,0.15)"}`,
                      boxShadow: missionIndex === i ? "0 0 20px rgba(255,215,0,0.15)" : "none",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs" style={{ color: "rgba(255,215,0,0.5)" }}>[{m.id}]</span>
                        <span className="font-bold" style={{ color: "#FFD700" }}>OPÉRATION {m.code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded"
                          style={{ background: "rgba(16,185,129,0.2)", color: "rgba(16,185,129,1)", border: "1px solid rgba(16,185,129,0.4)" }}>
                          ✓ {m.status}
                        </span>
                      </div>
                    </div>
                    {missionIndex === i && (
                      <div className="mt-3 pt-3 space-y-2 animate-fade-in-up" style={{ borderTop: "1px solid rgba(255,215,0,0.1)" }}>
                        <p className="text-sm" style={{ color: "rgba(255,215,0,0.8)" }}>{m.briefing}</p>
                        <p className="text-xs" style={{ color: "rgba(16,185,129,0.8)" }}>MENACE : {m.threat}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Global Status */}
            <div className="rounded-2xl p-6 text-center space-y-4"
              style={{ background: "rgba(255,215,0,0.04)", border: "1px solid rgba(255,215,0,0.3)" }}>
              <p className="font-mono text-xs tracking-widest" style={{ color: "rgba(255,215,0,0.5)" }}>STATUT GLOBAL DE LA MISSION</p>
              <p className="font-display text-3xl font-black" style={{ color: "#FFD700" }}>
                MONDE SAUVÉ ✓
              </p>
              <p className="text-sm font-mono" style={{ color: "rgba(255,215,0,0.6)" }}>
                PROTOCOLE Egor69 ACTIF · PRÉCISION FINANCIÈRE · COSMOS MYSTIQUE · INTÉGRITÉ MAGICIEN BLANC
              </p>
              <div className="flex justify-center gap-8 pt-2 text-xs font-mono" style={{ color: "rgba(255,215,0,0.5)" }}>
                <span>MENACES : 0</span>
                <span>ALLIÉS : ∞</span>
                <span>PUISSANCE : MAXIMALE</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 rounded-xl font-mono font-bold text-sm transition-all hover:shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #B8860B, #FFD700)",
                  color: "#000",
                  boxShadow: "0 0 30px rgba(255,215,0,0.3)",
                }}
              >
                ◆ RETOUR AU QUARTIER GÉNÉRAL
              </button>
              <button
                onClick={() => navigate("/dashboard-royal")}
                className="px-8 py-3 rounded-xl font-mono font-bold text-sm transition-all"
                style={{
                  background: "transparent",
                  color: "rgba(255,215,0,0.8)",
                  border: "1px solid rgba(255,215,0,0.4)",
                }}
              >
                👑 DASHBOARD ROYAL
              </button>
            </div>

            {/* Footer */}
            <p className="text-center font-mono text-xs pb-6" style={{ color: "rgba(255,215,0,0.25)" }}>
              GOLDEN EYE PROTOCOL · CLASSIFIÉ NIVEAU OMÉGA · © Egor69 · SOUVERAINETÉ ABSOLUE
            </p>
          </div>
        </div>
      )}
    </div>
  );
}