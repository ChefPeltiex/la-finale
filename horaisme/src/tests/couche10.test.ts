import { describe, expect, it } from 'vitest'
import {
  accomplirPalier,
  cloreEngagement,
  confirmerPalier,
  creerEngagement,
  palierDisponible,
  renoncerPalier,
} from '../engine/progression/engagement'
import {
  activerConstat,
  constatsVisibles,
  desactiverConstat,
  produireConstats,
  rejeterConstat,
} from '../engine/memory/constat'
import { MEMOIRE_VIDE } from '../engine/memory'

describe('Engagement autodéterminé', () => {
  it('cree un engagement avec les mots du joueur', () => {
    const e = creerEngagement({
      id: 'e1',
      formulation: 'Je veux oser dire bonjour au voisin.',
      classe: 'defi-ordinaire',
      paliers: [
        { formulation: 'Lui sourire dans l’escalier.' },
        { formulation: 'Lui dire « bonjour ».' },
      ],
      creeLe: '2026-01-01T00:00:00Z',
    })
    expect(e.formulationDuJoueur).toBe('Je veux oser dire bonjour au voisin.')
    expect(e.origine).toBe('joueur')
    expect(e.paliers).toHaveLength(2)
    expect(e.paliers[0].reversible).toBe(true)
  })

  it('rejette un engagement sans formulation', () => {
    expect(() =>
      creerEngagement({
        id: 'e1',
        formulation: '   ',
        classe: 'defi-ordinaire',
        paliers: [{ formulation: 'Test.' }],
        creeLe: '2026-01-01T00:00:00Z',
      }),
    ).toThrow(/engagement-sans-formulation/)
  })

  it('un palier doit etre confirme avant d’etre accompli', () => {
    let e = creerEngagement({
      id: 'e1',
      formulation: 'Test.',
      classe: 'defi-ordinaire',
      paliers: [{ formulation: 'P1' }],
      creeLe: '2026-01-01T00:00:00Z',
    })
    e = accomplirPalier(e, e.paliers[0].id, '2026-01-02T00:00:00Z')
    expect(e.paliers[0].accompliLe).toBeNull()
    e = confirmerPalier(e, e.paliers[0].id, '2026-01-02T00:00:00Z')
    e = accomplirPalier(e, e.paliers[0].id, '2026-01-02T00:01:00Z')
    expect(e.paliers[0].accompliLe).toBe('2026-01-02T00:01:00Z')
  })

  it('renoncer a un palier n’a aucun effet sur les autres', () => {
    let e = creerEngagement({
      id: 'e1',
      formulation: 'Test.',
      classe: 'defi-ordinaire',
      paliers: [{ formulation: 'P1' }, { formulation: 'P2' }],
      creeLe: '2026-01-01T00:00:00Z',
    })
    e = renoncerPalier(e, e.paliers[0].id, '2026-01-02T00:00:00Z')
    expect(e.paliers[0].renonceLe).not.toBeNull()
    expect(palierDisponible(e, e.paliers[1].id)).toBe(true)
    expect(palierDisponible(e, e.paliers[0].id)).toBe(false)
  })

  it('clore un engagement conserve la note du joueur', () => {
    const e = creerEngagement({
      id: 'e1',
      formulation: 'Test.',
      classe: 'defi-ordinaire',
      paliers: [],
      creeLe: '2026-01-01T00:00:00Z',
    })
    const ferme = cloreEngagement(e, 'Je me suis arrete la. Ca suffit.', '2026-01-02T00:00:00Z')
    expect(ferme.closLe).not.toBeNull()
    expect(ferme.noteDeCloture).toBe('Je me suis arrete la. Ca suffit.')
  })
})

describe('Le Constat', () => {
  it('est desactive par defaut', () => {
    expect(MEMOIRE_VIDE.reglagesConstat.actif).toBe(false)
  })

  it('ne produit rien quand il est inactif', () => {
    const m = MEMOIRE_VIDE
    expect(constatsVisibles(m, '2026-01-01T00:00:00Z')).toHaveLength(0)
  })

  it('produit un constat observable avec aveu d’ignorance', () => {
    const evenements = [
      {
        id: 'r1',
        type: 'refus' as const,
        operationId: 'op-a',
        propriete: 'une conversation avec une personne inconnue',
        ts: '2026-01-01T00:00:00Z',
      },
      {
        id: 'r2',
        type: 'refus' as const,
        operationId: 'op-b',
        propriete: 'une conversation avec une personne inconnue',
        ts: '2026-01-01T00:00:00Z',
      },
    ]
    const constats = produireConstats(evenements, '2026-01-01T00:00:00Z')
    expect(constats).toHaveLength(1)
    expect(constats[0].enonce).toContain('Tu as écarté 2 opérations')
    expect(constats[0].enonce).toContain('Je ne sais pas pourquoi')
  })

  it('compte les rappels en attente', () => {
    const evenements = [
      {
        id: 'ra1',
        type: 'rappel-en-attente' as const,
        operationId: 'op-a',
        propriete: 'geste',
        ts: '2026-01-01T00:00:00Z',
      },
    ]
    const constats = produireConstats(evenements, '2026-01-01T00:00:00Z')
    expect(constats).toHaveLength(1)
    expect(constats[0].enonce).toContain('1 savoir en attente de sa deuxième fois')
    expect(constats[0].enonce).toContain('Je ne sais pas quand tu voudras y revenir')
  })

  it('un constat rejete ne reapparait pas', () => {
    const m = {
      ...MEMOIRE_VIDE,
      reglagesConstat: activerConstat(MEMOIRE_VIDE.reglagesConstat),
      operationsRefusees: ['op-a', 'op-b'],
    }
    const avant = constatsVisibles(m, '2026-01-01T00:00:00Z')
    expect(avant).toHaveLength(1)
    const m2 = {
      ...m,
      reglagesConstat: rejeterConstat(m.reglagesConstat, avant[0].id),
    }
    expect(constatsVisibles(m2, '2026-01-01T00:00:00Z')).toHaveLength(0)
  })

  it('desactiver le Constat efface aussi son role dans la composition', () => {
    let r = activerConstat(MEMOIRE_VIDE.reglagesConstat)
    r = { ...r, alimenteLaComposition: true }
    r = desactiverConstat(r)
    expect(r.actif).toBe(false)
    expect(r.alimenteLaComposition).toBe(false)
  })
})
