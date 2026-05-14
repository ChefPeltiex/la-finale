import { useEffect, useMemo, useState } from "react";
import { MathInline } from "@/components/MathRenderer";

const FORMULAS = [
  { label: "Équilibre", math: "\\\\text{Soin} \\\\times \\\\text{Vérité} \\\\rightarrow \\\\text{Confiance}" },
  { label: "Fluidité", math: "\\\\Delta \\\\text{Friction} < 0 \\\\Rightarrow \\\\Delta \\\\text{Action} > 0" },
  { label: "Circulation", math: "\\\\text{Abondance} = \\\\frac{\\\\text{Valeur créée}}{\\\\text{Gaspillage}+\\\\text{Opacité}}" },
  { label: "Régénération", math: "\\\\text{Archive} \\\\rightarrow \\\\text{Graine} \\\\rightarrow \\\\text{Fruit du Dragon}" },
  { label: "Radar", math: "\\\\text{Signal} - \\\\text{Bruit} \\\\rightarrow \\\\text{Nugget}" },
];

export default function SovereigntyFormulaRibbon() {
  const [idx, setIdx] = useState(0);
  const item = useMemo(() => FORMULAS[idx % FORMULAS.length], [idx]);

  useEffect(() => {
    const t = setInterval(() => setIdx((v) => v + 1), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(16,185,129,0.06))",
      }}
    >
      <div className="px-4 py-2 flex items-center gap-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-white/55 uppercase">
          Formules de souveraineté
        </span>
        <span className="text-[10px] font-mono text-white/35">·</span>
        <span className="text-[10px] font-mono text-amber-300/80">{item.label}</span>
        <div className="ml-auto text-xs text-white/80 overflow-hidden whitespace-nowrap">
          <MathInline math={item.math} />
        </div>
      </div>
    </div>
  );
}

