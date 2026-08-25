import { useState } from 'react'
import type {
  Bifurcation,
  Datum,
  Etape,
  IssueVerification,
  PropositionOperation,
} from '../../engine/types'
import { LIBELLE_STATUT, COULEUR_STATUT } from '../../engine/provenance'
import { Bouton } from '../ui'

export interface Verdict {
  readonly enonce: string
  readonly statutInitial: Datum<string>['statut']
  readonly reponseDuReel: string
}

/** Ce que le joueur répond à une chose que HORA avait avancée. */
export interface VerdictContrechamp {
  readonly propositionId: string
  readonly issue: IssueVerification
  readonly observation: string
}

const CHOIX: readonly { issue: IssueVerification; libelle: string }[] = [
  { issue: 'confirmee', libelle: 'C’était le cas' },
  { issue: 'contredite', libelle: 'Non, j’ai vu autre chose' },
  { issue: 'indeterminee', libelle: 'Je ne peux pas trancher' },
]

/**
 * L'ancrage. Seul endroit où la réflexion existe, et elle reste courte.
 *
 * Deux sections distinctes, et la distinction n'est pas cosmétique : le
 * Registre confronte la *provenance* de ce que HORA supposait, le Contrechamp
 * confronte la *justesse* de ce qu'elle a avancé. Un statut de provenance ne
 * dit rien de la vérité d'un énoncé.
 */
export default function EtapeAncrage({
  etape,
  suppositions,
  propositions,
  bifurcation,
  reveal,
  lieu,
  noteLieu,
  observationInitiale,
  onClore,
}: {
  etape: Etape
  suppositions: readonly Datum<string>[]
  propositions: readonly PropositionOperation[]
  bifurcation: Bifurcation | null
  /** Absent quand aucune image de révélation n'existe. */
  reveal?: string
  /**
   * Absent quand il n'y a pas de lieu à révéler, ou qu'il ne *doit* pas
   * l'être : une espèce vulnérable ne se publie pas à une précision
   * exploitable, et un phénomène de ciel n'a pas d'adresse. Dans ces deux
   * cas, `noteLieu` dit pourquoi, au lieu de laisser un trou.
   */
  lieu?: { nom: string; lat: number; lon: number }
  noteLieu?: string
  observationInitiale: string
  onClore: (
    ajustement: string,
    verdicts: readonly Verdict[],
    contrechamp: readonly VerdictContrechamp[],
  ) => void
}) {
  const [ajustement, setAjustement] = useState('')
  const [reponses, setReponses] = useState<Record<string, string>>({})
  const [issues, setIssues] = useState<Record<string, IssueVerification>>({})
  const [constats, setConstats] = useState<Record<string, string>>({})

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
          {!devoiler ? (
            <p className="mt-4 rounded border border-dashed border-ink/20 px-5 py-6 font-display text-[1.02rem] italic leading-relaxed text-ink/55">
              Je ne te donne pas la réponse. Tu n’as pas trouvé aujourd’hui, le fragment reste
              ouvert, et il n’a aucune date d’expiration.
            </p>
          ) : lieu ? (
            <figure className="mt-4 overflow-hidden rounded border border-ink/10">
              {reveal ? (
                <img src={reveal} alt={lieu.nom} className="aspect-[3/2] w-full object-cover" />
              ) : null}
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
              {noteLieu ??
                'Cette opération ne révèle aucune position. Ce n’est pas un oubli : elle n’a pas de lieu à publier.'}
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
                    {/*
                      Une supposition `inconnu` n'a pas de valeur — c'est la
                      règle du type. Afficher sa justification n'est pas un
                      repli cosmétique : c'est le seul contenu réel d'une
                      ignorance déclarée, et le taire laisserait une ligne
                      vide là où il y a une information.
                    */}
                    <span className="font-display text-[1.02rem] text-ink/80">
                      {s.valeur ?? s.justification}
                    </span>
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
          <p className="kicker text-ink/40">Le Contrechamp — ce que j’avais avancé</p>
          <ul className="mt-4 flex flex-col gap-7">
            {propositions.map((p) => {
              const choisie = issues[p.id] ?? null
              return (
                <li key={p.id} className="rounded border border-ink/12 bg-white/50 px-5 py-5">
                  <p className="font-display text-[1.05rem] leading-relaxed text-ink/85">
                    {p.enonce}
                  </p>
                  <p className="mt-2 text-[0.84rem] leading-relaxed text-ink/55">
                    Si j’avais raison : {p.resultatAttendu}
                  </p>
                  <p className="data-line mt-2.5 text-ink/40">
                    Confiance annoncée {Math.round(p.confiance * 100)} %
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {CHOIX.map((c) => (
                      <button
                        key={c.issue}
                        type="button"
                        aria-pressed={choisie === c.issue}
                        onClick={() => setIssues((s) => ({ ...s, [p.id]: c.issue }))}
                        className={`min-h-11 rounded-[3px] border px-4 py-2 font-display text-[0.92rem] transition ${
                          choisie === c.issue
                            ? 'border-ink bg-ink text-cream'
                            : 'border-ink/20 text-ink/65 hover:border-ink/45'
                        }`}
                      >
                        {c.libelle}
                      </button>
                    ))}
                  </div>

                  {choisie !== null && choisie !== 'indeterminee' ? (
                    <input
                      value={constats[p.id] ?? ''}
                      onChange={(e) => setConstats((s) => ({ ...s, [p.id]: e.target.value }))}
                      placeholder="Ce que tu as constaté, en une phrase"
                      className="mt-4 w-full border-b border-ink/15 bg-transparent py-1.5 font-display text-[0.98rem] text-ink placeholder:text-ink/30 focus:border-ink/50 focus:outline-none"
                    />
                  ) : null}
                </li>
              )
            })}
          </ul>
          <p className="mt-4 text-[0.78rem] leading-relaxed text-ink/45">
            Me démentir vaut autant que me donner raison, et rapporte davantage. Ne rien pouvoir
            trancher est une réponse entière : je ne compte pas une absence de preuve comme une
            preuve du contraire.
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
                propositions.map((p) => ({
                  propositionId: p.id,
                  issue: issues[p.id] ?? 'indeterminee',
                  observation: constats[p.id] ?? '',
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
