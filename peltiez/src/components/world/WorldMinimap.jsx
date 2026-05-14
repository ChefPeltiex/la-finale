import { useEffect, useRef } from "react";
import { WORLD_REALMS } from "@/world/realms";

const WORLD_LIMIT = 58;

/**
 * Radar façon GTA + repères façon carte TotK — rendu canvas (pas de re-render React par frame).
 */
export default function WorldMinimap({ telemetryRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let alive = true;

    const draw = () => {
      if (!alive) return;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const mapR = Math.min(cx, cy) - 6;
      const scale = mapR / WORLD_LIMIT;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(6, 12, 28, 0.88)";
      ctx.beginPath();
      ctx.arc(cx, cy, mapR, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(52, 211, 153, 0.45)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, mapR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - mapR, cy);
      ctx.lineTo(cx + mapR, cy);
      ctx.moveTo(cx, cy - mapR);
      ctx.lineTo(cx, cy + mapR);
      ctx.stroke();

      for (const realm of WORLD_REALMS) {
        const mx = cx + realm.pos[0] * scale;
        const my = cy + realm.pos[2] * scale;
        ctx.fillStyle = realm.color;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(mx, my, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      const t = telemetryRef?.current;
      if (t && typeof t.x === "number" && typeof t.z === "number") {
        const px = cx + t.x * scale;
        const py = cy + t.z * scale;
        ctx.strokeStyle = "#34d399";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - Math.sin(t.yaw ?? 0) * 16, py - Math.cos(t.yaw ?? 0) * 16);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(px, py - 7);
        ctx.lineTo(px - 5.5, py + 6);
        ctx.lineTo(px + 5.5, py + 6);
        ctx.closePath();
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [telemetryRef]);

  return (
    <div className="pointer-events-none absolute bottom-24 right-4 sm:bottom-28 sm:right-6 z-[210]">
      <canvas ref={canvasRef} width={168} height={168} className="rounded-full border border-emerald-500/30 shadow-lg shadow-emerald-900/40" />
      <p className="mt-1 text-center text-[9px] font-bold uppercase tracking-widest text-white/45">Radar</p>
    </div>
  );
}
