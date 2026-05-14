import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const canvasRef = useRef(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      // Trigger animation after a brief delay
      setTimeout(() => setShowContent(true), 800);
    }
  }, [user, navigate]);

  // Particle burst animation
  useEffect(() => {
    if (!showContent) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let animId;

    const particles = Array.from({ length: 150 }, () => ({
      x: w / 2,
      y: h / 2,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 3,
      life: 1,
      size: Math.random() * 3 + 1,
      hue: Math.random() * 120 + 140,
    }));

    const draw = () => {
      ctx.fillStyle = "rgba(10,12,20,0.02)";
      ctx.fillRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life -= 0.01;

        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue},80%,60%,${p.life})`;
          ctx.fill();
        }
      });

      if (particles.some(p => p.life > 0)) {
        animId = requestAnimationFrame(draw);
      }
    };

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    draw();
    return () => cancelAnimationFrame(animId);
  }, [showContent]);

  return (
    <div className="min-h-screen overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />

      {/* Background */}
      <div className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, hsl(220,40%,5%) 0%, hsl(240,35%,8%) 40%, hsl(158,40%,8%) 100%)",
        }}>
        <div className="absolute top-1/4 left-1/4 h-96 w-96 opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(158,80%,50%,1), transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 right-1/4 h-80 w-80 opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, hsla(260,80%,60%,1), transparent 70%)", filter: "blur(70px)" }} />
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
        <div
          className={`text-center transform transition-all duration-1000 ${
            showContent
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-75 translate-y-8"
          }`}
        >
          {/* Emoji animation */}
          <div className="mb-8 flex justify-center">
            <div
              className="text-7xl animate-bounce"
              style={{ animationDuration: "2s", animationDelay: "0s" }}
            >
              💚
            </div>
            <div
              className="text-7xl animate-bounce ml-4"
              style={{ animationDuration: "2s", animationDelay: "0.2s" }}
            >
              ✨
            </div>
            <div
              className="text-7xl animate-bounce ml-4"
              style={{ animationDuration: "2s", animationDelay: "0.4s" }}
            >
              🌍
            </div>
          </div>

          {/* Main message */}
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-white mb-4 leading-tight">
            Bienvenue,<br />
            <span className="text-rainbow">{user?.full_name?.split(" ")[0]}</span>
          </h1>

          <p className="text-white/60 text-xl max-w-2xl mx-auto mb-3 leading-relaxed">
            Tu mérites ce câlin cosmique. Merci d'être ici, merci d'oser rêver, merci de vouloir changer le monde.
          </p>

          <p className="text-white/40 text-base mb-10 italic">
            « Tout commence par un pas. Tu viens de le faire. »
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              size="lg"
              className="rounded-xl font-bold px-8 text-base shadow-2xl border-0"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
              }}
            >
              <Link to="/marketplace">
                🚀 Découvrir le Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl text-white hover:bg-white/10 text-base"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              <Link to="/">← Retour à l'accueil</Link>
            </Button>
          </div>

          {/* Floaty features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-white/50 text-sm">
            {[
              { icon: "🎁", label: "Donner & recevoir" },
              { icon: "♻️", label: "Réparer le monde" },
              { icon: "🌟", label: "Gagner en aidant" },
            ].map((feature, i) => (
              <div
                key={feature.label}
                className="p-4 rounded-xl backdrop-blur-sm"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  animation: `float 6s ease-in-out ${i * 0.2}s infinite`,
                }}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <p className="text-xs font-medium text-white/70">{feature.label}</p>
              </div>
            ))}
          </div>

          {/* Footer message */}
          <div className="mt-16 text-white/30 text-xs">
            <p>Egor69 — pour celles et ceux qui veulent une économie circulaire à la hauteur du mystère du monde, sans promesses chiffrées creuses.</p>
            <p className="mt-1">🌈 L'économie circulaire est maintenant entre tes mains.</p>
          </div>
        </div>
      </div>
    </div>
  );
}