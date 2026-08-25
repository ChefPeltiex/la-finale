import { describe, expect, it, vi } from 'vitest'

import {
  appelsRestants,
  carteDeCouverture,
  etatVierge,
  interroger,
  niveauDeCouverture,
  phraseCouverture,
  plafonner,
  type Connecteur,
} from '../engine/connectors'
import {
  MAILLE_PUBLIABLE_METRES,
  aPurger,
  arrondirPosition,
  positionPour,
  positionPubliable,
  purger,
  reglagesParDefaut,
  type PositionPrivee,
  type ReglagesConfidentialite,
} from '../engine/privacy'

/**
 * Couche 4 — fondations des connecteurs et confidentialité de localisation.
 *
 * Deux refus protégés ici : une panne ne devient jamais une affirmation, et
 * zéro résultat ne devient jamais zéro phénomène.
 */

const MAINTENANT = new Date('2026-08-24T12:00:00Z')
const ZONE = arrondirPosition({ lat: 46.81392, lon: -71.20811 }, 500)

function connecteur(partiel: Partial<Connecteur<string>> = {}): Connecteur<string> {
  return {
    id: 'meteo',
    nom: 'Source de test',
    licence: 'Licence de test',
    clefRequise: false,
    statutMaximal: 'fait',
    ttlMs: 60_000,
    timeoutMs: 200,
    quotaParJour: 3,
    mailleMetres: 500,
    limitesConnues: ['Ne couvre que les relevés versés volontairement.'],
    repli: 'Sans réponse, la donnée reste inconnue.',
    precisionSpatialeMetres: 500,
    precisionTemporelle: '30 derniers jours',
    interroger: async () => ['a', 'b'],
    ...partiel,
  }
}

/* ------------------------------------------------------------------ */
/* Plafond de statut                                                   */
/* ------------------------------------------------------------------ */

describe('Un connecteur ne peut pas dépasser son plafond', () => {
  it('le plafond abaisse un statut trop ambitieux', () => {
    expect(plafonner('fait', 'plausible')).toBe('plausible')
    expect(plafonner('fait', 'simule')).toBe('simule')
  })

  it('il n’élève jamais un statut', () => {
    expect(plafonner('inconnu', 'fait')).toBe('inconnu')
    expect(plafonner('plausible', 'fait')).toBe('plausible')
  })

  it('une source d’observations passées ne rend jamais un fait', async () => {
    const inat = connecteur({ statutMaximal: 'plausible' })
    const r = await interroger(inat, { zone: ZONE, rayonMetres: 1_000 }, etatVierge(), MAINTENANT)
    expect(r.donnees).toHaveLength(2)
    expect(r.statut).toBe('plausible')
  })
})

/* ------------------------------------------------------------------ */
/* Une panne ne devient jamais une affirmation                         */
/* ------------------------------------------------------------------ */

describe('Aucune défaillance ne se transforme en donnée', () => {
  it('une erreur réseau rend inconnu, avec le repli', async () => {
    const c = connecteur({
      interroger: async () => {
        throw new Error('ECONNREFUSED')
      },
    })
    const r = await interroger(c, { zone: ZONE, rayonMetres: 500 }, etatVierge(), MAINTENANT)
    expect(r.statut).toBe('inconnu')
    expect(r.donnees).toHaveLength(0)
    expect(r.repli).toBe(c.repli)
    expect(r.justification).toMatch(/injoignable/)
  })

  it('un dépassement de délai rend inconnu sans lever', async () => {
    const c = connecteur({
      timeoutMs: 20,
      interroger: (req) =>
        new Promise((_, rejette) => {
          req.signal.addEventListener('abort', () => rejette(new Error('abandon')))
        }),
    })
    const r = await interroger(c, { zone: ZONE, rayonMetres: 500 }, etatVierge(), MAINTENANT)
    expect(r.statut).toBe('inconnu')
    expect(r.justification).toMatch(/pas répondu dans le délai/)
  })

  it('une réponse mal formée rend inconnu plutôt que d’être devinée', async () => {
    const c = connecteur({
      interroger: async () => ({ pas: 'un tableau' }) as unknown as readonly string[],
    })
    const r = await interroger(c, { zone: ZONE, rayonMetres: 500 }, etatVierge(), MAINTENANT)
    expect(r.statut).toBe('inconnu')
    expect(r.justification).toMatch(/format que je ne sais pas lire/)
  })

  it('un quota épuisé arrête la source au lieu de la faire deviner', async () => {
    const c = connecteur({ quotaParJour: 1, ttlMs: 0 })
    const etat = etatVierge()
    await interroger(c, { zone: ZONE, rayonMetres: 500 }, etat, MAINTENANT)
    expect(appelsRestants(etat, c, MAINTENANT)).toBe(0)

    const r = await interroger(c, { zone: ZONE, rayonMetres: 500 }, etat, MAINTENANT)
    expect(r.statut).toBe('inconnu')
    expect(r.justification).toMatch(/Quota quotidien atteint/)
  })

  it('le quota se réinitialise le lendemain', async () => {
    const c = connecteur({ quotaParJour: 1, ttlMs: 0 })
    const etat = etatVierge()
    await interroger(c, { zone: ZONE, rayonMetres: 500 }, etat, MAINTENANT)
    expect(appelsRestants(etat, c, new Date('2026-08-25T09:00:00Z'))).toBe(1)
  })

  it('une annulation extérieure est respectée', async () => {
    const controleur = new AbortController()
    controleur.abort()
    const c = connecteur({
      interroger: (req) =>
        new Promise((_, rejette) => {
          if (req.signal.aborted) rejette(new Error('déjà annulé'))
        }),
    })
    const r = await interroger(
      c,
      { zone: ZONE, rayonMetres: 500, signal: controleur.signal },
      etatVierge(),
      MAINTENANT,
    )
    expect(r.statut).toBe('inconnu')
  })
})

/* ------------------------------------------------------------------ */
/* Zéro résultat n'est pas zéro phénomène                              */
/* ------------------------------------------------------------------ */

describe('Une source muette décrit sa couverture, pas le monde', () => {
  it('zéro résultat ne devient jamais une affirmation d’absence', async () => {
    const c = connecteur({ interroger: async () => [] })
    const r = await interroger(c, { zone: ZONE, rayonMetres: 800 }, etatVierge(), MAINTENANT)
    expect(r.statut).toBe('inconnu')
    expect(r.justification).toMatch(/documentent peu cette zone/)
    expect(r.justification).not.toMatch(/personne|aucun.*n’existe|il n’y a rien/i)
  })

  it('la couverture affirme toujours qu’une donnée peut exister ailleurs', async () => {
    const c = connecteur({ interroger: async () => [] })
    const r = await interroger(c, { zone: ZONE, rayonMetres: 800 }, etatVierge(), MAINTENANT)
    expect(r.couverture.peutExisterAilleurs).toBe(true)
    expect(r.couverture.limitesConnues.length).toBeGreaterThan(0)
  })

  it('la couverture porte source, rayon, période et heure d’interrogation', async () => {
    const r = await interroger(connecteur(), { zone: ZONE, rayonMetres: 800 }, etatVierge(), MAINTENANT)
    expect(r.couverture.source).toBe('meteo')
    expect(r.couverture.rayonMetres).toBe(800)
    expect(r.couverture.periode).toBe('30 derniers jours')
    expect(r.couverture.interrogeeLe).toBe(MAINTENANT.toISOString())
  })

  it('les niveaux de couverture reflètent le volume, pas la vérité', () => {
    expect(niveauDeCouverture(0)).toBe('inexploree')
    expect(niveauDeCouverture(3)).toBe('partielle')
    expect(niveauDeCouverture(40)).toBe('documentee')
  })

  it('la phrase d’une zone vide ne prétend rien sur le monde', () => {
    const phrase = phraseCouverture({
      source: 'meteo',
      interrogeeLe: MAINTENANT.toISOString(),
      rayonMetres: 500,
      periode: null,
      resultats: 0,
      niveau: 'inexploree',
      limitesConnues: [],
      peutExisterAilleurs: true,
    })
    expect(phrase).toMatch(/sources actuellement connectées/)
    expect(phrase).not.toMatch(/personne/i)
  })

  it('la carte de couverture décrit ce qu’on sait interroger', () => {
    const carte = carteDeCouverture(ZONE, [])
    expect(carte.phrase).toMatch(/Aucune source n’a encore été interrogée/)
    expect(carte.totalResultats).toBe(0)
  })

  it('une carte sans aucun relevé n’annonce pas une absence', () => {
    const carte = carteDeCouverture(ZONE, [
      {
        source: 'meteo',
        interrogeeLe: MAINTENANT.toISOString(),
        rayonMetres: 500,
        periode: null,
        resultats: 0,
        niveau: 'inexploree',
        limitesConnues: [],
        peutExisterAilleurs: true,
      },
    ])
    expect(carte.phrase).toMatch(/documentent peu cette zone/)
    expect(carte.phrase).toMatch(/peuvent exister ailleurs/)
  })
})

/* ------------------------------------------------------------------ */
/* Cache                                                               */
/* ------------------------------------------------------------------ */

describe('Le cache évite les appels sans mentir sur leur origine', () => {
  it('une seconde requête identique ne rappelle pas la source', async () => {
    const espion = vi.fn(async () => ['a'])
    const c = connecteur({ interroger: espion })
    const etat = etatVierge()

    await interroger(c, { zone: ZONE, rayonMetres: 500 }, etat, MAINTENANT)
    const r = await interroger(c, { zone: ZONE, rayonMetres: 500 }, etat, MAINTENANT)

    expect(espion).toHaveBeenCalledTimes(1)
    expect(r.depuisCache).toBe(true)
  })

  it('passé le TTL, la source est réinterrogée', async () => {
    const espion = vi.fn(async () => ['a'])
    const c = connecteur({ interroger: espion, ttlMs: 1_000 })
    const etat = etatVierge()

    await interroger(c, { zone: ZONE, rayonMetres: 500 }, etat, MAINTENANT)
    await interroger(
      c,
      { zone: ZONE, rayonMetres: 500 },
      etat,
      new Date(MAINTENANT.valueOf() + 5_000),
    )
    expect(espion).toHaveBeenCalledTimes(2)
  })
})

/* ------------------------------------------------------------------ */
/* Confidentialité                                                     */
/* ------------------------------------------------------------------ */

describe('La position privée ne quitte pas la machine telle quelle', () => {
  const position: PositionPrivee = {
    lat: 46.81392,
    lon: -71.20811,
    precisionMetres: 12,
    capteeLe: '2026-08-24T10:00:00Z',
  }

  const reglages: ReglagesConfidentialite = {
    ...reglagesParDefaut(),
    consentements: [
      {
        source: 'meteo',
        accorde: true,
        finalite: 'Écarter les opérations dangereuses par mauvais temps.',
        mailleMetres: 2_000,
        conservationJours: 7,
        accordeLe: '2026-08-20T10:00:00Z',
      },
      {
        source: 'position',
        accorde: false,
        finalite: 'Proposer des opérations proches.',
        mailleMetres: 500,
        conservationJours: 1,
        accordeLe: null,
      },
    ],
  }

  it('un connecteur refuse une position plus précise que nécessaire', async () => {
    const c = connecteur({ mailleMetres: 2_000 })
    const trop = arrondirPosition(position, 100)
    const r = await interroger(c, { zone: trop, rayonMetres: 500 }, etatVierge(), MAINTENANT)
    expect(r.statut).toBe('inconnu')
    expect(r.justification).toMatch(/Rien n’a été transmis/)
  })

  it('sans consentement pour cette source précise, rien ne part', () => {
    expect(positionPour(reglages, 'position', position)).toBeNull()
  })

  it('un consentement accordé transmet une position arrondie à sa maille', () => {
    const z = positionPour(reglages, 'meteo', position)
    expect(z).not.toBeNull()
    expect(z!.mailleMetres).toBe(2_000)
    expect(z!.lat).not.toBe(position.lat)
  })

  it('deux relevés voisins dans la même maille tombent sur le même point', () => {
    /* On part du centre d'une cellule pour ne pas tester une frontière. */
    const centre = arrondirPosition({ lat: 46.81392, lon: -71.20811 }, 1_000)
    const a = arrondirPosition({ lat: centre.lat + 0.0002, lon: centre.lon - 0.0003 }, 1_000)
    const b = arrondirPosition({ lat: centre.lat - 0.0002, lon: centre.lon + 0.0003 }, 1_000)
    expect(a.lat).toBe(b.lat)
    expect(a.lon).toBe(b.lon)
  })

  it('l’arrondi est déterministe : aucun bruit aléatoire ajouté', () => {
    const a = arrondirPosition(position, 1_000)
    const b = arrondirPosition(position, 1_000)
    expect(a).toEqual(b)
    expect(arrondirPosition(a, 1_000)).toEqual(a)
  })

  it('aucune localisation en arrière-plan, et le type l’impose', () => {
    // @ts-expect-error le champ est le littéral `false`
    const impossible: ReglagesConfidentialite = { ...reglages, localisationEnArrierePlan: true }
    expect(impossible.localisationEnArrierePlan).toBe(true)
  })
})

describe('Ce qui peut être publié est plus grossier que ce qui est su', () => {
  const position: PositionPrivee = {
    lat: 46.81392,
    lon: -71.20811,
    precisionMetres: 8,
    capteeLe: '2026-08-24T10:00:00Z',
  }

  it('une preuve partageable ne porte qu’une position arrondie', () => {
    const p = positionPubliable(position, false)
    expect(p).not.toBeNull()
    expect(p!.mailleMetres).toBe(MAILLE_PUBLIABLE_METRES)
    expect(p!.mention).toMatch(/arrondie/)
  })

  it('une espèce sensible ne produit aucune position publiable', () => {
    expect(positionPubliable(position, true)).toBeNull()
  })
})

describe('Les traces se purgent à la durée déclarée', () => {
  const consentement = {
    source: 'position' as const,
    accorde: true,
    finalite: 'Proposer des opérations proches.',
    mailleMetres: 500,
    conservationJours: 2,
    accordeLe: '2026-08-20T10:00:00Z',
  }

  it('une position dépassée est à purger', () => {
    expect(aPurger(consentement, '2026-08-01T10:00:00Z', MAINTENANT)).toBe(true)
  })

  it('une position récente est conservée', () => {
    expect(aPurger(consentement, '2026-08-24T09:00:00Z', MAINTENANT)).toBe(false)
  })

  it('la purge ne garde que ce qui est encore dans la fenêtre', () => {
    const restant = purger(
      [{ capteeLe: '2026-08-01T10:00:00Z' }, { capteeLe: '2026-08-24T09:00:00Z' }],
      consentement,
      MAINTENANT,
    )
    expect(restant).toHaveLength(1)
  })
})
