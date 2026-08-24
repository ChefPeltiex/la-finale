import type { EtatOperation, Hypothese, Operation, Preuve } from '../types'
import { verifierInventaire } from '../safety'

/** État d'une opération. Réducteur pur : aucune dépendance à l'affichage. */

export type ActionOperation =
  | { type: 'demarrer'; operation: Operation }
  | { type: 'entrer-sur-le-terrain' }
  | { type: 'etape-suivante'; operation: Operation }
  | { type: 'etape-precedente' }
  | { type: 'ajouter-hypothese'; enonce: string; origine: Hypothese['origine'] }
  | { type: 'corriger-hypothese'; id: string; enonce: string }
  | { type: 'retirer-hypothese'; id: string }
  | { type: 'retenir-hypothese'; id: string }
  | { type: 'ajouter-preuve'; preuve: Preuve }
  | { type: 'choisir-bifurcation'; id: string }
  | { type: 'revenir' }

export function etatInitial(operation: Operation): EtatOperation {
  return {
    operationId: operation.id,
    phase: 'avant',
    indexEtape: 0,
    hypotheses: [],
    preuves: [],
    bifurcationChoisie: null,
    demarreeA: new Date().toISOString(),
  }
}

/** Une étape d'inventaire ne se franchit pas sans hypothèses concurrentes. */
export function peutAvancer(etat: EtatOperation, operation: Operation): boolean {
  const etape = operation.etapes[etat.indexEtape]
  if (!etape) return false
  if (etape.type === 'inventaire') {
    return verifierInventaire(etat.hypotheses, etape.hypothesesMinimum ?? 2).length === 0
  }
  if (etape.type === 'terrain') {
    return etat.bifurcationChoisie !== null
  }
  return true
}

function phasePour(operation: Operation, index: number): EtatOperation['phase'] {
  const etape = operation.etapes[index]
  if (!etape) return 'apres'
  if (etape.type === 'ancrage') return 'apres'
  if (etape.type === 'sortie' || etape.type === 'terrain') return 'pendant'
  return 'avant'
}

export function reduire(
  etat: EtatOperation,
  action: ActionOperation,
): EtatOperation {
  switch (action.type) {
    case 'demarrer':
      return etatInitial(action.operation)

    case 'entrer-sur-le-terrain':
      return { ...etat, phase: 'pendant' }

    case 'etape-suivante': {
      if (!peutAvancer(etat, action.operation)) return etat
      const index = Math.min(etat.indexEtape + 1, action.operation.etapes.length - 1)
      return { ...etat, indexEtape: index, phase: phasePour(action.operation, index) }
    }

    case 'etape-precedente': {
      const index = Math.max(0, etat.indexEtape - 1)
      return { ...etat, indexEtape: index }
    }

    case 'ajouter-hypothese': {
      const enonce = action.enonce.trim()
      if (enonce === '') return etat
      const hypothese: Hypothese = {
        id: `hyp-${etat.hypotheses.length + 1}-${Date.now()}`,
        enonce,
        origine: action.origine,
        retenue: false,
      }
      return { ...etat, hypotheses: [...etat.hypotheses, hypothese] }
    }

    case 'corriger-hypothese':
      return {
        ...etat,
        hypotheses: etat.hypotheses.map((h) =>
          h.id === action.id ? { ...h, enonce: action.enonce } : h,
        ),
      }

    case 'retirer-hypothese':
      return { ...etat, hypotheses: etat.hypotheses.filter((h) => h.id !== action.id) }

    /** Retenir n'est pas conclure : une seule à la fois, et elle reste hypothèse. */
    case 'retenir-hypothese':
      return {
        ...etat,
        hypotheses: etat.hypotheses.map((h) => ({
          ...h,
          retenue: h.id === action.id ? !h.retenue : false,
        })),
      }

    case 'ajouter-preuve':
      return { ...etat, preuves: [...etat.preuves, action.preuve] }

    case 'choisir-bifurcation':
      return { ...etat, bifurcationChoisie: action.id }

    case 'revenir':
      return { ...etat, phase: 'apres' }

    default:
      return etat
  }
}
