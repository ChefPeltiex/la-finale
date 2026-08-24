import { Link } from 'react-router-dom'

import { FinDePage, Kicker, Panneau, TitreSection } from '../components/ui'
import { CATALOGUE } from '../content/operations'
import { FAMILLES } from '../content/philosophie'
import { useJeu } from '../state/JeuProvider'

export default function Missions() {
  const { memoire } = useJeu()

  return (
    <div className="flex flex-col gap-12">
      <header className="rise">
        <Kicker>Ce qui est jouable maintenant</Kicker>
        <TitreSection className="mt-3">Missions</TitreSection>
      </header>

      <section className="rise" style={{ animationDelay: '100ms' }}>
        <ul className="flex flex-col gap-4">
          {CATALOGUE.map((op) => {
            const faite = memoire.ancrages.some((a) => a.operationId === op.id)
            return (
              <li key={op.id}>
                <Link
                  to={`/operation/${op.id}`}
                  className="group flex flex-wrap items-center justify-between gap-5 rounded-lg border border-gold-dim/18 bg-ink-soft/50 px-7 py-6 transition duration-300 hover:border-gold/45"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="kicker text-gold/55">{op.kicker}</span>
                      {faite ? (
                        <span className="data-line text-parchment/30">Déjà ancrée</span>
                      ) : null}
                    </div>
                    <p className="mt-2.5 font-display text-2xl">{op.titre}</p>
                    <p className="mt-2 max-w-xl text-[0.9rem] leading-relaxed text-parchment/50">
                      {op.promesse}
                    </p>
                  </div>
                  <span className="data-line shrink-0 text-parchment/35 transition-colors group-hover:text-gold">
                    {op.dureeMinutes[0]}–{op.dureeMinutes[1]} min · {op.rayonMetres} m →
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rise" style={{ animationDelay: '200ms' }}>
        <Kicker>Les quatre familles</Kicker>
        <div className="mt-4 grid gap-px overflow-hidden rounded-lg bg-gold-dim/10 sm:grid-cols-2">
          {FAMILLES.map((f) => (
            <div key={f.id} className="bg-ink-soft px-6 py-6">
              <p className="font-display text-lg text-parchment/85">{f.nom}</p>
              <p className="mt-2.5 text-[0.86rem] leading-relaxed text-parchment/45">{f.corps}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rise" style={{ animationDelay: '300ms' }}>
        <Panneau ton="forest" className="px-7 py-6">
          <Kicker className="text-parchment/40">État réel du catalogue</Kicker>
          <p className="mt-3 max-w-2xl text-[0.9rem] leading-relaxed text-parchment/60">
            Une seule opération est écrite et jouable de bout en bout. Les trois autres familles
            existent comme structure dans le moteur, pas comme contenu. Je préfère te le dire ici
            plutôt que de remplir cette page de cartes verrouillées.
          </p>
        </Panneau>
      </section>

      <FinDePage />
    </div>
  )
}
