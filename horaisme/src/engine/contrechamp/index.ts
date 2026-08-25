import type {
  IssueVerification,
  MemoireJoueur,
  Operation,
  Preuve,
  PropositionOperation,
  Verification,
} from '../types'

/**
 * Le Contrechamp du réel.
 *
 * HORA avance quelque chose de réfutable, dit ce qu'on devrait observer si
 * elle a raison, puis le terrain répond. Trois issues, jamais deux.
 *
 * Ce que ce module refuse de faire, et c'est le plus important :
 *
 * - Il ne déduit jamais une contradiction d'un silence. Ne rien avoir trouvé
 *   n'est pas avoir trouvé le contraire. Une issue `contredite` exige une
 *   observation écrite *et* au moins une preuve rattachée ; sans quoi elle
 *   retombe en `indeterminee`, avec la raison affichée.
 *
 * - Il ne compare pas la provenance d'une donnée à la vérité d'un énoncé.
 *   `statutEpistemique` dit d'où vient l'affirmation. Il ne dit rien de sa
 *   justesse, et ne sert donc jamais à trancher.
 *
 * - Il ne publie aucun « taux d'erreur de HORA ». Des opérations différentes
 *   ne produisent pas des événements comparables : une moyenne entre elles
 *   serait un chiffre inventé. On compte, on n'agrège pas.
 */

/* ------------------------------------------------------------------ */
/* Déclarer                                                            */
/* ------------------------------------------------------------------ */

export function confianceValide(c: number): boolean {
  return Number.isFinite(c) && c >= 0 && c <= 1
}

function identifiant(prefixe: string): string {
  return `${prefixe}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/** Inscrit au Contrechamp ce que l'opération avance, avant la sortie. */
export function avancerProposition(
  m: MemoireJoueur,
  operationId: string,
  p: PropositionOperation,
): MemoireJoueur {
  const deja = m.verifications.some(
    (v) => v.operationId === operationId && v.propositionId === p.id,
  )
  if (deja) return m

  const verification: Verification = {
    id: identifiant('ver'),
    operationId,
    propositionId: p.id,
    propositionInitiale: p.enonce,
    resultatAttendu: p.resultatAttendu,
    confianceInitiale: p.confiance,
    statutEpistemique: p.statutEpistemique,
    observationReelle: null,
    issue: 'indeterminee',
    preuveIds: [],
    proposeeLe: new Date().toISOString(),
    trancheeLe: null,
  }
  return { ...m, verifications: [...m.verifications, verification] }
}

export function avancerPropositions(m: MemoireJoueur, op: Operation): MemoireJoueur {
  return op.propositions.reduce((acc, p) => avancerProposition(acc, op.id, p), m)
}

/* ------------------------------------------------------------------ */
/* Trancher                                                            */
/* ------------------------------------------------------------------ */

export interface Verdict {
  readonly issue: IssueVerification
  readonly observation: string
  readonly preuves: readonly Preuve[]
}

export interface ResultatVerdict {
  readonly issueRetenue: IssueVerification
  /** Vrai quand l'issue demandée a dû être ramenée à `indeterminee`. */
  readonly ramenee: boolean
  readonly raison: string
}

/**
 * Décide de l'issue réellement inscriptible.
 *
 * Confirmer comme contredire engagent un constat : les deux exigent une
 * observation et une preuve. Sans elles, l'issue retombe à `indeterminee` —
 * ce qui n'est pas une punition, seulement la description exacte de ce qu'on
 * sait.
 */
export function arbitrer(v: Verdict): ResultatVerdict {
  if (v.issue === 'indeterminee') {
    return {
      issueRetenue: 'indeterminee',
      ramenee: false,
      raison: 'Rien ne permet de trancher. C’est une réponse entière, et elle compte.',
    }
  }

  const observation = v.observation.trim()
  if (observation === '') {
    return {
      issueRetenue: 'indeterminee',
      ramenee: true,
      raison:
        'Il manque ce que tu as constaté. Tant que ce n’est pas écrit, je ne peux ni me confirmer ni me démentir.',
    }
  }

  if (v.preuves.length === 0) {
    return {
      issueRetenue: 'indeterminee',
      ramenee: true,
      raison:
        v.issue === 'contredite'
          ? 'Un démenti sans preuve rattachée n’est pas un démenti. L’absence de preuve n’est pas une preuve du contraire.'
          : 'Une confirmation sans preuve rattachée reste une impression. Elle est inscrite comme indéterminée.',
    }
  }

  return {
    issueRetenue: v.issue,
    ramenee: false,
    raison:
      v.issue === 'contredite'
        ? 'Le terrain m’a contredit, et c’est inscrit tel quel.'
        : 'Le terrain m’a donné raison, avec une preuve à l’appui.',
  }
}

export function trancher(
  m: MemoireJoueur,
  verificationId: string,
  v: Verdict,
): { memoire: MemoireJoueur; resultat: ResultatVerdict } {
  const resultat = arbitrer(v)
  const memoire: MemoireJoueur = {
    ...m,
    verifications: m.verifications.map((x) =>
      x.id === verificationId
        ? {
            ...x,
            observationReelle: v.observation.trim() === '' ? null : v.observation.trim(),
            issue: resultat.issueRetenue,
            preuveIds: v.preuves.map((p) => p.id),
            trancheeLe: new Date().toISOString(),
          }
        : x,
    ),
  }
  return { memoire, resultat }
}

/** Le Démenti : un et un seul cas. */
export function estDementi(v: Verification): boolean {
  return v.issue === 'contredite' && v.preuveIds.length > 0 && v.observationReelle !== null
}

export function dementis(m: MemoireJoueur): readonly Verification[] {
  return m.verifications.filter(estDementi)
}

/* ------------------------------------------------------------------ */
/* Compter, sans agréger                                               */
/* ------------------------------------------------------------------ */

export interface ComptesContrechamp {
  readonly avancees: number
  readonly confirmees: number
  readonly contredites: number
  readonly indeterminees: number
  readonly enAttente: number
}

export function comptes(m: MemoireJoueur): ComptesContrechamp {
  const tranchees = m.verifications.filter((v) => v.trancheeLe !== null)
  return {
    avancees: m.verifications.length,
    confirmees: tranchees.filter((v) => v.issue === 'confirmee').length,
    contredites: tranchees.filter((v) => v.issue === 'contredite').length,
    indeterminees: tranchees.filter((v) => v.issue === 'indeterminee').length,
    enAttente: m.verifications.length - tranchees.length,
  }
}

/**
 * Échantillon minimal avant qu'une calibration ait le moindre sens.
 *
 * Volontairement élevé. En dessous, trois issues sur quatre relèvent du
 * hasard, et afficher un pourcentage serait une mise en scène de rigueur.
 */
export const MINIMUM_POUR_CALIBRER = 30

export interface TrancheConfiance {
  readonly borneBasse: number
  readonly borneHaute: number
  readonly confirmees: number
  readonly contredites: number
  readonly indeterminees: number
}

export interface EtatCalibration {
  readonly tranches: readonly TrancheConfiance[]
  readonly trancheesAvecPreuve: number
  readonly suffisant: boolean
  readonly message: string
}

/**
 * Structure préparée pour une calibration ultérieure.
 *
 * Elle regroupe les issues par tranche de confiance annoncée, et s'arrête là.
 * Tant que `suffisant` est faux — et il l'est aujourd'hui —, l'interface
 * affiche les comptes bruts et dit pourquoi elle ne calcule rien.
 */
export function etatCalibration(m: MemoireJoueur): EtatCalibration {
  const bornes = [0, 0.25, 0.5, 0.75, 1]
  const pertinentes = m.verifications.filter(
    (v) => v.trancheeLe !== null && v.issue !== 'indeterminee',
  )

  const tranches: TrancheConfiance[] = []
  for (let i = 0; i < bornes.length - 1; i += 1) {
    const basse = bornes[i]
    const haute = bornes[i + 1]
    const dedans = m.verifications.filter(
      (v) =>
        v.trancheeLe !== null &&
        v.confianceInitiale >= basse &&
        (i === bornes.length - 2 ? v.confianceInitiale <= haute : v.confianceInitiale < haute),
    )
    tranches.push({
      borneBasse: basse,
      borneHaute: haute,
      confirmees: dedans.filter((v) => v.issue === 'confirmee').length,
      contredites: dedans.filter((v) => v.issue === 'contredite').length,
      indeterminees: dedans.filter((v) => v.issue === 'indeterminee').length,
    })
  }

  const suffisant = pertinentes.length >= MINIMUM_POUR_CALIBRER
  return {
    tranches,
    trancheesAvecPreuve: pertinentes.length,
    suffisant,
    message: suffisant
      ? 'L’échantillon permet de commencer à comparer ma confiance annoncée à ce que le terrain a répondu.'
      : `Je ne calcule aucun taux. ${pertinentes.length} vérification${pertinentes.length > 1 ? 's' : ''} tranchée${pertinentes.length > 1 ? 's' : ''} sur les ${MINIMUM_POUR_CALIBRER} qu’il faudrait, et des opérations trop différentes pour être moyennées entre elles.`,
  }
}

/* ------------------------------------------------------------------ */
/* Vérification des propositions déclarées                             */
/* ------------------------------------------------------------------ */

export interface DefautProposition {
  readonly propositionId: string
  readonly regle: string
  readonly explication: string
}

export function verifierPropositions(op: Operation): DefautProposition[] {
  const defauts: DefautProposition[] = []

  if (op.propositions.length === 0) {
    defauts.push({
      propositionId: op.id,
      regle: 'aucune-proposition',
      explication:
        'Une opération doit avancer au moins une chose que le terrain peut démentir. Sans énoncé réfutable, il n’y a pas de contrechamp.',
    })
  }

  const vus = new Set<string>()
  for (const p of op.propositions) {
    if (vus.has(p.id)) {
      defauts.push({
        propositionId: p.id,
        regle: 'proposition-dupliquee',
        explication: 'Deux propositions ne peuvent pas partager le même identifiant.',
      })
    }
    vus.add(p.id)

    if (!confianceValide(p.confiance)) {
      defauts.push({
        propositionId: p.id,
        regle: 'confiance-hors-bornes',
        explication: 'La confiance annoncée se déclare entre 0 et 1.',
      })
    }

    if (p.resultatAttendu.trim().length < 15) {
      defauts.push({
        propositionId: p.id,
        regle: 'resultat-attendu-absent',
        explication:
          'Sans dire ce qu’on devrait observer si l’énoncé tient, rien ne peut le contredire. Une affirmation irréfutable n’a pas sa place ici.',
      })
    }

    if (p.enonce.trim().length < 15) {
      defauts.push({
        propositionId: p.id,
        regle: 'enonce-trop-court',
        explication: 'L’énoncé avancé doit être lisible et assez précis pour être mis en défaut.',
      })
    }
  }

  return defauts
}
