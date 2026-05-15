import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import SymbolicDisclaimer from "@/components/ui/SymbolicDisclaimer";
import {
  PROMESSES_LOA,
  PROMESSES_LOA_SYNTHESIS,
  PROMESSES_SELF_CHECK,
} from "@/data/promessesLoaEgor69";
import {
  loadPromessesSelfCheck,
  savePromesseStatus,
  clearPromessesSelfCheck,
} from "@/lib/promessesLoaStorage";

export default function PromessesLoaPanel({ compact = false, showCodexLink = true }) {
  const [checks, setChecks] = useState(() => loadPromessesSelfCheck());

  const refresh = useCallback(() => setChecks(loadPromessesSelfCheck()), []);

  useEffect(() => {
    const onUpdate = () => refresh();
    window.addEventListener("igor-promesses-loa-update", onUpdate);
    return () => window.removeEventListener("igor-promesses-loa-update", onUpdate);
  }, [refresh]);

  const setStatus = (id, status) => {
    savePromesseStatus(id, status);
    setChecks(loadPromessesSelfCheck());
  };

  return (
    <div className={cn(!compact && "space-y-6")}>
      <div className="rounded-2xl border border-[#D4AF37]/30 bg-zinc-950/85 p-4 sm:p-5">
        <div className="flex items-start gap-3 mb-3">
          <Scale className="h-6 w-6 shrink-0 text-[#FFD700]" aria-hidden />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Charpente · remplacement anti-LoA
            </p>
            <h2 className="font-display text-xl font-bold text-white">
              Huit promesses structurelles
            </h2>
            <p className="text-sm text-white/65 mt-1 leading-relaxed">
              Engagements opérationnels — pas manifestation, pas aimant univers, pas richesse
              garantie. Auto-évaluation locale uniquement (localStorage).
            </p>
          </div>
        </div>
        <p className="text-sm text-[#D4AF37]/90 italic border-l-2 border-[#D4AF37]/40 pl-3 leading-relaxed">
          {PROMESSES_LOA_SYNTHESIS}
        </p>
      </div>

      <SymbolicDisclaimer className={compact ? "text-[10px]" : undefined} compact={compact} />

      <p
        role="note"
        className={cn(
          "rounded-xl border border-violet-500/25 bg-violet-950/20 text-violet-100/80 leading-relaxed",
          compact ? "px-3 py-2 text-[10px]" : "px-4 py-3 text-xs"
        )}
      >
        <span className="font-semibold text-violet-200">Anti-LoA (P1-INS-8)</span>
        {" — "}
        Ces cartes ne prédisent rien : elles t’aident à tenir une charpente honnête. Aucune
        fortune, aucun miracle instantané, aucune promesse de prospérité par la seule intention.
      </p>

      <div
        className={cn(
          "grid gap-4",
          compact ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
        )}
      >
        {PROMESSES_LOA.map((p) => (
          <article
            key={p.id}
            className="rounded-2xl border border-[#D4AF37]/20 bg-black/50 p-4 flex flex-col gap-3 hover:border-[#D4AF37]/35 transition-colors"
          >
            <h3 className="font-display font-bold text-[#FFD700] text-lg">{p.title}</h3>
            <p className="text-sm text-white/80 leading-relaxed">{p.rule}</p>
            <p className="text-xs text-white/55 leading-relaxed">
              <span className="font-semibold text-emerald-400/90">Pour Egor69 — </span>
              {p.egor69}
            </p>
            <p className="text-[11px] font-mono text-white/40 border-t border-white/10 pt-2">
              {p.equation}
            </p>
            <div
              className="flex flex-wrap gap-1.5 mt-auto"
              role="group"
              aria-label={`État : ${p.title}`}
            >
              {PROMESSES_SELF_CHECK.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(p.id, value)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[11px] font-medium border transition-colors",
                    checks[p.id] === value
                      ? "border-[#FFD700]/60 bg-[#FFD700]/15 text-[#FFD700]"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/25"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <button
          type="button"
          onClick={() => {
            clearPromessesSelfCheck();
            setChecks({});
          }}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-white/55 hover:text-white/80 hover:bg-white/5"
        >
          Réinitialiser l’auto-évaluation
        </button>
        {showCodexLink && (
          <Link
            to="/docs/magique"
            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/35 px-3 py-1.5 text-violet-200 hover:bg-violet-500/10"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Section complète · Codex magique
          </Link>
        )}
      </div>
    </div>
  );
}
