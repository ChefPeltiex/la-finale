/** Chargement de route — n’occupe pas tout l’écran (évite impression de gel). */
export default function NavRouteFallback() {
  return (
    <div className="flex items-center gap-3 py-12 px-4 text-white/60 text-sm" role="status" aria-live="polite">
      <div
        className="h-5 w-5 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin shrink-0"
        aria-hidden
      />
      Chargement de la page…
    </div>
  );
}
