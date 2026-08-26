import type {
  Ancrage,
  AttributionXp,
  Datum,
  EntreeRegistre,
  LieuTerrain,
  MemoireJoueur,
} from '../types'
import type { Engagement, SavoirRecu, RappelLocal } from '../types'
import { REGLAGES_CONSTAT_PAR_DEFAUT } from '../types'

export {
  activerConstat,
  autoriserComposition,
  constatsVisibles,
  desactiverConstat,
  exclureCategorie,
  inclureCategorie,
  produireConstats,
  rejeterConstat,
  type EvenementConstat,
} from './constat'

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
  engagements: [],
  savoirs: [],
  rappelsLocaux: [],
  reglagesConstat: REGLAGES_CONSTAT_PAR_DEFAUT,
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

export function ajouterEngagement(m: MemoireJoueur, e: Engagement): MemoireJoueur {
  if (m.engagements.some((x) => x.id === e.id)) return m
  return { ...m, engagements: [...m.engagements, e] }
}

export function mettreAJourEngagement(
  m: MemoireJoueur,
  id: string,
  patch: (e: Engagement) => Engagement,
): MemoireJoueur {
  return {
    ...m,
    engagements: m.engagements.map((e) => (e.id === id ? patch(e) : e)),
  }
}

export function ajouterSavoir(m: MemoireJoueur, s: SavoirRecu): MemoireJoueur {
  if (m.savoirs.some((x) => x.id === s.id)) return m
  return { ...m, savoirs: [...m.savoirs, s] }
}

export function mettreAJourSavoir(
  m: MemoireJoueur,
  id: string,
  patch: (s: SavoirRecu) => SavoirRecu,
): MemoireJoueur {
  return {
    ...m,
    savoirs: m.savoirs.map((s) => (s.id === id ? patch(s) : s)),
  }
}

export function ajouterRappelLocal(m: MemoireJoueur, r: RappelLocal): MemoireJoueur {
  const sansDoublon = m.rappelsLocaux.filter((x) => x.savoirId !== r.savoirId)
  return { ...m, rappelsLocaux: [...sansDoublon, r] }
}

export function supprimerRappelLocal(m: MemoireJoueur, savoirId: string): MemoireJoueur {
  return { ...m, rappelsLocaux: m.rappelsLocaux.filter((r) => r.savoirId !== savoirId) }
}

export function mettreAJourReglagesConstat(
  m: MemoireJoueur,
  patch: Partial<MemoireJoueur['reglagesConstat']>,
): MemoireJoueur {
  return { ...m, reglagesConstat: { ...m.reglagesConstat, ...patch } }
}
