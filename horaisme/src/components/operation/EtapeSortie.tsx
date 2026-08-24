import { useState } from 'react'
import type { Etape, Hypothese } from '../../engine/types'
import { Bouton, Kicker } from '../ui'
import { HORA } from '../../content/hora'

/**
 * La technologie s'efface. Le mode poche coupe l'interface pendant l'action :
 * il ne reste qu'un signe, et rien à consulter.
 */
export default function EtapeSortie({
  etape,
  hypotheses,
  onRevenir,
}: {
  etape: Etape
  hypotheses: readonly Hypothese[]
  onRevenir: () => void
}) {
  const [enPoche, setEnPoche] = useState(false)

  if (enPoche) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020202] px-8">
        <span className="breathe flex size-14 items-center justify-center rounded-full border border-gold-dim/25 font-display text-lg text-gold/60">
          H
        </span>
        <p className="mt-8 max-w-xs text-center font-display text-[0.95rem] italic leading-relaxed text-parchment/25">
          {HORA.pendantSortie}
        </p>
        <button
          type="button"
          onClick={() => {
            setEnPoche(false)
            onRevenir()
          }}
          className="mt-16 data-line text-parchment/30 transition-colors hover:text-gold"
        >
          Je suis revenu
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <Kicker as="h1" className="text-gold/55">{etape.titre}</Kicker>

      {etape.corps.split('\n\n').map((p) => (
        <p
          key={p.slice(0, 24)}
          className="mt-5 font-display text-[1.2rem] leading-relaxed text-parchment/85"
        >
          {p}
        </p>
      ))}

      <div className="mt-10 w-full rounded-lg border border-gold-dim/15 bg-ink-soft/40 px-6 py-5 text-left">
        <Kicker>Ce que tu emportes</Kicker>
        <ul className="mt-3 flex flex-col gap-2">
          {hypotheses.map((h) => (
            <li key={h.id} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`mt-2 size-1.5 shrink-0 rounded-full ${
                  h.retenue ? 'bg-gold' : 'bg-parchment/30'
                }`}
              />
              <span className="font-display text-[0.98rem] leading-relaxed text-parchment/70">
                {h.enonce}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[0.78rem] text-parchment/35">
          Aucune n’est confirmée. C’est le terrain qui tranche.
        </p>
      </div>

      {etape.consigne ? (
        <p className="mt-8 font-display text-lg italic text-gold/70">{etape.consigne}</p>
      ) : null}

      <div className="mt-9 flex flex-col items-center gap-4">
        <Bouton onClick={() => setEnPoche(true)}>Mettre en poche</Bouton>
        <button
          type="button"
          onClick={onRevenir}
          className="data-line text-parchment/30 transition-colors hover:text-parchment/60"
        >
          Je suis déjà revenu
        </button>
      </div>
    </div>
  )
}
