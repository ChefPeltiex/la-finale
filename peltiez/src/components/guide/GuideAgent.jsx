import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Compass, X, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getGuideHintsForPath, COMPANION_DOC_PATH } from "@/config/guidePageHints";
import { loadDisplayMode, saveDisplayMode } from "@/lib/displayMode";

export default function GuideAgent() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(() => loadDisplayMode());

  useEffect(() => {
    const onMode = (ev) => setMode(ev.detail === "simple" ? "simple" : "deep");
    window.addEventListener("egor69-display-mode", onMode);
    return () => window.removeEventListener("egor69-display-mode", onMode);
  }, []);

  const hints = getGuideHintsForPath(location.pathname);
  const simple = mode === "simple";

  const toggleMode = () => {
    const next = simple ? "deep" : "simple";
    saveDisplayMode(next);
    setMode(next);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-[55] h-14 w-14 rounded-full",
          "flex items-center justify-center shadow-lg transition-all",
          "border-2 border-[#D4AF37]/60 bg-zinc-950/95 hover:border-[#FFD700] hover:shadow-[0_0_24px_rgba(255,215,0,0.25)]",
          open && "ring-2 ring-[#39FF14]/50"
        )}
        aria-label="Guide Egor69"
        aria-expanded={open}
      >
        <Compass className="h-6 w-6 text-[#FFD700]" />
      </button>

      {open && (
        <div
          className="fixed bottom-36 right-4 lg:bottom-24 lg:right-6 z-[55] w-[min(100vw-2rem,22rem)] rounded-2xl border border-[#D4AF37]/35 bg-zinc-950/98 backdrop-blur-md shadow-2xl overflow-hidden sovereign-border-glow"
          role="dialog"
          aria-label="Panneau guide"
        >
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-display font-bold text-sm text-[#FFD700] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#39FF14]" />
                Guide · {hints.title}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="mt-3 space-y-2 text-xs text-white/75 leading-relaxed">
              {hints.steps.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#BF00FF] font-bold shrink-0">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
            <a
              href={`/${COMPANION_DOC_PATH}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2 text-[11px] text-[#39FF14] hover:underline"
            >
              <BookOpen className="h-3.5 w-3.5" />
              {COMPANION_DOC_PATH}
            </a>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[10px] text-white/50 uppercase tracking-wider">Affichage</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 rounded-lg text-xs border-[#D4AF37]/40 hover:bg-[#FFD700]/10"
                onClick={toggleMode}
              >
                {simple ? "Mode profond" : "Mode simple"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}