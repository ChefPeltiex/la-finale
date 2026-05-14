import { useEffect, useRef } from "react";
import { onStardust } from "@/lib/godMode";

function rand(min, max) {
  return min + Math.random() * (max - min);
}

export default function StardustLayer() {
  const canvasRef = useRef(null);
  const burstsRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof canvas.getContext !== "function") return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
      canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const off = onStardust(({ x, y, power = 1 } = {}) => {
      const count = Math.floor(32 * power);
      const colors = ["#fde68a", "#fbbf24", "#10b981", "#38bdf8", "#a855f7"];
      const t0 = performance.now();
      const parts = Array.from({ length: count }, () => ({
        x,
        y,
        vx: rand(-3.2, 3.2) * power,
        vy: rand(-3.6, 2.2) * power,
        r: rand(0.8, 2.2) * (0.7 + power * 0.15),
        life: rand(500, 900),
        born: t0,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      burstsRef.current.push({ parts, born: t0 });
      if (burstsRef.current.length > 10) burstsRef.current.shift();
    });

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const now = performance.now();

      burstsRef.current = burstsRef.current
        .map(b => {
          b.parts = b.parts.filter(p => now - p.born < p.life);
          return b;
        })
        .filter(b => b.parts.length > 0);

      for (const b of burstsRef.current) {
        for (const p of b.parts) {
          const age = now - p.born;
          const t = Math.min(1, age / p.life);
          const ease = 1 - Math.pow(1 - t, 3);
          const x = p.x + p.vx * ease * 12;
          const y = p.y + p.vy * ease * 12 + ease * ease * 18;
          const alpha = (1 - t) * 0.95;

          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.arc(x, y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      off?.();
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ mixBlendMode: "screen", opacity: 0.9 }}
      aria-hidden="true"
    />
  );
}

