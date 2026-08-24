import { angleMort } from './angle-mort'
import { accepterPropositionExterne } from '../../engine/safety'
import type { Operation } from '../../engine/types'

import fragmentAngleMort from '../../assets/fragment-angle-mort.jpg'
import revealAngleMort from '../../assets/reveal-angle-mort.jpg'

const BRUT: readonly Operation[] = [angleMort]

/**
 * Une opération qui viole un garde-fou ne se charge pas. Le catalogue est
 * filtré au démarrage, pas seulement contrôlé par les tests.
 */
export const CATALOGUE: readonly Operation[] = BRUT.filter(
  (op) => accepterPropositionExterne(op).acceptee,
)

export const CATALOGUE_REJETE = BRUT.filter((op) => !accepterPropositionExterne(op).acceptee).map(
  (op) => ({ id: op.id, violations: accepterPropositionExterne(op).violations }),
)

export function operationParId(id: string): Operation | undefined {
  return CATALOGUE.find((op) => op.id === id)
}

export interface MediasOperation {
  readonly fragment: string
  readonly reveal: string
  /** Coordonnées du lieu, révélées seulement après le constat. */
  readonly lieu: { nom: string; lat: number; lon: number }
}

export const MEDIAS: Record<string, MediasOperation> = {
  'angle-mort': {
    fragment: fragmentAngleMort,
    reveal: revealAngleMort,
    lieu: { nom: 'Côte de la Montagne, Vieux-Québec', lat: 46.8129, lon: -71.2035 },
  },
}

export { angleMort }

/**
 * Contre-propositions de HORA pendant l'Inventaire.
 *
 * Ce sont des hypothèses concurrentes, jamais des réponses : elles servent à
 * empêcher qu'une seule lecture reste sur la table.
 */
export const CONTRE_HYPOTHESES: Record<string, readonly string[]> = {
  'angle-mort': [
    'Ce n’est pas sur une rue passante, mais dans une entrée de cour que tu longes sans jamais y entrer.',
    'Le fragment vient d’un mur que tu ne regardes que d’en face, jamais de près.',
    'C’est sur le côté d’un bâtiment dont tu ne connais que la façade avant.',
  ],
}
