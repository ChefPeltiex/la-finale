import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { DEPLOY_LAUNCH_AT_QUEBEC, DEPLOY_LAUNCH_LABEL } from "@/lib/deployLaunch";

function pad(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

function formatRemaining(ms) {
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (days > 0) {
    return `${days} j ${pad(h)} h ${pad(m)} min ${pad(sec)} s`;
  }
  return `${pad(h)} h ${pad(m)} min ${pad(sec)} s`;
}

export default function DeploymentCountdownBanner() {
  const [line, setLine] = useState(() => formatRemaining(DEPLOY_LAUNCH_AT_QUEBEC - Date.now()));
  const [done, setDone] = useState(() => Date.now() >= DEPLOY_LAUNCH_AT_QUEBEC.getTime());

  useEffect(() => {
    const tick = () => {
      const diff = DEPLOY_LAUNCH_AT_QUEBEC.getTime() - Date.now();
      if (diff <= 0) {
        setDone(true);
        setLine(null);
        return;
      }
      setLine(formatRemaining(diff));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (done) {
    return (
      <div
        className="sticky top-14 lg:top-0 z-[35] border-b border-emerald-500/25 bg-emerald-950/80 backdrop-blur-md"
        role="status"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 text-center">
          <Timer className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden />
          <p className="text-xs sm:text-sm font-medium text-emerald-100/95">
            Fenêtre {DEPLOY_LAUNCH_LABEL} — merci d’être là. Bon déploiement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="sticky top-14 lg:top-0 z-[35] border-b border-amber-500/30 bg-gradient-to-r from-slate-900/95 via-emerald-950/90 to-slate-900/95 backdrop-blur-md"
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Timer className="h-4 w-4 text-amber-400 shrink-0" aria-hidden />
          <p className="text-xs sm:text-sm font-semibold text-white/90 truncate">
            Décompte déploiement · <span className="text-amber-200/95">{DEPLOY_LAUNCH_LABEL}</span>
          </p>
        </div>
        <p
          className="text-sm sm:text-base font-mono font-black tracking-tight text-amber-300 tabular-nums text-right sm:text-left"
          suppressHydrationWarning
        >
          {line ?? "—"}
        </p>
      </div>
    </div>
  );
}
