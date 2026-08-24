import { useState } from 'react'
import type { Bifurcation, Etape } from '../../engine/types'
import { Bouton, Kicker } from '../ui'

/**
 * Le constat. Les quatre issues ont exactement le même poids visuel :
 * l'échec sincère n'est pas relégué en bas de liste.
 */
export default function EtapeConstat({
  etape,
  bifurcations,
  choisie,
  onChoisir,
  onValider,
}: {
  etape: Etape
  bifurcations: readonly Bifurcation[]
  choisie: string | null
  onChoisir: (id: string) => void
  onValider: (observation: string) => void
}) {
  const [observation, setObservation] = useState('')
  const bifurcation = bifurcations.find((b) => b.id === choisie) ?? null

  return (
    <div className="mx-auto flex max-w-3xl flex-col">
      <Kicker as="h1" className="text-gold/55">{etape.titre}</Kicker>

      {etape.corps.split('\n\n').map((p) => (
        <p
          key={p.slice(0, 24)}
          className="mt-4 font-display text-[1.15rem] leading-relaxed text-parchment/85"
        >
          {p}
        </p>
      ))}

      <ul className="mt-9 grid gap-3 sm:grid-cols-2">
        {bifurcations.map((b) => {
          const actif = b.id === choisie
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => onChoisir(b.id)}
                aria-pressed={actif}
                className={`h-full w-full rounded-lg border px-5 py-5 text-left transition duration-300 ${
                  actif
                    ? 'border-gold/70 bg-gold/8'
                    : 'border-gold-dim/18 bg-ink-soft/40 hover:border-gold-dim/45'
                }`}
              >
                <span className="font-display text-[1.05rem] leading-relaxed text-parchment/90">
                  {b.constat}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {bifurcation ? (
        <div className="mt-9 border-l border-oeil/40 pl-5">
          <p className="font-display text-[1.05rem] italic leading-relaxed text-parchment/75">
            {bifurcation.suite}
          </p>
        </div>
      ) : null}

      <div className="mt-10">
        <label htmlFor="observation" className="data-line text-parchment/40">
          Ce que tu as vu, en une phrase
        </label>
        <textarea
          id="observation"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          rows={3}
          placeholder="Décris le fait, pas l’impression."
          className="mt-3 w-full resize-none rounded-[3px] border border-gold-dim/25 bg-ink-soft/60 px-4 py-3 font-display leading-relaxed text-parchment placeholder:text-parchment/25 focus:border-gold/60 focus:outline-none"
        />
        <p className="mt-2 text-[0.76rem] text-parchment/35">
          Cette phrase est la preuve rattachée à ton XP. Sans elle, rien n’est attribué.
        </p>
      </div>

      <div className="mt-8">
        <Bouton
          onClick={() => onValider(observation)}
          disabled={bifurcation === null || observation.trim() === ''}
        >
          Ancrer le résultat
        </Bouton>
      </div>
    </div>
  )
}
