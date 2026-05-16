import { cn } from "@/lib/utils";

export default function SymbolicDisclaimer({ className, compact = false, variant = "default" }) {
  const frequency = variant === "frequency";
  const naturePortail = variant === "naturePortail";
  const natureHeritage = variant === "natureHeritage";

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
      ) : naturePortail ? (
        <>
          <span className="font-semibold text-emerald-300/95">Univers de jeu · fiction symbolique</span>
          {" — "}
          pas de médecine, pas d&apos;écologie normative, pas de promesses réelles. Les archétypes, quêtes et
          « pouvoirs » sont des <span className="text-white/80">accessoires de récit</span> pour parcourir le site ;
          aucun rituel ni mécanique magique n&apos;est activé ici.
        </>
      ) : natureHeritage ? (
        <>
          <span className="font-semibold text-[#D4AF37]/90">Patrimoine oral, symbolique et culturel</span>
          {" — "}
          Ne constitue pas un <span className="text-white/75">avis médical</span>, une identification
          fongique ou entomologique sûre des espèces, ni une recommandation de consommation ou de
          cueillette. Les noms « traditionnels » ou « de terroir » renvoient au{" "}
          <span className="text-white/75">folklore et à l&apos;histoire</span>, pas à l&apos;efficacité
          thérapeutique. Pour la santé, la toxicologie ou la légalité, consultez un{" "}
          <span className="text-white/75">professionnel qualifié</span> et des sources officielles.
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
