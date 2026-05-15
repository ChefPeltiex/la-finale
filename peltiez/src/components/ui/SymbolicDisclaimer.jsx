import { cn } from "@/lib/utils";

export default function SymbolicDisclaimer({ className, compact = false, variant = "default" }) {
  const frequency = variant === "frequency";

  return (
    <p
      role="note"
      className={cn(
        "rounded-xl border border-[#D4AF37]/25 bg-zinc-950/70 text-white/60 leading-relaxed",
        compact ? "px-3 py-2 text-[11px]" : "px-4 py-3 text-xs sm:text-sm",
        className
      )}
    >
      {frequency ? (
        <>
          <span className="font-semibold text-[#D4AF37]/90">Fréquences symboliques</span>
          {" — "}
          ambiance générée (432, 528, 852, 963, 7,83 Hz) à titre métaphorique ;{" "}
          <span className="text-white/75">non médical</span>, sans piste YouTube ni promesse de
          guérison.
        </>
      ) : (
        <>
          <span className="font-semibold text-[#D4AF37]/90">Section symbolique / métaphorique</span>
          {" — "}
          sans prétention scientifique ni promesse mesurée à l&apos;échelle sociétale. Les formules et
          protocoles sont des{" "}
          <span className="text-white/75">modèles à calibrer</span> sur un pilote réel (temps, coût,
          qualité des données).
        </>
      )}
    </p>
  );
}
