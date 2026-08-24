import type { Datum, StatutProvenance } from '../types'

/**
 * Le Registre repose sur quatre statuts et une seule règle dure :
 * une information dont la provenance est inconnue ne porte aucune valeur.
 * HORA a le droit de dire « je ne sais pas », et cela doit se voir.
 */

export const STATUTS: readonly StatutProvenance[] = ['fait', 'plausible', 'simule', 'inconnu']

export const LIBELLE_STATUT: Record<StatutProvenance, string> = {
  fait: 'Fait',
  plausible: 'Plausible',
  simule: 'Simulé',
  inconnu: 'Inconnu',
}

export const EXPLICATION_STATUT: Record<StatutProvenance, string> = {
  fait: 'Mesuré ou vérifiable maintenant. Tu peux t’appuyer dessus.',
  plausible: 'Déduit, non confirmé. À traiter comme une hypothèse.',
  simule: 'Donnée de démonstration. Aucune source réelle derrière.',
  inconnu: 'Je ne sais pas. Rien n’est affiché à la place.',
}

export const COULEUR_STATUT: Record<StatutProvenance, string> = {
  fait: 'var(--color-fait)',
  plausible: 'var(--color-plausible)',
  simule: 'var(--color-simule)',
  inconnu: 'var(--color-inconnu)',
}

export function fait<T>(valeur: T, source: string, justification: string): Datum<T> {
  return { valeur, statut: 'fait', source, justification, capteA: new Date().toISOString() }
}

export function plausible<T>(valeur: T, source: string, justification: string): Datum<T> {
  return { valeur, statut: 'plausible', source, justification, capteA: new Date().toISOString() }
}

export function simule<T>(valeur: T, source: string, justification: string): Datum<T> {
  return { valeur, statut: 'simule', source, justification, capteA: new Date().toISOString() }
}

export function inconnu<T>(source: string, justification = 'Aucune source disponible.'): Datum<T> {
  return { valeur: null, statut: 'inconnu', source, justification }
}

/** Un datum inconnu ne doit jamais afficher de valeur de remplacement. */
export function estAffichable<T>(d: Datum<T>): boolean {
  return d.statut !== 'inconnu' && d.valeur !== null
}

/** Invariant vérifié par les tests philosophiques. */
export function datumCoherent<T>(d: Datum<T>): boolean {
  if (d.source.trim() === '' || d.justification.trim() === '') return false
  if (d.statut === 'inconnu') return d.valeur === null
  return d.valeur !== null
}

/** Ordre de confiance décroissant, utilisé pour trier un Registre. */
export function poidsConfiance(s: StatutProvenance): number {
  return { fait: 3, plausible: 2, simule: 1, inconnu: 0 }[s]
}
