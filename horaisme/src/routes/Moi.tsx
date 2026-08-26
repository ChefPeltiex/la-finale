import { useState } from 'react'

import { Bouton, FinDePage, Kicker, Marque, Panneau, TitreSection } from '../components/ui'
import { LIBELLE_STATUT } from '../engine/provenance'
import {
  activerConstat,
  ajouterEngagement,
  autoriserComposition,
  confronterAuReel,
  constatsVisibles,
  desactiverConstat,
  effacerRegistre,
  mettreAJourEngagement,
  rejeterConstat,
} from '../engine/memory'
import {
  accomplirPalier,
  cloreEngagement,
  confirmerPalier,
  creerEngagement,
  renoncerPalier,
} from '../engine/progression'
import { comptes, dementis, etatCalibration } from '../engine/contrechamp'
import { niveauPour } from '../engine/progression'
import { useJeu } from '../state/JeuProvider'
import type { ClasseEnjeu, Engagement } from '../engine/types'

const RAYONS = [500, 1000, 1500, 3000, 8000] as const
const CLASSES_ENJEU: { id: ClasseEnjeu; label: string }[] = [
  { id: 'defi-ordinaire', label: 'Défi ordinaire' },
  { id: 'enjeu-sensible', label: 'Enjeu sensible' },
  { id: 'hors-cadre', label: 'Hors cadre (note seulement)' },
]

export default function Moi() {
  const {
    sources,
    basculerSource,
    rayon,
    definirRayon,
    positionAutorisee,
    demanderPosition,
    refuserPosition,
    memoire,
    majMemoire,
    effacerTout,
  } = useJeu()

  const [confirmation, setConfirmation] = useState(false)
  const [nouvelEngagement, setNouvelEngagement] = useState(false)
  const [formulation, setFormulation] = useState('')
  const [classe, setClasse] = useState<ClasseEnjeu>('defi-ordinaire')
  const [paliersTexte, setPaliersTexte] = useState('')
  const niveau = niveauPour(memoire.xpTotal)
  const c = comptes(memoire)
  const calibration = etatCalibration(memoire)
  const dementisInscrits = dementis(memoire)
  const constats = constatsVisibles(memoire, new Date().toISOString())

  function soumettreEngagement() {
    if (formulation.trim().length < 3) return
    const lignes = paliersTexte
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    const paliers = classe === 'hors-cadre' ? [] : lignes.map((l) => ({ formulation: l }))
    const e = creerEngagement({
      id: `eng-${Date.now()}`,
      formulation: formulation.trim(),
      classe,
      paliers,
      creeLe: new Date().toISOString(),
    })
    majMemoire((m) => ajouterEngagement(m, e))
    setFormulation('')
    setPaliersTexte('')
    setNouvelEngagement(false)
  }

  function majPalier(e: Engagement, palierId: string, action: 'confirmer' | 'accomplir' | 'renoncer') {
    const maintenant = new Date().toISOString()
    majMemoire((m) =>
      mettreAJourEngagement(m, e.id, (eng) => {
        if (action === 'confirmer') return confirmerPalier(eng, palierId, maintenant)
        if (action === 'accomplir') return accomplirPalier(eng, palierId, maintenant)
        return renoncerPalier(eng, palierId, maintenant)
      }),
    )
  }

  function fermerEngagement(e: Engagement) {
    majMemoire((m) =>
      mettreAJourEngagement(m, e.id, (eng) =>
        cloreEngagement(eng, 'Ferme par le joueur depuis l’ecran Moi.', new Date().toISOString()),
      ),
    )
  }

  return (
    <div className="flex flex-col gap-14">
      <header className="rise">
        <Kicker>Tu décides de tout ce qui suit</Kicker>
        <TitreSection className="mt-3">Moi</TitreSection>
        <p className="mt-4 data-line text-parchment/35">
          Niveau {niveau.rang} · {niveau.titre} · {memoire.xpTotal} XP vécu
        </p>
      </header>

      <section className="rise" style={{ animationDelay: '80ms' }}>
        <Kicker>Sources contextuelles</Kicker>
        <p className="mt-3 max-w-2xl text-[0.86rem] leading-relaxed text-parchment/45">
          Coupe n’importe laquelle. Une source coupée n’est pas remplacée par une estimation : je
          répondrai simplement que je ne sais pas.
        </p>
        <ul className="mt-5 flex flex-col gap-px overflow-hidden rounded-lg bg-gold-dim/10">
          {sources.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-4 bg-ink-soft px-6 py-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-[1.02rem] text-parchment/85">{s.nom}</span>
                  <Marque
                    statut={s.statutMax}
                    titre={`Statut maximal que cette source peut produire : ${LIBELLE_STATUT[s.statutMax]}.`}
                  />
                </div>
                <p className="mt-1.5 text-[0.82rem] leading-relaxed text-parchment/40">
                  {s.description}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={s.active}
                onClick={() => basculerSource(s.id)}
                className={`data-line inline-flex min-h-11 shrink-0 items-center rounded-full border px-5 transition-colors ${
                  s.active
                    ? 'border-gold/50 text-gold'
                    : 'border-parchment/20 text-parchment/35 hover:text-parchment/60'
                }`}
              >
                {s.active ? 'Active' : 'Coupée'}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rise" style={{ animationDelay: '160ms' }}>
        <Kicker>Position</Kicker>
        <Panneau className="mt-4 flex flex-wrap items-center justify-between gap-5 px-6 py-6">
          <p className="max-w-xl text-[0.9rem] leading-relaxed text-parchment/55">
            {positionAutorisee
              ? 'Ta position réelle est utilisée pour ce calcul, et elle ne quitte pas cet appareil.'
              : 'Aucune position réelle. Le Vieux-Québec sert de repli, et tout ce qui en découle est marqué comme simulé.'}
          </p>
          <div className="flex gap-4">
            {positionAutorisee ? (
              <Bouton variante="contour" onClick={refuserPosition}>
                Cesser de l’utiliser
              </Bouton>
            ) : (
              <Bouton variante="contour" onClick={demanderPosition}>
                Autoriser ma position
              </Bouton>
            )}
          </div>
        </Panneau>
      </section>

      <section className="rise" style={{ animationDelay: '240ms' }}>
        <Kicker>Rayon de déplacement</Kicker>
        <p className="mt-3 text-[0.86rem] text-parchment/45">
          Ce que tu acceptes de parcourir aujourd’hui. Rien n’est déduit de tes habitudes.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {RAYONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => definirRayon(r)}
              className={`rounded-[3px] border px-5 py-2.5 font-display transition-colors ${
                rayon === r
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-gold-dim/20 text-parchment/55 hover:border-gold-dim/50'
              }`}
            >
              {r < 1000 ? `${r} m` : `${r / 1000} km`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => definirRayon(null)}
            className={`rounded-[3px] border px-5 py-2.5 font-display transition-colors ${
              rayon === null
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-gold-dim/20 text-parchment/55 hover:border-gold-dim/50'
            }`}
          >
            Non déclaré
          </button>
        </div>
      </section>

      <section className="rise" style={{ animationDelay: '320ms' }}>
        <Kicker>Corriger mes suppositions</Kicker>
        {memoire.registre.length === 0 ? (
          <p className="mt-4 text-[0.9rem] text-parchment/40">
            Le Registre est vide. Rien à corriger.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {memoire.registre.map((e) => (
              <li key={e.id} className="rounded-lg border border-gold-dim/15 px-6 py-5">
                <div className="flex flex-wrap items-start gap-3">
                  <Marque statut={e.statutInitial} />
                  <p className="flex-1 font-display text-[1.02rem] leading-relaxed text-parchment/80">
                    {e.enonce}
                  </p>
                </div>
                <input
                  defaultValue={e.verdictReel ?? ''}
                  onBlur={(ev) =>
                    majMemoire((m) => confronterAuReel(m, e.id, ev.target.value))
                  }
                  placeholder="Ce que le réel a répondu"
                  className="mt-3 w-full border-b border-parchment/12 bg-transparent py-2 font-display text-parchment placeholder:text-parchment/25 focus:border-gold/60 focus:outline-none"
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rise" style={{ animationDelay: '360ms' }}>
        <Kicker>Le Contrechamp — ce que j’ai avancé, ce que le terrain en a fait</Kicker>
        {c.avancees === 0 ? (
          <p className="mt-4 text-[0.9rem] text-parchment/40">
            Je n’ai encore rien avancé qui puisse être démenti.
          </p>
        ) : (
          <>
            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-gold-dim/15 bg-gold-dim/15 sm:grid-cols-4">
              {[
                { libelle: 'Confirmées', valeur: c.confirmees },
                { libelle: 'Contredites', valeur: c.contredites },
                { libelle: 'Indéterminées', valeur: c.indeterminees },
                { libelle: 'En attente', valeur: c.enAttente },
              ].map((x) => (
                <div key={x.libelle} className="bg-ink px-5 py-5">
                  <dt className="data-line text-parchment/40">{x.libelle}</dt>
                  <dd className="mt-2 font-display text-[1.6rem] leading-none text-parchment/85">
                    {x.valeur}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 max-w-2xl text-[0.86rem] leading-relaxed text-parchment/50">
              {calibration.message}
            </p>

            {dementisInscrits.length > 0 ? (
              <ul className="mt-6 flex flex-col gap-4">
                {dementisInscrits.map((v) => (
                  <li
                    key={v.id}
                    className="rounded-lg border border-gold-dim/15 px-6 py-5"
                  >
                    <p className="data-line text-gold/60">Démenti</p>
                    <p className="mt-2.5 font-display text-[1.02rem] leading-relaxed text-parchment/55 line-through decoration-parchment/25">
                      {v.propositionInitiale}
                    </p>
                    <p className="mt-2 font-display text-[1.02rem] leading-relaxed text-parchment/85">
                      {v.observationReelle}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </section>

      <section className="rise" style={{ animationDelay: '400ms' }}>
        <Kicker>Boss — ce que tu nommes toi-même</Kicker>
        <p className="mt-3 max-w-2xl text-[0.86rem] leading-relaxed text-parchment/45">
          HORA ne devine jamais tes peurs. Tu nommes un objectif, tu en choisis la classe, et tu
          avances palier par palier. Chaque palier reste réversible et doit être confirmé au moment
          de l’exécuter.
        </p>

        {!nouvelEngagement ? (
          <div className="mt-5">
            <Bouton variante="contour" onClick={() => setNouvelEngagement(true)}>
              Nommer un Boss
            </Bouton>
          </div>
        ) : (
          <Panneau className="mt-5 flex flex-col gap-4 px-6 py-6">
            <label className="flex flex-col gap-2">
              <span className="data-line text-parchment/50">Ta formulation, en tes mots</span>
              <input
                value={formulation}
                onChange={(e) => setFormulation(e.target.value)}
                placeholder="Je veux oser dire bonjour au voisin."
                className="w-full border-b border-parchment/12 bg-transparent py-2 font-display text-parchment placeholder:text-parchment/25 focus:border-gold/60 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="data-line text-parchment/50">Classe</span>
              <select
                value={classe}
                onChange={(e) => setClasse(e.target.value as ClasseEnjeu)}
                className="w-full border-b border-parchment/12 bg-transparent py-2 font-display text-parchment focus:border-gold/60 focus:outline-none"
              >
                {CLASSES_ENJEU.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            {classe !== 'hors-cadre' && (
              <label className="flex flex-col gap-2">
                <span className="data-line text-parchment/50">Paliers, un par ligne</span>
                <textarea
                  value={paliersTexte}
                  onChange={(e) => setPaliersTexte(e.target.value)}
                  placeholder="Lui sourire dans l’escalier.\nLui dire « bonjour »."
                  rows={4}
                  className="w-full rounded-[3px] border border-parchment/12 bg-transparent p-3 font-display text-parchment placeholder:text-parchment/25 focus:border-gold/60 focus:outline-none"
                />
              </label>
            )}
            <div className="flex flex-wrap gap-3">
              <Bouton onClick={soumettreEngagement}>Créer l’engagement</Bouton>
              <Bouton variante="discret" onClick={() => setNouvelEngagement(false)}>
                Annuler
              </Bouton>
            </div>
          </Panneau>
        )}

        {memoire.engagements.length > 0 && (
          <ul className="mt-6 flex flex-col gap-4">
            {memoire.engagements.map((e) => (
              <li key={e.id} className="rounded-lg border border-gold-dim/15 px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="font-display text-[1.05rem] leading-relaxed text-parchment/85">
                    {e.formulationDuJoueur}
                  </p>
                  <span className="data-line shrink-0 text-parchment/40">
                    {e.classe === 'defi-ordinaire'
                      ? 'Défi ordinaire'
                      : e.classe === 'enjeu-sensible'
                        ? 'Enjeu sensible'
                        : 'Hors cadre'}
                  </span>
                </div>
                {e.classe !== 'hors-cadre' && (
                  <ul className="mt-4 flex flex-col gap-3">
                    {e.paliers.map((p) => (
                      <li
                        key={p.id}
                        className={`flex flex-wrap items-center justify-between gap-3 rounded-[3px] border px-4 py-3 ${
                          p.accompliLe !== null
                            ? 'border-gold/30 bg-gold/5'
                            : p.renonceLe !== null
                              ? 'border-parchment/10 opacity-50'
                              : 'border-gold-dim/15'
                        }`}
                      >
                        <span className="font-display text-[0.95rem] text-parchment/75">
                          {p.ordre}. {p.formulation}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {p.confirmeLe === null && p.renonceLe === null && (
                            <Bouton
                              variante="discret"
                              onClick={() => majPalier(e, p.id, 'confirmer')}
                            >
                              Confirmer
                            </Bouton>
                          )}
                          {p.confirmeLe !== null && p.accompliLe === null && p.renonceLe === null && (
                            <>
                              <Bouton
                                variante="discret"
                                onClick={() => majPalier(e, p.id, 'accomplir')}
                              >
                                Accomplir
                              </Bouton>
                              <Bouton
                                variante="discret"
                                onClick={() => majPalier(e, p.id, 'renoncer')}
                              >
                                Renoncer
                              </Bouton>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {e.closLe === null && (
                  <div className="mt-4">
                    <Bouton variante="discret" onClick={() => fermerEngagement(e)}>
                      Clore cet engagement
                    </Bouton>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rise" style={{ animationDelay: '440ms' }}>
        <Kicker>Le Constat</Kicker>
        <Panneau className="mt-4 px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-parchment/85">
                {memoire.reglagesConstat.actif ? 'Actif' : 'Désactivé'}
              </p>
              <p className="mt-1 max-w-xl text-[0.82rem] leading-relaxed text-parchment/45">
                {memoire.reglagesConstat.actif
                  ? 'Je rapporte des comptes observables, suivis de ce que je ne sais pas.'
                  : 'Je ne produis aucun constat. Ce réglage reste éteint par défaut.'}
              </p>
            </div>
            <Bouton
              variante="contour"
              onClick={() =>
                majMemoire((m) => ({
                  ...m,
                  reglagesConstat: m.reglagesConstat.actif
                    ? desactiverConstat(m.reglagesConstat)
                    : activerConstat(m.reglagesConstat),
                }))
              }
            >
              {memoire.reglagesConstat.actif ? 'Désactiver' : 'Activer'}
            </Bouton>
          </div>

          {memoire.reglagesConstat.actif && (
            <>
              <label className="mt-5 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={memoire.reglagesConstat.alimenteLaComposition}
                  onChange={(ev) =>
                    majMemoire((m) => ({
                      ...m,
                      reglagesConstat: autoriserComposition(
                        m.reglagesConstat,
                        ev.target.checked,
                      ),
                    }))
                  }
                  className="size-4 accent-gold"
                />
                <span className="text-[0.86rem] text-parchment/60">
                  Permettre que ces constats influencent la composition des propositions
                </span>
              </label>

              {constats.length > 0 ? (
                <ul className="mt-6 flex flex-col gap-3">
                  {constats.map((c) => (
                    <li
                      key={c.id}
                      className="flex flex-wrap items-start justify-between gap-3 rounded-[3px] border border-gold-dim/15 px-4 py-3"
                    >
                      <p className="max-w-xl text-[0.9rem] leading-relaxed text-parchment/70">
                        {c.enonce}
                      </p>
                      <Bouton
                        variante="discret"
                        onClick={() =>
                          majMemoire((m) => ({
                            ...m,
                            reglagesConstat: rejeterConstat(m.reglagesConstat, c.id),
                          }))
                        }
                      >
                        Rejeter
                      </Bouton>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-[0.86rem] text-parchment/35">
                  Aucun constat visible pour l’instant.
                </p>
              )}
            </>
          )}
        </Panneau>
      </section>

      <section className="rise" style={{ animationDelay: '480ms' }}>
        <Kicker>Ce que ce système ne fait pas</Kicker>
        <Panneau ton="forest" className="mt-4 px-7 py-6">
          <p className="max-w-2xl text-[0.9rem] leading-relaxed text-parchment/60">
            Aucun like, aucun classement public, aucune série, aucune notification de rappel, aucun
            compteur de temps passé dans l’application. Ces mécaniques ne sont pas désactivées :
            elles n’existent pas dans le modèle de données, et un test échoue si l’une d’elles
            réapparaît.
          </p>
        </Panneau>
      </section>

      <section className="rise" style={{ animationDelay: '480ms' }}>
        <Kicker>Tes traces</Kicker>
        <p className="mt-3 max-w-2xl text-[0.86rem] leading-relaxed text-parchment/45">
          Tout est conservé uniquement dans le stockage local de ce navigateur. Rien n’est envoyé
          nulle part, et rien ne survit à un effacement.
        </p>
        <div className="mt-5 flex flex-wrap gap-4">
          <Bouton variante="contour" onClick={() => majMemoire(effacerRegistre)}>
            Effacer le Registre
          </Bouton>
          {confirmation ? (
            <>
              <Bouton
                variante="danger"
                onClick={() => {
                  effacerTout()
                  setConfirmation(false)
                }}
              >
                Confirmer l’effacement total
              </Bouton>
              <Bouton variante="discret" onClick={() => setConfirmation(false)}>
                Annuler
              </Bouton>
            </>
          ) : (
            <Bouton variante="danger" onClick={() => setConfirmation(true)}>
              Tout effacer
            </Bouton>
          )}
        </div>
      </section>

      <FinDePage />
    </div>
  )
}
