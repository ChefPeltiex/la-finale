import { useMemo, useRef, useEffect } from "react";
import { integrateDiscrete, simulatePilotSde } from "@/lib/math/pilotEquations";

export default function PilotSdeChart({ width = 520, height = 160 }) {
  const { weekly, cumulative } = useMemo(() => {
    const weekly = simulatePilotSde({ mu: 0.015, sigma: 0.06, steps: 13, x0: 0 });
    return { weekly, cumulative: integrateDiscrete(weekly) };
  }, []);

  const pad = 12;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const min = Math.min(...cumulative, 0);
  const max = Math.max(...cumulative, 0.01);
  const scaleY = (v) => pad + h - ((v - min) / (max - min)) * h;
  const scaleX = (i) => pad + (i / (cumulative.length - 1)) * w;

  const path = cumulative.map((v, i) => `${i === 0 ? "M" : "L"} ${scaleX(i)} ${scaleY(v)}`).join(" ");

  const pathRef = useRef(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
    // Trigger reflow before starting the transition
    void el.getBoundingClientRect();
    el.style.transition = "stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.strokeDashoffset = "0";
  }, [path]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-xl rounded-lg bg-sky-950/40 border border-sky-500/20">
      <path ref={pathRef} d={path} fill="none" stroke="#38bdf8" strokeWidth="2" />
      <text x={pad} y={height - 4} className="fill-sky-300/70 text-[9px]">
        Illustration · tendance μ + variation σ (simulation, pas une prévision certifiée)
      </text>
    </svg>
  );
}
