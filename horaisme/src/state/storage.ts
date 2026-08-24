import type { MemoireJoueur, SourceContexte } from '../engine/types'
import { MEMOIRE_VIDE } from '../engine/memory'
import { SOURCES_PAR_DEFAUT } from '../engine/context'

/**
 * Persistance locale uniquement. Rien ne quitte l'appareil, et tout peut être
 * effacé depuis l'onglet Moi.
 */

const CLE_MEMOIRE = 'horaisme.memoire.v1'
const CLE_SOURCES = 'horaisme.sources.v1'
const CLE_RAYON = 'horaisme.rayon.v1'

function lire<T>(cle: string, defaut: T): T {
  try {
    const brut = localStorage.getItem(cle)
    return brut === null ? defaut : (JSON.parse(brut) as T)
  } catch {
    return defaut
  }
}

function ecrire<T>(cle: string, valeur: T): void {
  try {
    localStorage.setItem(cle, JSON.stringify(valeur))
  } catch {
    /* Stockage indisponible : la session reste utilisable en mémoire vive. */
  }
}

export function chargerMemoire(): MemoireJoueur {
  return lire<MemoireJoueur>(CLE_MEMOIRE, MEMOIRE_VIDE)
}

export function sauverMemoire(m: MemoireJoueur): void {
  ecrire(CLE_MEMOIRE, m)
}

export function chargerSources(): readonly SourceContexte[] {
  return lire<readonly SourceContexte[]>(CLE_SOURCES, SOURCES_PAR_DEFAUT)
}

export function sauverSources(s: readonly SourceContexte[]): void {
  ecrire(CLE_SOURCES, s)
}

export function chargerRayon(): number | null {
  return lire<number | null>(CLE_RAYON, 1500)
}

export function sauverRayon(r: number | null): void {
  ecrire(CLE_RAYON, r)
}

export function toutEffacer(): void {
  for (const cle of [CLE_MEMOIRE, CLE_SOURCES, CLE_RAYON]) {
    try {
      localStorage.removeItem(cle)
    } catch {
      /* rien à faire */
    }
  }
}
