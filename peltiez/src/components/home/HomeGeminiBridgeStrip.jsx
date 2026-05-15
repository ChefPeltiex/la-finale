import { Link } from "react-router-dom";
import { GitBranch, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRIDGE_TAGLINE, formatMay21PilotNote } from "@/lib/geminiBridge";
import usePilotMode from "@/hooks/usePilotMode";

export default function HomeGeminiBridgeStrip({ className }) {
  const { pilotMode } = usePilotMode();
  const showPilotNote = pilotMode;

  return (
    <section
      id="accueil-pont-gemini"
      className={cn(
        "scroll-mt-28 lg:scroll-mt-8 max-w-6xl mx-auto px-4 lg:px-8",
        className
      )}
      aria-label="Pont symbolique"
    >
      <div className="rounded-2xl border border-[#D4AF37]/30 bg-zinc-950/85 px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <GitBranch className="h-5 w-5 text-[#FFD700] shrink-0 mt-0.5" aria-hidden />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]/85">
              Pont · métaphore jumelle
            </p>
            <p className="text-sm font-semibold text-white/90 leading-snug">{BRIDGE_TAGLINE}</p>
            <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
              Contemplation ou action — une preuve vérifiable à la fois. Pas d’horoscope ni de promesse miracle.
            </p>
          </div>
        </div>
        {showPilotNote ? (
          <div className="sm:max-w-xs rounded-xl border border-[#FFD700]/35 bg-[#FFD700]/8 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#FFD700]/90 flex items-center gap-1">
              <Sparkles className="h-3 w-3" aria-hidden />
              Mode pilote
            </p>
            <p className="text-[11px] text-white/65 mt-1 leading-snug">{formatMay21PilotNote()}</p>
            <Link
              to="/pilote"
              className="mt-1.5 inline-block text-[11px] font-semibold text-[#39FF14]/90 hover:underline"
            >
              Tableau pilote 90 jours →
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
