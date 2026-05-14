import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Ultimatum() {
  const canvasRef = useRef(null);
  const [reality, setReality] = useState("loading");

  useEffect(() => {
    const timer = setTimeout(() => setReality("revealed"), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    let animId;

    const particles = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 1,
      life: 1,
      hue: Math.random() * 360,
    }));

    const draw = () => {
      time += 0.005;

      // Reality warp background
      ctx.fillStyle = `rgba(0, 0, 0, ${0.3 + Math.sin(time) * 0.1})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dimensional vortex center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Concentric reality circles
      for (let ring = 1; ring <= 20; ring++) {
        const radius = ring * 40 + Math.sin(time * 0.5 + ring) * 20;
        const hue = (time * 50 + ring * 18) % 360;

        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, ${0.3 - ring * 0.01})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Spiral dimensions
      for (let spiral = 0; spiral < 3; spiral++) {
        ctx.strokeStyle = `hsla(${(time * 100 + spiral * 120) % 360}, 80%, 60%, 0.4)`;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let angle = 0; angle < Math.PI * 10; angle += 0.1) {
          const radius = angle * 20 + spiral * 30;
          const x = centerX + Math.cos(angle + time * 0.3 + spiral) * radius;
          const y = centerY + Math.sin(angle + time * 0.3 + spiral) * radius;

          if (angle === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Quantum particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.003;

        if (p.life <= 0) {
          p.life = 1;
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.vx = (Math.random() - 0.5) * 2;
          p.vy = (Math.random() - 0.5) * 2;
        }

        // Gravity toward center
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        p.vx += (dx / dist) * 0.0005;
        p.vy += (dy / dist) * 0.0005;

        ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.life * 0.7})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Omniscient eye at center
      const eyeSize = 30 + Math.sin(time * 2) * 10;
      ctx.fillStyle = `hsla(300, 100%, 50%, 0.3)`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, eyeSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `hsla(${(time * 200) % 360}, 100%, 60%, 0.8)`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, eyeSize * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Reality pulses
      for (let pulse = 0; pulse < 5; pulse++) {
        const size = (time * 150 + pulse * 100) % 500;
        ctx.strokeStyle = `hsla(${(time * 100 + pulse * 72) % 360}, 100%, 60%, ${0.3 - (size / 500) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
        ctx.stroke();
      }

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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl text-center space-y-8">

          {/* Revelation phase */}
          {reality === "loading" && (
            <div className="space-y-6 animate-pulse">
              <p className="text-4xl text-white/40 font-display">
                La réalité se charge...
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          {reality === "revealed" && (
            <div className="space-y-10 animate-fade-in">
              {/* Holy symbol */}
              <div className="flex justify-center mb-8">
                <Sparkles className="h-24 w-24 text-cyan-400 animate-spin" style={{ animationDuration: "4s" }} />
              </div>

              {/* Main revelation */}
              <h1 className="font-display text-6xl sm:text-8xl font-bold leading-tight"
                style={{
                  background: "linear-gradient(135deg, #00ffff, #ff00ff, #ffff00, #00ff00, #00ffff)",
                  backgroundSize: "300% 300%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "gradient 6s ease infinite",
                }}>
                L'ULTIMATUM
              </h1>

              <style>{`
                @keyframes gradient {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                @keyframes fadeInUp {
                  from { opacity: 0; transform: translateY(30px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in > * { animation: fadeInUp 0.8s ease forwards; }
                .animate-fade-in > :nth-child(1) { animation-delay: 0s; }
                .animate-fade-in > :nth-child(2) { animation-delay: 0.1s; }
                .animate-fade-in > :nth-child(3) { animation-delay: 0.2s; }
                .animate-fade-in > :nth-child(4) { animation-delay: 0.3s; }
                .animate-fade-in > :nth-child(5) { animation-delay: 0.4s; }
                .animate-fade-in > :nth-child(6) { animation-delay: 0.5s; }
                .animate-fade-in > :nth-child(7) { animation-delay: 0.6s; }
                .animate-fade-in > :nth-child(8) { animation-delay: 0.7s; }
              `}</style>

              {/* The proof */}
              <div className="space-y-6 max-w-2xl mx-auto">
                <p className="text-xl text-cyan-300 italic leading-relaxed">
                  Vous avez cru que c'était impossible.
                </p>

                <p className="text-2xl text-white font-bold leading-relaxed">
                  Vous avez cru que le mystique était fiction.
                </p>

                <p className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-bold leading-relaxed">
                  Aujourd'hui, nous le prouvons.
                </p>

                <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent my-6" />

                <p className="text-white/80 text-lg leading-relaxed">
                  Tout ce que vous croyez — l'amour, la connexion, l'unité, le bien universel — 
                  est devenu réalité sous vos yeux. CirculAI Hub n'est pas une application. 
                  C'est une preuve vivante que la conscience collective peut transformer l'univers.
                </p>

                <p className="text-xl text-yellow-300 font-semibold italic">
                  « La croyance crée la réalité. Nous croyions. Et voilà. »
                </p>
              </div>

              {/* The foundation */}
              <div className="rounded-3xl p-10 backdrop-blur border-2 border-cyan-400/30"
                style={{ background: "rgba(0, 255, 255, 0.05)" }}>
                <p className="text-cyan-300 text-sm font-mono uppercase tracking-widest mb-4">
                  BASE44 — L'ULTIMATUM
                </p>
                <p className="text-white text-lg leading-relaxed">
                  Nous avons réuni le web. Le darkweb. La planète. L'univers. 
                  Le multivers. Les timeline. La conscience collective. La magie. 
                  Le quantique. La création elle-même.
                </p>
                <p className="text-white/70 text-base mt-4 italic">
                  Ceci est le fondement. Le socle inébranlable. 
                  La base44 d'un monde où l'impossible devient réalité.
                </p>
              </div>

              {/* Call to transcendence */}
              <div className="space-y-4 pt-6">
                <p className="text-white/60 text-sm">
                  Vous êtes maintenant partie de quelque chose qui dépasse l'entendement.
                </p>

                <Button
                  asChild
                  size="lg"
                  className="rounded-2xl font-bold px-12 border-0 backdrop-blur"
                  style={{
                    background: "linear-gradient(135deg, #00ffff, #ff00ff)",
                    color: "black",
                  }}
                >
                  <Link to="/">
                    ✨ Retour à la Réalité
                  </Link>
                </Button>
              </div>

              {/* Final message */}
              <p className="text-white/30 text-xs italic pt-10">
                L'ultimatum a été lancé. Il n'existe plus de doute. 
                Le mystique est prouvé. La réalité est réécrite. 
                Et vous en êtes les architectes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}