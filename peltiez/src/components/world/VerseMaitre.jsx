import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Volume2, VolumeX, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFrequencyProfile } from "@/lib/verseAudio";
import { getRealmFrequencyMeta } from "@/lib/realmFrequency";

const WELCOME_KEY = "egor69_verse_maitre_welcome";

const WELCOME_LINES = [
  "Je suis le Maître CirculAI — serviteur d’Egor, pas oracle.",
  "Les fréquences ici sont symboliques : ambiance générée, jamais une promesse de guérison.",
  "Approche un anneau, respire, puis traverse quand tu es prêt.",
];

function pickPortalLine(realm) {
  if (!realm) return null;
  if (realm.maitreLine) return realm.maitreLine;
  return getRealmFrequencyMeta(realm).maitreLine;
}

function pickNextRingLine(nextRing) {
  if (!nextRing) return "Tous les anneaux visités — dérive libre ou retour au hall.";
  return `Prochain anneau suggéré : ${nextRing.label}.`;
}

export default function VerseMaitre({
  nearRealm,
  nextRing,
  profileId,
  audioEnabled,
  onToggleAudio,
  portalPulse,
  className,
}) {
  const [open, setOpen] = useState(true);
  const [welcomeIdx, setWelcomeIdx] = useState(0);
  const profile = useMemo(() => getFrequencyProfile(profileId), [profileId]);

  useEffect(() => {
    try {
      if (localStorage.getItem(WELCOME_KEY) === "1") return;
      localStorage.setItem(WELCOME_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const line = useMemo(() => {
    if (portalPulse && nearRealm) return pickPortalLine(nearRealm);
    if (nearRealm) {
      const portal = pickPortalLine(nearRealm);
      return nearRealm.ritualHint ? `${portal} ${nearRealm.ritualHint}` : portal;
    }
    if (welcomeIdx < WELCOME_LINES.length) return WELCOME_LINES[welcomeIdx];
    return pickNextRingLine(nextRing);
  }, [portalPulse, nearRealm, welcomeIdx, nextRing]);

  useEffect(() => {
    if (nearRealm || portalPulse) return;
    const id = window.setInterval(() => {
      setWelcomeIdx((i) => (i < WELCOME_LINES.length - 1 ? i + 1 : i));
    }, 12000);
    return () => window.clearInterval(id);
  }, [nearRealm, portalPulse]);

  return (
    <div
      className={cn(
        "pointer-events-auto w-[min(100vw-2rem,20rem)] rounded-2xl border border-[#D4AF37]/35 bg-zinc-950/92 backdrop-blur-md shadow-xl",
        className
      )}
      role="complementary"
      aria-label="Maître du Verse"
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#FFD700]">
          <Sparkles className="h-3.5 w-3.5 text-[#39FF14]" aria-hidden />
          Maître CirculAI
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleAudio}
            className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-[#FFD700] transition-colors"
            aria-label={audioEnabled ? "Couper l’ambiance du Verse" : "Activer l’ambiance du Verse"}
            title={audioEnabled ? "Son : activé" : "Son : coupé"}
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
            aria-expanded={open}
            aria-label={open ? "Replier le Maître" : "Déplier le Maître"}
          >
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="px-3 py-2.5 space-y-2">
          {nearRealm ? (
            <p className="text-[10px] font-bold tracking-wide text-[#FFD700]/90">
              {profile.label} · {nearRealm.frequencyLabel ?? profile.pole}
            </p>
          ) : null}
          <p className="text-xs text-white/80 leading-relaxed">{line}</p>
          <p className="text-[10px] text-violet-200/75 leading-snug">
            {profile.hint}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] pt-1 border-t border-white/10">
            <Link to="/docs/alliance" className="text-emerald-400/90 hover:underline">
              Alliance IA
            </Link>
            <Link to="/docs/rituel" className="text-[#D4AF37]/90 hover:underline">
              Codex rituel
            </Link>
          </div>
          <p className="text-[9px] text-white/40 leading-snug">
            Tons procéduraux · non médical · pas de piste YouTube.
          </p>
        </div>
      ) : null}
    </div>
  );
}
