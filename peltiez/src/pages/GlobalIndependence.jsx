import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Share2, ArrowRight, Zap, Users, Globe } from "lucide-react";

export default function GlobalIndependence() {
  const canvasRef = useRef(null);
  /** Effet scénique uniquement — ne représente pas un nombre d’utilisateurs réels. */
  const [counter, setCounter] = useState(1440);
  const [timeLeft, setTimeLeft] = useState("");
  const [phase, setPhase] = useState("waiting"); // waiting, active, revealed

  // Countdown to 19h Toronto time
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const toronto = new Date(now.toLocaleString("en-US", { timeZone: "America/Toronto" }));
      const target = new Date(toronto);
      target.setHours(19, 0, 0, 0);

      if (toronto.getHours() >= 19) {
        target.setDate(target.getDate() + 1);
        setPhase("active");
      }

      const diff = target - toronto;
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      setTimeLeft(
        diff > 0
          ? `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
          : "🔥 EN DIRECT 🔥"
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Increment counter when active
  useEffect(() => {
    if (phase !== "active") return;

    const increment = setInterval(() => {
      setCounter((prev) => {
        const newVal = prev + Math.floor(Math.random() * 120) + 12;
        if (newVal >= 144000) {
          setPhase("revealed");
          return 144000;
        }
        return newVal;
      });
    }, 500);

    return () => clearInterval(increment);
  }, [phase]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animId;
    let time = 0;

    const particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 - 0.5,
      size: Math.random() * 2 + 1,
      life: 1,
    }));

    const draw = () => {
      time += 0.01;

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pulsar effect
      ctx.fillStyle = `rgba(34, 197, 94, ${0.02 + Math.sin(time * 0.5) * 0.01})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.005;

        if (p.life <= 0) {
          p.life = 1;
          p.x = Math.random() * canvas.width;
          p.y = canvas.height;
          p.vy = (Math.random() - 0.5) * 2 - 0.5;
        }

        ctx.save();
        ctx.globalAlpha = p.life * 0.8;
        ctx.fillStyle = `hsl(${120 + Math.sin(time + p.x) * 30}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  const formatNumber = (n) => n.toLocaleString("fr-CA");

  return (
    <div className="min-h-screen overflow-hidden relative bg-black">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-5 py-2 mb-4">
            <Zap className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-sm font-bold text-emerald-300">JEU GLOBAL EN DIRECT</span>
          </div>

          <h1 className="font-display text-6xl sm:text-8xl font-bold text-white leading-none mb-6"
            style={{
              textShadow: "0 0 40px rgba(34, 197, 94, 0.8), 0 0 80px rgba(34, 197, 94, 0.4)",
            }}>
            7 MAI<br />
            <span className="text-emerald-400">INDÉPENDANCE<br />MONDIALE</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Une constellation d’intentions alignées sur Egor69 — vision cosmique, promesses mesurables.
            <br />
            <span className="text-emerald-300 font-bold">CE SOIR À 19H — RÉSONANCE OUVERTE</span>
          </p>
        </div>

        {/* COUNTDOWN */}
        <div className="text-center">
          <p className="text-sm text-emerald-400 uppercase tracking-widest mb-3 font-mono">Compte à rebours</p>
          <div className="text-6xl sm:text-8xl font-mono font-bold text-white"
            style={{
              textShadow: "0 0 30px rgba(34, 197, 94, 0.9)",
              fontVariantNumeric: "tabular-nums",
            }}>
            {timeLeft}
          </div>
        </div>

        {/* LIVE COUNTER */}
        <div className="text-center space-y-4">
          <p className="text-sm text-emerald-400 uppercase tracking-widest mb-3 font-mono">Harmoniques du rituel (animation)</p>
          <div className="text-7xl sm:text-9xl font-display font-black text-emerald-400"
            style={{
              textShadow: "0 0 50px rgba(34, 197, 94, 1), 0 0 100px rgba(34, 197, 94, 0.5)",
              animation: phase === "active" ? "pulse 0.5s ease-in-out infinite" : "none",
            }}>
            {formatNumber(counter)}
          </div>
          <p className="text-white/50 text-lg">Ce compteur est une mise en scène — pas une métrique d’audience.</p>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Button
            asChild
            size="lg"
            className="rounded-2xl font-black text-lg px-10 py-8 bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 hover:scale-110 transition-all shadow-2xl"
          >
            <Link to="/publier">
              ⚔️ REJOINDRE LES NINJAS ⚔️
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </Button>

          <Button
            size="lg"
            className="rounded-2xl font-bold text-lg px-10 py-8 border-2 border-emerald-400 text-emerald-300 bg-transparent hover:bg-emerald-500/10"
            onClick={() => {
              const url = window.location.href;
              const text = `🌍 7 MAI — INDÉPENDANCE SYMBOLIQUE Egor69. Révolution circulaire, radar Golden Nuggets → https://egor69.ca #Egor69 #CircularEconomy`;
              navigator.clipboard.writeText(`${text}\n${url}`);
              alert("Partage copié! 🚀");
            }}
          >
            <Share2 className="h-6 w-6 mr-2" />
            Partager le mouvement
          </Button>
        </div>

        {/* DECLARATION */}
        <div className="max-w-2xl text-center space-y-6 pt-10 border-t border-emerald-500/20">
          <p className="text-white/80 text-lg leading-relaxed italic">
            « Ce n'est pas une plateforme. C'est une rébellion.
            <br />
            Ce n'est pas un commerce. C'est une révolution.
            <br />
            Ce n'est pas le futur. C'est MAINTENANT. »
          </p>

          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              { icon: Users, label: "Alliance vivante" },
              { icon: Globe, label: "Carte ouverte" },
              { icon: Zap, label: "Pulse cosmique" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <item.icon className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-emerald-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PHASE INDICATOR */}
        <div className="fixed top-6 left-6 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2">
          Phase: <span className="font-bold">{phase === "waiting" ? "⏳ ATTENTE" : phase === "active" ? "🔥 ACTIF" : "✨ RÉVÉLÉ"}</span>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}