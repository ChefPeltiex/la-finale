import CarteTerrain from '../components/map/CarteTerrain'
import { FinDePage, Kicker, Panneau, ParoleHora, TitreSection } from '../components/ui'
import { HORA } from '../content/hora'
import { POSITION_DEMO } from '../engine/context'
import { carteDeCouverture } from '../engine/connectors'
import { MAILLE_PUBLIABLE_METRES, arrondirPosition } from '../engine/privacy'
import { elargissementTerrain } from '../engine/progression'
import { useJeu } from '../state/JeuProvider'

export default function Terrain() {
  const { memoire, contexte } = useJeu()
  const e = elargissementTerrain(memoire)
  const centre =
    contexte.coordonnees.valeur ?? POSITION_DEMO

  /*
   * Carte des ignorances — nom interne `CarteCouverture`.
   *
   * Aucun connecteur spatial n'est branché à ce stade : la liste des
   * couvertures est donc vide, et c'est ce que la carte annonce. Elle ne dit
   * pas « il n'y a rien ici », elle dit « je n'ai encore rien interrogé ».
   * La distinction est tout l'objet de cette section.
   *
   * La zone affichée est arrondie avant d'être montrée, à la même maille que
   * celle qui serait transmise à une source : ce que l'écran révèle ne doit
   * pas être plus précis que ce que l'application accepterait d'émettre.
   */
  const zone = arrondirPosition(centre, MAILLE_PUBLIABLE_METRES)
  const couverture = carteDeCouverture(zone, [])

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

      <section className="rise" style={{ animationDelay: '300ms' }}>
        <Kicker>Carte des ignorances</Kicker>
        <Panneau ton="forest" className="mt-4 px-7 py-6">
          <p className="font-display text-[1.05rem] leading-relaxed text-parchment/80">
            {couverture.phrase}
          </p>

          <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="data-line text-parchment/35">Sources interrogées</dt>
              <dd className="mt-1 text-[0.92rem] text-parchment/70">
                {couverture.sourcesInterrogees.length === 0
                  ? 'Aucune'
                  : couverture.sourcesInterrogees.join(', ')}
              </dd>
            </div>
            <div>
              <dt className="data-line text-parchment/35">Zone examinée</dt>
              <dd className="mt-1 text-[0.92rem] text-parchment/70">
                {zone.lat.toFixed(3)} · {zone.lon.toFixed(3)} — maille de {zone.mailleMetres} m
              </dd>
            </div>
            <div>
              <dt className="data-line text-parchment/35">Relevés rendus</dt>
              <dd className="mt-1 text-[0.92rem] text-parchment/70">{couverture.totalResultats}</dd>
            </div>
            <div>
              <dt className="data-line text-parchment/35">Une donnée peut exister ailleurs</dt>
              <dd className="mt-1 text-[0.92rem] text-parchment/70">
                Toujours. Aucune source branchée ici ne prétend à l’exhaustivité.
              </dd>
            </div>
          </dl>

          <p className="mt-6 max-w-2xl text-[0.82rem] leading-relaxed text-parchment/40">
            Cette carte décrit ce que je sais interroger, jamais ce qui existe. Une zone vide
            signifie que mes sources la documentent peu — pas que personne n’y a rien vu. Tant
            qu’aucun connecteur n’est branché, elle reste blanche en entier, et c’est la réponse
            exacte.
          </p>
        </Panneau>
      </section>

      <FinDePage />
    </div>
  )
}
