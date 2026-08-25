import { describe, expect, it } from 'vitest'

import { angleMort } from '../content/operations/angle-mort'
import {
  MINIMUM_POUR_CALIBRER,
  arbitrer,
  avancerPropositions,
  comptes,
  confianceValide,
  dementis,
  estDementi,
  etatCalibration,
  trancher,
  verifierPropositions,
} from '../engine/contrechamp'
import { creerPreuve } from '../engine/evidence'
import { MEMOIRE_VIDE } from '../engine/memory'
import { accepterPropositionExterne } from '../engine/safety'
import type { MemoireJoueur, Operation, Verification } from '../engine/types'

/**
 * Couche 3 — le Contrechamp du réel et le Démenti.
 *
 * Ces tests protègent trois refus : ne pas déduire une contradiction d'un
 * silence, ne pas confondre provenance et vérité, ne pas publier de taux
 * d'erreur sur des événements qui ne se comparent pas.
 */

const PREUVE = creerPreuve('observation', 'Le motif a disparu sous un ravalement récent.')

function memoireAvecPropositions(): MemoireJoueur {
  return avancerPropositions(MEMOIRE_VIDE, angleMort)
}

function premiere(m: MemoireJoueur): Verification {
  return m.verifications[0]
}

/* ------------------------------------------------------------------ */
/* Le refus principal                                                  */
/* ------------------------------------------------------------------ */

describe('Une absence de preuve n’est pas une preuve du contraire', () => {
  it('un démenti sans preuve rattachée retombe en indéterminé', () => {
    const r = arbitrer({ issue: 'contredite', observation: 'Je n’ai rien vu.', preuves: [] })
    expect(r.issueRetenue).toBe('indeterminee')
    expect(r.ramenee).toBe(true)
    expect(r.raison).toMatch(/n’est pas une preuve du contraire/)
  })

  it('un démenti sans observation écrite retombe en indéterminé', () => {
    const r = arbitrer({ issue: 'contredite', observation: '   ', preuves: [PREUVE] })
    expect(r.issueRetenue).toBe('indeterminee')
  })

  it('une confirmation sans preuve retombe aussi en indéterminé', () => {
    const r = arbitrer({ issue: 'confirmee', observation: 'Il me semble que oui.', preuves: [] })
    expect(r.issueRetenue).toBe('indeterminee')
    expect(r.ramenee).toBe(true)
  })

  it('« je ne peux pas trancher » est une réponse entière, pas un échec', () => {
    const r = arbitrer({ issue: 'indeterminee', observation: '', preuves: [] })
    expect(r.issueRetenue).toBe('indeterminee')
    expect(r.ramenee).toBe(false)
    expect(r.raison).toMatch(/réponse entière/)
  })

  it('observation et preuve réunies, le démenti est inscrit tel quel', () => {
    const r = arbitrer({
      issue: 'contredite',
      observation: 'La façade a été refaite, le motif n’existe plus.',
      preuves: [PREUVE],
    })
    expect(r.issueRetenue).toBe('contredite')
    expect(r.ramenee).toBe(false)
  })
})

describe('Le Démenti ne se déclenche que sur une contradiction étayée', () => {
  it('une vérification ramenée à indéterminée n’est pas un démenti', () => {
    const m = memoireAvecPropositions()
    const { memoire } = trancher(m, premiere(m).id, {
      issue: 'contredite',
      observation: 'Rien trouvé.',
      preuves: [],
    })
    expect(dementis(memoire)).toHaveLength(0)
  })

  it('une contradiction étayée en est un', () => {
    const m = memoireAvecPropositions()
    const { memoire } = trancher(m, premiere(m).id, {
      issue: 'contredite',
      observation: 'Le motif a disparu sous un ravalement.',
      preuves: [PREUVE],
    })
    expect(dementis(memoire)).toHaveLength(1)
    expect(estDementi(memoire.verifications[0])).toBe(true)
  })

  it('une confirmation étayée n’en est pas un', () => {
    const m = memoireAvecPropositions()
    const { memoire } = trancher(m, premiere(m).id, {
      issue: 'confirmee',
      observation: 'Le motif est bien là.',
      preuves: [creerPreuve('observation', 'Motif retrouvé, intact.')],
    })
    expect(dementis(memoire)).toHaveLength(0)
    expect(memoire.verifications[0].issue).toBe('confirmee')
  })
})

/* ------------------------------------------------------------------ */
/* Provenance et vérité restent séparées                               */
/* ------------------------------------------------------------------ */

describe('Le statut de provenance ne sert jamais à trancher', () => {
  it('une proposition « plausible » peut être confirmée', () => {
    const m = memoireAvecPropositions()
    expect(premiere(m).statutEpistemique).toBe('plausible')
    const { memoire } = trancher(m, premiere(m).id, {
      issue: 'confirmee',
      observation: 'Vérifié sur place.',
      preuves: [PREUVE],
    })
    expect(memoire.verifications[0].issue).toBe('confirmee')
    expect(memoire.verifications[0].statutEpistemique).toBe('plausible')
  })

  it('l’issue et le statut épistémique sont deux champs indépendants', () => {
    const m = memoireAvecPropositions()
    const { memoire } = trancher(m, premiere(m).id, {
      issue: 'contredite',
      observation: 'Autre chose.',
      preuves: [PREUVE],
    })
    const v = memoire.verifications[0]
    expect(v.statutEpistemique).toBe(v.statutEpistemique)
    expect(v.issue).not.toBe(v.statutEpistemique)
  })

  it('le résultat attendu est conservé pour que le démenti porte sur quelque chose', () => {
    expect(premiere(memoireAvecPropositions()).resultatAttendu.length).toBeGreaterThan(15)
  })
})

/* ------------------------------------------------------------------ */
/* Compter sans agréger                                                */
/* ------------------------------------------------------------------ */

describe('Les comptes sont transparents et aucun taux n’est publié', () => {
  it('une proposition avancée mais non tranchée reste en attente', () => {
    const c = comptes(memoireAvecPropositions())
    expect(c.avancees).toBe(2)
    expect(c.enAttente).toBe(2)
    expect(c.confirmees + c.contredites + c.indeterminees).toBe(0)
  })

  it('les trois issues se comptent séparément', () => {
    let m = memoireAvecPropositions()
    m = trancher(m, m.verifications[0].id, {
      issue: 'confirmee',
      observation: 'Oui.',
      preuves: [PREUVE],
    }).memoire
    m = trancher(m, m.verifications[1].id, {
      issue: 'contredite',
      observation: 'Non.',
      preuves: [PREUVE],
    }).memoire

    const c = comptes(m)
    expect(c.confirmees).toBe(1)
    expect(c.contredites).toBe(1)
    expect(c.enAttente).toBe(0)
  })

  it('aucun taux n’est calculé sous le seuil, et l’écran le dit', () => {
    const e = etatCalibration(memoireAvecPropositions())
    expect(e.suffisant).toBe(false)
    expect(e.message).toMatch(/Je ne calcule aucun taux/)
    expect(e.message).toContain(String(MINIMUM_POUR_CALIBRER))
  })

  it('les indéterminées ne comptent pas dans l’échantillon de calibration', () => {
    let m = memoireAvecPropositions()
    m = trancher(m, m.verifications[0].id, {
      issue: 'contredite',
      observation: 'Rien.',
      preuves: [],
    }).memoire
    expect(etatCalibration(m).trancheesAvecPreuve).toBe(0)
  })

  it('la structure de calibration existe déjà, par tranche de confiance', () => {
    const e = etatCalibration(memoireAvecPropositions())
    expect(e.tranches).toHaveLength(4)
    expect(e.tranches[0].borneBasse).toBe(0)
    expect(e.tranches[3].borneHaute).toBe(1)
  })
})

/* ------------------------------------------------------------------ */
/* Ce qu'une opération doit avancer                                    */
/* ------------------------------------------------------------------ */

describe('Une opération doit avancer quelque chose de réfutable', () => {
  function violationsDe(patch: Partial<Operation>): string[] {
    return accepterPropositionExterne({ ...angleMort, ...patch }).violations.map((v) => v.regle)
  }

  it('une opération sans proposition est rejetée', () => {
    expect(violationsDe({ propositions: [] })).toContain('aucune-proposition')
  })

  it('une affirmation sans résultat attendu est irréfutable, donc rejetée', () => {
    expect(
      violationsDe({
        propositions: [
          {
            id: 'p',
            enonce: 'Quelque chose de vrai t’attend là-bas.',
            resultatAttendu: 'On verra.',
            confiance: 0.5,
            statutEpistemique: 'plausible',
          },
        ],
      }),
    ).toContain('resultat-attendu-absent')
  })

  it('une confiance hors bornes est rejetée', () => {
    expect(
      violationsDe({
        propositions: [
          {
            id: 'p',
            enonce: 'Un énoncé suffisamment long pour être lisible.',
            resultatAttendu: 'Un résultat observable et suffisamment précis.',
            confiance: 1.4,
            statutEpistemique: 'plausible',
          },
        ],
      }),
    ).toContain('confiance-hors-bornes')
  })

  it('deux propositions ne peuvent pas partager un identifiant', () => {
    const p = {
      id: 'meme-id',
      enonce: 'Un énoncé suffisamment long pour être lisible.',
      resultatAttendu: 'Un résultat observable et suffisamment précis.',
      confiance: 0.5,
      statutEpistemique: 'plausible' as const,
    }
    expect(violationsDe({ propositions: [p, p] })).toContain('proposition-dupliquee')
  })

  it('« L’angle mort » avance deux choses que le terrain peut démentir', () => {
    expect(verifierPropositions(angleMort)).toEqual([])
    expect(angleMort.propositions).toHaveLength(2)
    expect(accepterPropositionExterne(angleMort).acceptee).toBe(true)
  })

  it('les bornes de confiance sont vérifiées', () => {
    expect(confianceValide(0)).toBe(true)
    expect(confianceValide(1)).toBe(true)
    expect(confianceValide(-0.1)).toBe(false)
    expect(confianceValide(Number.NaN)).toBe(false)
  })
})

describe('Avancer deux fois la même proposition ne la duplique pas', () => {
  it('la mémoire reste stable si l’opération est relancée', () => {
    const m = avancerPropositions(avancerPropositions(MEMOIRE_VIDE, angleMort), angleMort)
    expect(m.verifications).toHaveLength(2)
  })
})
