import type { AttributionXp, MemoireJoueur, Preuve } from '../types'
import { verifierAttribution, type Violation } from '../safety'

/**
 * Attribution des XP.
 *
 * « Tu ne montes pas seulement de niveau. Tu élargis ton terrain. »
 * Aucun compteur de temps passé dans l'application n'existe dans ce modèle,
 * et aucun XP ne peut être créé sans preuve d'action réelle.
 */

export interface ResultatAttribution {
  readonly attribution: AttributionXp | null
  readonly violations: readonly Violation[]
}

export function attribuerXp(
  operationId: string,
  montant: number,
  motif: string,
  preuves: readonly Preuve[],
): ResultatAttribution {
  const attribution: AttributionXp = {
    operationId,
    montant,
    motif,
    preuves,
    horodatage: new Date().toISOString(),
  }
  const violations = verifierAttribution(attribution)
  return violations.length > 0
    ? { attribution: null, violations }
    : { attribution, violations: [] }
}

const PALIERS = [0, 120, 320, 640, 1100, 1750, 2600] as const

const TITRES = [
  'Passant',
  'Arpenteur',
  'Repéreur',
  'Éclaireur',
  'Cartographe',
  'Vétéran du terrain',
  'Familier de l’inconnu',
] as const

export interface Niveau {
  readonly rang: number
  readonly titre: string
  readonly xpDansLeNiveau: number
  readonly xpPourLeSuivant: number | null
}

export function niveauPour(xpTotal: number): Niveau {
  let rang = 0
  while (rang + 1 < PALIERS.length && xpTotal >= PALIERS[rang + 1]) rang += 1
  const base = PALIERS[rang]
  const suivant = rang + 1 < PALIERS.length ? PALIERS[rang + 1] : null
  return {
    rang: rang + 1,
    titre: TITRES[rang],
    xpDansLeNiveau: xpTotal - base,
    xpPourLeSuivant: suivant === null ? null : suivant - base,
  }
}

export interface Elargissement {
  readonly lieux: number
  readonly ancrages: number
  readonly echecsAssumes: number
  readonly hypothesesCorrigees: number
}

/** Ce que la progression mesure réellement : l'étendue du terrain vécu. */
export function elargissementTerrain(m: MemoireJoueur): Elargissement {
  return {
    lieux: m.lieux.length,
    ancrages: m.ancrages.length,
    echecsAssumes: m.attributions.filter((a) => a.motif.toLowerCase().includes('sans trouver'))
      .length,
    hypothesesCorrigees: m.registre.filter((e) => e.verdictReel !== null).length,
  }
}
