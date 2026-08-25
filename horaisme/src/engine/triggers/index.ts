import type {
  Contexte,
  Datum,
  Declencheur,
  IssueDeclencheur,
  Operation,
} from '../types'

/**
 * Déclencheurs contextuels.
 *
 * Une seule règle gouverne ce module, et elle est plus importante que tout
 * le reste : **l'absence de donnée n'est jamais une donnée contraire**.
 *
 * Quand la météo est inconnue, une opération qui exige du soleil n'est pas
 * « écartée pour cause de mauvais temps ». Elle est indéterminée, et c'est
 * ce mot-là que le joueur doit lire. Confondre les deux, ce serait faire
 * exactement ce que cette application reproche aux autres : présenter un
 * silence comme un fait.
 */

export interface EvaluationDeclencheur {
  readonly declencheur: Declencheur
  readonly issue: IssueDeclencheur
  readonly explication: string
}

export interface EvaluationDeclencheurs {
  readonly issue: IssueDeclencheur
  readonly details: readonly EvaluationDeclencheur[]
  readonly satisfaits: readonly EvaluationDeclencheur[]
  readonly nonSatisfaits: readonly EvaluationDeclencheur[]
  readonly indetermines: readonly EvaluationDeclencheur[]
}

const LIBELLE_TYPE: Record<Declencheur['type'], string> = {
  saison: 'Saison',
  'lumiere-minimum': 'Lumière restante',
  heure: 'Heure',
  'meteo-requise': 'Météo attendue',
  'meteo-exclue': 'Météo à éviter',
  'temperature-max': 'Température maximale',
  'temperature-min': 'Température minimale',
}

export function libelleDeclencheur(d: Declencheur): string {
  return LIBELLE_TYPE[d.type]
}

function indetermine(d: Declencheur, quoi: string): EvaluationDeclencheur {
  return {
    declencheur: d,
    issue: 'indetermine',
    explication: `${quoi} : je ne sais pas. Je ne peux ni confirmer ni écarter cette condition.`,
  }
}

function normaliser(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function correspond(valeur: string, attendues: readonly string[]): boolean {
  const v = normaliser(valeur)
  return attendues.some((a) => v.includes(normaliser(a)))
}

/** Un datum inconnu, ou porteur d'une valeur nulle, ne tranche rien. */
function lisible<T>(d: Datum<T>): T | null {
  return d.statut === 'inconnu' ? null : d.valeur
}

export function evaluerDeclencheur(d: Declencheur, c: Contexte): EvaluationDeclencheur {
  switch (d.type) {
    case 'saison': {
      const saison = lisible(c.saison)
      if (saison === null) return indetermine(d, 'Saison')
      const ok = correspond(saison, d.valeurs)
      return {
        declencheur: d,
        issue: ok ? 'satisfait' : 'non-satisfait',
        explication: ok
          ? `Saison en cours : ${saison}. ${d.raison}`
          : `Cette opération demande ${d.valeurs.join(' ou ')}. Nous sommes en ${saison}.`,
      }
    }

    case 'lumiere-minimum': {
      const minutes = lisible(c.minutesDeLumiere)
      if (minutes === null) return indetermine(d, 'Lumière restante')
      const ok = minutes >= d.minutes
      return {
        declencheur: d,
        issue: ok ? 'satisfait' : 'non-satisfait',
        explication: ok
          ? `Environ ${minutes} min de lumière, il en faut ${d.minutes}. ${d.raison}`
          : `Il reste environ ${minutes} min de lumière, cette opération en demande ${d.minutes}.`,
      }
    }

    case 'heure': {
      const heure = lisible(c.heureLocale)
      if (heure === null) return indetermine(d, 'Heure locale')
      const h = Number.parseInt(heure.slice(0, 2), 10)
      if (Number.isNaN(h)) return indetermine(d, 'Heure locale')
      const ok = d.deHeure <= d.aHeure ? h >= d.deHeure && h < d.aHeure : h >= d.deHeure || h < d.aHeure
      return {
        declencheur: d,
        issue: ok ? 'satisfait' : 'non-satisfait',
        explication: ok
          ? `Il est ${heure}. ${d.raison}`
          : `Cette opération se joue entre ${d.deHeure} h et ${d.aHeure} h. Il est ${heure}.`,
      }
    }

    case 'meteo-requise': {
      const meteo = lisible(c.meteo)
      if (meteo === null) return indetermine(d, 'Météo')
      const ok = correspond(meteo, d.valeurs)
      return {
        declencheur: d,
        issue: ok ? 'satisfait' : 'non-satisfait',
        explication: ok
          ? `Météo observée : ${meteo}. ${d.raison}`
          : `Cette opération demande ${d.valeurs.join(' ou ')}. Il fait ${meteo}.`,
      }
    }

    case 'meteo-exclue': {
      const meteo = lisible(c.meteo)
      if (meteo === null) return indetermine(d, 'Météo')
      const exclu = correspond(meteo, d.valeurs)
      return {
        declencheur: d,
        issue: exclu ? 'non-satisfait' : 'satisfait',
        explication: exclu
          ? `Conditions actuelles : ${meteo}. ${d.raison}`
          : `Rien dans la météo (${meteo}) n’empêche cette opération.`,
      }
    }

    case 'temperature-max': {
      const t = lisible(c.temperature)
      if (t === null) return indetermine(d, 'Température')
      const ok = t <= d.celsius
      return {
        declencheur: d,
        issue: ok ? 'satisfait' : 'non-satisfait',
        explication: ok
          ? `${t} °C, sous le plafond de ${d.celsius} °C. ${d.raison}`
          : `${t} °C. Au-dessus de ${d.celsius} °C, je ne propose pas cette opération. ${d.raison}`,
      }
    }

    case 'temperature-min': {
      const t = lisible(c.temperature)
      if (t === null) return indetermine(d, 'Température')
      const ok = t >= d.celsius
      return {
        declencheur: d,
        issue: ok ? 'satisfait' : 'non-satisfait',
        explication: ok
          ? `${t} °C, au-dessus du plancher de ${d.celsius} °C. ${d.raison}`
          : `${t} °C. Sous ${d.celsius} °C, je ne propose pas cette opération. ${d.raison}`,
      }
    }
  }
}

/**
 * Issue globale.
 *
 * - un seul déclencheur non satisfait suffit à écarter l'opération ;
 * - sinon, un seul indéterminé suffit à rendre l'ensemble indéterminé ;
 * - une opération sans déclencheur est satisfaite par défaut.
 *
 * L'ordre compte : une condition démentie par une donnée réelle prime sur une
 * condition qu'on n'a pas pu vérifier.
 */
export function evaluerDeclencheurs(
  op: Operation,
  contexte: Contexte,
): EvaluationDeclencheurs {
  const details = op.declencheurs.map((d) => evaluerDeclencheur(d, contexte))
  const satisfaits = details.filter((e) => e.issue === 'satisfait')
  const nonSatisfaits = details.filter((e) => e.issue === 'non-satisfait')
  const indetermines = details.filter((e) => e.issue === 'indetermine')

  const issue: IssueDeclencheur =
    nonSatisfaits.length > 0 ? 'non-satisfait' : indetermines.length > 0 ? 'indetermine' : 'satisfait'

  return { issue, details, satisfaits, nonSatisfaits, indetermines }
}
