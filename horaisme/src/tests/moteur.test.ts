import { describe, expect, it } from 'vitest'

import { assemblerContexte, coucherDuSoleil, distanceMetres, POSITION_DEMO, SOURCES_PAR_DEFAUT, saisonDe } from '../engine/context'
import { compositeurDeterministe } from '../engine/composition'
import { MEMOIRE_VIDE, confronterAuReel, inscrireAuRegistre } from '../engine/memory'
import { datumCoherent, plausible } from '../engine/provenance'
import { niveauPour } from '../engine/progression'
import { angleMort } from '../content/operations/angle-mort'

const MAINTENANT = new Date('2026-05-15T14:00:00-04:00')

function contexteDeBase(rayon: number | null = 1500) {
  return assemblerContexte({
    maintenant: MAINTENANT,
    position: null,
    positionAutorisee: false,
    rayonDeclareMetres: rayon,
    sources: SOURCES_PAR_DEFAUT,
  })
}

describe('Contexte', () => {
  it('marque la position de repli comme simulée, jamais comme un fait', () => {
    const c = contexteDeBase()
    expect(c.coordonnees.statut).toBe('simule')
    expect(c.zone.statut).toBe('simule')
  })

  it('répond « inconnu » pour la météo, faute de source branchée', () => {
    const c = contexteDeBase()
    expect(c.meteo.statut).toBe('inconnu')
    expect(c.meteo.valeur).toBeNull()
  })

  it('classe la lumière restante comme plausible, pas comme un fait', () => {
    const c = contexteDeBase()
    expect(c.minutesDeLumiere.statut).toBe('plausible')
    expect(c.minutesDeLumiere.valeur).toBeGreaterThan(0)
  })

  it('rend chaque datum cohérent avec son statut', () => {
    const c = contexteDeBase()
    for (const d of Object.values(c)) expect(datumCoherent(d)).toBe(true)
  })

  it('renvoie « inconnu » dès qu’une source est coupée', () => {
    const sources = SOURCES_PAR_DEFAUT.map((s) =>
      s.id === 'saison' ? { ...s, active: false } : s,
    )
    const c = assemblerContexte({
      maintenant: MAINTENANT,
      position: null,
      positionAutorisee: false,
      rayonDeclareMetres: 1500,
      sources,
    })
    expect(c.saison.statut).toBe('inconnu')
  })

  it('calcule un coucher de soleil plausible pour Québec en mai', () => {
    const coucher = coucherDuSoleil(MAINTENANT, POSITION_DEMO.lat, POSITION_DEMO.lon)
    const minutesRestantes = (coucher.valueOf() - MAINTENANT.valueOf()) / 60_000
    /* Le 15 mai à 14 h, Québec se couche autour de 20 h 15 heure locale. */
    expect(minutesRestantes).toBeGreaterThan(300)
    expect(minutesRestantes).toBeLessThan(450)
  })

  it('déduit la saison de la date', () => {
    expect(saisonDe(new Date('2026-01-10T12:00:00Z'))).toBe('Hiver')
    expect(saisonDe(new Date('2026-07-10T12:00:00Z'))).toBe('Été')
  })

  it('mesure une distance cohérente', () => {
    const d = distanceMetres(POSITION_DEMO, { lat: 46.8129, lon: -71.2035 })
    expect(d).toBeGreaterThan(100)
    expect(d).toBeLessThan(1500)
  })
})

describe('Composition', () => {
  it('propose l’opération et sait dire pourquoi', () => {
    const r = compositeurDeterministe.composer({
      contexte: contexteDeBase(),
      memoire: MEMOIRE_VIDE,
      catalogue: [angleMort],
    })
    expect(r.propositions).toHaveLength(1)
    expect(r.propositions[0].raisons.length).toBeGreaterThan(0)
    for (const raison of r.propositions[0].raisons) {
      expect(raison.enonce.trim()).not.toBe('')
      expect(raison.source).toBeTruthy()
    }
  })

  it('écarte ce qui dépasse le rayon déclaré, en le disant', () => {
    const r = compositeurDeterministe.composer({
      contexte: contexteDeBase(500),
      memoire: MEMOIRE_VIDE,
      catalogue: [angleMort],
    })
    expect(r.propositions).toHaveLength(0)
    expect(r.ecartees[0].motif).toContain('500')
  })

  it('n’insiste jamais sur une opération écartée par le joueur', () => {
    const r = compositeurDeterministe.composer({
      contexte: contexteDeBase(),
      memoire: { ...MEMOIRE_VIDE, operationsRefusees: ['angle-mort'] },
      catalogue: [angleMort],
    })
    expect(r.propositions).toHaveLength(0)
  })

  it('offre toujours « rien aujourd’hui »', () => {
    const r = compositeurDeterministe.composer({
      contexte: contexteDeBase(),
      memoire: MEMOIRE_VIDE,
      catalogue: [angleMort],
    })
    expect(r.rienAujourdhui.length).toBeGreaterThan(0)
  })
})

describe('Registre', () => {
  it('conserve le statut initial puis le verdict du réel', () => {
    const supposition = plausible('Le détail est encore là.', 'Composition', 'Non vérifié.')
    let m = inscrireAuRegistre(MEMOIRE_VIDE, 'angle-mort', supposition)
    expect(m.registre[0].statutInitial).toBe('plausible')
    expect(m.registre[0].verdictReel).toBeNull()

    m = confronterAuReel(m, m.registre[0].id, 'Repeint, mais présent.')
    expect(m.registre[0].verdictReel).toBe('Repeint, mais présent.')
    expect(m.registre[0].statutInitial).toBe('plausible')
  })
})

describe('Progression', () => {
  it('démarre à Passant et progresse par paliers', () => {
    expect(niveauPour(0).titre).toBe('Passant')
    expect(niveauPour(150).rang).toBe(2)
    expect(niveauPour(999_999).xpPourLeSuivant).toBeNull()
  })
})
