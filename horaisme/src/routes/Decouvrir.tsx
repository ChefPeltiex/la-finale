import { FinDePage, Kicker, Marque, Panneau, TitreSection } from '../components/ui'
import { FORMULES } from '../content/hora'
import {
  BOUCLE_HORA,
  FAMILLES,
  NE_PAS_CONFONDRE,
  PRINCIPES,
  PRINCIPE_CENTRAL,
  ROLES_HORA,
} from '../content/philosophie'
import { EXPLICATION_STATUT, STATUTS } from '../engine/provenance'
import embleme from '../assets/hora-emblem.jpg'

/**
 * Découvrir — un atlas, pas un fil.
 *
 * Contenu fixe, consulté volontairement, sans recommandation, sans tendance,
 * sans classement et sans chargement à l'infini. La page a une fin.
 */
export default function Decouvrir() {
  return (
    <div className="flex flex-col gap-16">
      <header className="rise">
        <Kicker>Atlas · consulté, jamais recommandé</Kicker>
        <TitreSection className="mt-3">Découvrir</TitreSection>
        <p className="mt-5 max-w-2xl text-[0.92rem] leading-relaxed text-parchment/50">
          Une bibliothèque fermée : rien ne se recharge en bas de page, rien n’est trié pour te
          retenir, rien ne t’est suggéré. Ce qui est ici y restera, et tu y viens parce que tu l’as
          décidé.
        </p>
      </header>

      <section className="rise" style={{ animationDelay: '80ms' }}>
        <div className="chalk relative overflow-hidden rounded-lg hairline bg-ink-deep">
          <img
            src={embleme}
            alt="Œuvre à la craie : un œil central entouré de facettes rayonnantes."
            className="h-72 w-full object-cover opacity-80 md:h-96"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep via-transparent to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 px-7 pb-7 md:px-10">
            <p className="max-w-2xl font-display text-[clamp(1.1rem,2.4vw,1.6rem)] italic leading-snug text-parchment/90">
              {FORMULES.portee}
            </p>
          </div>
        </div>
      </section>

      <section className="rise" style={{ animationDelay: '160ms' }}>
        <Kicker>Le principe central</Kicker>
        <p className="mt-4 max-w-3xl font-display text-[1.15rem] leading-relaxed text-parchment/80">
          {PRINCIPE_CENTRAL}
        </p>
      </section>

      <section className="rise" style={{ animationDelay: '220ms' }}>
        <Kicker>Les principes, et ce qu’ils imposent au code</Kicker>
        <p className="mt-3 max-w-2xl text-[0.86rem] leading-relaxed text-parchment/40">
          Chaque principe qui peut être vérifié par une machine l’est. La colonne de droite indique
          le test qui casse la construction si le principe est violé.
        </p>
        <ul className="mt-6 flex flex-col gap-px overflow-hidden rounded-lg bg-gold-dim/10">
          {PRINCIPES.map((p) => (
            <li key={p.id} className="grid gap-4 bg-ink-soft px-6 py-6 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <p className="font-display text-[1.08rem] leading-relaxed text-parchment/90">
                  {p.enonce}
                </p>
                <p className="mt-3 text-[0.86rem] leading-relaxed text-parchment/45">
                  {p.consequenceTechnique}
                </p>
              </div>
              <div className="lg:border-l lg:border-gold-dim/12 lg:pl-6">
                <span className="data-line text-parchment/30">Garanti par le test</span>
                <p className="mt-2 font-mono text-[0.8rem] leading-relaxed text-oeil/75">
                  {p.test ?? '— relève du contenu, relu à la main'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rise" style={{ animationDelay: '280ms' }}>
        <Kicker>La boucle HORA</Kicker>
        <ol className="mt-5 grid gap-px overflow-hidden rounded-lg bg-gold-dim/10 sm:grid-cols-2 lg:grid-cols-5">
          {BOUCLE_HORA.map((e, i) => (
            <li key={e.nom} className="bg-ink-soft px-5 py-6">
              <span className="data-line text-gold/50">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-3 font-display text-lg text-parchment/90">{e.nom}</p>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-parchment/45">{e.corps}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-[0.82rem] text-parchment/35">
          Elle n’est jamais expliquée pendant une opération. Elle apparaît seulement en marge, en
          micro-typographie.
        </p>
      </section>

      <section className="rise" style={{ animationDelay: '340ms' }}>
        <Kicker>Les quatre statuts</Kicker>
        <ul className="mt-5 flex flex-col gap-3">
          {STATUTS.map((s) => (
            <li key={s} className="flex flex-wrap items-start gap-4 rounded border border-gold-dim/12 px-5 py-4">
              <Marque statut={s} />
              <span className="flex-1 text-[0.9rem] leading-relaxed text-parchment/60">
                {EXPLICATION_STATUT[s]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rise" style={{ animationDelay: '400ms' }}>
        <Kicker>Les familles d’action</Kicker>
        <div className="mt-5 grid gap-px overflow-hidden rounded-lg bg-gold-dim/10 sm:grid-cols-2">
          {FAMILLES.map((f) => (
            <div key={f.id} className="bg-ink-soft px-6 py-6">
              <p className="font-display text-lg text-parchment/85">{f.nom}</p>
              <p className="mt-2.5 text-[0.86rem] leading-relaxed text-parchment/45">{f.corps}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rise grid gap-6 lg:grid-cols-2" style={{ animationDelay: '460ms' }}>
        <Panneau className="px-6 py-6">
          <Kicker>HORA est</Kicker>
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
            {ROLES_HORA.est.map((r) => (
              <li key={r} className="rounded-full border border-oeil/30 px-3 py-1 data-line text-oeil/80">
                {r}
              </li>
            ))}
          </ul>
        </Panneau>
        <Panneau className="px-6 py-6">
          <Kicker>HORA n’est pas</Kicker>
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-2">
            {ROLES_HORA.nEstPas.map((r) => (
              <li key={r} className="rounded-full border border-terre/35 px-3 py-1 data-line text-terre/80">
                {r}
              </li>
            ))}
          </ul>
        </Panneau>
      </section>

      <section className="rise" style={{ animationDelay: '520ms' }}>
        <Kicker>Ne pas confondre</Kicker>
        <p className="mt-4 max-w-3xl font-display text-[1.05rem] leading-relaxed text-parchment/60">
          L’Horaïsme n’est pas {NE_PAS_CONFONDRE.join(', ni ')}.
        </p>
        <p className="mt-6 max-w-3xl font-display text-[1.1rem] italic leading-relaxed text-gold/70">
          {FORMULES.ville}
        </p>
      </section>

      <FinDePage>
        C’est la fin de l’atlas. Il n’y a pas de page suivante, et il n’y en aura pas d’autre tant
        que quelqu’un n’en aura pas écrit une.
      </FinDePage>
    </div>
  )
}
