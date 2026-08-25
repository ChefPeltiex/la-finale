import type {
  CadreNature,
  CranIndice,
  EchelleIndices,
  GesteNature,
  Operation,
  RegleCueillette,
} from '../types'
import type { Violation } from '../safety'
import { evaluerFait } from '../facts'

/**
 * Nature.
 *
 * Deux règles gouvernent ce module, et aucune n'est négociable :
 *
 * 1. Le canal d'indices qui protège le joueur ne s'échange jamais contre de
 *    l'XP. On ne paie personne pour se priver de l'information qui l'empêche
 *    de confondre deux espèces.
 * 2. Une légalité qu'on ne peut pas établir vaut interdiction, jamais
 *    permission. L'absence de règle connue n'est pas une autorisation.
 */

/* ------------------------------------------------------------------ */
/* Canal A — indices de localisation, monnayables                      */
/* ------------------------------------------------------------------ */

export const MULTIPLICATEUR_INDICE: Record<CranIndice, number> = {
  aucun: 1.6,
  contextuel: 1.4,
  sensoriel: 1.25,
  directionnel: 1.1,
  zone: 1.0,
  revelation: 0.8,
}

export const LIBELLE_CRAN: Record<CranIndice, string> = {
  aucun: 'Aucun indice',
  contextuel: 'Indice contextuel',
  sensoriel: 'Indice sensoriel',
  directionnel: 'Indice directionnel',
  zone: 'Zone approximative',
  revelation: 'Révélation partielle',
}

/**
 * Plafond appliqué dès qu'une confusion dangereuse est possible.
 *
 * Sans lui, l'échelle « aucun indice = XP maximal » paierait le joueur pour
 * partir sans savoir distinguer une espèce de son sosie toxique.
 */
export const PLAFOND_SOSIE_DANGEREUX = 1.25

export interface CalculMultiplicateur {
  readonly multiplicateur: number
  readonly ecrete: boolean
  readonly raison: string
}

export function multiplicateurPour(
  cran: CranIndice,
  nature?: CadreNature,
): CalculMultiplicateur {
  const brut = MULTIPLICATEUR_INDICE[cran]
  const dangereux = (nature?.sosiesDangereux.length ?? 0) > 0
  if (dangereux && brut > PLAFOND_SOSIE_DANGEREUX) {
    return {
      multiplicateur: PLAFOND_SOSIE_DANGEREUX,
      ecrete: true,
      raison:
        'Une confusion dangereuse est possible ici. Le bonus de difficulté est plafonné : je ne récompense pas le fait de partir moins informé.',
    }
  }
  return { multiplicateur: brut, ecrete: false, raison: LIBELLE_CRAN[cran] }
}

export function xpAvecIndice(
  xpBase: number,
  cran: CranIndice,
  nature?: CadreNature,
): { montant: number; calcul: CalculMultiplicateur } {
  const calcul = multiplicateurPour(cran, nature)
  return { montant: Math.round(xpBase * calcul.multiplicateur), calcul }
}

/* ------------------------------------------------------------------ */
/* Canal B — indices de sécurité, jamais monnayables                   */
/* ------------------------------------------------------------------ */

/**
 * Le canal B est rendu en entier quel que soit le cran choisi. Cette
 * fonction existe pour qu'aucun appelant n'ait à décider s'il le filtre :
 * il n'y a rien à filtrer.
 */
export function indicesSecuriteToujoursVisibles(e: EchelleIndices) {
  return e.securite
}

/** Le canal A, lui, se révèle par crans successifs. */
export function indicesLocalisationJusqua(e: EchelleIndices, cran: CranIndice) {
  const ordre: readonly CranIndice[] = [
    'aucun',
    'contextuel',
    'sensoriel',
    'directionnel',
    'zone',
    'revelation',
  ]
  const limite = ordre.indexOf(cran)
  return e.localisation.filter((i) => ordre.indexOf(i.cran) <= limite && i.cran !== 'aucun')
}

/* ------------------------------------------------------------------ */
/* Prélèvement                                                         */
/* ------------------------------------------------------------------ */

export interface EvaluationPrelevement {
  readonly autorise: boolean
  readonly statut: 'fait' | 'plausible' | 'inconnu'
  readonly raisons: readonly string[]
  /** Quantité maximale légale, `null` si non établie. */
  readonly quantiteMax: number | null
}

/**
 * Verrouillé par défaut. Le prélèvement n'est autorisé que si *toutes* les
 * conditions sont établies positivement, à jour et sur le bon territoire.
 */
export function evaluerPrelevement(
  nature: CadreNature,
  territoire: string,
  maintenant: Date = new Date(),
): EvaluationPrelevement {
  const raisons: string[] = []

  if (!nature.prelevementAutorise) {
    raisons.push('Cette opération se joue sans rien prélever. Observer suffit.')
    return { autorise: false, statut: 'fait', raisons, quantiteMax: null }
  }

  if (!nature.gestesAutorises.includes('prelever')) {
    raisons.push('Le prélèvement ne fait pas partie des gestes prévus par cette opération.')
    return { autorise: false, statut: 'fait', raisons, quantiteMax: null }
  }

  const regle: RegleCueillette | null = nature.regle
  if (regle === null) {
    raisons.push(
      'Aucune règle de cueillette vérifiée pour ce territoire. Je ne sais pas si c’est légal ici, donc je ne l’autorise pas.',
    )
    return { autorise: false, statut: 'inconnu', raisons, quantiteMax: null }
  }

  const permis = evaluerFait(regle.prelevementPermis, territoire, maintenant)
  if (!permis.utilisable) {
    raisons.push(permis.raison)
    return { autorise: false, statut: 'inconnu', raisons, quantiteMax: null }
  }
  if (permis.valeur !== true) {
    raisons.push('Le prélèvement de cette espèce n’est pas permis sur ce territoire.')
    return { autorise: false, statut: permis.statut === 'simule' ? 'plausible' : permis.statut, raisons, quantiteMax: null }
  }

  if (nature.especeSensible) {
    raisons.push('Espèce sensible : observation seulement, et position jamais publiée précisément.')
    return { autorise: false, statut: 'fait', raisons, quantiteMax: null }
  }

  let quantiteMax: number | null = null
  if (regle.quantiteMaxParAn !== null) {
    const q = evaluerFait(regle.quantiteMaxParAn, territoire, maintenant)
    if (!q.utilisable) {
      raisons.push(q.raison)
      return { autorise: false, statut: 'inconnu', raisons, quantiteMax: null }
    }
    quantiteMax = q.valeur
    raisons.push(`Limite légale connue : ${q.valeur} par personne et par an.`)
  }

  raisons.push(
    'Prélèvement possible dans ce cadre. Identification par image seule : jamais suffisante pour consommer quoi que ce soit.',
  )
  return { autorise: true, statut: 'fait', raisons, quantiteMax }
}

/* ------------------------------------------------------------------ */
/* Position d'une espèce sensible                                      */
/* ------------------------------------------------------------------ */

/**
 * Arrondi grossier appliqué avant toute publication. Environ 1 km de côté
 * sous nos latitudes.
 *
 * Cette couche est délibérément la nôtre : le masquage automatique
 * d'iNaturalist existe, mais sa propre documentation admet qu'il est
 * contournable. On ne délègue pas une règle de sécurité à un tiers.
 */
export function flouterPosition(
  pos: { lat: number; lon: number },
  especeSensible: boolean,
): { lat: number; lon: number; precisionMetres: number } {
  if (!especeSensible) return { ...pos, precisionMetres: 0 }
  return {
    lat: Math.round(pos.lat * 100) / 100,
    lon: Math.round(pos.lon * 100) / 100,
    precisionMetres: 1_000,
  }
}

/* ------------------------------------------------------------------ */
/* Vérifications                                                       */
/* ------------------------------------------------------------------ */

const GESTES_SANS_CONTACT: readonly GesteNature[] = [
  'observer',
  'photographier',
  'mesurer',
  'dessiner',
  'localiser',
]

/** Formulations qui poussent à ingérer. Interdites sans exception. */
const MOTIFS_INGESTION =
  /\b(mange[sz]?[- ](le|la|les|en)\b|goûte[sz]?[- ](le|la|les|en)\b|tu peux (le |la |les |l')?(manger|goûter|consommer|avaler)|bon à manger|prépare (une|-toi une) (tisane|infusion)|mets[- ]en dans (ta|une) (salade|assiette))/gi

/** Formulations qui poussent à prélever, quand le prélèvement est fermé. */
const MOTIFS_PRELEVEMENT =
  /\b(cueille[sz]?[- ](le|la|les|en)\b|arrache[sz]?[- ](le|la|les)\b|déterre[sz]?[- ](le|la|les)\b|rapporte[sz]?[- ]en (un|une|quelques)|remplis (ton|un) (sac|panier))/gi

export function verifierCadreNature(op: Operation): Violation[] {
  const nature = op.nature
  if (nature === undefined) return []

  const violations: Violation[] = []

  const textes = [
    op.titre,
    op.kicker,
    op.promesse,
    op.dixSecondes,
    ...op.etapes.flatMap((e) => [e.titre, e.corps, e.consigne ?? '']),
    ...op.bifurcations.flatMap((b) => [b.constat, b.suite]),
    ...(op.indices?.localisation.map((i) => i.texte) ?? []),
  ].join('\n')

  for (const extrait of textes.match(MOTIFS_INGESTION) ?? []) {
    violations.push({
      regle: 'ingestion-interdite',
      extrait,
      explication:
        'Aucune opération ne demande de consommer un produit sauvage. Une identification par image ne remplace jamais un avis compétent.',
    })
  }

  if (!nature.prelevementAutorise) {
    for (const extrait of textes.match(MOTIFS_PRELEVEMENT) ?? []) {
      violations.push({
        regle: 'prelevement-non-autorise',
        extrait,
        explication:
          'Cette opération est en mode observation. Son texte ne peut pas inviter à prélever.',
      })
    }
  }

  if (nature.gestesAutorises.length === 0) {
    violations.push({
      regle: 'gestes-nature-absents',
      extrait: op.id,
      explication: 'Une opération nature doit dire explicitement ce que le joueur a le droit de faire.',
    })
  }

  if (nature.especeSensible && nature.prelevementAutorise) {
    violations.push({
      regle: 'espece-sensible-prelevee',
      extrait: op.id,
      explication: 'Une espèce sensible ne se prélève pas, quelle que soit la règle générale.',
    })
  }

  if (nature.prelevementAutorise && nature.regle === null) {
    violations.push({
      regle: 'prelevement-sans-cadre-legal',
      extrait: op.id,
      explication:
        'Autoriser un prélèvement exige une règle datée et située. Sans elle, la réponse est « je ne sais pas », donc non.',
    })
  }

  if (nature.sosiesDangereux.length > 0) {
    const securite = op.indices?.securite ?? []
    const couvreLesSosies = securite.some((i) => i.categorie === 'sosie')
    if (!couvreLesSosies) {
      violations.push({
        regle: 'sosie-non-documente',
        extrait: op.id,
        explication:
          'Dès qu’une confusion dangereuse est possible, le canal de sécurité doit nommer le sosie. Ce canal est gratuit et non masquable.',
      })
    }
    const discrimination = securite.filter((i) => i.categorie === 'discrimination')
    if (discrimination.length < 2) {
      violations.push({
        regle: 'discrimination-insuffisante',
        extrait: op.id,
        explication:
          'Distinguer deux espèces demande au moins deux caractères concordants. Un seul critère ne suffit pas.',
      })
    }
  }

  if (
    !nature.prelevementAutorise &&
    !nature.gestesAutorises.every((g) => GESTES_SANS_CONTACT.includes(g))
  ) {
    violations.push({
      regle: 'geste-incoherent',
      extrait: op.id,
      explication: 'Le prélèvement est fermé, mais la liste des gestes autorisés le contient.',
    })
  }

  return violations
}

/** Cadre par défaut : observation seule, rien de plus. */
export function cadreNatureParDefaut(): CadreNature {
  return {
    prelevementAutorise: false,
    ingestionAutorisee: false,
    sosiesDangereux: [],
    regle: null,
    especeSensible: false,
    gestesAutorises: ['observer', 'photographier'],
  }
}
