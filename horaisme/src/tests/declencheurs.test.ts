import { describe, expect, it } from 'vitest'

import { angleMort } from '../content/operations/angle-mort'
import { compositeurDeterministe } from '../engine/composition'
import { fait, inconnu, plausible } from '../engine/provenance'
import { accepterPropositionExterne } from '../engine/safety'
import { evaluerDeclencheur, evaluerDeclencheurs } from '../engine/triggers'
import { MEMOIRE_VIDE } from '../engine/memory'
import type { Contexte, Declencheur, Operation } from '../engine/types'

/**
 * Couche 2 — déclencheurs contextuels et modèle d'opération enrichi.
 *
 * La règle que ces tests protègent tient en une phrase : l'absence de donnée
 * n'est jamais une donnée contraire.
 */

function contexte(partiel: Partial<Contexte> = {}): Contexte {
  return {
    heureLocale: fait('13:00', 'horloge', 'Horloge de l’appareil.'),
    minutesDeLumiere: fait(300, 'lumiere', 'Calcul solaire local.'),
    meteo: fait('ciel dégagé', 'meteo', 'Observation.'),
    temperature: fait(18, 'meteo', 'Observation.'),
    saison: fait('printemps', 'saison', 'Date du jour.'),
    zone: plausible('Vieux-Québec', 'position', 'Déduit de la position approximative.'),
    coordonnees: fait({ lat: 46.81, lon: -71.21 }, 'position', 'Position déclarée.'),
    rayonMobiliteMetres: fait(2_000, 'mobilite', 'Rayon déclaré par le joueur.'),
    ...partiel,
  }
}

function composer(c: Contexte) {
  return compositeurDeterministe.composer({
    contexte: c,
    memoire: MEMOIRE_VIDE,
    catalogue: [angleMort],
  })
}

/* ------------------------------------------------------------------ */
/* Ce qui compte le plus : l'indétermination                           */
/* ------------------------------------------------------------------ */

describe('Une donnée manquante ne vaut pas une donnée contraire', () => {
  const exigeSoleil: Declencheur = {
    type: 'meteo-requise',
    valeurs: ['dégagé', 'soleil'],
    raison: 'Le phénomène ne se voit qu’avec du soleil.',
  }

  it('météo inconnue rend le déclencheur indéterminé, jamais non satisfait', () => {
    const e = evaluerDeclencheur(exigeSoleil, contexte({ meteo: inconnu('meteo', 'Aucune source branchée.') }))
    expect(e.issue).toBe('indetermine')
    expect(e.issue).not.toBe('non-satisfait')
  })

  it('l’explication dit « je ne sais pas », pas « ce n’est pas le cas »', () => {
    const e = evaluerDeclencheur(exigeSoleil, contexte({ meteo: inconnu('meteo', 'Rien.') }))
    expect(e.explication).toMatch(/je ne sais pas/i)
    expect(e.explication).not.toMatch(/il fait/i)
  })

  it('météo réellement contraire, elle, tranche', () => {
    const e = evaluerDeclencheur(exigeSoleil, contexte({ meteo: fait('pluie', 'meteo', 'Observation.') }))
    expect(e.issue).toBe('non-satisfait')
  })

  it('un déclencheur exclusif ne s’active pas sur une météo inconnue', () => {
    const exclut: Declencheur = {
      type: 'meteo-exclue',
      valeurs: ['orage'],
      raison: 'Aucune opération extérieure pendant un orage.',
    }
    expect(evaluerDeclencheur(exclut, contexte({ meteo: inconnu('meteo', 'Rien.') })).issue).toBe(
      'indetermine',
    )
  })
})

describe('L’issue globale hiérarchise les trois cas', () => {
  function op(declencheurs: readonly Declencheur[]): Operation {
    return { ...angleMort, declencheurs }
  }

  const soleil: Declencheur = {
    type: 'meteo-requise',
    valeurs: ['dégagé'],
    raison: 'Le phénomène demande du soleil.',
  }
  const froid: Declencheur = {
    type: 'temperature-max',
    celsius: 0,
    raison: 'Ce phénomène n’apparaît que sous zéro.',
  }

  it('une condition démentie prime sur une condition invérifiable', () => {
    const c = contexte({ meteo: inconnu('meteo', 'Rien.'), temperature: fait(20, 'meteo', 'Observation.') })
    expect(evaluerDeclencheurs(op([soleil, froid]), c).issue).toBe('non-satisfait')
  })

  it('un seul indéterminé suffit à rendre l’ensemble indéterminé', () => {
    const c = contexte({ meteo: inconnu('meteo', 'Rien.'), temperature: fait(-5, 'meteo', 'Observation.') })
    const e = evaluerDeclencheurs(op([soleil, froid]), c)
    expect(e.issue).toBe('indetermine')
    expect(e.indetermines).toHaveLength(1)
    expect(e.satisfaits).toHaveLength(1)
  })

  it('une opération sans déclencheur est satisfaite par défaut', () => {
    expect(evaluerDeclencheurs(op([]), contexte()).issue).toBe('satisfait')
  })
})

describe('Le compositeur distingue écarter et ne pas savoir', () => {
  
  it('une opération dont la condition est démentie est écartée avec son motif', () => {
    const nuit = contexte({ minutesDeLumiere: fait(5, 'lumiere', 'Le soleil est couché.') })
    const r = composer(nuit)
    expect(r.propositions).toHaveLength(0)
    expect(r.ecartees[0].motif).toContain('lumière')
  })

  it('une opération dont la condition est invérifiable reste proposée, avec réserve', () => {
    const sansLumiere = contexte({
      minutesDeLumiere: inconnu('lumiere', 'Position refusée, calcul solaire impossible.'),
    })
    const r = composer(sansLumiere)
    expect(r.propositions).toHaveLength(1)
    expect(r.propositions[0].reserves).toHaveLength(1)
    expect(r.propositions[0].reserves[0].explication).toMatch(/je ne sais pas/i)
  })

  it('conditions réunies, l’opération est proposée sans réserve', () => {
    const r = composer(contexte())
    expect(r.propositions).toHaveLength(1)
    expect(r.propositions[0].reserves).toHaveLength(0)
    expect(r.propositions[0].raisons.length).toBeGreaterThan(0)
  })

  it('le filtre de mobilité lit le bout le plus éloigné du terrain', () => {
    const court = contexte({ rayonMobiliteMetres: fait(500, 'mobilite', 'Rayon déclaré.') })
    const r = composer(court)
    expect(r.propositions).toHaveLength(0)
    expect(r.ecartees[0].motif).toContain('900')
  })
})

/* ------------------------------------------------------------------ */
/* Champs devenus obligatoires                                         */
/* ------------------------------------------------------------------ */

describe('Une opération doit se déclarer entièrement', () => {
  function violationsDe(patch: Partial<Operation>): string[] {
    return accepterPropositionExterne({ ...angleMort, ...patch }).violations.map((v) => v.regle)
  }

  it('sans intention déclarée, elle est rejetée', () => {
    expect(violationsDe({ intention: 'Bof.' })).toContain('intention-absente')
  })

  it('sans condition d’abandon, elle est rejetée', () => {
    expect(violationsDe({ conditionsAbandon: [] })).toContain('abandon-non-prevu')
  })

  it('sans accessibilité déclarée, elle est rejetée', () => {
    expect(violationsDe({ accessibilite: '' })).toContain('accessibilite-non-declaree')
  })

  it('sans conséquences sur le Terrain et le Registre, elle est rejetée', () => {
    expect(violationsDe({ consequences: { terrain: '', registre: 'x' } })).toContain(
      'consequences-absentes',
    )
  })

  it('une plage de distance inversée est rejetée', () => {
    expect(violationsDe({ distanceMetres: [900, 200] })).toContain('distance-incoherente')
  })

  it('une plage de durée inversée est rejetée', () => {
    expect(violationsDe({ dureeMinutes: [60, 25] })).toContain('duree-incoherente')
  })

  it('un déclencheur sans raison lisible est rejeté', () => {
    expect(
      violationsDe({ declencheurs: [{ type: 'lumiere-minimum', minutes: 45, raison: 'oui' }] }),
    ).toContain('declencheur-sans-raison')
  })

  it('« L’angle mort » satisfait toutes ces exigences', () => {
    const { acceptee, violations } = accepterPropositionExterne(angleMort)
    expect(violations).toEqual([])
    expect(acceptee).toBe(true)
  })
})

describe('Les textes des indices sont soumis aux mêmes interdits', () => {
  it('une formulation d’oracle glissée dans un indice est rejetée', () => {
    const op: Operation = {
      ...angleMort,
      indices: {
        ...angleMort.indices,
        localisation: [
          ...angleMort.indices.localisation,
          { cran: 'zone', texte: 'Je sais ce que tu penses en ce moment.' },
        ],
      },
    }
    expect(accepterPropositionExterne(op).acceptee).toBe(false)
  })
})

describe('Chaque opération porte une thématique', () => {
  it('« L’angle mort » relève de la perception', () => {
    expect(angleMort.thematique).toBe('perception')
  })
})
