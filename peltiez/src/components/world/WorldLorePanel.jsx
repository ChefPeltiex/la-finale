/**
 * Panneau narratif dense pour le Verse — affiche la profondeur de chaque portail sans masquer les engagements honnêtes (pledge).
 */
export default function WorldLorePanel({ realm }) {
  if (!realm) {
    return (
      <p className="text-sm text-white/55 leading-relaxed max-w-xl">
        Avance dans le relief : chaque anneau lumineux est une porte vers une fonction réelle de Egor69. Le radar en bas à droite te situe ;
        la progression en haut trace tes passages sans jamais inventer de métrique d’audience.
      </p>
    );
  }

  return (
    <div className="space-y-3 max-w-2xl text-left">
      <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-emerald-400/90">Chambre narrative</p>
      <h3 className="font-display text-xl font-black text-white tracking-tight">{realm.label}</h3>
      <p className="text-xs italic text-violet-200/85 leading-relaxed border-l-2 border-violet-400/40 pl-3">{realm.atmosphere}</p>
      <div className="max-h-36 overflow-y-auto pr-2 text-sm text-white/85 leading-relaxed">
        {realm.lore}
      </div>
      <div className="rounded-lg bg-amber-500/10 border border-amber-400/25 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300/90 mb-1">Rite suggéré</p>
        <p className="text-xs text-amber-100/95 leading-relaxed">{realm.ritualHint}</p>
      </div>
      {realm.sensory?.length ? (
        <p className="text-[11px] text-cyan-200/80">
          <span className="font-semibold text-cyan-400/90">Sens : </span>
          {realm.sensory.join(" · ")}
        </p>
      ) : null}
      {realm.connections?.length ? (
        <p className="text-[11px] text-white/55">
          <span className="font-semibold text-white/70">Ponts : </span>
          {realm.connections.join(" · ")}
        </p>
      ) : null}
      <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 mb-1">Engagement affiché</p>
        <p className="text-[11px] text-white/70 leading-relaxed">{realm.pledge}</p>
      </div>
    </div>
  );
}
