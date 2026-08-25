import { useMemo, useReducer, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import { CONTRE_HYPOTHESES, MEDIAS, operationParId } from '../content/operations'
import { etatInitial, peutAvancer, reduire } from '../engine/operation'
import { creerPreuve } from '../engine/evidence'
import { attribuerXp } from '../engine/progression'
import {
  abandonnerOperation,
  ajouterAncrage,
  ajouterAttribution,
  confronterAuReel,
  inscrireAuRegistre,
  revelerLieu,
} from '../engine/memory'
import { useJeu } from '../state/JeuProvider'
import { avancerPropositions, trancher } from '../engine/contrechamp'
import { HORA } from '../content/hora'

import RailEtapes from '../components/operation/RailEtapes'
import EtapeFragment from '../components/operation/EtapeFragment'
import EtapeInventaire from '../components/operation/EtapeInventaire'
import EtapeSortie from '../components/operation/EtapeSortie'
import EtapeConstat from '../components/operation/EtapeConstat'
import EtapeAncrage, {
  type Verdict,
  type VerdictContrechamp,
} from '../components/operation/EtapeAncrage'
import { Bouton, Kicker } from '../components/ui'

/**
 * XP du Démenti.
 *
 * Contredire HORA avec une preuve rapporte davantage que lui donner raison.
 * Ce n'est pas une coquetterie : c'est le seul moment où l'application
 * apprend réellement quelque chose qu'elle ne savait pas.
 */
const XP_DEMENTI = 40

export default function OperationEnCours() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { majMemoire } = useJeu()

  const operation = id ? operationParId(id) : undefined
  const modele = operation ?? null

  const [etat, envoyer] = useReducer(
    reduire,
    modele,
    (op) =>
      op
        ? etatInitial(op)
        : {
            operationId: '',
            phase: 'avant' as const,
            indexEtape: 0,
            hypotheses: [],
            preuves: [],
            bifurcationChoisie: null,
            demarreeA: new Date().toISOString(),
          },
  )

  const [observation, setObservation] = useState('')
  const [bilan, setBilan] = useState<{ xp: number; echec: boolean; dementis: number } | null>(null)

  const etape = modele?.etapes[etat.indexEtape] ?? null
  const bifurcation = useMemo(
    () => modele?.bifurcations.find((b) => b.id === etat.bifurcationChoisie) ?? null,
    [modele, etat.bifurcationChoisie],
  )

  if (!modele) return <Navigate to="/aujourdhui" replace />

  const medias = MEDIAS[modele.id]
  const avancer = () => envoyer({ type: 'etape-suivante', operation: modele })

  function validerConstat(texte: string) {
    if (!modele) return
    setObservation(texte)
    envoyer({ type: 'ajouter-preuve', preuve: creerPreuve('observation', texte) })
    envoyer({ type: 'etape-suivante', operation: modele })
  }

  function clore(
    ajustement: string,
    verdicts: readonly Verdict[],
    contrechamp: readonly VerdictContrechamp[],
  ) {
    if (!modele || !bifurcation) return

    const preuves = [...etat.preuves, creerPreuve('presence', 'Sortie effectuée et retour déclaré.')]
    const motif = bifurcation.echecSincere
      ? 'Sortie effectuée sans trouver le fragment.'
      : `Constat sur place : ${bifurcation.constat}`
    const { attribution } = attribuerXp(modele.id, bifurcation.xp, motif, preuves)

    let xpTotal = bifurcation.xp
    let nombreDementis = 0

    majMemoire((m) => {
      let suivant = m

      if (attribution) suivant = ajouterAttribution(suivant, attribution)

      modele.suppositions.forEach((s, i) => {
        suivant = inscrireAuRegistre(suivant, modele.id, s)
        const derniere = suivant.registre[suivant.registre.length - 1]
        const reponse = verdicts[i]?.reponseDuReel.trim() ?? ''
        if (reponse !== '') suivant = confronterAuReel(suivant, derniere.id, reponse)
      })

      /* Contrechamp : ce que HORA avait avancé, puis ce que le terrain en dit. */
      suivant = avancerPropositions(suivant, modele)
      for (const v of contrechamp) {
        const cible = suivant.verifications.find(
          (x) => x.operationId === modele.id && x.propositionId === v.propositionId,
        )
        if (!cible) continue

        const preuvesDuVerdict =
          v.observation.trim() === ''
            ? []
            : [creerPreuve('observation', `Contrechamp — ${v.observation.trim()}`)]

        const { memoire: apres, resultat } = trancher(suivant, cible.id, {
          issue: v.issue,
          observation: v.observation,
          preuves: preuvesDuVerdict,
        })
        suivant = apres

        if (resultat.issueRetenue === 'contredite') {
          nombreDementis += 1
          const { attribution: bonus } = attribuerXp(
            modele.id,
            XP_DEMENTI,
            `Démenti : « ${cible.propositionInitiale} » — ${v.observation.trim()}`,
            preuvesDuVerdict,
          )
          if (bonus) {
            suivant = ajouterAttribution(suivant, bonus)
            xpTotal += XP_DEMENTI
          }
        }
      }

      suivant = ajouterAncrage(suivant, {
        id: `ancrage-${Date.now()}`,
        operationId: modele.id,
        bifurcationId: bifurcation.id,
        observation,
        ajustement,
        horodatage: new Date().toISOString(),
      })

      if (!bifurcation.echecSincere && medias) {
        suivant = revelerLieu(suivant, {
          id: `${modele.id}-lieu`,
          nom: medias.lieu.nom,
          lat: medias.lieu.lat,
          lon: medias.lieu.lon,
          revelePar: modele.titre,
        })
      }

      return suivant
    })

    setBilan({ xp: xpTotal, echec: bifurcation.echecSincere, dementis: nombreDementis })
  }

  function abandonner() {
    if (!modele) return
    majMemoire((m) => abandonnerOperation(m, modele.id))
    navigate('/aujourdhui')
  }

  if (bilan) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center bg-ink px-6 py-16 text-center">
        <Kicker className="text-gold/55">Opération close</Kicker>
        <h1 className="mt-5 font-display text-[clamp(2rem,5vw,3.4rem)] leading-none">
          {modele.titre}
        </h1>
        <p className="mt-7 max-w-lg font-display text-[1.1rem] italic leading-relaxed text-parchment/70">
          {bilan.echec ? HORA.echecSincere : 'C’est arrivé pour vrai, et c’est inscrit.'}
        </p>
        <p className="mt-8 data-line text-gold/70">+{bilan.xp} XP vécu</p>
        {bilan.dementis > 0 ? (
          <p className="mt-4 max-w-lg font-display text-[1rem] leading-relaxed text-parchment/70">
            Tu m’as contredite {bilan.dementis === 1 ? 'une fois' : `${bilan.dementis} fois`}, preuve
            à l’appui. C’est inscrit au Contrechamp, et ça vaut plus que de m’avoir donné raison.
          </p>
        ) : null}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <Link
            to="/parcours"
            className="inline-flex items-center gap-2.5 rounded-[3px] bg-gold px-7 py-3 font-display font-semibold text-ink transition hover:bg-[#e6ce85]"
          >
            Voir le parcours
          </Link>
          <Link
            to="/aujourdhui"
            className="data-line inline-flex min-h-11 items-center text-parchment/40 transition-colors hover:text-parchment"
          >
            Revenir à aujourd’hui
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-svh bg-ink px-6 py-7 md:px-10 md:py-9">
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <Link
          to="/aujourdhui"
          className="data-line -my-3 inline-flex min-h-11 items-center text-parchment/35 transition-colors hover:text-parchment"
        >
          ← {modele.titre}
        </Link>
        <RailEtapes etapes={modele.etapes} index={etat.indexEtape} />
      </header>

      <div className="mx-auto mt-14 max-w-5xl pb-16">
        {etape?.type === 'fragment' && medias ? (
          <EtapeFragment etape={etape} image={medias.fragment} onContinuer={avancer} />
        ) : null}

        {etape?.type === 'inventaire' ? (
          <EtapeInventaire
            etape={etape}
            hypotheses={etat.hypotheses}
            contrePropositions={CONTRE_HYPOTHESES[modele.id] ?? []}
            onAjouter={(enonce, origine) => envoyer({ type: 'ajouter-hypothese', enonce, origine })}
            onCorriger={(hid, enonce) => envoyer({ type: 'corriger-hypothese', id: hid, enonce })}
            onRetirer={(hid) => envoyer({ type: 'retirer-hypothese', id: hid })}
            onRetenir={(hid) => envoyer({ type: 'retenir-hypothese', id: hid })}
            onContinuer={avancer}
            peutContinuer={peutAvancer(etat, modele)}
          />
        ) : null}

        {etape?.type === 'sortie' ? (
          <EtapeSortie etape={etape} hypotheses={etat.hypotheses} onRevenir={avancer} />
        ) : null}

        {etape?.type === 'terrain' ? (
          <EtapeConstat
            etape={etape}
            bifurcations={modele.bifurcations}
            choisie={etat.bifurcationChoisie}
            onChoisir={(bid) => envoyer({ type: 'choisir-bifurcation', id: bid })}
            onValider={validerConstat}
          />
        ) : null}

        {etape?.type === 'ancrage' && medias ? (
          <EtapeAncrage
            etape={etape}
            suppositions={modele.suppositions}
            propositions={modele.propositions}
            bifurcation={bifurcation}
            reveal={medias.reveal}
            lieu={medias.lieu}
            observationInitiale={observation}
            onClore={clore}
          />
        ) : null}
      </div>

      <footer className="mx-auto flex max-w-5xl justify-center pb-6">
        <Bouton variante="discret" onClick={abandonner}>
          Quitter l’opération
        </Bouton>
      </footer>
    </main>
  )
}
