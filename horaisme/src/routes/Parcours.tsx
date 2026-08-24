import { Link } from 'react-router-dom'

import { FinDePage, Kicker, Marque, Panneau, TitreSection, Vide } from '../components/ui'
import { FORMULES } from '../content/hora'
import { CATALOGUE } from '../content/operations'
import { niveauPour } from '../engine/progression'
import { useJeu } from '../state/JeuProvider'

function dateCourte(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-CA', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Parcours() {
  const { memoire } = useJeu()
  const niveau = niveauPour(memoire.xpTotal)
  const progression =
    niveau.xpPourLeSuivant === null
      ? 1
      : Math.min(1, niveau.xpDansLeNiveau / niveau.xpPourLeSuivant)

  return (
    <div className="flex flex-col gap-12">
      <header className="rise">
        <Kicker>La chaîne de ce que tu as vécu</Kicker>
        <TitreSection className="mt-3">Parcours</TitreSection>
      </header>

      <section className="rise" style={{ animationDelay: '100ms' }}>
        <Panneau className="px-7 py-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="data-line text-parchment/35">
                Niveau {niveau.rang} · {niveau.titre}
              </p>
              <p className="mt-2 font-display text-[2.6rem] leading-none text-gold/85">
                {memoire.xpTotal} <span className="text-lg text-parchment/45">XP vécu</span>
              </p>
            </div>
            <p className="data-line text-parchment/30">
              {niveau.xpPourLeSuivant === null
                ? 'Dernier palier écrit'
                : `${niveau.xpPourLeSuivant - niveau.xpDansLeNiveau} XP avant le palier suivant`}
            </p>
          </div>

          <div className="mt-6 h-px w-full bg-parchment/10">
            <div
              className="h-px bg-gold transition-[width] duration-700"
              style={{ width: `${progression * 100}%` }}
            />
          </div>

          <p className="mt-5 font-display text-[0.98rem] italic text-parchment/45">
            {FORMULES.progression}
          </p>
        </Panneau>
      </section>

      <section className="rise" style={{ animationDelay: '200ms' }}>
        <Kicker>Ancrages</Kicker>
        {memoire.ancrages.length === 0 ? (
          <div className="mt-4">
            <Vide>
              Rien encore. Un ancrage n’apparaît qu’après une sortie réelle — il n’y a aucun moyen
              d’en fabriquer un depuis cet écran.
            </Vide>
            <Link
              to={`/operation/${CATALOGUE[0]?.id ?? ''}`}
              className="data-line mt-3 inline-flex min-h-11 items-center text-gold/70 underline underline-offset-4 hover:text-gold"
            >
              Ouvrir la première opération
            </Link>
          </div>
        ) : (
          <ol className="mt-4 flex flex-col">
            {[...memoire.ancrages].reverse().map((a) => (
              <li key={a.id} className="border-l border-gold-dim/25 pb-9 pl-6 last:pb-0">
                <span className="data-line text-parchment/30">{dateCourte(a.horodatage)}</span>
                <p className="mt-2 font-display text-xl text-parchment/90">
                  {CATALOGUE.find((o) => o.id === a.operationId)?.titre ?? a.operationId}
                </p>
                <p className="mt-3 font-display text-[1.02rem] leading-relaxed text-parchment/70">
                  {a.observation}
                </p>
                {a.ajustement.trim() !== '' ? (
                  <p className="mt-3 border-l border-oeil/40 pl-4 text-[0.9rem] italic leading-relaxed text-parchment/50">
                    {a.ajustement}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="rise" style={{ animationDelay: '300ms' }}>
        <Kicker>Registre — ce que j’ai supposé, ce que le réel a répondu</Kicker>
        {memoire.registre.length === 0 ? (
          <p className="mt-4 text-[0.9rem] text-parchment/40">
            Vide. Le Registre se remplit uniquement quand une opération est close.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {[...memoire.registre].reverse().map((e) => (
              <li key={e.id} className="rounded-lg border border-gold-dim/15 px-6 py-5">
                <div className="flex flex-wrap items-start gap-3">
                  <Marque statut={e.statutInitial} />
                  <p className="flex-1 font-display text-[1.02rem] leading-relaxed text-parchment/80">
                    {e.enonce}
                  </p>
                </div>
                {e.verdictReel === null ? (
                  <p className="mt-3 pl-1 text-[0.86rem] italic text-parchment/35">
                    Jamais confrontée au réel.
                  </p>
                ) : (
                  <p className="mt-3 border-l-2 border-fait/60 pl-4 text-[0.92rem] leading-relaxed text-parchment/70">
                    {e.verdictReel}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <FinDePage />
    </div>
  )
}
