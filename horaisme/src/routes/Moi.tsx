import { useState } from 'react'

import { Bouton, FinDePage, Kicker, Marque, Panneau, TitreSection } from '../components/ui'
import { LIBELLE_STATUT } from '../engine/provenance'
import {
  activerConstat,
  ajouterEngagement,
  ajouterRappelLocal,
  ajouterSavoir,
  autoriserComposition,
  confronterAuReel,
  constatsVisibles,
  creerRappelLocal,
  creerSavoirRecu,
  desactiverConstat,
  effacerRegistre,
  enregistrerRappel,
  joursRestants,
  mettreAJourEngagement,
  mettreAJourSavoir,
  rappelDisponible,
  rejeterConstat,
  supprimerRappelLocal,
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
import type { ClasseEnjeu, Engagement, FormePreuveRappel, CategorieSavoir, Rappel } from '../engine/types'

const RAYONS = [500, 1000, 1500, 3000, 8000] as const
const CLASSES_ENJEU: { id: ClasseEnjeu; label: string }[] = [
  { id: 'defi-ordinaire', label: 'Défi ordinaire' },
  { id: 'enjeu-sensible', label: 'Enjeu sensible' },
  { id: 'hors-cadre', label: 'Hors cadre (note seulement)' },
]
const CATEGORIES_SAVOIR: { id: CategorieSavoir; label: string }[] = [
  { id: 'geste', label: 'Geste' },
  { id: 'histoire', label: 'Histoire' },
  { id: 'recette', label: 'Recette' },
  { id: 'orientation', label: 'Orientation' },
  { id: 'technique', label: 'Technique' },
  { id: 'saisonnier', label: 'Savoir saisonnier' },
]
const FORMES_PREUVE: { id: FormePreuveRappel; label: string }[] = [
  { id: 'reformulation', label: 'Reformulation écrite' },
  { id: 'reproduction-geste', label: 'Reproduction du geste' },
  { id: 'resultat-materiel', label: 'Résultat matériel' },
  { id: 'croquis', label: 'Croquis' },
  { id: 'demonstration', label: 'Démonstration' },
  { id: 'enregistrement', label: 'Explication enregistrée' },
  { id: 'correction-du-transmetteur', label: 'Correction volontaire du transmetteur' },
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
  const [nouveauSavoir, setNouveauSavoir] = useState(false)
  const [categorieSavoir, setCategorieSavoir] = useState<CategorieSavoir>('geste')
  const [enonceSavoir, setEnonceSavoir] = useState('')
  const [fenetreSavoir, setFenetreSavoir] = useState('3')
  const [justificationFenetre, setJustificationFenetre] = useState('')
  const [savoirEnRappel, setSavoirEnRappel] = useState<string | null>(null)
  const [rappelDeMemoire, setRappelDeMemoire] = useState('')
  const [formeRappel, setFormeRappel] = useState<FormePreuveRappel>('reformulation')
  const [verdictRappel, setVerdictRappel] = useState<'tenu' | 'partiel' | 'perdu'>('partiel')
  const [noteRappel, setNoteRappel] = useState('')
  const [dateRappelLocal, setDateRappelLocal] = useState('')
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

  function soumettreSavoir() {
    const jours = Number.parseInt(fenetreSavoir, 10)
    if (Number.isNaN(jours) || jours < 1 || enonceSavoir.trim().length < 5) return
    const s = creerSavoirRecu(
      {
        operationId: 'manuel',
        categorie: categorieSavoir,
        enonceInitial: enonceSavoir.trim(),
        fenetreMinimaleJours: jours,
        justificationFenetre: justificationFenetre.trim() || 'Fenetre declaree manuellement.',
      },
      new Date().toISOString(),
    )
    majMemoire((m) => ajouterSavoir(m, s))
    setEnonceSavoir('')
    setFenetreSavoir('3')
    setJustificationFenetre('')
    setNouveauSavoir(false)
  }

  function soumettreRappel(savoirId: string) {
    if (rappelDeMemoire.trim().length < 3) return
    majMemoire((m) =>
      mettreAJourSavoir(m, savoirId, (s) =>
        enregistrerRappel(s, {
          enonceDeMemoire: rappelDeMemoire,
          forme: formeRappel,
          verdictDuJoueur: verdictRappel,
          noteDuJoueur: noteRappel,
          rappeleLe: new Date().toISOString(),
        }),
      ),
    )
    setSavoirEnRappel(null)
    setRappelDeMemoire('')
    setNoteRappel('')
  }

  function creerRappelPourSavoir(savoirId: string) {
    if (!dateRappelLocal) return
    const r = creerRappelLocal(savoirId, dateRappelLocal, new Date().toISOString())
    majMemoire((m) => ajouterRappelLocal(m, r))
    setDateRappelLocal('')
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

      <section className="rise" style={{ animationDelay: '520ms' }}>
        <Kicker>La deuxième fois — transmission et rappel</Kicker>
        <p className="mt-3 max-w-2xl text-[0.86rem] leading-relaxed text-parchment/45">
          Un savoir recu d’un humain n’est verifie que quand tu peux le redire de memoire. Aucune
          notification automatique : tu choisis seul de revenir, et tu juges seul l’ecart.
        </p>

        {!nouveauSavoir ? (
          <div className="mt-5">
            <Bouton variante="contour" onClick={() => setNouveauSavoir(true)}>
              Noter un savoir recu
            </Bouton>
          </div>
        ) : (
          <Panneau className="mt-5 flex flex-col gap-4 px-6 py-6">
            <label className="flex flex-col gap-2">
              <span className="data-line text-parchment/50">Categorie</span>
              <select
                value={categorieSavoir}
                onChange={(e) => setCategorieSavoir(e.target.value as CategorieSavoir)}
                className="w-full border-b border-parchment/12 bg-transparent py-2 font-display text-parchment focus:border-gold/60 focus:outline-none"
              >
                {CATEGORIES_SAVOIR.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="data-line text-parchment/50">Ce que tu as appris, ecrit par toi</span>
              <textarea
                value={enonceSavoir}
                onChange={(e) => setEnonceSavoir(e.target.value)}
                placeholder="On tient le couteau par le manche, lame vers le bas..."
                rows={4}
                className="w-full rounded-[3px] border border-parchment/12 bg-transparent p-3 font-display text-parchment placeholder:text-parchment/25 focus:border-gold/60 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="data-line text-parchment/50">Delai minimum avant le rappel (jours)</span>
              <input
                type="number"
                min={1}
                value={fenetreSavoir}
                onChange={(e) => setFenetreSavoir(e.target.value)}
                className="w-full border-b border-parchment/12 bg-transparent py-2 font-display text-parchment focus:border-gold/60 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="data-line text-parchment/50">Pourquoi ce delai ?</span>
              <input
                value={justificationFenetre}
                onChange={(e) => setJustificationFenetre(e.target.value)}
                placeholder="Un geste moteur commence a se degrader apres quelques jours."
                className="w-full border-b border-parchment/12 bg-transparent py-2 font-display text-parchment placeholder:text-parchment/25 focus:border-gold/60 focus:outline-none"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <Bouton onClick={soumettreSavoir}>Enregistrer le savoir</Bouton>
              <Bouton variante="discret" onClick={() => setNouveauSavoir(false)}>
                Annuler
              </Bouton>
            </div>
          </Panneau>
        )}

        {memoire.savoirs.length > 0 && (
          <ul className="mt-6 flex flex-col gap-4">
            {memoire.savoirs.map((s) => {
              const maintenant = new Date()
              const disponible = rappelDisponible(s, maintenant)
              const attente = joursRestants(s, maintenant)
              const rappelLocal = memoire.rappelsLocaux.find((r) => r.savoirId === s.id)
              return (
                <li key={s.id} className="rounded-lg border border-gold-dim/15 px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-[1.02rem] text-parchment/85">
                        {CATEGORIES_SAVOIR.find((c) => c.id === s.categorie)?.label}
                      </p>
                      <p className="mt-1 text-[0.82rem] text-parchment/40">
                        {s.rappel === null
                          ? disponible
                            ? 'Le rappel est maintenant possible.'
                            : `Attendre encore ${attente} jour${attente > 1 ? 's' : ''}.`+
                            (rappelLocal ? ` Rappel local prevu le ${rappelLocal.dateSouhaitee.slice(0, 10)}.` : '')
                          : `Rappele le ${s.rappel.rappeleLe.slice(0, 10)}.`}
                      </p>
                    </div>
                    {s.rappel === null && (
                      <Bouton
                        variante="discret"
                        onClick={() => {
                          if (disponible) {
                            setSavoirEnRappel(s.id)
                            setRappelDeMemoire('')
                          }
                        }}
                        disabled={!disponible}
                      >
                        Faire le rappel
                      </Bouton>
                    )}
                  </div>

                  {s.rappel === null && (
                    <div className="mt-4 flex flex-wrap items-end gap-3">
                      <input
                        type="datetime-local"
                        value={dateRappelLocal}
                        onChange={(e) => setDateRappelLocal(e.target.value)}
                        className="rounded-[3px] border border-parchment/12 bg-transparent px-3 py-2 font-display text-parchment text-[0.85rem] focus:border-gold/60 focus:outline-none"
                      />
                      <Bouton
                        variante="discret"
                        onClick={() => creerRappelPourSavoir(s.id)}
                        disabled={!dateRappelLocal}
                      >
                        {rappelLocal ? 'Modifier le rappel local' : 'Creer un rappel local'}
                      </Bouton>
                      {rappelLocal && (
                        <Bouton
                          variante="discret"
                          onClick={() => majMemoire((m) => supprimerRappelLocal(m, s.id))}
                        >
                          Supprimer
                        </Bouton>
                      )}
                    </div>
                  )}

                  {s.rappel !== null && (
                    <div className="mt-4 grid gap-4 rounded-[3px] border border-gold-dim/15 bg-ink-soft p-4 sm:grid-cols-2">
                      <div>
                        <p className="data-line text-parchment/40">Original</p>
                        <p className="mt-1.5 font-display text-[0.95rem] leading-relaxed text-parchment/70">
                          {s.enonceInitial}
                        </p>
                      </div>
                      <div>
                        <p className="data-line text-parchment/40">De memoire</p>
                        <p className="mt-1.5 font-display text-[0.95rem] leading-relaxed text-parchment/85">
                          {s.rappel.enonceDeMemoire}
                        </p>
                      </div>
                    </div>
                  )}

                  {savoirEnRappel === s.id && (
                    <Panneau className="mt-4 flex flex-col gap-4 px-5 py-5">
                      <p className="text-[0.86rem] text-parchment/55">
                        Ecris ce que tu retiens sans regarder l’original. L’original ne sera affiche
                        qu’apres ta saisie.
                      </p>
                      <textarea
                        value={rappelDeMemoire}
                        onChange={(e) => setRappelDeMemoire(e.target.value)}
                        rows={4}
                        className="w-full rounded-[3px] border border-parchment/12 bg-transparent p-3 font-display text-parchment placeholder:text-parchment/25 focus:border-gold/60 focus:outline-none"
                      />
                      <label className="flex flex-col gap-2">
                        <span className="data-line text-parchment/50">Forme de la preuve</span>
                        <select
                          value={formeRappel}
                          onChange={(e) => setFormeRappel(e.target.value as FormePreuveRappel)}
                          className="w-full border-b border-parchment/12 bg-transparent py-2 font-display text-parchment focus:border-gold/60 focus:outline-none"
                        >
                          {FORMES_PREUVE.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="data-line text-parchment/50">Ton verdict</span>
                        <select
                          value={verdictRappel}
                          onChange={(e) =>
                            setVerdictRappel(e.target.value as Rappel['verdictDuJoueur'])
                          }
                          className="w-full border-b border-parchment/12 bg-transparent py-2 font-display text-parchment focus:border-gold/60 focus:outline-none"
                        >
                          <option value="tenu">Tenu</option>
                          <option value="partiel">Partiel</option>
                          <option value="perdu">Perdu</option>
                        </select>
                      </label>
                      <input
                        value={noteRappel}
                        onChange={(e) => setNoteRappel(e.target.value)}
                        placeholder="Note personnelle (optionnelle)"
                        className="w-full border-b border-parchment/12 bg-transparent py-2 font-display text-parchment placeholder:text-parchment/25 focus:border-gold/60 focus:outline-none"
                      />
                      <div className="flex flex-wrap gap-3">
                        <Bouton onClick={() => soumettreRappel(s.id)}>Enregistrer le rappel</Bouton>
                        <Bouton variante="discret" onClick={() => setSavoirEnRappel(null)}>
                          Annuler
                        </Bouton>
                      </div>
                    </Panneau>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="rise" style={{ animationDelay: '560ms' }}>
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
