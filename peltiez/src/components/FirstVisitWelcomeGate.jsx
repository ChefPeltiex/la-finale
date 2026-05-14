import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Volume2, Lock } from "lucide-react";
import { EXPERIENCE_FLAGS } from "@/lib/experienceFlags";
import { FIRST_VISIT_WELCOME_TITLE, FIRST_VISIT_WELCOME_SECTIONS } from "@/lib/firstVisitWelcomeCopy";
import Egor69Mascot from "@/components/Egor69Mascot";

const STORAGE_KEY = "egor69:firstVisitWelcomeCompleted:v1";
const AUDIO_SRC = "/audio/first-visit-emotional.mp3";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function fadeOutAudio(audio, ms = 3200) {
  if (!audio || audio.paused) return;
  const steps = 16;
  const stepMs = Math.max(80, Math.floor(ms / steps));
  let v = audio.volume;
  const t = window.setInterval(() => {
    v = Math.max(0, v - 1 / steps);
    audio.volume = v;
    if (v <= 0.02) {
      window.clearInterval(t);
      audio.pause();
      audio.currentTime = 0;
    }
  }, stepMs);
}

export default function FirstVisitWelcomeGate() {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(STORAGE_KEY) === "1";
  });
  const [musicStarted, setMusicStarted] = useState(false);
  const [scrolledToEnd, setScrolledToEnd] = useState(false);
  const [checked, setChecked] = useState(false);
  const audioRef = useRef(null);
  const endRef = useRef(null);
  const scrollRef = useRef(null);

  const tryStartMusic = useCallback(() => {
    if (musicStarted || prefersReducedMotion()) return;
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.32;
    el.play()
      .then(() => setMusicStarted(true))
      .catch(() => {
        /* fichier absent ou autoplay refusé : silencieux */
      });
  }, [musicStarted]);

  useEffect(() => {
    if (dismissed || !EXPERIENCE_FLAGS.firstVisitWelcomeGate) return;
    const root = scrollRef.current;
    const node = endRef.current;
    if (!root || !node) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setScrolledToEnd(true);
      },
      { root, threshold: 0.85 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [dismissed]);

  if (!EXPERIENCE_FLAGS.firstVisitWelcomeGate || dismissed) return null;

  const canEnter = scrolledToEnd && checked;

  return (
    <div
      className="fixed inset-0 lg:left-64 z-[200] flex flex-col bg-[#050812]/97 backdrop-blur-xl text-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-visit-welcome-title"
      onPointerDownCapture={tryStartMusic}
    >
      <audio ref={audioRef} src={AUDIO_SRC} loop preload="none" />

      <Egor69Mascot
        variant="peek"
        enterDelay={480}
        size={108}
        className="absolute z-[2] bottom-[7.25rem] right-2 sm:bottom-[7.5rem] sm:right-8"
      />

      <div className="shrink-0 border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <Lock className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden />
          <span>Accès conditionnel — document à lire en entier</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/45">
          <Volume2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="hidden sm:inline">Audio d’ambiance : lecture optionnelle au premier geste</span>
          <span className="sm:hidden">Audio optionnel</span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-8 py-6 min-h-0"
      >
        <div className="max-w-2xl mx-auto space-y-6 pb-8">
          <h1 id="first-visit-welcome-title" className="font-display text-2xl sm:text-4xl font-bold text-emerald-100">
            {FIRST_VISIT_WELCOME_TITLE}
          </h1>
          {FIRST_VISIT_WELCOME_SECTIONS.map((p, i) => (
            <p key={i} className="text-sm sm:text-base leading-relaxed text-white/85">
              {p}
            </p>
          ))}
          <p ref={endRef} className="text-xs text-emerald-300/80 font-medium pt-2 border-t border-white/10">
            — Fin du document · faites défiler jusqu’ici, puis confirmez ci-dessous.
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/10 bg-black/40 px-4 py-4 space-y-4">
        <div className="max-w-2xl mx-auto flex items-start gap-3">
          <Checkbox
            id="welcome-read"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
            className="mt-1 border-white/40 data-[state=checked]:bg-emerald-600"
          />
          <label htmlFor="welcome-read" className="text-sm text-white/80 leading-snug cursor-pointer">
            Je confirme avoir lu l’intégralité du texte et compris le cadre d’utilisation (données personnelles, choix utilisateur, distinction entre usage courant de la plateforme et espaces symboliques ou ludiques).
          </label>
        </div>
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            type="button"
            disabled={!canEnter}
            className="rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 disabled:opacity-40"
            onClick={() => {
              if (!canEnter) return;
              localStorage.setItem(STORAGE_KEY, "1");
              fadeOutAudio(audioRef.current);
              setDismissed(true);
            }}
          >
            Accéder à la plateforme
          </Button>
        </div>
      </div>
    </div>
  );
}
