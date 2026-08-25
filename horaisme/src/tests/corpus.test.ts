import { describe, expect, it } from 'vitest'

import {
  CATALOGUE,
  CATALOGUE_REJETE,
  CONTRE_HYPOTHESES,
  MEDIAS,
  angleMort,
  leSosie,
  troisSoleils,
} from '../content/operations'
import { verifierOperation } from '../engine/safety'
import { multiplicateurPour, PLAFOND_SOSIE_DANGEREUX } from '../engine/nature'
import type { Operation } from '../engine/types'

/*
 * Le catalogue filtre les opérations non conformes *silencieusement* : une
 * opération mal écrite ne plante pas, elle disparaît. C'est le bon
 * comportement en production et le pire pour un test — un corpus vidé par
 * erreur passerait inaperçu. Ce fichier existe pour rendre ce silence
 * impossible.
 */

const ATTENDUES = ['angle-mort', 'trois-soleils', 'le-sosie'] as const

describe('Le corpus se charge en entier', () => {
  it('aucune opération n’est écartée au démarrage', () => {
    expect(CATALOGUE_REJETE).toEqual([])
  })

  it('les trois opérations verticales sont présentes', () => {
    expect(CATALOGUE.map((o) => o.id).sort()).toEqual([...ATTENDUES].sort())
  })
})

const toutes: readonly Operation[] = [angleMort, troisSoleils, leSosie]

describe.each(toutes.map((op) => [op.titre, op] as const))('« %s »', (_titre, op) => {
  it('passe tous les garde-fous', () => {
    expect(verifierOperation(op)).toEqual([])
  })

  it('démontre le cycle complet, du fragment à l’ancrage', () => {
    const types = op.etapes.map((e) => e.type)
    expect(types).toEqual(['fragment', 'inventaire', 'sortie', 'terrain', 'ancrage'])
  })

  it('offre au moins une issue d’échec sincère récompensée', () => {
    const echecs = op.bifurcations.filter((b) => b.echecSincere)
    expect(echecs.length).toBeGreaterThan(0)
    for (const e of echecs) expect(e.xp).toBeGreaterThan(0)
  })

  it('avance au moins deux propositions vérifiables sur le terrain', () => {
    expect(op.propositions.length).toBeGreaterThanOrEqual(2)
    for (const p of op.propositions) {
      expect(p.resultatAttendu.trim().length).toBeGreaterThan(0)
      expect(p.confiance).toBeGreaterThan(0)
      expect(p.confiance).toBeLessThanOrEqual(1)
    }
  })

  it('n’affiche aucune confiance de 1 : rien n’est certain avant la sortie', () => {
    for (const p of op.propositions) expect(p.confiance).toBeLessThan(1)
  })

  it('propose des contre-hypothèses pendant l’Inventaire', () => {
    expect(CONTRE_HYPOTHESES[op.id]?.length ?? 0).toBeGreaterThanOrEqual(3)
  })

  it('déclare des conditions d’abandon et des risques', () => {
    expect(op.conditionsAbandon.length).toBeGreaterThan(0)
    expect(op.risques.length).toBeGreaterThan(0)
  })

  it('rattache ses conséquences au Terrain et au Registre', () => {
    expect(op.consequences.terrain.trim().length).toBeGreaterThan(0)
    expect(op.consequences.registre.trim().length).toBeGreaterThan(0)
  })
})

describe('Chaque opération sait ce qu’elle montre et ce qu’elle tait', () => {
  it.each(ATTENDUES)('« %s » a une entrée média explicite', (id) => {
    expect(MEDIAS[id]).toBeDefined()
  })

  it('une opération sans lieu explique pourquoi, au lieu de laisser un trou', () => {
    for (const id of ATTENDUES) {
      const m = MEDIAS[id]!
      if (!m.lieu) expect(m.noteLieu?.trim().length ?? 0).toBeGreaterThan(0)
    }
  })

  it('aucune coordonnée n’est publiée pour l’espèce vulnérable', () => {
    /*
     * La règle n'est pas « on floute » mais « on n'écrit pas ». Un arrondi
     * reste une position ; l'absence, non.
     */
    expect(MEDIAS['le-sosie']!.lieu).toBeUndefined()
    expect(leSosie.nature?.especeSensible).toBe(true)
  })
})

describe('« Le sosie » tient la règle du canal B', () => {
  it('ne prélève rien et ne peut pas autoriser l’ingestion', () => {
    expect(leSosie.nature?.prelevementAutorise).toBe(false)
    expect(leSosie.nature?.ingestionAutorisee).toBe(false)
    expect(leSosie.nature?.gestesAutorises).not.toContain('prelever')
  })

  it('nomme les sosies dangereux et donne au moins trois caractères discriminants', () => {
    const securite = leSosie.indices.securite
    expect(leSosie.nature?.sosiesDangereux.length).toBeGreaterThanOrEqual(2)
    expect(securite.filter((i) => i.categorie === 'sosie').length).toBeGreaterThan(0)
    expect(securite.filter((i) => i.categorie === 'discrimination').length).toBeGreaterThanOrEqual(3)
  })

  it('désigne explicitement le vérâtre vert, pas seulement le muguet', () => {
    /*
     * Le muguet est le sosie célèbre ; le vérâtre vert est celui qui partage
     * réellement l'habitat et la saison. Omettre le second au profit du
     * premier serait rassurant et faux.
     */
    const tout = [
      ...(leSosie.nature?.sosiesDangereux ?? []),
      ...leSosie.indices.securite.map((i) => i.texte),
    ].join(' ')
    expect(tout).toMatch(/vérâtre vert/i)
    expect(tout).toMatch(/muguet/i)
  })

  it('désapprend le faux critère de la nervation parallèle', () => {
    const tout = leSosie.indices.securite.map((i) => i.texte).join(' ')
    expect(tout).toMatch(/nervation parallèle/i)
  })

  it('le canal A est écrêté par la présence d’un sosie dangereux', () => {
    /*
     * Se priver d'un indice de localisation rapporte davantage — sauf ici.
     * On ne paie jamais quelqu'un pour approcher une plante mortelle avec
     * moins d'information.
     */
    const m = multiplicateurPour('aucun', leSosie.nature)
    expect(m.multiplicateur).toBe(PLAFOND_SOSIE_DANGEREUX)
    expect(m.ecrete).toBe(true)
  })

  it('rappelle la limite légale sans la confondre avec un seuil écologique', () => {
    const legal = leSosie.indices.securite.find((i) => i.categorie === 'legal')
    expect(legal?.texte).toMatch(/50 bulbes/)
    expect(legal?.texte).toMatch(/vulnérable/i)
    /* L'exception ne vaut pas partout : l'omettre la rendrait plus large qu'elle ne l'est. */
    expect(legal?.texte).toMatch(/parc|aire protégée|refuge/i)
  })
})

describe('« Les trois soleils » protège les yeux avant tout le reste', () => {
  it('interdit explicitement de regarder le soleil, et de le viser dans une optique', () => {
    const interdits = troisSoleils.indices.securite
      .filter((i) => i.categorie === 'interdit')
      .map((i) => i.texte)
      .join(' ')
    expect(interdits).toMatch(/jamais le soleil directement/i)
    expect(interdits).toMatch(/viseur|jumelles/i)
  })

  it('donne un test capable de contredire l’hypothèse atmosphérique', () => {
    /*
     * Une opération de démystification qui ne fournirait que des critères de
     * confirmation ne démystifierait rien : il lui faut un geste qui peut
     * faire échouer l'explication qu'elle avance elle-même.
     */
    const sosie = troisSoleils.indices.securite.find((i) => i.categorie === 'sosie')
    expect(sosie?.texte).toMatch(/reflet/i)
    expect(troisSoleils.bifurcations.map((b) => b.id)).toContain('dementi-reflet')
  })

  it('récompense davantage le démenti que la confirmation', () => {
    const confirme = troisSoleils.bifurcations.find((b) => b.id === 'signature-complete')!
    const dementi = troisSoleils.bifurcations.find((b) => b.id === 'dementi-reflet')!
    expect(dementi.xp).toBeGreaterThan(confirme.xp)
  })

  it('ne se déclenche pas dans une météo qui rend le phénomène impossible', () => {
    const exclusions = troisSoleils.declencheurs.filter((d) => d.type === 'meteo-exclue')
    expect(exclusions.length).toBeGreaterThan(0)
  })
})
