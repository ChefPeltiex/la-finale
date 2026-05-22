import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Rappel sobre : requêtes IA = coût énergétique (cloud ou Ollama local).
 * Inspiré des travaux publics sur l’énergie par invite (ex. Google, 2025–2026).
 */
export default function AiEnergyFootprintNotice({ className, linkToDoc = true }) {
  return (
    <p
      className={cn(
        "flex gap-2 text-[10px] leading-snug text-muted-foreground",
        className
      )}
      role="note"
    >
      <Zap className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-70" aria-hidden />
      <span>
        Chaque requête IA consomme de l&apos;énergie (serveur distant ou Ollama local).
        Formulez une demande précise · évitez les relances inutiles.
        {linkToDoc ? (
          <>
            {" "}
            <Link
              to="/docs/circulai/inspiration-science-2026"
              className="text-sky-600/90 hover:underline dark:text-sky-400/90"
            >
              Contexte
            </Link>
          </>
        ) : null}
      </span>
    </p>
  );
}
