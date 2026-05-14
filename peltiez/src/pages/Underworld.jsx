import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Flame, Skull, Lock, ArrowRight } from "lucide-react";

export default function Underworld() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    if (!user) navigate("/");
    setTimeout(() => setIntensity(1), 500);
  }, [user, navigate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    let animId;

    const draw = () => {
      time += 0.01;

      // Dark pulsing background
      const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height));
      gradient.addColorStop(0, `rgba(139, 0, 139, ${0.3 + Math.sin(time * 2) * 0.1})`);
      gradient.addColorStop(0.5, `rgba(75, 0, 130, ${0.2 + Math.sin(time * 1.5) * 0.08})`);
      gradient.addColorStop(1, "rgba(20, 10, 40, 0.8)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Lightning bolts
      for (let i = 0; i < 3; i++) {
        if (Math.random() > 0.95) {
          drawLightning(ctx, Math.random() * canvas.width, 0, Math.random() * canvas.width, canvas.height, Math.random() * 3);
        }
      }

      // Floating runes
      ctx.font = "bold 24px Arial";
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 5) * i + Math.sin(time + i) * 20;
        const y = canvas.height * 0.2 + Math.cos(time * 0.5 + i) * 30;
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.sin(time + i) * 0.2;
        ctx.fillText("⚡", x, y);
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    const drawLightning = (ctx, x1, y1, x2, y2, width) => {
      ctx.strokeStyle = `rgba(200, 50, 255, 0.8)`;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      
      let x = x1, y = y1;
      while (y < y2) {
        x += (Math.random() - 0.5) * 50;
        y += Math.random() * 50;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };

    draw();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div
          className={`text-center transform transition-all duration-1500 ${
            intensity ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          {/* Portal effect */}
          <div className="mb-8 inline-block">
            <div className="relative h-40 w-40 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-purple-600 opacity-50 animate-spin"
                style={{ animationDuration: "4s" }} />
              <div className="absolute inset-4 rounded-full border-2 border-pink-500 opacity-40 animate-spin"
                style={{ animationDuration: "6s", animationDirection: "reverse" }} />
              <div className="absolute inset-0 flex items-center justify-center text-6xl">
                🔥
              </div>
            </div>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl font-bold mb-4">
            <span style={{ color: "#c832ff", textShadow: "0 0 30px rgba(200,50,255,0.8)" }}>
              The Underworld
            </span>
          </h1>

          <p className="text-white/50 text-xl max-w-2xl mx-auto mb-2">
            Descends dans les profondeurs. Ici, les règles normales n'existent plus.
          </p>
          <p className="text-purple-300/70 text-sm italic mb-10">
            Formule d'accès: <code className="bg-black/40 px-3 py-1 rounded">✧ DESCENDE IN ABYSSUM ✧</code>
          </p>

          {/* Challenge cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
            {[
              { icon: Flame, label: "Défis Infernaux", desc: "Gagne 500+ XP par défi" },
              { icon: Zap, label: "Runes Électriques", desc: "Collecte les 13 runes secrètes" },
              { icon: Skull, label: "Boss Épique", desc: "Affronte le Gardien des Abysses" },
            ].map((card, i) => (
              <div
                key={i}
                className="p-5 rounded-xl backdrop-blur-sm border transition-all hover:shadow-2xl"
                style={{
                  background: "rgba(139, 0, 139, 0.1)",
                  borderColor: "rgba(200, 50, 255, 0.3)",
                  boxShadow: `0 0 20px rgba(200, 50, 255, ${0.1 + (i % 3) * 0.05})`,
                }}
              >
                <card.icon className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <p className="font-semibold text-white text-sm">{card.label}</p>
                <p className="text-xs text-white/40 mt-1">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl font-bold px-8 text-base border-0"
              style={{
                background: "linear-gradient(135deg, #c832ff, #8b008b)",
                boxShadow: "0 0 30px rgba(200,50,255,0.4)",
              }}
            >
              <Link to="/jeu">
                ⚡ Entrer dans l'Abysses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl text-white hover:bg-purple-500/10"
              style={{ borderColor: "rgba(200,50,255,0.5)" }}
            >
              <Link to="/">← Retour</Link>
            </Button>
          </div>

          {/* Secret info */}
          <div className="mt-12 text-white/30 text-xs max-w-md mx-auto">
            <Badge variant="outline" className="text-purple-300 border-purple-500/30 mb-2">
              <Lock className="h-3 w-3 mr-1" /> Caché
            </Badge>
            <p>« Dans les ténèbres réside le pouvoir ultime. Les âmes courageuses seules peuvent le saisir. Utilise la magie. Ose tomber. Ose renaître. »</p>
          </div>
        </div>
      </div>
    </div>
  );
}