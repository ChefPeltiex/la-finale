import { useState } from 'react'
import type { Etape, Hypothese } from '../../engine/types'
import { Bouton, Kicker } from '../ui'
import { FORMULES, HORA } from '../../content/hora'
import embleme from '../../assets/hora-oeil.jpg'

/**
 * L'Inventaire.
 *
 * Aucune hypothèse n'est mise en avant, aucune n'est validée. L'étape ne se
 * franchit pas tant qu'une seule lecture est sur la table.
 */
export default function EtapeInventaire({
  etape,
  hypotheses,
  contrePropositions,
  onAjouter,
  onCorriger,
  onRetirer,
  onRetenir,
  onContinuer,
  peutContinuer,
}: {
  etape: Etape
  hypotheses: readonly Hypothese[]
  contrePropositions: readonly string[]
  onAjouter: (enonce: string, origine: Hypothese['origine']) => void
  onCorriger: (id: string, enonce: string) => void
  onRetirer: (id: string) => void
  onRetenir: (id: string) => void
  onContinuer: () => void
  peutContinuer: boolean
}) {
  const [brouillon, setBrouillon] = useState('')
  const [edition, setEdition] = useState<string | null>(null)

  const minimum = etape.hypothesesMinimum ?? 2
  const dejaProposees = hypotheses.filter((h) => h.origine === 'hora').length
  const contre = contrePropositions[dejaProposees] ?? null

  function soumettre() {
    if (brouillon.trim() === '') return
    onAjouter(brouillon, 'joueur')
    setBrouillon('')
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center">
      <div className="relative">
        <img
          src={embleme}
          alt=""
          aria-hidden="true"
          className="size-24 rounded-full object-cover opacity-80"
        />
        <div
          aria-hidden="true"
          className="breathe absolute inset-0 rounded-full ring-1 ring-oeil/40"
        />
      </div>

      <Kicker as="h1" className="mt-6 text-gold/55">{etape.titre}</Kicker>

      <div className="mt-5 max-w-xl text-center">
        {etape.corps.split('\n\n').map((p) => (
          <p
            key={p.slice(0, 24)}
            className="mt-3 font-display text-[1.12rem] leading-relaxed text-parchment/85"
          >
            {p}
          </p>
        ))}
      </div>

      <p className="mt-7 max-w-md text-center font-display text-[0.95rem] italic text-parchment/45">
        {FORMULES.inventaire}
      </p>

      <div className="mt-10 w-full">
        <label htmlFor="hypothese" className="data-line text-parchment/40">
          Hypothèse {hypotheses.length + 1}
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="hypothese"
            value={brouillon}
            onChange={(e) => setBrouillon(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') soumettre()
            }}
            placeholder="Où crois-tu que ce détail se trouve ?"
            className="flex-1 rounded-[3px] border border-gold-dim/25 bg-ink-soft/60 px-4 py-3 font-display text-parchment placeholder:text-parchment/25 focus:border-gold/60 focus:outline-none"
          />
          <Bouton variante="contour" onClick={soumettre} disabled={brouillon.trim() === ''}>
            Poser
          </Bouton>
        </div>
      </div>

      {hypotheses.length > 0 ? (
        <ul className="mt-8 grid w-full gap-4 sm:grid-cols-2">
          {hypotheses.map((h) => (
            <li
              key={h.id}
              className="flex flex-col justify-between rounded-lg border border-gold-dim/18 bg-ink-soft/50 px-5 py-4"
            >
              <div>
                <span className="data-line text-parchment/30">
                  {h.origine === 'hora' ? 'Proposée par HORA' : 'La tienne'}
                </span>

                {edition === h.id ? (
                  <input
                    autoFocus
                    defaultValue={h.enonce}
                    onBlur={(e) => {
                      onCorriger(h.id, e.target.value)
                      setEdition(null)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onCorriger(h.id, e.currentTarget.value)
                        setEdition(null)
                      }
                    }}
                    className="mt-2.5 w-full rounded-[3px] border border-gold/50 bg-ink px-3 py-2 font-display text-parchment focus:outline-none"
                  />
                ) : (
                  <p className="mt-2.5 font-display text-[1.02rem] leading-relaxed text-parchment/85">
                    {h.enonce}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <button
                  type="button"
                  onClick={() => onRetenir(h.id)}
                  className={`data-line transition-colors ${
                    h.retenue ? 'text-gold' : 'text-parchment/35 hover:text-parchment/70'
                  }`}
                >
                  {h.retenue ? '● Retenue' : '○ Retenir'}
                </button>
                <button
                  type="button"
                  onClick={() => setEdition(h.id)}
                  className="data-line text-parchment/30 transition-colors hover:text-parchment/70"
                >
                  Corriger
                </button>
                <button
                  type="button"
                  onClick={() => onRetirer(h.id)}
                  className="data-line text-parchment/25 transition-colors hover:text-terre"
                >
                  Retirer
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {hypotheses.length > 0 && hypotheses.some((h) => h.retenue) ? (
        <p className="mt-6 max-w-lg text-center text-[0.84rem] leading-relaxed text-parchment/45">
          {HORA.inventaireRetenue}
        </p>
      ) : null}

      {hypotheses.length > 0 && hypotheses.length < minimum ? (
        <div className="mt-8 w-full rounded-lg border border-oeil/25 bg-oeil/5 px-6 py-5">
          <p className="font-display text-[1.02rem] italic leading-relaxed text-parchment/80">
            {HORA.inventaireRefus}
          </p>
          {contre ? (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <p className="flex-1 text-[0.88rem] leading-relaxed text-parchment/55">
                Si tu sèches : «&nbsp;{contre}&nbsp;»
              </p>
              <Bouton variante="discret" onClick={() => onAjouter(contre, 'hora')}>
                Prendre celle-là
              </Bouton>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-11 flex flex-col items-center gap-3">
        <Bouton onClick={onContinuer} disabled={!peutContinuer}>
          Emporter l’inventaire
        </Bouton>
        {!peutContinuer ? (
          <p className="data-line text-parchment/30">
            {minimum} hypothèses minimum · {hypotheses.length} posée
            {hypotheses.length > 1 ? 's' : ''}
          </p>
        ) : null}
      </div>
    </div>
  )
}
