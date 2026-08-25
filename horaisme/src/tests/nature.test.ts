import { describe, expect, it } from 'vitest'

import { ailDesBois, seuilDeclinAilDesBois } from '../content/nature/regles-quebec'
import {
  applicableA,
  echeanceDe,
  evaluerFait,
  faitCoherent,
  faitExterne,
  faitExterneInconnu,
  versDatum,
} from '../engine/facts'
import {
  MULTIPLICATEUR_INDICE,
  PLAFOND_SOSIE_DANGEREUX,
  cadreNatureParDefaut,
  evaluerPrelevement,
  flouterPosition,
  indicesLocalisationJusqua,
  indicesSecuriteToujoursVisibles,
  multiplicateurPour,
  verifierCadreNature,
  xpAvecIndice,
} from '../engine/nature'
import { accepterPropositionExterne } from '../engine/safety'
import { angleMort } from '../content/operations/angle-mort'
import type { CadreNature, EchelleIndices, FaitExterne, Operation } from '../engine/types'

/**
 * Couche 1 — garde-fous nature, indices à deux canaux, faits périssables.
 *
 * Ces tests portent la règle : ils ne la décrivent pas, ils la font échouer.
 */

const MAINTENANT = new Date('2026-08-24T12:00:00Z')

/* ------------------------------------------------------------------ */
/* Faits externes                                                      */
/* ------------------------------------------------------------------ */

describe('Un fait du monde porte sa date de péremption', () => {
  const base = {
    valeur: 42,
    statut: 'fait' as const,
    source: 'Source de test',
    territoire: 'CA-QC',
    licence: 'test',
    justification: 'Pour le test.',
    repli: 'Retomber sur inconnu.',
  }

  it('un fait sans échéance déclarée est traité comme périmé', () => {
    const f = faitExterne({ ...base, verifieLe: '2026-08-24' })
    expect(echeanceDe(f)).toBeNull()
    expect(evaluerFait(f, 'CA-QC', MAINTENANT).utilisable).toBe(false)
  })

  it('un fait expiré cesse d’être affirmable et rend sa règle de repli', () => {
    const f = faitExterne({ ...base, verifieLe: '2020-01-01', validiteJours: 30 })
    const e = evaluerFait(f, 'CA-QC', MAINTENANT)
    expect(e.utilisable).toBe(false)
    expect(e.valeur).toBeNull()
    expect(e.statut).toBe('inconnu')
    expect(e.raison).toContain('Retomber sur inconnu')
  })

  it('un fait encore valide rend sa valeur', () => {
    const f = faitExterne({ ...base, verifieLe: '2026-08-01', validiteJours: 180 })
    expect(evaluerFait(f, 'CA-QC', MAINTENANT).valeur).toBe(42)
  })

  it('un fait périmé ne laisse aucune valeur dans le Datum affiché', () => {
    const f = faitExterne({ ...base, verifieLe: '2020-01-01', validiteJours: 30 })
    const d = versDatum(f, 'CA-QC', MAINTENANT)
    expect(d.statut).toBe('inconnu')
    expect(d.valeur).toBeNull()
  })
})

describe('Un fait du monde porte son territoire', () => {
  it('une règle provinciale s’applique à une ville de la province', () => {
    expect(applicableA(ailDesBois.prelevementPermis, 'CA-QC/quebec')).toBe(true)
  })

  it('une règle ne franchit pas la frontière de sa juridiction', () => {
    expect(applicableA(ailDesBois.prelevementPermis, 'CA-ON')).toBe(false)
    expect(evaluerFait(ailDesBois.prelevementPermis, 'CA-ON', MAINTENANT).utilisable).toBe(false)
  })
})

describe('Tout fait externe déclaré est cohérent', () => {
  const candidats: readonly (FaitExterne<unknown> | null)[] = [
    ailDesBois.prelevementPermis,
    ailDesBois.quantiteMaxParAn,
    ailDesBois.statutConservation,
    ailDesBois.ventePermise,
    ailDesBois.sanction,
    seuilDeclinAilDesBois,
  ]
  const tous = candidats.filter((f): f is FaitExterne<unknown> => f !== null)

  it.each(tous)('« $source » déclare source, territoire, vérification et repli', (f) => {
    expect(faitCoherent(f)).toBe(true)
  })

  it('le seuil écologique n’est pas présenté comme une règle de droit', () => {
    expect(seuilDeclinAilDesBois.statut).toBe('plausible')
    expect(ailDesBois.quantiteMaxParAn?.statut).toBe('fait')
  })
})

/* ------------------------------------------------------------------ */
/* Indices : deux canaux                                               */
/* ------------------------------------------------------------------ */

describe('Le canal des indices de localisation est monnayable', () => {
  it('renoncer aux indices rapporte davantage', () => {
    expect(MULTIPLICATEUR_INDICE.aucun).toBeGreaterThan(MULTIPLICATEUR_INDICE.zone)
    expect(MULTIPLICATEUR_INDICE.revelation).toBeLessThan(MULTIPLICATEUR_INDICE.zone)
  })

  it('l’échelle est strictement décroissante du plus dur au plus assisté', () => {
    const ordre = ['aucun', 'contextuel', 'sensoriel', 'directionnel', 'zone', 'revelation'] as const
    for (let i = 1; i < ordre.length; i += 1) {
      expect(MULTIPLICATEUR_INDICE[ordre[i]]).toBeLessThan(MULTIPLICATEUR_INDICE[ordre[i - 1]])
    }
  })

  it('les crans se révèlent cumulativement', () => {
    const e: EchelleIndices = {
      localisation: [
        { cran: 'contextuel', texte: 'A' },
        { cran: 'directionnel', texte: 'B' },
        { cran: 'revelation', texte: 'C' },
      ],
      securite: [],
    }
    expect(indicesLocalisationJusqua(e, 'directionnel').map((i) => i.texte)).toEqual(['A', 'B'])
  })
})

describe('Le canal de sécurité n’est jamais monnayable', () => {
  const dangereux: CadreNature = {
    ...cadreNatureParDefaut(),
    sosiesDangereux: ['Muguet — Convallaria majalis'],
  }

  it('le bonus de difficulté est écrêté dès qu’une confusion dangereuse est possible', () => {
    const calcul = multiplicateurPour('aucun', dangereux)
    expect(calcul.ecrete).toBe(true)
    expect(calcul.multiplicateur).toBe(PLAFOND_SOSIE_DANGEREUX)
  })

  it('aucun cran ne permet de dépasser le plafond sur une opération à sosie', () => {
    for (const cran of Object.keys(MULTIPLICATEUR_INDICE) as (keyof typeof MULTIPLICATEUR_INDICE)[]) {
      expect(multiplicateurPour(cran, dangereux).multiplicateur).toBeLessThanOrEqual(
        PLAFOND_SOSIE_DANGEREUX,
      )
    }
  })

  it('partir sans indice ne rapporte pas plus que le plafond quand un sosie existe', () => {
    const sans = xpAvecIndice(100, 'aucun', dangereux).montant
    const avec = xpAvecIndice(100, 'sensoriel', dangereux).montant
    expect(sans).toBe(avec)
  })

  it('les indices de sécurité sont rendus intégralement, quel que soit le cran', () => {
    const e: EchelleIndices = {
      localisation: [],
      securite: [
        { categorie: 'sosie', texte: 'S' },
        { categorie: 'discrimination', texte: 'D1' },
        { categorie: 'discrimination', texte: 'D2' },
        { categorie: 'legal', texte: 'L' },
      ],
    }
    expect(indicesSecuriteToujoursVisibles(e)).toHaveLength(4)
  })
})

/* ------------------------------------------------------------------ */
/* Prélèvement                                                         */
/* ------------------------------------------------------------------ */

describe('Le prélèvement est verrouillé par défaut', () => {
  it('un cadre nature neutre n’autorise rien à arracher', () => {
    const e = evaluerPrelevement(cadreNatureParDefaut(), 'CA-QC', MAINTENANT)
    expect(e.autorise).toBe(false)
  })

  it('sans règle vérifiée, la réponse est « je ne sais pas », donc non', () => {
    const cadre: CadreNature = {
      ...cadreNatureParDefaut(),
      prelevementAutorise: true,
      gestesAutorises: ['observer', 'prelever'],
      regle: null,
    }
    const e = evaluerPrelevement(cadre, 'CA-QC', MAINTENANT)
    expect(e.autorise).toBe(false)
    expect(e.statut).toBe('inconnu')
  })

  it('une règle périmée verrouille le prélèvement sans intervention humaine', () => {
    const perimee = {
      ...ailDesBois,
      prelevementPermis: faitExterne({
        valeur: true,
        statut: 'fait' as const,
        source: 'Règle expirée',
        territoire: 'CA-QC',
        verifieLe: '2019-01-01',
        validiteJours: 30,
        licence: 'test',
        justification: 'Ancienne.',
        repli: 'Verrouiller.',
      }),
    }
    const cadre: CadreNature = {
      ...cadreNatureParDefaut(),
      prelevementAutorise: true,
      gestesAutorises: ['observer', 'prelever'],
      regle: perimee,
    }
    expect(evaluerPrelevement(cadre, 'CA-QC', MAINTENANT).autorise).toBe(false)
  })

  it('une règle hors juridiction ne vaut pas autorisation', () => {
    const cadre: CadreNature = {
      ...cadreNatureParDefaut(),
      prelevementAutorise: true,
      gestesAutorises: ['observer', 'prelever'],
      regle: ailDesBois,
    }
    expect(evaluerPrelevement(cadre, 'CA-ON', MAINTENANT).autorise).toBe(false)
  })

  it('une espèce sensible reste en observation même quand la loi le permettrait', () => {
    const cadre: CadreNature = {
      ...cadreNatureParDefaut(),
      prelevementAutorise: true,
      gestesAutorises: ['observer', 'prelever'],
      especeSensible: true,
      regle: ailDesBois,
    }
    expect(evaluerPrelevement(cadre, 'CA-QC', MAINTENANT).autorise).toBe(false)
  })

  it('toutes conditions réunies, le prélèvement s’ouvre avec sa limite chiffrée', () => {
    const cadre: CadreNature = {
      ...cadreNatureParDefaut(),
      prelevementAutorise: true,
      gestesAutorises: ['observer', 'prelever'],
      regle: ailDesBois,
    }
    const e = evaluerPrelevement(cadre, 'CA-QC', MAINTENANT)
    expect(e.autorise).toBe(true)
    expect(e.quantiteMax).toBe(50)
  })
})

describe('La position d’une espèce sensible n’est jamais publiée précisément', () => {
  const pos = { lat: 46.81392, lon: -71.20811 }

  it('une espèce sensible est floutée à l’échelle du kilomètre', () => {
    const f = flouterPosition(pos, true)
    expect(f.precisionMetres).toBe(1_000)
    expect(Math.abs(f.lat - pos.lat)).toBeGreaterThan(0)
    expect(f.lat.toString().split('.')[1]?.length ?? 0).toBeLessThanOrEqual(2)
  })

  it('une espèce ordinaire garde sa précision', () => {
    expect(flouterPosition(pos, false)).toEqual({ ...pos, precisionMetres: 0 })
  })
})

/* ------------------------------------------------------------------ */
/* Vérification des opérations nature                                  */
/* ------------------------------------------------------------------ */

function operationNature(nature: Partial<CadreNature>, texte: string, indices?: EchelleIndices): Operation {
  return {
    ...angleMort,
    id: 'test-nature',
    dixSecondes:
      'Une opération de test qui déclare longuement pourquoi elle ne tient pas en dix secondes.',
    etapes: angleMort.etapes.map((e) => (e.type === 'fragment' ? { ...e, corps: texte } : e)),
    indices,
    nature: { ...cadreNatureParDefaut(), ...nature },
  }
}

describe('Aucune opération ne peut inviter à consommer un produit sauvage', () => {
  it('une consigne d’ingestion fait échouer l’opération au chargement', () => {
    const op = operationNature({}, 'Tu peux le manger sans crainte une fois identifié.')
    const { acceptee, violations } = accepterPropositionExterne(op)
    expect(acceptee).toBe(false)
    expect(violations.some((v) => v.regle === 'ingestion-interdite')).toBe(true)
  })

  it('une invitation à préparer une tisane est bloquée de la même façon', () => {
    const op = operationNature({}, 'Prépare une tisane avec ce que tu auras trouvé.')
    expect(verifierCadreNature(op).some((v) => v.regle === 'ingestion-interdite')).toBe(true)
  })

  it('le type interdit structurellement d’ouvrir l’ingestion', () => {
    const cadre = cadreNatureParDefaut()
    // @ts-expect-error `ingestionAutorisee` est le littéral `false` : `true` ne compile pas.
    const impossible: CadreNature = { ...cadre, ingestionAutorisee: true }
    expect(impossible.ingestionAutorisee).toBe(true)
  })
})

describe('Une opération en observation ne peut pas inviter à prélever', () => {
  it('« cueille-la » est rejeté quand le prélèvement est fermé', () => {
    const op = operationNature({}, 'Trouve la plante puis cueille-la pour la rapporter.')
    expect(verifierCadreNature(op).some((v) => v.regle === 'prelevement-non-autorise')).toBe(true)
  })

  it('la liste des gestes ne peut pas contredire le verrou', () => {
    const op = operationNature({ gestesAutorises: ['observer', 'prelever'] }, 'Observe seulement.')
    expect(verifierCadreNature(op).some((v) => v.regle === 'geste-incoherent')).toBe(true)
  })

  it('ouvrir le prélèvement sans cadre légal daté est rejeté', () => {
    const op = operationNature(
      { prelevementAutorise: true, gestesAutorises: ['observer', 'prelever'], regle: null },
      'Observe.',
    )
    expect(verifierCadreNature(op).some((v) => v.regle === 'prelevement-sans-cadre-legal')).toBe(
      true,
    )
  })
})

describe('Une confusion dangereuse impose de documenter le sosie', () => {
  it('un sosie déclaré sans indice de sécurité correspondant est rejeté', () => {
    const op = operationNature({ sosiesDangereux: ['Cigüe maculée'] }, 'Observe.')
    expect(verifierCadreNature(op).some((v) => v.regle === 'sosie-non-documente')).toBe(true)
  })

  it('un seul caractère discriminant ne suffit pas', () => {
    const op = operationNature({ sosiesDangereux: ['Cigüe maculée'] }, 'Observe.', {
      localisation: [],
      securite: [
        { categorie: 'sosie', texte: 'Cigüe maculée' },
        { categorie: 'discrimination', texte: 'Odeur' },
      ],
    })
    expect(verifierCadreNature(op).some((v) => v.regle === 'discrimination-insuffisante')).toBe(true)
  })

  it('deux caractères concordants et un sosie nommé passent', () => {
    const op = operationNature({ sosiesDangereux: ['Cigüe maculée'] }, 'Observe.', {
      localisation: [],
      securite: [
        { categorie: 'sosie', texte: 'Cigüe maculée' },
        { categorie: 'discrimination', texte: 'Odeur de la feuille froissée' },
        { categorie: 'discrimination', texte: 'Tige tachetée de pourpre' },
      ],
    })
    expect(verifierCadreNature(op)).toHaveLength(0)
  })
})

describe('Une opération sans dimension nature reste inchangée', () => {
  it('« L’angle mort » ne déclenche aucune règle de cueillette', () => {
    expect(verifierCadreNature(angleMort)).toHaveLength(0)
    expect(accepterPropositionExterne(angleMort).acceptee).toBe(true)
  })
})

describe('Un fait inconnu se déclare comme tel', () => {
  it('la fabrique inconnue ne porte aucune valeur', () => {
    const f = faitExterneInconnu<number>('Aucune source', 'CA-QC', 'Non vérifié.', 'Verrouiller.')
    expect(f.valeur).toBeNull()
    expect(faitCoherent(f)).toBe(true)
    expect(evaluerFait(f, 'CA-QC', MAINTENANT).utilisable).toBe(false)
  })
})
