import CarteTerrain from '../components/map/CarteTerrain'
import { FinDePage, Kicker, Panneau, ParoleHora, TitreSection } from '../components/ui'
import { HORA } from '../content/hora'
import { POSITION_DEMO } from '../engine/context'
import { elargissementTerrain } from '../engine/progression'
import { useJeu } from '../state/JeuProvider'

export default function Terrain() {
  const { memoire, contexte } = useJeu()
  const e = elargissementTerrain(memoire)
  const centre =
    contexte.coordonnees.valeur ?? POSITION_DEMO

  const mesures = [
    { valeur: e.lieux, libelle: 'Lieux révélés' },
    { valeur: e.ancrages, libelle: 'Ancrages' },
    { valeur: e.hypothesesCorrigees, libelle: 'Suppositions confrontées' },
    { valeur: e.echecsAssumes, libelle: 'Sorties sans trouver' },
  ]

  return (
    <div className="flex flex-col gap-12">
      <header className="rise">
        <Kicker>Ce que tu as réellement parcouru</Kicker>
        <TitreSection className="mt-3">Terrain</TitreSection>
        {memoire.lieux.length === 0 ? (
          <div className="mt-5 max-w-2xl">
            <ParoleHora>{HORA.terrainVide}</ParoleHora>
          </div>
        ) : null}
      </header>

      <section className="rise" style={{ animationDelay: '100ms' }}>
        <CarteTerrain lieux={memoire.lieux} centre={centre} />
      </section>

      <section className="rise" style={{ animationDelay: '200ms' }}>
        <Kicker>Élargissement</Kicker>
        <Panneau className="mt-4 grid grid-cols-2 gap-px overflow-hidden bg-gold-dim/10 lg:grid-cols-4">
          {mesures.map((m) => (
            <div key={m.libelle} className="bg-ink-soft px-6 py-7">
              <p className="font-display text-[2.4rem] leading-none text-gold/85">{m.valeur}</p>
              <p className="mt-3 data-line text-parchment/35">{m.libelle}</p>
            </div>
          ))}
        </Panneau>
        <p className="mt-4 max-w-2xl text-[0.82rem] leading-relaxed text-parchment/35">
          Aucun pourcentage de complétion : un terrain ne se termine pas. Rien ici ne mesure le
          temps que tu passes dans l’application, parce que ce chiffre n’existe nulle part dans le
          modèle de données.
        </p>
      </section>

      <FinDePage />
    </div>
  )
}
