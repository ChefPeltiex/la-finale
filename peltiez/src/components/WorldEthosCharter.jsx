import { Link } from "react-router-dom";
import { Heart, ScrollText, Layers } from "lucide-react";
import { WORLD_ETHOS } from "@/lib/site";

/**
 * Textes canoniques depuis {@link WORLD_ETHOS} — une seule source pour Charte + Mon univers.
 */
export default function WorldEthosCharter({ variant = "full" }) {
  const compact = variant === "compact";

  return (
    <div className={compact ? "space-y-4" : "space-y-8"}>
      <section
        className={
          compact
            ? "rounded-xl border border-border bg-card/80 p-4 space-y-3"
            : "rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/40 via-card to-card p-6 sm:p-8 space-y-4"
        }
      >
        <div className="flex items-center gap-2">
          <Heart className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-emerald-400 shrink-0`} aria-hidden />
          <h2 className={`font-display font-bold text-foreground ${compact ? "text-base" : "text-xl"}`}>
            Entraide, joie & valves ludiques
          </h2>
        </div>
        <ul className={`space-y-2 ${compact ? "text-xs" : "text-sm"} text-muted-foreground leading-relaxed list-disc pl-5 marker:text-emerald-600/80`}>
          {WORLD_ETHOS.catharsisAndCare.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        <p
          className={`text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 ${compact ? "text-[11px] pt-1" : "text-xs"}`}
        >
          <Link to="/outworld" className="text-emerald-600 hover:underline font-medium">
            Outworld
          </Link>
          <Link to="/arene-virtuelle" className="text-emerald-600 hover:underline font-medium">
            Arène
          </Link>
          <Link to="/security" className="hover:underline">
            Sécurité
          </Link>
        </p>
      </section>

      <section
        className={
          compact
            ? "rounded-xl border border-amber-500/20 bg-amber-950/15 p-4 space-y-3"
            : "rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/30 via-card to-card p-6 sm:p-8 space-y-4"
        }
      >
        <div className="flex items-center gap-2">
          <Layers className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-amber-400 shrink-0`} aria-hidden />
          <h2 className={`font-display font-bold text-foreground ${compact ? "text-base" : "text-xl"}`}>
            Priorité absolue — cohérence globale
          </h2>
        </div>
        <ul
          className={`space-y-2 ${compact ? "text-xs" : "text-sm"} text-muted-foreground leading-relaxed list-disc pl-5 marker:text-amber-600/80`}
        >
          {WORLD_ETHOS.absoluteCohesion.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <section
        className={
          compact
            ? "rounded-xl border border-border p-4 space-y-3"
            : "rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4"
        }
      >
        <div className="flex items-center gap-2">
          <ScrollText className={`${compact ? "h-4 w-4" : "h-5 w-5"} text-primary shrink-0`} aria-hidden />
          <h2 className={`font-display font-bold text-foreground ${compact ? "text-base" : "text-xl"}`}>
            Promesses fondatrices
          </h2>
        </div>
        <ul className={`space-y-2 ${compact ? "text-xs" : "text-sm"} text-muted-foreground leading-relaxed list-disc pl-5`}>
          {WORLD_ETHOS.charter.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
