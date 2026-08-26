import type { FormePreuveRappel, Rappel, RappelLocal, SavoirRecu } from '../types'

export interface PropositionSavoir {
  readonly operationId: string
  readonly categorie: SavoirRecu['categorie']
  readonly enonceInitial: string
  readonly fenetreMinimaleJours: number
  readonly justificationFenetre: string
  /** `null` est le cas normal : anonyme par defaut. */
  readonly transmetteur?: SavoirRecu['transmetteur']
}

export function creerSavoirRecu(p: PropositionSavoir, creeLe: string): SavoirRecu {
  return {
    id: `savoir-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    operationId: p.operationId,
    categorie: p.categorie,
    enonceInitial: p.enonceInitial.trim(),
    recuLe: creeLe,
    fenetreMinimaleJours: p.fenetreMinimaleJours,
    justificationFenetre: p.justificationFenetre,
    transmetteur: p.transmetteur ?? null,
    rappel: null,
  }
}

export function rappelDisponible(s: SavoirRecu, maintenant: Date): boolean {
  if (s.rappel !== null) return false
  const recu = new Date(s.recuLe)
  const minimale = new Date(recu)
  minimale.setDate(minimale.getDate() + s.fenetreMinimaleJours)
  return maintenant >= minimale
}

export function joursRestants(s: SavoirRecu, maintenant: Date): number {
  const recu = new Date(s.recuLe)
  const minimale = new Date(recu)
  minimale.setDate(minimale.getDate() + s.fenetreMinimaleJours)
  const diff = minimale.getTime() - maintenant.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export function enregistrerRappel(
  s: SavoirRecu,
  {
    enonceDeMemoire,
    forme,
    verdictDuJoueur,
    noteDuJoueur,
    rappeleLe,
  }: {
    enonceDeMemoire: string
    forme: FormePreuveRappel
    verdictDuJoueur: Rappel['verdictDuJoueur']
    noteDuJoueur: string
    rappeleLe: string
  },
): SavoirRecu {
  const rappel: Rappel = {
    enonceDeMemoire: enonceDeMemoire.trim(),
    forme,
    verdictDuJoueur,
    noteDuJoueur: noteDuJoueur.trim(),
    rappeleLe,
  }
  return { ...s, rappel }
}

export function creerRappelLocal(savoirId: string, dateSouhaitee: string, creeLe: string): RappelLocal {
  return { savoirId, dateSouhaitee, creeLe }
}
