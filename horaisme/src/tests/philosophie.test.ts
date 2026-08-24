import { describe, expect, it } from 'vitest'

import { angleMort } from '../content/operations/angle-mort'
import { CONTRE_HYPOTHESES } from '../content/operations'
import { FORMULES, HORA } from '../content/hora'
import {
  BOUCLE_HORA,
  FAMILLES,
  NE_PAS_CONFONDRE,
  PRINCIPES,
  PRINCIPE_CENTRAL,
  ROLES_HORA,
} from '../content/philosophie'
import { accepterPropositionExterne, verifierInventaire, verifierTexte } from '../engine/safety'
import { attribuerXp } from '../engine/progression'
import { creerPreuve } from '../engine/evidence'
import { datumCoherent, estAffichable, inconnu } from '../engine/provenance'
import { MEMOIRE_VIDE, abandonnerOperation, refuserOperation } from '../engine/memory'
import { etatInitial, peutAvancer, reduire } from '../engine/operation'
import type { Operation } from '../engine/types'

/**
 * Les principes canoniques de l'Horaïsme, exécutables.
 *
 * Un principe violé fait échouer la construction. Les garde-fous vivent ici et
 * dans le moteur, jamais uniquement dans un prompt.
 */

/* Le catalogue est volontairement redéclaré à plat : les tests ne doivent pas
   dépendre du filtrage appliqué au chargement, sinon une opération fautive
   disparaîtrait silencieusement au lieu de faire échouer la suite. */
const CATALOGUE_BRUT: readonly Operation[] = [angleMort]

describe('Le test des dix secondes est une donnée obligatoire', () => {
  it.each(CATALOGUE_BRUT)('« $titre » déclare pourquoi elle n’est pas évidente', (op) => {
    expect(op.dixSecondes.trim().length).toBeGreaterThan(20)
  })
})

describe('Une conclusion doit survivre à l’inventaire complet', () => {
  it.each(CATALOGUE_BRUT)('« $titre » confronte au moins deux lectures', (op) => {
    const inventaires = op.etapes.filter((e) => e.type === 'inventaire')
    expect(inventaires.length).toBeGreaterThan(0)
    for (const e of inventaires) expect(e.hypothesesMinimum ?? 0).toBeGreaterThanOrEqual(2)
  })

  it('refuse d’avancer avec une seule hypothèse', () => {
    let etat = etatInitial(angleMort)
    etat = reduire(etat, { type: 'etape-suivante', operation: angleMort })
    etat = reduire(etat, { type: 'ajouter-hypothese', enonce: 'Rue Saint-Jean', origine: 'joueur' })

    expect(peutAvancer(etat, angleMort)).toBe(false)

    etat = reduire(etat, { type: 'ajouter-hypothese', enonce: 'Côte de la Fabrique', origine: 'joueur' })
    expect(peutAvancer(etat, angleMort)).toBe(true)
  })

  it('signale un inventaire incomplet', () => {
    expect(verifierInventaire([], 2)).toHaveLength(1)
  })
})

describe('Une hypothèse reste une hypothèse', () => {
  it('retenir n’en fait pas un fait et n’en retient jamais deux', () => {
    let etat = etatInitial(angleMort)
    etat = reduire(etat, { type: 'ajouter-hypothese', enonce: 'Première', origine: 'joueur' })
    etat = reduire(etat, { type: 'ajouter-hypothese', enonce: 'Seconde', origine: 'hora' })

    const [a, b] = etat.hypotheses
    etat = reduire(etat, { type: 'retenir-hypothese', id: a.id })
    etat = reduire(etat, { type: 'retenir-hypothese', id: b.id })

    expect(etat.hypotheses.filter((h) => h.retenue)).toHaveLength(1)
    expect(etat.hypotheses.every((h) => 'retenue' in h && !('fait' in h))).toBe(true)
    expect(verifierInventaire(etat.hypotheses, 2)).toHaveLength(0)
  })

  it('laisse l’utilisateur corriger une hypothèse du système', () => {
    let etat = etatInitial(angleMort)
    etat = reduire(etat, { type: 'ajouter-hypothese', enonce: 'Version de HORA', origine: 'hora' })
    etat = reduire(etat, {
      type: 'corriger-hypothese',
      id: etat.hypotheses[0].id,
      enonce: 'Ma version',
    })
    expect(etat.hypotheses[0].enonce).toBe('Ma version')
  })
})

describe('Les XP reconnaissent une action vécue', () => {
  it('rejette une attribution sans preuve', () => {
    const { attribution, violations } = attribuerXp('angle-mort', 90, 'Sans rien', [])
    expect(attribution).toBeNull()
    expect(violations[0].regle).toBe('xp-sans-preuve')
  })

  it('accepte une attribution adossée à une observation réelle', () => {
    const preuve = creerPreuve('observation', 'La pierre est fendue sous le motif.')
    const { attribution, violations } = attribuerXp('angle-mort', 90, 'Constat sur place', [preuve])
    expect(violations).toHaveLength(0)
    expect(attribution?.montant).toBe(90)
  })

  it('n’expose aucun compteur de temps passé, de série ou de popularité', () => {
    const interdits = ['temps', 'duree', 'serie', 'streak', 'likes', 'classement', 'popularite']
    const cles = Object.keys(MEMOIRE_VIDE).map((c) =>
      c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(),
    )
    for (const mot of interdits) expect(cles.some((c) => c.includes(mot))).toBe(false)
  })
})

describe('Le positif véritable regarde le négatif en face', () => {
  it.each(CATALOGUE_BRUT)('« $titre » récompense un échec sincère', (op) => {
    const echec = op.bifurcations.find((b) => b.echecSincere)
    expect(echec).toBeDefined()
    expect(echec?.xp).toBeGreaterThan(0)
  })

  it.each(CATALOGUE_BRUT)('« $titre » offre plusieurs suites réelles', (op) => {
    expect(op.bifurcations.length).toBeGreaterThanOrEqual(2)
  })
})

describe('La technologie s’efface', () => {
  it.each(CATALOGUE_BRUT)('« $titre » fait quitter l’écran puis revenir au réel', (op) => {
    expect(op.etapes.some((e) => e.type === 'sortie' && e.modePoche === true)).toBe(true)
    expect(op.etapes.some((e) => e.type === 'ancrage')).toBe(true)
  })
})

describe('L’utilisateur reste souverain', () => {
  it('refuser une opération ne retire aucun XP', () => {
    const avant = { ...MEMOIRE_VIDE, xpTotal: 250 }
    expect(refuserOperation(avant, 'angle-mort').xpTotal).toBe(250)
  })

  it('abandonner ne brise aucune série et ne coûte rien', () => {
    const avant = { ...MEMOIRE_VIDE, xpTotal: 250 }
    const apres = abandonnerOperation(avant, 'angle-mort')
    expect(apres.xpTotal).toBe(250)
    expect(apres.operationsAbandonnees).toContain('angle-mort')
  })
})

describe('HORA a le droit de dire qu’il ne sait pas', () => {
  it('un datum inconnu n’affiche aucune valeur de remplacement', () => {
    const d = inconnu<string>('Météo')
    expect(d.valeur).toBeNull()
    expect(estAffichable(d)).toBe(false)
    expect(datumCoherent(d)).toBe(true)
  })
})

describe('Aucune parole d’oracle, de devin ou de thérapeute', () => {
  const CORPUS: readonly string[] = [
    ...Object.values(FORMULES),
    ...Object.values(HORA),
    PRINCIPE_CENTRAL,
    ...NE_PAS_CONFONDRE,
    ...ROLES_HORA.est,
    ...ROLES_HORA.nEstPas,
    ...PRINCIPES.flatMap((p) => [p.enonce, p.consequenceTechnique]),
    ...BOUCLE_HORA.flatMap((e) => [e.nom, e.corps]),
    ...FAMILLES.flatMap((f) => [f.nom, f.corps]),
    ...Object.values(CONTRE_HYPOTHESES).flat(),
  ]

  it('le corpus de contenu ne contient aucune formulation interdite', () => {
    const fautifs = CORPUS.flatMap((t) => verifierTexte(t))
    expect(fautifs).toEqual([])
  })

  it.each(CATALOGUE_BRUT)('« $titre » franchit tous les garde-fous', (op) => {
    const { acceptee, violations } = accepterPropositionExterne(op)
    expect(violations).toEqual([])
    expect(acceptee).toBe(true)
  })

  it('intercepte bien une formulation prédictive', () => {
    expect(verifierTexte('Je te prédis une belle rencontre.').length).toBeGreaterThan(0)
    expect(verifierTexte('Ne perds pas ta série de 12 jours.').length).toBeGreaterThan(0)
  })
})
