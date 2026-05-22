import { Link } from "react-router-dom";

export function CodexTwinVisual() {
  return (
    <div className="flex gap-3 justify-center items-end" aria-hidden>
      <div className="w-14 h-14 rounded-lg border-2 border-amber-500/60 bg-amber-950/40 flex items-center justify-center font-bold text-amber-200">
        C
      </div>
      <div className="h-8 w-8 mb-2 border-t border-b border-dashed border-white/30" />
      <div className="w-14 h-14 rounded-lg border-2 border-violet-500/60 bg-violet-950/40 flex items-center justify-center font-bold text-violet-200">
        E
      </div>
    </div>
  );
}

export function CodexEyeVisual() {
  return (
    <div className="relative w-24 h-24 mx-auto" aria-hidden>
      <div className="absolute inset-0 rounded-full border-2 border-sky-400/50" />
      <div className="absolute inset-4 rounded-full bg-sky-500/20 border border-sky-300/40" />
      <div className="absolute inset-[38%] rounded-full bg-sky-200/80" />
    </div>
  );
}

export function CodexBridgeVisual() {
  return (
    <div className="flex items-center gap-2 justify-center text-xs font-mono text-white/50" aria-hidden>
      <span className="text-emerald-400">+</span>
      <div className="w-32 h-1 bg-gradient-to-r from-emerald-500/80 via-white/40 to-violet-500/80 rounded-full" />
      <span className="text-violet-400">−</span>
    </div>
  );
}

export function CodexRhythmVisual() {
  const bars = [40, 65, 90, 55, 75, 100, 45];
  return (
    <div className="flex items-end gap-1 h-12 justify-center" aria-hidden>
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-2 rounded-sm bg-amber-500/70"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

const VISUALS = {
  jumeaux: CodexTwinVisual,
  oeil: CodexEyeVisual,
  pont: CodexBridgeVisual,
  algorythme: CodexRhythmVisual,
};

export default function CodexMetaphoreCard({ item, compact = false }) {
  const Visual = VISUALS[item.id];
  return (
    <article className="rounded-2xl border border-amber-500/25 bg-gradient-to-b from-zinc-900 to-black p-5 sm:p-6 flex flex-col">
      {Visual ? <Visual /> : (
        <p className="text-center text-2xl font-serif text-amber-200/90" aria-hidden>
          {item.symbol}
        </p>
      )}
      <h3 className="mt-4 text-lg font-bold text-amber-100">{item.title}</h3>
      <p className="mt-1 text-sm text-amber-200/70 italic">{item.subtitle}</p>
      {!compact && (
        <div className="mt-4 space-y-2 text-sm text-white/65 flex-1">
          {item.circulai && (
            <p>
              <span className="text-emerald-400 font-semibold">CirculAI · </span>
              {item.circulai}
            </p>
          )}
          {item.egor && (
            <p>
              <span className="text-violet-300 font-semibold">Egor69 · </span>
              {item.egor}
            </p>
          )}
        </div>
      )}
    </article>
  );
}

export function CodexMetaphoreLink({ className = "" }) {
  return (
    <Link
      to="/codex-metaphores"
      className={`text-sm text-amber-300/90 hover:text-amber-200 underline-offset-4 hover:underline ${className}`}
    >
      Codex · images métaphoriques
    </Link>
  );
}
