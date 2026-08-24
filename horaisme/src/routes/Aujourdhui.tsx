import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Bouton, Donnee, Kicker, Marque, Panneau, ParoleHora, TitreSection, FinDePage } from '../components/ui'
import { FORMULES, HORA } from '../content/hora'
import { useJeu } from '../state/JeuProvider'
import { refuserOperation, reproposerOperation } from '../engine/memory'
import embleme from '../assets/hora-emblem.jpg'

function dateLongue(d: Date): string {
  return d.toLocaleDateString('fr-CA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/** « 7 h 38 » se lit d'un coup d'œil ; « 458 min » demande un calcul. */
function dureeLisible(minutes: number): string {
  if (minutes < 60) return `environ ${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `environ ${h} h` : `environ ${h} h ${String(m).padStart(2, '0')}`
}

export default function Aujourdhui() {
  const { contexte, composition, compositeur, memoire, majMemoire } = useJeu()
  const [pourquoiOuvert, setPourquoiOuvert] = useState(false)
  const principale = composition.propositions[0] ?? null

  return (
    <div className="flex flex-col gap-14">
      <header className="rise">
        <Kicker>{dateLongue(new Date())}</Kicker>
        <TitreSection className="mt-3">Aujourd’hui</TitreSection>
        <div className="mt-5 max-w-2xl">
          <ParoleHora>
            {memoire.ancrages.length === 0 ? HORA.accueilSansHistorique : HORA.accueilAvecHistorique}
          </ParoleHora>
        </div>
      </header>

      <section className="rise" style={{ animationDelay: '120ms' }}>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <Kicker>Ce que je sais du moment</Kicker>
          <span className="data-line text-parchment/25">{compositeur}</span>
        </div>

        <Panneau className="mt-4 grid gap-x-10 gap-y-1 px-6 py-3 sm:grid-cols-2 lg:grid-cols-3">
          <Donnee etiquette="Heure locale" datum={contexte.heureLocale} />
          <Donnee
            etiquette="Lumière restante"
            datum={contexte.minutesDeLumiere}
            format={dureeLisible}
          />
          <Donnee etiquette="Saison" datum={contexte.saison} />
          <Donnee etiquette="Zone" datum={contexte.zone} />
          <Donnee etiquette="Météo" datum={contexte.meteo} />
          <Donnee
            etiquette="Rayon déclaré"
            datum={contexte.rayonMobiliteMetres}
            format={(r) => `${r} m`}
          />
        </Panneau>

        <p className="mt-3 text-[0.78rem] leading-relaxed text-parchment/35">
          Chacune de ces sources peut être coupée depuis{' '}
          <Link to="/moi" className="text-gold/70 underline underline-offset-4">
            Moi
          </Link>
          . Ce que je ne sais pas reste vide : je ne comble jamais un trou par une estimation
          présentée comme un fait.
        </p>
      </section>

      <section className="rise" style={{ animationDelay: '240ms' }}>
        <Kicker>Ce que je te propose</Kicker>

        {principale === null ? (
          <Panneau className="mt-4 px-7 py-8">
            <p className="font-display text-xl italic text-parchment/55">
              Rien à te proposer pour l’instant.
            </p>
            <p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-parchment/45">
              Soit tu as tout écarté, soit ton rayon de déplacement exclut ce que j’ai en réserve.
              Les deux se corrigent depuis Moi, et aucun des deux n’est un problème.
            </p>
          </Panneau>
        ) : (
          <article className="chalk relative mt-4 overflow-hidden rounded-lg hairline-strong bg-ink-soft/80">
            <img
              src={embleme}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 top-1/2 hidden w-[38rem] -translate-y-1/2 opacity-[0.13] mix-blend-screen md:block"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-soft via-ink-soft/85 to-transparent"
            />

            <div className="relative px-7 py-8 md:px-10 md:py-11">
              <div className="flex flex-wrap items-center gap-3">
                <Kicker className="text-gold/60">{principale.operation.kicker}</Kicker>
                <span className="data-line text-parchment/30">
                  {principale.operation.dureeMinutes[0]}–{principale.operation.dureeMinutes[1]} min ·{' '}
                  {principale.operation.rayonMetres} m
                </span>
              </div>

              <h3 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.2rem)] leading-none tracking-[0.01em]">
                {principale.operation.titre}
              </h3>

              <p className="mt-5 max-w-xl font-display text-[1.15rem] italic leading-relaxed text-parchment/85">
                {principale.operation.promesse}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={`/operation/${principale.operation.id}`}
                  className="inline-flex items-center gap-3 rounded-[3px] bg-gold px-8 py-3.5 font-display font-semibold text-ink transition duration-300 hover:bg-[#e6ce85]"
                >
                  Ouvrir l’opération
                  <span aria-hidden="true">&#8594;</span>
                </Link>
                <Bouton
                  variante="discret"
                  onClick={() => majMemoire((m) => refuserOperation(m, principale.operation.id))}
                >
                  Écarter
                </Bouton>
              </div>

              <div className="mt-8 border-t border-gold-dim/12 pt-5">
                <button
                  type="button"
                  onClick={() => setPourquoiOuvert((o) => !o)}
                  aria-expanded={pourquoiOuvert}
                  className="kicker -my-3 inline-flex min-h-11 items-center text-parchment/45 transition-colors hover:text-gold"
                >
                  {pourquoiOuvert ? '— ' : '+ '}Pourquoi cette opération&nbsp;?
                </button>

                {pourquoiOuvert ? (
                  <div className="mt-5 flex max-w-2xl flex-col gap-5">
                    <p className="text-[0.86rem] leading-relaxed text-parchment/50">
                      {HORA.pourquoiCeci}
                    </p>

                    <ul className="flex flex-col gap-3">
                      {principale.raisons.map((r) => (
                        <li key={`${r.source}-${r.enonce}`} className="flex items-start gap-3">
                          <Marque statut={r.statut} />
                          <span className="text-[0.88rem] leading-relaxed text-parchment/70">
                            {r.enonce}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="rounded border border-gold-dim/18 bg-ink/50 px-5 py-4">
                      <Kicker className="text-gold/50">Test des dix secondes</Kicker>
                      <p className="mt-2.5 text-[0.86rem] leading-relaxed text-parchment/60">
                        {principale.operation.dixSecondes}
                      </p>
                    </div>

                    <div>
                      <Kicker>Ce que je suppose sans pouvoir le garantir</Kicker>
                      <ul className="mt-3 flex flex-col gap-2.5">
                        {principale.operation.suppositions.map((s) => (
                          <li key={s.valeur ?? s.justification} className="flex items-start gap-3">
                            <Marque statut={s.statut} />
                            <span className="text-[0.86rem] leading-relaxed text-parchment/60">
                              {s.valeur}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        )}
      </section>

      <section className="rise" style={{ animationDelay: '360ms' }}>
        <Panneau ton="forest" className="px-7 py-7">
          <Kicker className="text-parchment/40">Rien aujourd’hui</Kicker>
          <p className="mt-3 max-w-2xl font-display text-[1.05rem] italic leading-relaxed text-parchment/70">
            {composition.rienAujourdhui}
          </p>
        </Panneau>
      </section>

      {composition.ecartees.length > 0 ? (
        <section className="rise" style={{ animationDelay: '420ms' }}>
          <Kicker>Écartées</Kicker>
          <ul className="mt-4 flex flex-col gap-3">
            {composition.ecartees.map((e) => (
              <li
                key={e.operationId}
                className="flex flex-wrap items-center justify-between gap-3 rounded border border-gold-dim/12 px-5 py-3.5"
              >
                <div>
                  <p className="font-display text-parchment/70">{e.titre}</p>
                  <p className="mt-1 text-[0.8rem] text-parchment/40">{e.motif}</p>
                </div>
                <Bouton
                  variante="discret"
                  onClick={() => majMemoire((m) => reproposerOperation(m, e.operationId))}
                >
                  Remettre en jeu
                </Bouton>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <FinDePage>
        {FORMULES.arbitrage} Il n’y a rien de plus sous cette ligne, et rien ne se chargera si tu
        restes.
      </FinDePage>
    </div>
  )
}
