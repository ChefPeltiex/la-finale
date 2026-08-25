import { angleMort } from './angle-mort'
import { troisSoleils } from './trois-soleils'
import { leSosie } from './le-sosie'
import { accepterPropositionExterne } from '../../engine/safety'
import type { Operation } from '../../engine/types'

import fragmentAngleMort from '../../assets/fragment-angle-mort.jpg'
import revealAngleMort from '../../assets/reveal-angle-mort.jpg'

const BRUT: readonly Operation[] = [angleMort, troisSoleils, leSosie]

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
  /** Absent quand le fragment n'est pas une image à décoder. */
  readonly fragment?: string
  /** Absent quand il n'y a aucune image de révélation. */
  readonly reveal?: string
  /**
   * Coordonnées du lieu, révélées seulement après le constat.
   *
   * Absentes quand il n'y a pas de lieu à révéler — un phénomène de ciel n'a
   * pas d'adresse — ou quand il ne *doit* pas l'être : une espèce vulnérable
   * ne se publie pas à une précision exploitable. `noteLieu` dit alors
   * pourquoi, pour qu'une décision ne se lise pas comme un oubli.
   */
  readonly lieu?: { nom: string; lat: number; lon: number }
  readonly noteLieu?: string
}

export const MEDIAS: Record<string, MediasOperation> = {
  'angle-mort': {
    fragment: fragmentAngleMort,
    reveal: revealAngleMort,
    lieu: { nom: 'Côte de la Montagne, Vieux-Québec', lat: 46.8129, lon: -71.2035 },
  },
  'trois-soleils': {
    noteLieu:
      'Cette opération n’a pas de lieu à révéler : le phénomène est dans le ciel, et le bon endroit est celui d’où tu as vu l’horizon dégagé. C’est ton point d’observation qui compte, pas une adresse.',
  },
  'le-sosie': {
    noteLieu:
      'Je ne publie aucune coordonnée pour cette opération. L’ail des bois est une espèce vulnérable, et une colonie divulguée est une colonie visitée. Ce n’est pas une donnée qui me manque : c’est une donnée que je refuse d’écrire.',
  },
}

export { angleMort, troisSoleils, leSosie }

/**
 * Question posée au joueur au moment de formuler ses hypothèses.
 *
 * Chaque opération ne demande pas la même chose. « L'angle mort » cherche un
 * endroit, « Les trois soleils » une cause, « Le sosie » une identité.
 */
export const INVITES_HYPOTHESE: Record<string, string> = {
  'angle-mort': 'Où crois-tu que ce détail se trouve ?',
  'trois-soleils': 'Qu’est-ce qui produit ces deux autres soleils ?',
  'le-sosie': 'Quelle plante crois-tu avoir devant toi ?',
}

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
  'trois-soleils': [
    'Ce n’est pas dans le ciel : c’est un reflet sur une vitre d’immeuble derrière toi.',
    'Ce n’est pas dans le ciel : c’est un reflet interne de ton objectif, et il n’existe pas à l’œil nu.',
    'Il y en a deux, symétriques, et tu n’en as remarqué qu’un seul.',
    'Ce n’est pas un faux soleil mais un cercle complet, et tu n’en vois qu’un morceau.',
  ],
  'le-sosie': [
    'Les deux plantes poussent côte à côte au même endroit — c’est le cas le plus fréquent, et le plus piégeux.',
    'Ce n’est ni l’une ni l’autre : c’est une troisième espèce que tu n’avais pas envisagée.',
    'Le caractère sur lequel tu t’appuies est justement celui que le sosie partage.',
  ],
}
