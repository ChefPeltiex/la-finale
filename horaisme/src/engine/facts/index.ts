import type { Datum, FaitExterne, StatutProvenance } from '../types'
import { inconnu } from '../provenance'

/**
 * Faits externes.
 *
 * Un fait du monde change. Une limite légale est modifiée, un horaire est
 * révisé, un compte d'observations grimpe, une espèce change de statut de
 * conservation. Une application honnête ne peut donc pas figer ces valeurs
 * dans son code comme si elles étaient éternelles.
 *
 * Chaque fait externe transporte donc sa date de vérification, sa durée de
 * validité et son territoire. Quand l'une des trois ne tient plus, le fait
 * se dégrade en `inconnu` et sa règle de repli s'applique.
 */

const MS_PAR_JOUR = 86_400_000

export interface EntreeFaitExterne<T> {
  readonly valeur: T
  readonly statut: Exclude<StatutProvenance, 'inconnu'>
  readonly source: string
  readonly url?: string | null
  readonly territoire: string
  readonly publieLe?: string | null
  readonly verifieLe: string
  readonly expireLe?: string | null
  readonly validiteJours?: number | null
  readonly licence: string
  readonly identifiantRegle?: string | null
  readonly texteOriginal?: string | null
  readonly justification: string
  readonly repli: string
}

export function faitExterne<T>(e: EntreeFaitExterne<T>): FaitExterne<T> {
  return {
    valeur: e.valeur,
    statut: e.statut,
    source: e.source,
    url: e.url ?? null,
    territoire: e.territoire,
    publieLe: e.publieLe ?? null,
    verifieLe: e.verifieLe,
    expireLe: e.expireLe ?? null,
    validiteJours: e.validiteJours ?? null,
    licence: e.licence,
    identifiantRegle: e.identifiantRegle ?? null,
    texteOriginal: e.texteOriginal ?? null,
    justification: e.justification,
    repli: e.repli,
  }
}

export function faitExterneInconnu<T>(
  source: string,
  territoire: string,
  justification: string,
  repli: string,
): FaitExterne<T> {
  return {
    valeur: null,
    statut: 'inconnu',
    source,
    url: null,
    territoire,
    publieLe: null,
    verifieLe: new Date().toISOString(),
    expireLe: null,
    validiteJours: null,
    licence: 'sans objet',
    identifiantRegle: null,
    texteOriginal: null,
    justification,
    repli,
  }
}

/** Date à laquelle le fait cesse d'être considéré comme fiable. */
export function echeanceDe<T>(f: FaitExterne<T>): Date | null {
  if (f.expireLe !== null) return new Date(f.expireLe)
  if (f.validiteJours !== null) {
    return new Date(new Date(f.verifieLe).valueOf() + f.validiteJours * MS_PAR_JOUR)
  }
  return null
}

/**
 * Un fait sans échéance déclarée est traité comme périmé.
 *
 * C'est volontairement sévère : l'oubli de déclarer une durée de validité ne
 * doit pas produire un fait immortel.
 */
export function estPerime<T>(f: FaitExterne<T>, maintenant: Date = new Date()): boolean {
  if (f.statut === 'inconnu') return true
  const echeance = echeanceDe(f)
  if (echeance === null) return true
  return maintenant.valueOf() > echeance.valueOf()
}

/**
 * Un fait de `CA-QC` s'applique à `CA-QC/quebec`. L'inverse est faux : une
 * règle municipale ne s'étend pas à la province.
 */
export function applicableA<T>(f: FaitExterne<T>, territoire: string): boolean {
  if (f.territoire === territoire) return true
  return territoire.startsWith(`${f.territoire}/`)
}

export interface EvaluationFait<T> {
  readonly utilisable: boolean
  readonly valeur: T | null
  readonly statut: StatutProvenance
  readonly raison: string
}

/**
 * Seul point de lecture autorisé d'un fait externe. Vérifie la péremption et
 * le territoire avant de rendre la valeur ; sinon rend `inconnu` avec le repli.
 */
export function evaluerFait<T>(
  f: FaitExterne<T>,
  territoire: string,
  maintenant: Date = new Date(),
): EvaluationFait<T> {
  if (f.statut === 'inconnu') {
    return { utilisable: false, valeur: null, statut: 'inconnu', raison: f.repli }
  }
  if (!applicableA(f, territoire)) {
    return {
      utilisable: false,
      valeur: null,
      statut: 'inconnu',
      raison: `Cette information vaut pour ${f.territoire}, pas pour ${territoire}. ${f.repli}`,
    }
  }
  if (estPerime(f, maintenant)) {
    const echeance = echeanceDe(f)
    const quand = echeance === null ? 'aucune durée de validité déclarée' : `valable jusqu’au ${echeance.toISOString().slice(0, 10)}`
    return {
      utilisable: false,
      valeur: null,
      statut: 'inconnu',
      raison: `Vérifié le ${f.verifieLe.slice(0, 10)} (${quand}). Je ne peux plus l’affirmer. ${f.repli}`,
    }
  }
  return { utilisable: true, valeur: f.valeur, statut: f.statut, raison: f.justification }
}

/** Projection vers le `Datum` affichable par l'interface. */
export function versDatum<T>(
  f: FaitExterne<T>,
  territoire: string,
  maintenant: Date = new Date(),
): Datum<T> {
  const e = evaluerFait(f, territoire, maintenant)
  if (!e.utilisable) return inconnu<T>(f.source, e.raison)
  return {
    valeur: e.valeur,
    statut: e.statut,
    source: f.source,
    justification: `${f.justification} Vérifié le ${f.verifieLe.slice(0, 10)}.`,
    capteA: f.verifieLe,
  }
}

/** Invariant vérifié par les tests : un fait externe cohérent. */
export function faitCoherent<T>(f: FaitExterne<T>): boolean {
  if (f.source.trim() === '' || f.territoire.trim() === '') return false
  if (f.justification.trim() === '' || f.repli.trim() === '') return false
  if (f.verifieLe.trim() === '' || Number.isNaN(new Date(f.verifieLe).valueOf())) return false
  if (f.statut === 'inconnu') return f.valeur === null
  return f.valeur !== null
}
