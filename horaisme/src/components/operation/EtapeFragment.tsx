import { useEffect, useState } from 'react'
import type { Etape } from '../../engine/types'
import { Bouton, Kicker } from '../ui'

const OBSERVATION_SECONDES = 60

export default function EtapeFragment({
  etape,
  image,
  onContinuer,
}: {
  etape: Etape
  image: string
  onContinuer: () => void
}) {
  const [ecoule, setEcoule] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setEcoule((s) => Math.min(OBSERVATION_SECONDES, s + 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const complet = ecoule >= OBSERVATION_SECONDES

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
      <figure className="relative overflow-hidden rounded-lg hairline">
        <img
          src={image}
          alt="Fragment à identifier : détail de façade recadré, sans contexte."
          className="aspect-square w-full object-cover"
          style={{ filter: 'saturate(0.7) contrast(1.05)' }}
        />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-ink to-transparent px-5 pb-4 pt-12">
          <span className="data-line text-parchment/50">Fragment · sans localisation</span>
          <span className="data-line text-parchment/35">
            {complet ? 'Observé' : `${OBSERVATION_SECONDES - ecoule} s`}
          </span>
        </figcaption>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gold/60 transition-[width] duration-1000 ease-linear"
          style={{ width: `${(ecoule / OBSERVATION_SECONDES) * 100}%` }}
        />
      </figure>

      <div className="flex flex-col justify-center">
        <Kicker as="h1" className="text-gold/55">{etape.titre}</Kicker>

        {etape.corps.split('\n\n').map((p) => (
          <p
            key={p.slice(0, 24)}
            className="mt-5 font-display text-[1.15rem] leading-relaxed text-parchment/85"
          >
            {p}
          </p>
        ))}

        {etape.consigne ? (
          <p className="mt-7 border-l border-oeil/40 pl-4 text-[0.9rem] leading-relaxed text-parchment/55">
            {etape.consigne}
          </p>
        ) : null}

        <div className="mt-9">
          <Bouton onClick={onContinuer}>
            {complet ? 'Passer à l’inventaire' : 'J’en ai assez vu'}
          </Bouton>
          <p className="mt-3 text-[0.75rem] text-parchment/30">
            Rien ne te bloque. Le compte à rebours est une suggestion, pas une serrure.
          </p>
        </div>
      </div>
    </div>
  )
}
