import type {
  Ancrage,
  AttributionXp,
  Datum,
  EntreeRegistre,
  LieuTerrain,
  MemoireJoueur,
} from '../types'

/**
 * Mémoire du joueur.
 *
 * Le Registre conserve ce que l'application a affirmé ou supposé, puis ce que
 * le réel a répondu. C'est la souveraineté rendue vérifiable : l'utilisateur
 * peut auditer HORA, corriger une de ses hypothèses, et tout effacer.
 */

export const MEMOIRE_VIDE: MemoireJoueur = {
  xpTotal: 0,
  attributions: [],
  registre: [],
  verifications: [],
  ancrages: [],
  lieux: [],
  operationsRefusees: [],
  operationsAbandonnees: [],
}

export function inscrireAuRegistre(
  m: MemoireJoueur,
  operationId: string,
  supposition: Datum<string>,
): MemoireJoueur {
  const entree: EntreeRegistre = {
    id: `reg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    operationId,
    enonce: supposition.valeur ?? supposition.justification,
    statutInitial: supposition.statut,
    verdictReel: null,
    horodatage: new Date().toISOString(),
  }
  return { ...m, registre: [...m.registre, entree] }
}

/** Confronter une supposition au réel. C'est l'utilisateur qui tranche. */
export function confronterAuReel(
  m: MemoireJoueur,
  entreeId: string,
  verdict: string,
): MemoireJoueur {
  return {
    ...m,
    registre: m.registre.map((e) => (e.id === entreeId ? { ...e, verdictReel: verdict } : e)),
  }
}

export function ajouterAncrage(m: MemoireJoueur, ancrage: Ancrage): MemoireJoueur {
  return { ...m, ancrages: [...m.ancrages, ancrage] }
}

export function ajouterAttribution(m: MemoireJoueur, a: AttributionXp): MemoireJoueur {
  return { ...m, xpTotal: m.xpTotal + a.montant, attributions: [...m.attributions, a] }
}

export function revelerLieu(m: MemoireJoueur, lieu: LieuTerrain): MemoireJoueur {
  if (m.lieux.some((l) => l.id === lieu.id)) return m
  return { ...m, lieux: [...m.lieux, lieu] }
}

/** Refuser n'entraîne aucune pénalité. Aucun XP n'est retiré, jamais. */
export function refuserOperation(m: MemoireJoueur, operationId: string): MemoireJoueur {
  if (m.operationsRefusees.includes(operationId)) return m
  return { ...m, operationsRefusees: [...m.operationsRefusees, operationId] }
}

export function reproposerOperation(m: MemoireJoueur, operationId: string): MemoireJoueur {
  return { ...m, operationsRefusees: m.operationsRefusees.filter((id) => id !== operationId) }
}

/** Abandonner ne brise aucune série : il n'existe aucune série. */
export function abandonnerOperation(m: MemoireJoueur, operationId: string): MemoireJoueur {
  return { ...m, operationsAbandonnees: [...m.operationsAbandonnees, operationId] }
}

export function effacerTout(): MemoireJoueur {
  return MEMOIRE_VIDE
}

export function effacerRegistre(m: MemoireJoueur): MemoireJoueur {
  return { ...m, registre: [] }
}
