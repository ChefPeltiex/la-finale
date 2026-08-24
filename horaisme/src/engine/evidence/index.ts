import type { Preuve, TypePreuve } from '../types'

/** Preuves. Une action réelle laisse une trace ; sans trace, pas d'XP. */

export const LIBELLE_PREUVE: Record<TypePreuve, string> = {
  presence: 'Présence sur place',
  observation: 'Observation notée',
  photo: 'Image rapportée',
  echange: 'Échange avec quelqu’un',
}

export function creerPreuve(type: TypePreuve, contenu: string): Preuve {
  return {
    id: `preuve-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    contenu: contenu.trim(),
    horodatage: new Date().toISOString(),
  }
}

export function preuveValide(p: Preuve): boolean {
  return p.contenu.trim().length > 0
}
