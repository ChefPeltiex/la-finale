import { useEffect, useRef } from "react";

/**
 * @param {{ layout: Array<{ id: string, title?: string, gridX: number, gridY: number, gridSize: number, peanoIndex: number }>, highlightId?: string }} props
 */
export default function PeanoAtlasCanvas({ layout, highlightId, onSelect }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !layout?.length) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const gs = layout[0].gridSize || 16;
    const cell = size / (gs + 1);

    ctx.fillStyle = "#050508";
    ctx.fillRect(0, 0, size, size);

    const ordered = [...layout].sort((a, b) => a.peanoIndex - b.peanoIndex);
    ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ordered.forEach((f, i) => {
      const px = (f.gridX + 0.5) * cell;
      const py = (f.gridY + 0.5) * cell;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    layout.forEach((f) => {
      const px = (f.gridX + 0.5) * cell;
      const py = (f.gridY + 0.5) * cell;
      const active = f.id === highlightId;
      ctx.beginPath();
      ctx.arc(px, py, active ? 5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = active ? "#FFD700" : "rgba(255, 215, 0, 0.55)";
      ctx.fill();
    });
  }, [layout, highlightId]);

  const handleClick = (ev) => {
    if (!onSelect || !layout?.length) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const gs = layout[0].gridSize || 16;
    const cell = rect.width / (gs + 1);
    let best = null;
    let bestD = Infinity;
    for (const f of layout) {
      const px = (f.gridX + 0.5) * cell;
      const py = (f.gridY + 0.5) * cell;
      const d = (px - x) ** 2 + (py - y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = f;
      }
    }
    if (best && bestD < cell * cell) onSelect(best);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full aspect-square max-w-lg mx-auto rounded-xl border border-[#D4AF37]/30 cursor-pointer"
      onClick={handleClick}
      role="img"
      aria-label="Carte Peano du maillage encyclopédique"
    />
  );
}
