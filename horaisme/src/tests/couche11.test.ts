import { describe, expect, it } from 'vitest'
import {
  creerRappelLocal,
  creerSavoirRecu,
  enregistrerRappel,
  joursRestants,
  rappelDisponible,
} from '../engine/memory/savoir'

describe('La deuxième fois', () => {
  const savoir = creerSavoirRecu(
    {
      operationId: 'op-transmission',
      categorie: 'geste',
      enonceInitial: 'On tient le couteau par le manche, lame vers le bas, et on coupe en tirant.',
      fenetreMinimaleJours: 3,
      justificationFenetre: 'Un geste moteur commence à se dégrader après quelques jours.',
    },
    '2026-01-01T00:00:00Z',
  )

  it('cree un savoir recu avec un enonce initial', () => {
    expect(savoir.enonceInitial).toBe(
      'On tient le couteau par le manche, lame vers le bas, et on coupe en tirant.',
    )
    expect(savoir.transmetteur).toBeNull()
    expect(savoir.rappel).toBeNull()
  })

  it('interdit le rappel avant la fenetre minimale', () => {
    const avant = new Date('2026-01-03T00:00:00Z')
    expect(rappelDisponible(savoir, avant)).toBe(false)
    expect(joursRestants(savoir, avant)).toBe(1)
  })

  it('autorise le rappel apres la fenetre minimale', () => {
    const apres = new Date('2026-01-05T00:00:00Z')
    expect(rappelDisponible(savoir, apres)).toBe(true)
    expect(joursRestants(savoir, apres)).toBe(0)
  })

  it('enregistre un rappel avec un verdict humain, sans note automatique', () => {
    const misAJour = enregistrerRappel(savoir, {
      enonceDeMemoire: 'On tient le couteau et on coupe.',
      forme: 'reproduction-geste',
      verdictDuJoueur: 'partiel',
      noteDuJoueur: 'J’ai oublié le sens de la lame.',
      rappeleLe: '2026-01-05T00:00:00Z',
    })
    expect(misAJour.rappel).not.toBeNull()
    expect(misAJour.rappel?.verdictDuJoueur).toBe('partiel')
    expect(misAJour.rappel?.forme).toBe('reproduction-geste')
  })

  it('un rappel local est cree explicitement, sans recurrence', () => {
    const r = creerRappelLocal(savoir.id, '2026-01-10T09:00:00Z', '2026-01-01T00:00:00Z')
    expect(r.savoirId).toBe(savoir.id)
    expect(r.dateSouhaitee).toBe('2026-01-10T09:00:00Z')
    expect(r).not.toHaveProperty('repetition')
  })
})
