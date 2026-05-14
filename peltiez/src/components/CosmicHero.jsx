import { useEffect, useMemo, useRef, useId } from "react";
import { buildGoldenSpiralPathD } from "@/lib/goldenRatio";

// Animated particle canvas — pure web API, zero deps
export default function CosmicHero({ children, className = "", id }) {
  const canvasRef = useRef(null);
  const spiralId = useId().replace(/:/g, "");
  const spiralD = useMemo(() => buildGoldenSpiralPathD({ steps: 380, thetaStep: 0.03, r0: 2.2 }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let w, h;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particles — reduced count for performance
    const N = 55;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * 1000,
      y: Math.random() * 1000,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      hue: Math.random() * 120 + 140, // green-cyan-violet range
      alpha: Math.random() * 0.6 + 0.2,
    }));

    // Shooting stars
    const stars = [];
    const addStar = () => {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.5,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 6 + 4,
        alpha: 1,
        angle: Math.PI / 4,
      });
    };
    const starInterval = setInterval(() => {
      if (Math.random() < 0.25) addStar();
    }, 2000);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `hsla(${p.hue},80%,60%,${(1 - dist / 120) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,70%,${p.alpha})`;
        ctx.fill();
      }

      // Shooting stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.alpha -= 0.015;
        if (s.alpha <= 0) { stars.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x - Math.cos(s.angle) * s.len,
          s.y - Math.sin(s.angle) * s.len
        );
        grad.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(starInterval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div id={id} className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.55 }}
      />
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox="-320 -320 640 640"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: 0.14 }}
        aria-hidden
      >
        <defs>
          <linearGradient id={`spiral-grad-${spiralId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(245 158 11 / 0.55)" />
            <stop offset="55%" stopColor="rgb(16 185 129 / 0.35)" />
            <stop offset="100%" stopColor="rgb(99 102 241 / 0.25)" />
          </linearGradient>
        </defs>
        <path
          d={spiralD}
          fill="none"
          stroke={`url(#spiral-grad-${spiralId})`}
          strokeWidth="1.1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}