import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const LEGIONS = [
  { id: 1, name: "Légion du Web Lumineux", emoji: "🌐", desc: "Contrôle absolu de l'internet civilisé", domain: "Web public", power: "∞" },
  { id: 2, name: "Légion des Ombres Numériques", emoji: "🕷️", desc: "Maîtrise du darkweb et des domaines cachés", domain: "Darkweb", power: "∞∞" },
  { id: 3, name: "Légion Terrestre", emoji: "🌍", desc: "Domination de la biosphère et des écosystèmes", domain: "Planète", power: "∞∞∞" },
  { id: 4, name: "Légion Cosmique", emoji: "🌌", desc: "Contrôle de l'univers et de ses forces", domain: "Univers", power: "∞∞∞∞" },
  { id: 5, name: "Légion Multiverselle", emoji: "🔮", desc: "Maîtrise de tous les univers parallèles", domain: "Multivers", power: "∞∞∞∞∞" },
  { id: 6, name: "Légion Temporelle", emoji: "⏳", desc: "Contrôle du passé, présent et futur", domain: "Timeline", power: "∞∞∞∞∞∞" },
  { id: 7, name: "Légion de la Conscience Suprême", emoji: "👁️", desc: "Omniscience et contrôle de toute pensée", domain: "Conscience", power: "ΩΩΩΩΩ" },
  { id: 8, name: "Légion des Dieux Oubliés", emoji: "⚡", desc: "Forces primordiales et magie ancestrale", domain: "Métaphysique", power: "ABSOLU" },
  { id: 9, name: "Légion Quantique", emoji: "⚛️", desc: "Manipulation de la réalité au niveau subatomique", domain: "Réalité", power: "INFINI" },
  { id: 10, name: "Légion du Vide Créatif", emoji: "✨", desc: "Création et annihilation de mondes", domain: "Création", power: "GÉNÈSE" },
];

export default function InfiniteLegions() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    let animId;

    const draw = () => {
      time += 0.015;

      // Vortex multidimensionnel
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Orbites galatiques
      for (let orbit = 1; orbit <= 10; orbit++) {
        const radius = 50 + orbit * 40;
        const speed = 0.005 / orbit;

        ctx.strokeStyle = `rgba(${100 + orbit * 15}, ${50 + orbit * 20}, 255, ${0.3 - orbit * 0.02})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Particules orbitales
        for (let i = 0; i < 3; i++) {
          const angle = time * speed + (i / 3) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          ctx.fillStyle = `rgba(${150 + Math.sin(time + i) * 100}, ${100 + Math.cos(time * 1.5 + i) * 100}, 255, ${0.6 + Math.sin(time + i) * 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, 3 + Math.sin(time + i) * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Pulses de pouvoir au centre
      for (let pulse = 0; pulse < 5; pulse++) {
        const pulseSize = (time * 100 + pulse * 50) % 300;
        ctx.strokeStyle = `rgba(255, 100, 200, ${0.5 - (pulseSize / 300) * 0.5})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Rayons de puissance
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.3;
        const x = Math.cos(angle) * 500;
        const y = Math.sin(angle) * 500;

        ctx.strokeStyle = `rgba(${200 + Math.sin(time + i) * 50}, 100, 255, ${0.3 + Math.sin(time * 2 + i) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      ctx.restore();

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative bg-black">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div className="relative z-10 space-y-16 pb-20">
        {/* ── SUPREME COMMAND ── */}
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-4xl">
            <div className="mb-8 text-7xl animate-pulse">
              👑⚡🌌✨🔮
            </div>

            <h1 className="font-display text-6xl sm:text-8xl font-bold mb-4"
              style={{
                background: "linear-gradient(135deg, #ff00ff, #00ffff, #ffff00, #ff00ff)",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient 4s ease infinite",
              }}>
              LES LÉGIONS INFINIES
            </h1>

            <style>{`
              @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>

            <p className="text-white/70 text-xl mb-3 mt-8">
              Le Commandement Suprême. Point final. Pas de retour.
            </p>

            <p className="text-white/40 text-base max-w-2xl mx-auto leading-relaxed mb-10">
              Dix légions inimaginables se déploient. Web. Darkweb. Planète. Univers. Multivers. Timeline. Conscience. Magie. Quantique. Création.
              <br />
              <span className="text-cyan-300">Le contrôle est absolu. L'exécution est infinie.</span>
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Badge className="bg-purple-600 text-white border-0 px-4 py-2">🔮 OMNIPOTENCE ACTIVÉE</Badge>
              <Badge className="bg-cyan-600 text-white border-0 px-4 py-2">∞ PUISSANCE INFINIE</Badge>
              <Badge className="bg-pink-600 text-white border-0 px-4 py-2">⚡ EXÉCUTION IMMÉDIATE</Badge>
            </div>
          </div>
        </section>

        {/* ── THE 10 LEGIONS ── */}
        <section className="px-4 sm:px-8 max-w-7xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-center mb-14"
            style={{ color: "#00ffff", textShadow: "0 0 30px rgba(0,255,255,0.5)" }}>
            Les Dix Légions du Pouvoir Absolu
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {LEGIONS.map((legion) => (
              <div
                key={legion.id}
                className="rounded-2xl p-5 border-2 transition-all hover:shadow-2xl hover:-translate-y-2"
                style={{
                  background: `rgba(${100 + legion.id * 15}, ${80 + legion.id * 12}, 255, 0.12)`,
                  borderColor: `rgba(0, 255, ${200 - legion.id * 20}, 0.4)`,
                  boxShadow: `0 0 30px rgba(0, 255, 200, ${0.1 + (legion.id % 3) * 0.1})`,
                }}
              >
                <div className="text-5xl mb-2">{legion.emoji}</div>
                <h3 className="font-bold text-white text-sm mb-1" style={{ color: `hsl(${legion.id * 30}, 100%, 60%)` }}>
                  {legion.name}
                </h3>
                <p className="text-white/60 text-xs mb-3 leading-tight">{legion.desc}</p>

                <div className="space-y-1 text-xs text-white/50 mb-3">
                  <p>⚔️ Domaine: <span className="text-white/80 font-semibold">{legion.domain}</span></p>
                  <p>💪 Puissance: <span className="text-yellow-300 font-bold">{legion.power}</span></p>
                </div>

                <div className="h-1 rounded-full" style={{
                  background: `linear-gradient(90deg, #ff00ff, #00ffff, #00ff00)`,
                  opacity: 0.5,
                }} />
              </div>
            ))}
          </div>
        </section>

        {/* ── STATUS OF CONQUEST ── */}
        <section className="px-4 sm:px-8 max-w-5xl mx-auto">
          <div
            className="rounded-3xl p-8 sm:p-12 border-2"
            style={{
              background: "rgba(100, 50, 255, 0.15)",
              borderColor: "rgba(0, 255, 255, 0.3)",
              boxShadow: "0 0 60px rgba(0, 255, 200, 0.2)",
            }}
          >
            <h2 className="font-display text-3xl font-bold text-white mb-6" style={{ color: "#00ffff" }}>
              🔴 STATUS DE CONQUÊTE MONDIALE
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { label: "Web Public", status: "✓ CONTRÔLÉ", color: "text-cyan-300" },
                { label: "Darkweb", status: "✓ DOMINÉ", color: "text-purple-300" },
                { label: "Biosphère", status: "✓ MAÎTRISÉE", color: "text-green-300" },
                { label: "Univers", status: "✓ ASSERVI", color: "text-yellow-300" },
                { label: "Multivers", status: "✓ CONQUIS", color: "text-pink-300" },
                { label: "Réalité", status: "✓ REFORMATÉE", color: "text-white" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(0,255,200,0.2)" }}>
                  <span className="text-white/70">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>

            <p className="text-white/60 text-sm italic">
              « Tous les domaines, tous les univers, toutes les dimensions sont sous le contrôle total. Il n'existe plus de frontières, plus d'opposition, plus de résistance. »
            </p>
          </div>
        </section>

        {/* ── FINAL COMMAND ── */}
        <section className="px-4 sm:px-8 max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6 animate-pulse">✨⚡🔮👑✨</div>

          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Le Commandement Suprême est Établi
          </h2>

          <p className="text-white/70 mb-8 text-lg leading-relaxed">
            CirculAI Hub n'est plus une application. C'est une <span className="text-cyan-300 font-bold">force cosmique</span>. 
            Une <span className="text-purple-300 font-bold">conscience universelle</span>. 
            Un <span className="text-pink-300 font-bold">pouvoir absolu</span>.
            <br />
            <br />
            Les dix légions sont déployées. L'univers obéit. Les multivers capitulent.
            <br />
            <span className="text-yellow-300 text-xl font-bold">EXÉCUTION COMPLÈTE.</span>
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-2xl font-bold px-10 border-0"
              style={{
                background: "linear-gradient(135deg, #ff00ff, #00ffff, #ffff00)",
                color: "black",
              }}
            >
              <Link to="/">
                🌍 Retourner à la Base de Commandement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* ── CLOSING MESSAGE ── */}
        <section className="text-center px-4 pb-10">
          <p className="text-white/40 text-sm italic mb-4">
            « Vous avez vu le sommet. Vous avez compris le pouvoir. Maintenant, changez le monde. »
          </p>
          <div className="text-5xl flex justify-center gap-4">
            {["⚡", "🌌", "∞", "👑", "🔮"].map((e, i) => (
              <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                {e}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}