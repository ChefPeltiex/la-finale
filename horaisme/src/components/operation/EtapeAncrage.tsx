import { useState } from 'react'
import type { Bifurcation, Datum, Etape } from '../../engine/types'
import { LIBELLE_STATUT, COULEUR_STATUT } from '../../engine/provenance'
import { Bouton } from '../ui'

export interface Verdict {
  readonly enonce: string
  readonly statutInitial: Datum<string>['statut']
  readonly reponseDuReel: string
}

/**
 * L'ancrage. Seul endroit où la réflexion existe, et elle reste courte.
 * Le Registre confronte ici ce que HORA supposait à ce que le réel a répondu.
 */
export default function EtapeAncrage({
  etape,
  suppositions,
  bifurcation,
  reveal,
  lieu,
  observationInitiale,
  onClore,
}: {
  etape: Etape
  suppositions: readonly Datum<string>[]
  bifurcation: Bifurcation | null
  reveal: string
  lieu: { nom: string; lat: number; lon: number }
  observationInitiale: string
  onClore: (ajustement: string, verdicts: readonly Verdict[]) => void
}) {
  const [ajustement, setAjustement] = useState('')
  const [reponses, setReponses] = useState<Record<string, string>>({})

  /* Un échec sincère ne dévoile pas la réponse : le fragment reste ouvert. */
  const devoiler = bifurcation !== null && !bifurcation.echecSincere

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-lg bg-cream text-ink">
      <div className="px-7 py-9 md:px-11 md:py-12">
        <h1 className="kicker text-ink/40">{etape.titre}</h1>

        {etape.corps.split('\n\n').map((p) => (
          <p key={p.slice(0, 24)} className="mt-4 font-display text-[1.12rem] leading-relaxed text-ink/80">
            {p}
          </p>
        ))}

        <section className="mt-11">
          <p className="kicker text-ink/40">Le lieu</p>
          {devoiler ? (
            <figure className="mt-4 overflow-hidden rounded border border-ink/10">
              <img src={reveal} alt={lieu.nom} className="aspect-[3/2] w-full object-cover" />
              <figcaption className="flex flex-wrap items-center justify-between gap-2 bg-ink/4 px-5 py-3">
                <span className="font-display text-[0.98rem] text-ink/75">{lieu.nom}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${lieu.lat},${lieu.lon}`}
                  target="_blank"
                  rel="noreferrer"
                  className="data-line text-ink/45 underline underline-offset-4 hover:text-ink"
                >
                  {lieu.lat.toFixed(4)} · {lieu.lon.toFixed(4)}
                </a>
              </figcaption>
            </figure>
          ) : (
            <p className="mt-4 rounded border border-dashed border-ink/20 px-5 py-6 font-display text-[1.02rem] italic leading-relaxed text-ink/55">
              Je ne te donne pas la réponse. Tu n’as pas trouvé aujourd’hui, le fragment reste
              ouvert, et il n’a aucune date d’expiration.
            </p>
          )}
        </section>

        <section className="mt-11">
          <p className="kicker text-ink/40">Le Registre — ce que je supposais</p>
          <ul className="mt-4 flex flex-col gap-5">
            {suppositions.map((s) => {
              const cle = s.valeur ?? s.justification
              return (
                <li key={cle} className="border-l-2 pl-4" style={{ borderColor: COULEUR_STATUT[s.statut] }}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span
                      className="data-line"
                      style={{ color: `color-mix(in srgb, ${COULEUR_STATUT[s.statut]} 75%, #14110c)` }}
                    >
                      {LIBELLE_STATUT[s.statut]}
                    </span>
                    <span className="font-display text-[1.02rem] text-ink/80">{s.valeur}</span>
                  </div>
                  <input
                    value={reponses[cle] ?? ''}
                    onChange={(e) => setReponses((r) => ({ ...r, [cle]: e.target.value }))}
                    placeholder="Ce que le réel a répondu"
                    className="mt-2.5 w-full border-b border-ink/15 bg-transparent py-1.5 font-display text-[0.98rem] text-ink placeholder:text-ink/30 focus:border-ink/50 focus:outline-none"
                  />
                </li>
              )
            })}
          </ul>
          <p className="mt-4 text-[0.78rem] leading-relaxed text-ink/45">
            Corrige-moi librement. Ce que tu écris ici écrase ma supposition, jamais l’inverse.
          </p>
        </section>

        <section className="mt-11">
          <p className="kicker text-ink/40">Ton observation</p>
          <p className="mt-3 font-display text-[1.08rem] leading-relaxed text-ink/80">
            {observationInitiale}
          </p>

          <label htmlFor="ajustement" className="mt-8 block kicker text-ink/40">
            Ce que tu ajustes
          </label>
          <textarea
            id="ajustement"
            value={ajustement}
            onChange={(e) => setAjustement(e.target.value)}
            rows={3}
            placeholder="Une phrase. Ce que tu feras différemment, ou ce que tu regarderas autrement."
            className="mt-3 w-full resize-none rounded border border-ink/15 bg-white/60 px-4 py-3 font-display leading-relaxed text-ink placeholder:text-ink/30 focus:border-ink/50 focus:outline-none"
          />
        </section>

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Bouton
            onClick={() =>
              onClore(
                ajustement,
                suppositions.map((s) => ({
                  enonce: s.valeur ?? s.justification,
                  statutInitial: s.statut,
                  reponseDuReel: reponses[s.valeur ?? s.justification] ?? '',
                })),
              )
            }
            className="!bg-ink !text-cream hover:!bg-ink-soft"
          >
            Clore l’opération
          </Bouton>
          {bifurcation ? (
            <span className="data-line text-ink/40">
              +{bifurcation.xp} XP vécu · preuve rattachée
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
