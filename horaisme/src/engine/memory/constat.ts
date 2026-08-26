import type { Constat, MemoireJoueur, ReglagesConstat } from '../types'
import { verifierConstat } from '../safety'

export interface EvenementConstat {
  readonly id: string
  readonly type: 'refus' | 'abandon' | 'rappel-en-attente'
  readonly operationId: string
  /** Propriété observée : thématique, exigence, délai, etc. */
  readonly propriete: string
  readonly ts: string
}

/**
 * Produit les constats à partir d'événements observables dans l'application.
 *
 * Le Constat est désactivé par défaut. S'il est actif, il compte des faits
 * de jeu et s'arrête sur un aveu d'ignorance. Il ne transforme jamais quatre
 * refus en profil psychologique.
 */
export function produireConstats(
  evenements: readonly EvenementConstat[],
  maintenant: string,
): readonly Constat[] {
  const parCategorie = new Map<
    string,
    {
      label: string
      propriete: string
      ids: string[]
    }
  >()

  for (const e of evenements) {
    if (e.type === 'refus' || e.type === 'abandon') {
      const cle = `${e.type}-${e.propriete}`
      const existant = parCategorie.get(cle)
      if (existant) {
        existant.ids.push(e.id)
      } else {
        parCategorie.set(cle, {
          label:
            e.type === 'refus'
              ? 'Tu as écarté {{count}} opérations'
              : 'Tu as abandonné {{count}} opérations',
          propriete: e.propriete,
          ids: [e.id],
        })
      }
    }

    if (e.type === 'rappel-en-attente') {
      const cle = 'rappel-en-attente'
      const existant = parCategorie.get(cle)
      if (existant) {
        existant.ids.push(e.id)
      } else {
        parCategorie.set(cle, {
          label: '{{count}} savoir en attente de sa deuxième fois',
          propriete: e.propriete,
          ids: [e.id],
        })
      }
    }
  }

  const constats: Constat[] = []
  for (const [cle, groupe] of parCategorie) {
    if (groupe.ids.length === 0) continue
    const compte = groupe.ids.length
    const enonceBase =
      cle === 'rappel-en-attente'
        ? `${compte} savoir${compte > 1 ? 's' : ''} en attente de ${compte > 1 ? 'leur' : 'sa'} deuxième fois`
        : groupe.label.replace('{{count}}', String(compte))
    const enonce =
      cle === 'rappel-en-attente'
        ? `${enonceBase}. Je ne sais pas quand tu voudras y revenir.`
        : `${enonceBase} qui comportaient ${groupe.propriete}. Je ne sais pas pourquoi.`

    const c: Constat = {
      id: `constat-${cle}-${maintenant}`,
      categorie:
        cle === 'rappel-en-attente'
          ? 'rappel-en-attente'
          : cle.startsWith('refus')
            ? 'ecart-thematique'
            : 'abandon',
      enonce,
      evenementIds: groupe.ids,
      produitLe: maintenant,
    }

    const violations = verifierConstat(c)
    if (violations.length === 0) {
      constats.push(c)
    }
  }

  return constats
}

export function activerConstat(reglages: ReglagesConstat): ReglagesConstat {
  return { ...reglages, actif: true }
}

export function desactiverConstat(reglages: ReglagesConstat): ReglagesConstat {
  return { ...reglages, actif: false, alimenteLaComposition: false }
}

export function exclureCategorie(
  reglages: ReglagesConstat,
  categorie: Constat['categorie'],
): ReglagesConstat {
  if (reglages.categoriesExclues.includes(categorie)) return reglages
  return { ...reglages, categoriesExclues: [...reglages.categoriesExclues, categorie] }
}

export function inclureCategorie(
  reglages: ReglagesConstat,
  categorie: Constat['categorie'],
): ReglagesConstat {
  return {
    ...reglages,
    categoriesExclues: reglages.categoriesExclues.filter((c) => c !== categorie),
  }
}

export function autoriserComposition(reglages: ReglagesConstat, autorise: boolean): ReglagesConstat {
  return { ...reglages, alimenteLaComposition: autorise }
}

export function rejeterConstat(reglages: ReglagesConstat, constatId: string): ReglagesConstat {
  if (reglages.constatsRejetes.includes(constatId)) return reglages
  return { ...reglages, constatsRejetes: [...reglages.constatsRejetes, constatId] }
}

export function constatsVisibles(
  memoire: MemoireJoueur,
  maintenant: string,
): readonly Constat[] {
  if (!memoire.reglagesConstat.actif) return []
  const evenements: EvenementConstat[] = []

  for (const opId of memoire.operationsRefusees) {
    evenements.push({
      id: `refus-${opId}`,
      type: 'refus',
      operationId: opId,
      propriete: 'une exigence que tu as jugée trop forte',
      ts: maintenant,
    })
  }

  for (const opId of memoire.operationsAbandonnees) {
    evenements.push({
      id: `abandon-${opId}`,
      type: 'abandon',
      operationId: opId,
      propriete: 'une exigence que tu as jugée trop forte',
      ts: maintenant,
    })
  }

  for (const s of memoire.savoirs) {
    if (s.rappel === null) {
      evenements.push({
        id: `rappel-${s.id}`,
        type: 'rappel-en-attente',
        operationId: s.operationId,
        propriete: s.categorie,
        ts: maintenant,
      })
    }
  }

  const bruts = produireConstats(evenements, maintenant)
  return bruts.filter(
    (c) =>
      !memoire.reglagesConstat.categoriesExclues.includes(c.categorie) &&
      !memoire.reglagesConstat.constatsRejetes.includes(c.id),
  )
}
