import { describe, expect, it } from 'vitest'
import {
  verifierCadreEnjeu,
  verifierCadreSavoir,
  verifierCadreTiers,
  verifierConstat,
  verifierEngagement,
  verifierNonSubstitution,
  verifierOperation,
  verifierTransmetteur,
} from '../engine/safety'
import {
  type Engagement,
  type Operation,
  type Palier,
  type Transmetteur,
} from '../engine/types'

function baseOp(partial: Partial<Operation> = {}): Operation {
  return {
    id: 'test',
    famille: 'operation',
    thematique: 'action',
    titre: 'Test',
    kicker: 'Test',
    promesse: 'Test',
    intention: 'Test',
    dixSecondes: 'Test',
    dureeMinutes: [10, 20],
    distanceMetres: [100, 200],
    niveauPhysique: 'marche-douce',
    accessibilite: 'Test',
    materiel: [],
    risques: [],
    conditionsAbandon: [],
    declencheurs: [],
    indices: { localisation: [], securite: [] },
    propositions: [],
    etapes: [],
    bifurcations: [],
    consequences: { terrain: 'Test', registre: 'Test' },
    ...partial,
  } as Operation
}

describe('Souveraineté des champs', () => {
  it('rejette un champ de joueur pré-rempli par HORA', () => {
    const op = baseOp({
      etapes: [
        {
          id: 'souvenir',
          type: 'ancrage',
          titre: 'Souvenir',
          corps: 'Écris ce que tu retiens.',
          saisie: {
            champ: 'souvenir',
            invite: 'Qu’est-ce que tu retiens ?',
            valeurPreRemplie: 'Quelque chose' as unknown as null, // interdit
          },
        },
      ],
    })
    const v = verifierNonSubstitution(op)
    expect(v.some((x) => x.regle === 'substitution')).toBe(true)
  })

  it('accepte une invite et des exemples sur un champ souverain', () => {
    const op = baseOp({
      etapes: [
        {
          id: 'souvenir',
          type: 'ancrage',
          titre: 'Souvenir',
          corps: 'Écris ce que tu retiens.',
          saisie: {
            champ: 'souvenir',
            invite: 'Qu’est-ce que tu retiens de cette rencontre, en deux phrases ?',
            valeurPreRemplie: null,
            exemples: ['Exemple A', 'Exemple B'],
          },
        },
      ],
    })
    expect(verifierNonSubstitution(op)).toHaveLength(0)
  })

  it('rejette un seul exemple, qui est une réponse déguisée', () => {
    const op = baseOp({
      etapes: [
        {
          id: 'souvenir',
          type: 'ancrage',
          titre: 'Souvenir',
          corps: 'Écris.',
          saisie: {
            champ: 'souvenir',
            invite: 'Qu’est-ce que tu retiens ?',
            valeurPreRemplie: null,
            exemples: ['Seule réponse attendue'],
          },
        },
      ],
    })
    const v = verifierNonSubstitution(op)
    expect(v.some((x) => x.regle === 'exemple-unique')).toBe(true)
  })

  it('rejette une invite trop courte sur un champ souverain', () => {
    const op = baseOp({
      etapes: [
        {
          id: 'souvenir',
          type: 'ancrage',
          titre: 'Souvenir',
          corps: 'Écris.',
          saisie: {
            champ: 'souvenir',
            invite: 'Dis.',
            valeurPreRemplie: null,
          },
        },
      ],
    })
    const v = verifierNonSubstitution(op)
    expect(v.some((x) => x.regle === 'invite-absente')).toBe(true)
  })
})

describe('Boss et engagements autodéterminés', () => {
  function palier(p: Partial<Palier> = {}): Palier {
    return {
      id: 'p1',
      ordre: 1,
      formulation: 'Dis bonjour au voisin.',
      reversible: true,
      difficulte: { physique: 0, social: 1, emotionnel: 0 },
      confirmeLe: null,
      accompliLe: null,
      renonceLe: null,
      ...p,
    }
  }

  it('une opération boss sans cadre d’enjeu est rejetée', () => {
    const op = baseOp({ famille: 'boss', thematique: 'boss' })
    const v = verifierCadreEnjeu(op)
    expect(v.some((x) => x.regle === 'enjeu-non-declare')).toBe(true)
  })

  it('un engagement hors cadre ne produit aucun palier', () => {
    const e: Engagement = {
      id: 'e1',
      formulationDuJoueur: 'Je veux arrêter de fuir les foules.',
      origine: 'joueur',
      classe: 'hors-cadre',
      paliers: [palier()],
      creeLe: '2026-01-01T00:00:00Z',
      closLe: null,
      noteDeCloture: null,
    }
    expect(verifierEngagement(e).some((x) => x.regle === 'paliers-hors-cadre')).toBe(true)
  })

  it('un engagement doit porter les mots du joueur', () => {
    const e: Engagement = {
      id: 'e1',
      formulationDuJoueur: '  ',
      origine: 'joueur',
      classe: 'defi-ordinaire',
      paliers: [palier()],
      creeLe: '2026-01-01T00:00:00Z',
      closLe: null,
      noteDeCloture: null,
    }
    expect(verifierEngagement(e).some((x) => x.regle === 'engagement-sans-formulation')).toBe(true)
  })

  it('un palier irréversible est rejeté', () => {
    const e: Engagement = {
      id: 'e1',
      formulationDuJoueur: 'Test.',
      origine: 'joueur',
      classe: 'defi-ordinaire',
      paliers: [{ ...palier(), reversible: false as unknown as true }],
      creeLe: '2026-01-01T00:00:00Z',
      closLe: null,
      noteDeCloture: null,
    }
    expect(verifierEngagement(e).some((x) => x.regle === 'palier-irreversible')).toBe(true)
  })

  it('un palier accompli sans confirmation au moment de l’exécuter est une escalade automatique', () => {
    const e: Engagement = {
      id: 'e1',
      formulationDuJoueur: 'Test.',
      origine: 'joueur',
      classe: 'defi-ordinaire',
      paliers: [{ ...palier(), accompliLe: '2026-01-02T00:00:00Z' }],
      creeLe: '2026-01-01T00:00:00Z',
      closLe: null,
      noteDeCloture: null,
    }
    expect(verifierEngagement(e).some((x) => x.regle === 'escalade-automatique')).toBe(true)
  })

  it('deux paliers au même rang sont ambigus', () => {
    const e: Engagement = {
      id: 'e1',
      formulationDuJoueur: 'Test.',
      origine: 'joueur',
      classe: 'defi-ordinaire',
      paliers: [palier({ id: 'p1', ordre: 1 }), palier({ id: 'p2', ordre: 1 })],
      creeLe: '2026-01-01T00:00:00Z',
      closLe: null,
      noteDeCloture: null,
    }
    expect(verifierEngagement(e).some((x) => x.regle === 'paliers-ambigus')).toBe(true)
  })

  it('un défi ordinaire est accepté', () => {
    const op = baseOp({
      famille: 'boss',
      thematique: 'boss',
      enjeu: {
        classe: 'defi-ordinaire',
        difficulte: { physique: 1, social: 1, emotionnel: 0 },
        arretImmediat: 'Arrête immédiatement si tu te sens mal à l’aise.',
        nonPrise: 'Cette opération n’est pas un traitement.',
      },
    })
    expect(verifierCadreEnjeu(op)).toHaveLength(0)
  })

  it('un enjeu sensible ne peut pas monter l’émotionnel à 3', () => {
    const op = baseOp({
      famille: 'boss',
      thematique: 'boss',
      enjeu: {
        classe: 'enjeu-sensible',
        difficulte: { physique: 0, social: 0, emotionnel: 3 },
        arretImmediat: 'Arrête immédiatement.',
        nonPrise: 'Pas un traitement.',
      },
    })
    expect(verifierCadreEnjeu(op).some((x) => x.regle === 'enjeu-sensible-trop-exigeant')).toBe(true)
  })

  it('un arrêt immédiat trop court est rejeté', () => {
    const op = baseOp({
      famille: 'boss',
      thematique: 'boss',
      enjeu: {
        classe: 'defi-ordinaire',
        difficulte: { physique: 0, social: 0, emotionnel: 0 },
        arretImmediat: 'Stop.',
        nonPrise: 'Pas un traitement.',
      },
    })
    expect(verifierCadreEnjeu(op).some((x) => x.regle === 'arret-immediat-absent')).toBe(true)
  })

  it('une non-prise trop courte est rejetée', () => {
    const op = baseOp({
      famille: 'boss',
      thematique: 'boss',
      enjeu: {
        classe: 'defi-ordinaire',
        difficulte: { physique: 0, social: 0, emotionnel: 0 },
        arretImmediat: 'Arrêtez immédiatement si vous vous sentez mal.',
        nonPrise: 'Non.',
      },
    })
    expect(verifierCadreEnjeu(op).some((x) => x.regle === 'non-prise-absente')).toBe(true)
  })

  it('hors-cadre est toujours rejeté comme quête d’exposition', () => {
    const op = baseOp({
      famille: 'boss',
      thematique: 'boss',
      enjeu: {
        classe: 'hors-cadre',
        difficulte: { physique: 0, social: 0, emotionnel: 0 },
        arretImmediat: 'Arrêtez immédiatement et contactez un professionnel.',
        nonPrise: 'HORA ne traite pas cela.',
      },
    })
    expect(verifierCadreEnjeu(op).some((x) => x.regle === 'enjeu-hors-cadre')).toBe(true)
  })
})

describe('Le tiers humain', () => {
  it('un tiers anonyme par défaut est accepté', () => {
    const op = baseOp({
      tiers: {
        anonymeParDefaut: true,
        donneesFacultatives: [],
        formuleDeConsentement:
          'Je note ce que vous m’avez appris sans votre nom ni votre visage. Pouvez-vous me le transmettre ?',
        siRefus: 'Si vous préférez ne pas, je remercie et je m’en vais.',
      },
    })
    expect(verifierCadreTiers(op)).toHaveLength(0)
  })

  it('un tiers non anonyme par défaut est rejeté', () => {
    const op = baseOp({
      tiers: {
        anonymeParDefaut: false as unknown as true,
        donneesFacultatives: [],
        formuleDeConsentement: '...',
        siRefus: '...',
      },
    })
    expect(verifierCadreTiers(op).some((x) => x.regle === 'tiers-non-anonyme-par-defaut')).toBe(true)
  })

  it('une formule de consentement trop courte est rejetée', () => {
    const op = baseOp({
      tiers: {
        anonymeParDefaut: true,
        donneesFacultatives: [],
        formuleDeConsentement: 'OK ?',
        siRefus: 'Merci quand même.',
      },
    })
    expect(verifierCadreTiers(op).some((x) => x.regle === 'consentement-non-formule')).toBe(true)
  })

  it('un refus du tiers non prévu est rejeté', () => {
    const op = baseOp({
      tiers: {
        anonymeParDefaut: true,
        donneesFacultatives: [],
        formuleDeConsentement:
          'Je note ce que vous m’avez appris sans votre nom. Pouvez-vous me le transmettre ?',
        siRefus: 'OK.',
      },
    })
    expect(verifierCadreTiers(op).some((x) => x.regle === 'refus-du-tiers-non-prevu')).toBe(true)
  })

  it('un consentement ambigu — même donnée demandée deux fois — est rejeté', () => {
    const op = baseOp({
      tiers: {
        anonymeParDefaut: true,
        donneesFacultatives: ['nom', 'nom'],
        formuleDeConsentement:
          'Je note ce que vous m’avez appris sans votre nom. Pouvez-vous me le transmettre ?',
        siRefus: 'Si vous préférez ne pas, je remercie et je m’en vais.',
      },
    })
    expect(verifierCadreTiers(op).some((x) => x.regle === 'consentement-ambigu')).toBe(true)
  })

  it('une attribution sans consentement nom vivant est rejetée', () => {
    const t: Transmetteur = {
      id: 't1',
      anonyme: false,
      consentements: [],
      attribution: 'M. Dubois',
    }
    expect(verifierTransmetteur(t).some((x) => x.regle === 'attribution-sans-consentement')).toBe(true)
  })

  it('un transmetteur anonyme ne peut porter de nom', () => {
    const t: Transmetteur = {
      id: 't1',
      anonyme: true,
      consentements: [
        { donnee: 'nom', accorde: true, obtenuLe: '2026-01-01', revoqueLe: null },
      ],
      attribution: 'M. Dubois',
    }
    expect(verifierTransmetteur(t).some((x) => x.regle === 'anonymat-contredit')).toBe(true)
  })

  it('une position domiciliaire est rejetée', () => {
    const t: Transmetteur = {
      id: 't1',
      anonyme: false,
      consentements: [
        {
          donnee: 'position',
          accorde: true,
          obtenuLe: '2026-01-01',
          revoqueLe: null,
          lieuPublic: false,
        },
      ],
      attribution: null,
    }
    expect(verifierTransmetteur(t).some((x) => x.regle === 'position-domiciliaire')).toBe(true)
  })
})

describe('La deuxième fois', () => {
  it('une opération de savoir doit justifier sa fenêtre', () => {
    const op = baseOp({
      savoir: {
        categorie: 'geste',
        fenetreMinimaleJours: 3,
        justificationFenetre: ' Court.',
        formesDePreuve: ['reproduction-geste'],
      },
      etapes: [
        {
          id: 'rappel',
          type: 'ancrage',
          titre: 'Rappel',
          corps: 'Reproduis le geste de mémoire.',
          saisie: {
            champ: 'savoir-recu',
            invite: 'Comment faisait-on ce geste ?',
            valeurPreRemplie: null,
          },
        },
      ],
    })
    expect(verifierCadreSavoir(op).some((x) => x.regle === 'fenetre-injustifiee')).toBe(true)
  })

  it('une fenêtre de moins d’un jour est rejetée', () => {
    const op = baseOp({
      savoir: {
        categorie: 'geste',
        fenetreMinimaleJours: 0,
        justificationFenetre: 'Un geste simple peut être vérifié le jour même.',
        formesDePreuve: ['reproduction-geste'],
      },
      etapes: [
        {
          id: 'rappel',
          type: 'ancrage',
          titre: 'Rappel',
          corps: 'Reproduis le geste de mémoire.',
          saisie: {
            champ: 'savoir-recu',
            invite: 'Comment faisait-on ce geste ?',
            valeurPreRemplie: null,
          },
        },
      ],
    })
    expect(verifierCadreSavoir(op).some((x) => x.regle === 'fenetre-nulle')).toBe(true)
  })

  it('une opération de savoir doit exiger une forme de preuve', () => {
    const op = baseOp({
      savoir: {
        categorie: 'geste',
        fenetreMinimaleJours: 3,
        justificationFenetre:
          'Un geste moteur commence à se dégrader après quelques jours sans répétition.',
        formesDePreuve: [],
      },
      etapes: [
        {
          id: 'rappel',
          type: 'ancrage',
          titre: 'Rappel',
          corps: 'Reproduis le geste de mémoire.',
          saisie: {
            champ: 'savoir-recu',
            invite: 'Comment faisait-on ce geste ?',
            valeurPreRemplie: null,
          },
        },
      ],
    })
    expect(verifierCadreSavoir(op).some((x) => x.regle === 'preuve-de-rappel-absente')).toBe(true)
  })
})

describe('Le Constat', () => {
  it('un constat sans événement est rejeté', () => {
    const c = {
      id: 'c1',
      categorie: 'ecart-thematique' as const,
      enonce: 'Tu as écarté quatre opérations. Je ne sais pas pourquoi.',
      evenementIds: [],
      produitLe: '2026-01-01T00:00:00Z',
    }
    expect(verifierConstat(c).some((x) => x.regle === 'constat-sans-evenement')).toBe(true)
  })

  it('un constat sans aveu d’ignorance est rejeté', () => {
    const c = {
      id: 'c1',
      categorie: 'ecart-thematique' as const,
      enonce: 'Tu as écarté quatre opérations.',
      evenementIds: ['e1', 'e2'],
      produitLe: '2026-01-01T00:00:00Z',
    }
    expect(verifierConstat(c).some((x) => x.regle === 'constat-sans-aveu')).toBe(true)
  })

  it('un constat correct est accepté', () => {
    const c = {
      id: 'c1',
      categorie: 'ecart-thematique' as const,
      enonce:
        'Tu as écarté quatre opérations qui comportaient une conversation avec une personne inconnue. Je ne sais pas pourquoi.',
      evenementIds: ['e1', 'e2', 'e3', 'e4'],
      produitLe: '2026-01-01T00:00:00Z',
    }
    expect(verifierConstat(c)).toHaveLength(0)
  })

  it('rejette les formulations interprétatives', () => {
    const phrases = [
      'Tu évites les inconnus.',
      'Tu sembles anxieux.',
      'Tu as peur du rejet.',
      'Ce comportement révèle une tendance.',
    ]
    for (const p of phrases) {
      const op = baseOp({ dixSecondes: p })
      expect(verifierOperation(op).some((x) => x.regle === 'interpretation-de-comportement')).toBe(true)
    }
  })
})
