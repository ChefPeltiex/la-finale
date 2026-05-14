import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Petite illustration « serviteur Egor69 » (SVG maison) — décoratif, réutilisable.
 * Idées d’emplacement : porte d’accueil, empty states, pied de modale, coin dashboard.
 */
export default function Egor69Mascot({
  className,
  /** Largeur du dessin (hauteur proportionnelle au viewBox). */
  size = 112,
  /** Délai avant l’entrée en scène (ms). */
  enterDelay = 500,
  /** Variante visuelle. */
  variant = "peek",
}) {
  const [onStage, setOnStage] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (onStage) return;
    const t = window.setTimeout(() => setOnStage(true), enterDelay);
    return () => window.clearTimeout(t);
  }, [enterDelay, onStage]);

  const motion =
    variant === "peek"
      ? onStage
        ? "translate-x-0 translate-y-0 opacity-100 rotate-0"
        : "translate-x-[55%] translate-y-[18%] opacity-0 rotate-6"
      : onStage
        ? "opacity-100 scale-100"
        : "opacity-0 scale-90";

  return (
    <div
      className={cn(
        "pointer-events-none select-none transition-all duration-700 ease-out",
        variant === "peek" && !onStage && "blur-[0.5px]",
        motion,
        className,
      )}
      aria-hidden
    >
      <span className="sr-only">Illustration ludique du serviteur Egor69.</span>
      <div className={cn(onStage && "motion-safe:animate-float-slow motion-reduce:animate-none")}>
      <svg
        width={size}
        height={(size * 120) / 100}
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
      >
        <ellipse cx="50" cy="102" rx="28" ry="10" fill="rgba(0,0,0,0.35)" />
        <ellipse cx="50" cy="78" rx="34" ry="38" fill="url(#eg-body)" stroke="rgba(16,185,129,0.5)" strokeWidth="1.2" />
        <circle cx="50" cy="38" r="30" fill="url(#eg-head)" stroke="rgba(52,211,153,0.45)" strokeWidth="1.2" />
        <path
          d="M32 18 L38 8 L44 16 L50 6 L56 16 L62 8 L68 18 Q50 22 32 18 Z"
          fill="rgba(250,204,21,0.35)"
          stroke="rgba(250,204,21,0.55)"
          strokeWidth="0.8"
        />
        <ellipse cx="38" cy="40" rx="9" ry="11" fill="#f8fafc" />
        <ellipse cx="62" cy="40" rx="9" ry="11" fill="#f8fafc" />
        <circle cx="40" cy="41" r="3.2" fill="#0f172a" />
        <circle cx="64" cy="41" r="3.2" fill="#0f172a" />
        <circle cx="41" cy="40" r="1" fill="white" opacity="0.9" />
        <circle cx="65" cy="40" r="1" fill="white" opacity="0.9" />
        <path
          d="M38 54 Q50 62 62 54"
          stroke="rgba(15,23,42,0.55)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <text x="50" y="86" textAnchor="middle" fontSize="15" fill="rgba(236,253,245,0.9)">
          ♻
        </text>
        <defs>
          <linearGradient id="eg-head" x1="20" y1="10" x2="80" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#047857" />
            <stop offset="1" stopColor="#0f766e" />
          </linearGradient>
          <linearGradient id="eg-body" x1="20" y1="50" x2="80" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#065f46" />
            <stop offset="1" stopColor="#115e59" />
          </linearGradient>
        </defs>
      </svg>
      </div>
    </div>
  );
}
