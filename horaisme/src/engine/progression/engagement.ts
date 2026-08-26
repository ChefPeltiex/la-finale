import type { AxesDifficulte, Engagement, Palier } from '../types'
import { verifierEngagement } from '../safety'

export interface PropositionPaliers {
  readonly formulation: string
  readonly difficulte?: Partial<AxesDifficulte>
}

/**
 * Crée un engagement dans les mots du joueur.
 *
 * HORA ne devine jamais la formulation. Cette fonction prend les mots du
 * joueur, les valide, et construit les paliers demandés — tous réversibles,
 * tous confirmables au moment de l'exécution.
 */
export function creerEngagement({
  id,
  formulation,
  classe,
  paliers,
  creeLe,
}: {
  id: string
  formulation: string
  classe: Engagement['classe']
  paliers: readonly PropositionPaliers[]
  creeLe: string
}): Engagement {
  const baseDifficulte: AxesDifficulte = { physique: 0, social: 0, emotionnel: 0 }

  const paliersConstruits: readonly Palier[] = paliers.map((p, idx) => ({
    id: `${id}-palier-${idx + 1}`,
    ordre: idx + 1,
    formulation: p.formulation,
    reversible: true,
    difficulte: { ...baseDifficulte, ...p.difficulte },
    confirmeLe: null,
    accompliLe: null,
    renonceLe: null,
  }))

  const engagement: Engagement = {
    id,
    formulationDuJoueur: formulation.trim(),
    origine: 'joueur',
    classe,
    paliers: paliersConstruits,
    creeLe,
    closLe: null,
    noteDeCloture: null,
  }

  const violations = verifierEngagement(engagement)
  if (violations.length > 0) {
    throw new Error(violations.map((v) => `${v.regle}: ${v.explication}`).join('\n'))
  }

  return engagement
}

function mettreAJourPalier(
  engagement: Engagement,
  palierId: string,
  patch: Partial<Palier>,
): Engagement {
  return {
    ...engagement,
    paliers: engagement.paliers.map((p) => (p.id === palierId ? { ...p, ...patch } : p)),
  }
}

export function confirmerPalier(engagement: Engagement, palierId: string, maintenant: string): Engagement {
  const palier = engagement.paliers.find((p) => p.id === palierId)
  if (!palier) return engagement
  if (palier.renonceLe !== null) return engagement
  return mettreAJourPalier(engagement, palierId, { confirmeLe: maintenant })
}

export function accomplirPalier(engagement: Engagement, palierId: string, maintenant: string): Engagement {
  const palier = engagement.paliers.find((p) => p.id === palierId)
  if (!palier) return engagement
  if (palier.confirmeLe === null) return engagement
  if (palier.renonceLe !== null) return engagement
  return mettreAJourPalier(engagement, palierId, { accompliLe: maintenant })
}

export function renoncerPalier(engagement: Engagement, palierId: string, maintenant: string): Engagement {
  const palier = engagement.paliers.find((p) => p.id === palierId)
  if (!palier) return engagement
  return mettreAJourPalier(engagement, palierId, { renonceLe: maintenant })
}

export function cloreEngagement(
  engagement: Engagement,
  note: string,
  maintenant: string,
): Engagement {
  return {
    ...engagement,
    closLe: maintenant,
    noteDeCloture: note.trim(),
  }
}

export function palierDisponible(engagement: Engagement, palierId: string): boolean {
  const palier = engagement.paliers.find((p) => p.id === palierId)
  if (!palier) return false
  return palier.confirmeLe === null && palier.renonceLe === null && palier.accompliLe === null
}
