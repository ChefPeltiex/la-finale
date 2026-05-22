import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SymbolicDisclaimer from "@/components/ui/SymbolicDisclaimer";
import {
  ensurePilotStartDate,
  formatMay21PilotNote,
  getMay21CalendarState,
  getPilot90Progress,
  getPilotLeidenfrostHint,
  loadBirthdayRitual,
  saveBirthdayRitual,
} from "@/lib/geminiBridge";

const RITUAL_ITEMS = [
  {
    id: "proofs",
    label: "Trois preuves documentées",
    hint: "Faits vérifiables · pas de chiffres inventés.",
    link: "/docs/preuves",
  },
  {
    id: "engagements",
    label: "Engagements tenus du pilote",
    hint: "Promesses réalistes tenues sur 90 jours.",
    link: "/docs/investisseur",
  },
  {
    id: "testimonials",
    label: "Témoignages collectés",
    hint: "Voix réelles · consentement explicite.",
    link: "/profil",
  },
];

export default function Pilot90Panel({ className, compact = false }) {
  const [ritual, setRitual] = useState(() => loadBirthdayRitual());
  const [progress, setProgress] = useState(() => getPilot90Progress());
  const may21 = getMay21CalendarState();

  const refresh = useCallback(() => {
    ensurePilotStartDate();
    setProgress(getPilot90Progress());
    setRitual(loadBirthdayRitual());
  }, []);

  useEffect(() => {
    refresh();
    const onRitual = () => setRitual(loadBirthdayRitual());
    window.addEventListener("egor69-pilot-birthday-ritual", onRitual);
    return () => window.removeEventListener("egor69-pilot-birthday-ritual", onRitual);
  }, [refresh]);

  const toggle = (id) => {
    setRitual(saveBirthdayRitual({ [id]: !ritual[id] }));
  };

  const ritualDone = RITUAL_ITEMS.filter((i) => ritual[i.id]).length;
  const leidenfrost = getPilotLeidenfrostHint(progress, ritual);

  return (
    <section
      className={cn(
        "pilot-card rounded-2xl border border-[#D4AF37]/35 bg-zinc-950/80 p-5 space-y-4",
        className
      )}
      aria-labelledby="pilot-90-title"
    >
      <div className="flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-[#FFD700] shrink-0 mt-0.5" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]/90">
            Pilote 90 jours
          </p>
          <h2 id="pilot-90-title" className="font-display text-lg font-bold text-white">
            Transition mesurée · preuves avant promesses
          </h2>
          {!compact && (
            <p className="text-xs text-white/55 mt-1 leading-relaxed">
              Jalons civils et engagements B2B — pas d’horoscope ni de « miracle » marketing.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-white/70">
          <span>Jour {progress.started ? progress.day : "—"} / {progress.total}</span>
          <span>{progress.complete ? "Pilote bouclé" : "En cours"}</span>
        </div>
        <div
          className="h-2 rounded-full bg-white/10 overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progress.ratio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#39FF14] transition-all duration-500"
            style={{ width: `${Math.round(progress.ratio * 100)}%` }}
          />
        </div>
        {!progress.started && (
          <Button type="button" size="sm" variant="outline" className="rounded-xl text-xs" onClick={refresh}>
            Démarrer le compteur pilote (aujourd’hui)
          </Button>
        )}
        {leidenfrost ? (
          <div
            className={cn(
              "rounded-xl border px-3 py-2.5 text-[11px] leading-snug",
              leidenfrost.level === "warn"
                ? "border-amber-500/45 bg-amber-500/10 text-amber-100/90"
                : "border-sky-500/35 bg-sky-500/8 text-sky-100/85"
            )}
            role="status"
          >
            <p className="font-semibold">{leidenfrost.title}</p>
            <p className="mt-1 text-white/60">{leidenfrost.body}</p>
          </div>
        ) : null}
      </div>

      <div
        className={cn(
          "rounded-xl border px-3 py-2.5 flex gap-2",
          may21.isNear
            ? "border-[#FFD700]/45 bg-[#FFD700]/8"
            : "border-white/10 bg-white/5"
        )}
      >
        <Calendar className="h-4 w-4 text-[#FFD700] shrink-0 mt-0.5" aria-hidden />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#FFD700]">Rituel d’anniversaire · 21 mai</p>
          <p className="text-[11px] text-white/60 mt-0.5 leading-snug">{formatMay21PilotNote()}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-white/45">
          Checklist revue ({ritualDone}/{RITUAL_ITEMS.length})
        </p>
        {RITUAL_ITEMS.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-3 transition-colors",
              ritual[item.id] ? "border-[#39FF14]/40 bg-[#39FF14]/5" : "border-white/10"
            )}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className={cn(
                "mt-0.5 h-5 w-5 rounded border flex items-center justify-center shrink-0",
                ritual[item.id]
                  ? "bg-[#39FF14] border-[#39FF14] text-zinc-950"
                  : "border-white/30"
              )}
              aria-pressed={!!ritual[item.id]}
              aria-label={item.label}
            >
              {ritual[item.id] ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white/90">{item.label}</p>
              <p className="text-[11px] text-white/50 mt-0.5">{item.hint}</p>
              <Link
                to={item.link}
                className="text-[11px] text-[#39FF14]/90 hover:underline mt-1 inline-block"
              >
                Ouvrir
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/docs/circulai-kit-regional"
        className="block rounded-xl border border-sky-500/30 bg-sky-950/25 px-3 py-2.5 text-xs text-sky-200/90 hover:bg-sky-500/10 transition-colors"
      >
        Kit régional — lettre, plan d&apos;affaires v2, démo 10 min
      </Link>

      <SymbolicDisclaimer variant="frequency" compact className="text-[10px]" />
    </section>
  );
}
