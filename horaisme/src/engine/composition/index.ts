import type {
  Contexte,
  IdSourceContexte,
  MemoireJoueur,
  Operation,
  StatutProvenance,
} from '../types'
import { estAffichable } from '../provenance'
import { accepterPropositionExterne } from '../safety'

/**
 * Composition narrative.
 *
 * Version déterministe et vérifiable. Le futur maître de jeu génératif
 * implémentera la même interface `Compositeur` et ses sorties passeront par
 * `accepterPropositionExterne` avant d'atteindre l'écran.
 */

export interface RaisonProposition {
  readonly source: IdSourceContexte
  readonly enonce: string
  readonly statut: StatutProvenance
}

export interface Proposition {
  readonly operation: Operation
  /** « Pourquoi cette opération m'est-elle proposée ? » — toujours répondable. */
  readonly raisons: readonly RaisonProposition[]
}

export interface Ecartee {
  readonly operationId: string
  readonly titre: string
  readonly motif: string
}

export interface ResultatComposition {
  readonly propositions: readonly Proposition[]
  readonly ecartees: readonly Ecartee[]
  /** « Rien aujourd'hui » est toujours proposé, sans pénalité ni culpabilité. */
  readonly rienAujourdhui: string
}

export interface EntreeComposition {
  readonly contexte: Contexte
  readonly memoire: MemoireJoueur
  readonly catalogue: readonly Operation[]
  readonly maximum?: number
}

export interface Compositeur {
  readonly nom: string
  readonly genere: boolean
  composer(entree: EntreeComposition): ResultatComposition
}

const RIEN_AUJOURDHUI =
  'Rien aujourd’hui est un choix entier. Aucune série ne se brise, aucun compteur ne baisse, et je ne reviendrai pas te le rappeler.'

export const compositeurDeterministe: Compositeur = {
  nom: 'Compositeur déterministe',
  genere: false,

  composer({ contexte, memoire, catalogue, maximum = 3 }): ResultatComposition {
    const propositions: Proposition[] = []
    const ecartees: Ecartee[] = []

    for (const operation of catalogue) {
      const { acceptee, violations } = accepterPropositionExterne(operation)
      if (!acceptee) {
        ecartees.push({
          operationId: operation.id,
          titre: operation.titre,
          motif: `Rejetée par les garde-fous : ${violations[0].regle}.`,
        })
        continue
      }

      if (memoire.operationsRefusees.includes(operation.id)) {
        ecartees.push({
          operationId: operation.id,
          titre: operation.titre,
          motif: 'Tu l’as écartée. Elle ne reviendra pas tant que tu ne la redemandes pas.',
        })
        continue
      }

      const raisons: RaisonProposition[] = []

      const rayon = contexte.rayonMobiliteMetres
      if (estAffichable(rayon)) {
        if (operation.rayonMetres > (rayon.valeur as number)) {
          ecartees.push({
            operationId: operation.id,
            titre: operation.titre,
            motif: `Terrain de ${operation.rayonMetres} m, au-delà du rayon de ${rayon.valeur} m que tu as déclaré.`,
          })
          continue
        }
        raisons.push({
          source: 'mobilite',
          enonce: `Le terrain tient dans les ${rayon.valeur} m que tu as déclarés.`,
          statut: rayon.statut,
        })
      }

      const lumiere = contexte.minutesDeLumiere
      if (estAffichable(lumiere)) {
        const minutes = lumiere.valeur as number
        const [, dureeMax] = operation.dureeMinutes
        if (minutes < dureeMax) {
          raisons.push({
            source: 'lumiere',
            enonce: `Il reste environ ${minutes} min de lumière, l’opération en demande jusqu’à ${dureeMax}. Faisable, mais tu finiras peut-être à la noirceur.`,
            statut: lumiere.statut,
          })
        } else {
          raisons.push({
            source: 'lumiere',
            enonce: `Environ ${minutes} min de lumière restante : de quoi tenir les ${dureeMax} min de l’opération.`,
            statut: lumiere.statut,
          })
        }
      }

      if (estAffichable(contexte.zone)) {
        raisons.push({
          source: 'position',
          enonce: `L’opération se joue autour de ${contexte.zone.valeur}.`,
          statut: contexte.zone.statut,
        })
      }

      if (estAffichable(contexte.saison)) {
        raisons.push({
          source: 'saison',
          enonce: `Saison en cours : ${contexte.saison.valeur}.`,
          statut: contexte.saison.statut,
        })
      }

      if (memoire.ancrages.length === 0) {
        raisons.push({
          source: 'historique',
          enonce: 'Aucun ancrage encore. Je te propose une opération d’entrée sur le terrain.',
          statut: 'fait',
        })
      }

      propositions.push({ operation, raisons })
      if (propositions.length >= maximum) break
    }

    return { propositions, ecartees, rienAujourdhui: RIEN_AUJOURDHUI }
  },
}
