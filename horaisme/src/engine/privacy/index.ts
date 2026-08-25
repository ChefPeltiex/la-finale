import type { IdSourceContexte } from '../types'

/**
 * Confidentialité de localisation.
 *
 * Trois positions distinctes, et les confondre serait la faute :
 *
 * - la **position privée** : ce que l'appareil sait. Elle ne quitte jamais
 *   la machine du joueur ;
 * - la **zone de quête** : ce qui est transmis à une source externe, arrondi
 *   à la précision minimale dont cette source a réellement besoin ;
 * - la **position publiable** : ce qui pourrait apparaître dans une preuve
 *   partagée. Toujours plus grossière, et absente dès qu'une espèce sensible
 *   est en jeu.
 *
 * Aucune fonction de ce module n'élargit une précision. Elles ne font que la
 * réduire.
 */

export interface PositionPrivee {
  readonly lat: number
  readonly lon: number
  /** Précision annoncée par l'appareil, en mètres. */
  readonly precisionMetres: number
  readonly capteeLe: string
}

export interface ZoneDeQuete {
  readonly lat: number
  readonly lon: number
  /** Côté approximatif de la maille, en mètres. */
  readonly mailleMetres: number
}

/** Un degré de latitude vaut environ 111 km. */
const METRES_PAR_DEGRE_LAT = 111_320

/**
 * Arrondit une position à une maille donnée.
 *
 * L'arrondi se fait sur une grille fixe et non par troncature aléatoire :
 * deux relevés voisins tombent ainsi sur le même point, ce qui empêche de
 * reconstituer un déplacement en comparant plusieurs requêtes.
 *
 * Le pas en longitude est calculé à partir de la latitude *déjà arrondie*.
 * Sinon la grille se déplacerait avec le point qu'elle est censée fixer, et
 * réappliquer l'arrondi donnerait un résultat différent.
 */
export function arrondirPosition(
  p: { lat: number; lon: number },
  mailleMetres: number,
): ZoneDeQuete {
  if (mailleMetres <= 0) {
    return { lat: p.lat, lon: p.lon, mailleMetres: 0 }
  }
  const pasLat = mailleMetres / METRES_PAR_DEGRE_LAT
  const lat = Math.round(p.lat / pasLat) * pasLat

  const cos = Math.cos((lat * Math.PI) / 180)
  const facteur = Math.abs(cos) < 1e-6 ? 1e-6 : Math.abs(cos)
  const pasLon = mailleMetres / (METRES_PAR_DEGRE_LAT * facteur)

  return { lat, lon: Math.round(p.lon / pasLon) * pasLon, mailleMetres }
}

/* ------------------------------------------------------------------ */
/* Consentement, source par source                                     */
/* ------------------------------------------------------------------ */

export interface ConsentementSource {
  readonly source: IdSourceContexte
  readonly accorde: boolean
  /** À quoi sert précisément cette source. Pas de formulation générale. */
  readonly finalite: string
  /** Maille minimale transmise à cette source. */
  readonly mailleMetres: number
  readonly conservationJours: number
  readonly accordeLe: string | null
}

export interface ReglagesConfidentialite {
  readonly consentements: readonly ConsentementSource[]
  /** Aucune localisation pendant que l'application n'est pas au premier plan. */
  readonly localisationEnArrierePlan: false
}

export function reglagesParDefaut(): ReglagesConfidentialite {
  return { consentements: [], localisationEnArrierePlan: false }
}

export function consentementPour(
  r: ReglagesConfidentialite,
  source: IdSourceContexte,
): ConsentementSource | null {
  return r.consentements.find((c) => c.source === source) ?? null
}

/**
 * Ce qui part réellement vers une source donnée.
 *
 * Sans consentement explicite pour cette source précise, rien ne part. Un
 * accord donné à la météo n'autorise pas la biodiversité.
 */
export function positionPour(
  r: ReglagesConfidentialite,
  source: IdSourceContexte,
  p: PositionPrivee | null,
): ZoneDeQuete | null {
  if (p === null) return null
  const c = consentementPour(r, source)
  if (c === null || !c.accorde) return null
  return arrondirPosition(p, Math.max(c.mailleMetres, 0))
}

/* ------------------------------------------------------------------ */
/* Ce qui peut apparaître dans une preuve                              */
/* ------------------------------------------------------------------ */

export const MAILLE_PUBLIABLE_METRES = 1_000

export interface PositionPubliable {
  readonly lat: number
  readonly lon: number
  readonly mailleMetres: number
  readonly mention: string
}

/**
 * Une preuve partagée ne porte jamais une position exploitable, et n'en porte
 * aucune dès qu'une espèce sensible est concernée.
 */
export function positionPubliable(
  p: PositionPrivee | null,
  especeSensible: boolean,
): PositionPubliable | null {
  if (p === null || especeSensible) return null
  const z = arrondirPosition(p, MAILLE_PUBLIABLE_METRES)
  return {
    lat: z.lat,
    lon: z.lon,
    mailleMetres: z.mailleMetres,
    mention: `Position arrondie à environ ${MAILLE_PUBLIABLE_METRES} m.`,
  }
}

/* ------------------------------------------------------------------ */
/* Conservation                                                        */
/* ------------------------------------------------------------------ */

export function expireLe(c: ConsentementSource, capteeLe: string): Date {
  return new Date(new Date(capteeLe).valueOf() + c.conservationJours * 86_400_000)
}

export function aPurger(
  c: ConsentementSource,
  capteeLe: string,
  maintenant: Date = new Date(),
): boolean {
  return maintenant.valueOf() > expireLe(c, capteeLe).valueOf()
}

/** Retire les positions dont la durée de conservation déclarée est écoulée. */
export function purger<T extends { capteeLe: string }>(
  entrees: readonly T[],
  c: ConsentementSource,
  maintenant: Date = new Date(),
): readonly T[] {
  return entrees.filter((e) => !aPurger(c, e.capteeLe, maintenant))
}
