import type { IdSourceContexte, StatutProvenance } from '../types'
import type { ZoneDeQuete } from '../privacy'

/**
 * Connecteurs.
 *
 * Une source externe ne rend jamais directement une valeur au moteur. Elle
 * rend une réponse qui porte sa provenance, sa précision, sa fraîcheur et sa
 * couverture — et surtout son plafond de statut.
 *
 * Deux règles gouvernent ce module :
 *
 * 1. **Un connecteur ne peut pas dépasser son plafond.** Une observation
 *    passée sur iNaturalist rend une espèce *plausible* ici et maintenant,
 *    jamais *avérée*. Le plafond est appliqué par le code, pas laissé à la
 *    prudence de l'appelant ni à celle d'un futur modèle.
 *
 * 2. **Zéro résultat n'est pas zéro phénomène.** Une source qui ne renvoie
 *    rien décrit sa propre couverture, pas le monde. `estVide` et
 *    `injoignable` sont deux états distincts, et aucun des deux ne signifie
 *    « il n'y a rien là-bas ».
 */

/* ------------------------------------------------------------------ */
/* Couverture                                                          */
/* ------------------------------------------------------------------ */

export type NiveauCouverture = 'inexploree' | 'partielle' | 'documentee'

export interface Couverture {
  readonly source: IdSourceContexte
  readonly interrogeeLe: string
  readonly rayonMetres: number
  /** Fenêtre temporelle réellement couverte par la requête. */
  readonly periode: string | null
  readonly resultats: number
  readonly niveau: NiveauCouverture
  /** Ce que cette source ne voit pas, dit d'avance. */
  readonly limitesConnues: readonly string[]
  /**
   * Toujours vrai. Aucune de nos sources ne prétend à l'exhaustivité, et
   * l'interface doit le répéter plutôt que laisser croire au silence.
   */
  readonly peutExisterAilleurs: true
}

export function niveauDeCouverture(resultats: number): NiveauCouverture {
  if (resultats === 0) return 'inexploree'
  if (resultats < 5) return 'partielle'
  return 'documentee'
}

/**
 * Formulation imposée pour une zone sans résultat.
 *
 * Jamais « personne n'a rien documenté ici ». L'absence de résultat chez nos
 * fournisseurs ne prouve pas l'absence de connaissance : elle prouve
 * seulement les limites de ce que nous avons branché.
 */
export function phraseCouverture(c: Couverture): string {
  if (c.niveau === 'inexploree') {
    return `Les sources actuellement connectées documentent peu cette zone. Interrogé le ${c.interrogeeLe.slice(0, 10)} dans un rayon de ${c.rayonMetres} m.`
  }
  if (c.niveau === 'partielle') {
    return `Peu de relevés ici : ${c.resultats} dans un rayon de ${c.rayonMetres} m. D’autres peuvent exister sans avoir été versés à cette source.`
  }
  return `${c.resultats} relevés dans un rayon de ${c.rayonMetres} m, interrogés le ${c.interrogeeLe.slice(0, 10)}.`
}

/* ------------------------------------------------------------------ */
/* Contrat                                                             */
/* ------------------------------------------------------------------ */

export interface RequeteConnecteur {
  /** Position déjà arrondie par la couche de confidentialité. */
  readonly zone: ZoneDeQuete
  readonly rayonMetres: number
  readonly signal: AbortSignal
}

export interface ReponseConnecteur<T> {
  readonly donnees: readonly T[]
  readonly statut: StatutProvenance
  readonly couverture: Couverture
  readonly precisionSpatialeMetres: number | null
  readonly precisionTemporelle: string | null
  readonly justification: string
  /** Ce qui s'applique quand la source n'a rien pu dire. */
  readonly repli: string | null
  readonly depuisCache: boolean
}

export interface Connecteur<T> {
  readonly id: IdSourceContexte
  readonly nom: string
  readonly licence: string
  readonly clefRequise: boolean
  /** Plafond de statut. Aucune donnée de cette source ne le dépasse. */
  readonly statutMaximal: StatutProvenance
  readonly ttlMs: number
  readonly timeoutMs: number
  readonly quotaParJour: number
  /** Maille minimale exigée avant de transmettre une position. */
  readonly mailleMetres: number
  readonly limitesConnues: readonly string[]
  readonly repli: string
  readonly precisionSpatialeMetres: number | null
  readonly precisionTemporelle: string | null
  interroger(r: RequeteConnecteur): Promise<readonly T[]>
}

/* ------------------------------------------------------------------ */
/* Plafond de statut                                                   */
/* ------------------------------------------------------------------ */

const RANG: Record<StatutProvenance, number> = {
  inconnu: 0,
  simule: 1,
  plausible: 2,
  fait: 3,
}

/** Ramène un statut sous le plafond du connecteur. Ne l'élève jamais. */
export function plafonner(
  souhaite: StatutProvenance,
  plafond: StatutProvenance,
): StatutProvenance {
  return RANG[souhaite] > RANG[plafond] ? plafond : souhaite
}

/* ------------------------------------------------------------------ */
/* Cache et quota                                                      */
/* ------------------------------------------------------------------ */

interface EntreeCache<T> {
  readonly cle: string
  readonly donnees: readonly T[]
  readonly ecriteLe: number
  readonly couverture: Couverture
}

export interface EtatConnecteurs {
  readonly cache: Map<string, EntreeCache<unknown>>
  readonly appels: Map<string, { jour: string; nombre: number }>
}

export function etatVierge(): EtatConnecteurs {
  return { cache: new Map(), appels: new Map() }
}

function cleDe(c: Connecteur<unknown>, r: RequeteConnecteur): string {
  return `${c.id}|${r.zone.lat.toFixed(4)}|${r.zone.lon.toFixed(4)}|${r.rayonMetres}`
}

function jourDe(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function appelsRestants(
  etat: EtatConnecteurs,
  c: Connecteur<unknown>,
  maintenant: Date = new Date(),
): number {
  const suivi = etat.appels.get(c.id)
  if (!suivi || suivi.jour !== jourDe(maintenant)) return c.quotaParJour
  return Math.max(0, c.quotaParJour - suivi.nombre)
}

function compter(etat: EtatConnecteurs, c: Connecteur<unknown>, maintenant: Date): void {
  const jour = jourDe(maintenant)
  const suivi = etat.appels.get(c.id)
  etat.appels.set(c.id, {
    jour,
    nombre: suivi && suivi.jour === jour ? suivi.nombre + 1 : 1,
  })
}

/* ------------------------------------------------------------------ */
/* Exécution                                                           */
/* ------------------------------------------------------------------ */

function couvertureVide(
  c: Connecteur<unknown>,
  r: RequeteConnecteur,
  maintenant: Date,
): Couverture {
  return {
    source: c.id,
    interrogeeLe: maintenant.toISOString(),
    rayonMetres: r.rayonMetres,
    periode: c.precisionTemporelle,
    resultats: 0,
    niveau: 'inexploree',
    limitesConnues: c.limitesConnues,
    peutExisterAilleurs: true,
  }
}

function echec<T>(
  c: Connecteur<T>,
  r: RequeteConnecteur,
  raison: string,
  maintenant: Date,
): ReponseConnecteur<T> {
  return {
    donnees: [],
    statut: 'inconnu',
    couverture: couvertureVide(c as Connecteur<unknown>, r, maintenant),
    precisionSpatialeMetres: null,
    precisionTemporelle: null,
    justification: raison,
    repli: c.repli,
    depuisCache: false,
  }
}

/**
 * Interroge une source, ou explique pourquoi elle n'a rien pu dire.
 *
 * Cette fonction ne lève jamais. Un réseau coupé, un quota épuisé, une
 * réponse hors délai ou une source qui répond n'importe quoi produisent tous
 * la même chose : un statut `inconnu`, une couverture honnête et une règle de
 * repli. Le moteur n'a donc aucun chemin par lequel une panne pourrait
 * devenir une affirmation.
 */
export async function interroger<T>(
  c: Connecteur<T>,
  r: Omit<RequeteConnecteur, 'signal'> & { signal?: AbortSignal },
  etat: EtatConnecteurs,
  maintenant: Date = new Date(),
): Promise<ReponseConnecteur<T>> {
  if (r.zone.mailleMetres < c.mailleMetres) {
    return echec(
      c,
      { ...r, signal: new AbortController().signal },
      `Position trop précise pour ${c.nom} : maille de ${r.zone.mailleMetres} m alors que ${c.mailleMetres} m suffisent. Rien n’a été transmis.`,
      maintenant,
    )
  }

  const cle = cleDe(c as Connecteur<unknown>, { ...r, signal: new AbortController().signal })
  const enCache = etat.cache.get(cle) as EntreeCache<T> | undefined
  if (enCache && maintenant.valueOf() - enCache.ecriteLe < c.ttlMs) {
    return {
      donnees: enCache.donnees,
      statut: plafonner(enCache.donnees.length > 0 ? 'fait' : 'inconnu', c.statutMaximal),
      couverture: enCache.couverture,
      precisionSpatialeMetres: c.precisionSpatialeMetres,
      precisionTemporelle: c.precisionTemporelle,
      justification: `${c.nom}, réponse conservée localement pour éviter un appel de plus.`,
      repli: enCache.donnees.length === 0 ? c.repli : null,
      depuisCache: true,
    }
  }

  if (appelsRestants(etat, c as Connecteur<unknown>, maintenant) <= 0) {
    return echec(
      c,
      { ...r, signal: new AbortController().signal },
      `Quota quotidien atteint pour ${c.nom}. Je préfère m’arrêter plutôt que deviner.`,
      maintenant,
    )
  }

  const controleur = new AbortController()
  const externe = r.signal
  if (externe) {
    if (externe.aborted) controleur.abort()
    else externe.addEventListener('abort', () => controleur.abort(), { once: true })
  }
  const minuterie = setTimeout(() => controleur.abort(), c.timeoutMs)

  try {
    compter(etat, c as Connecteur<unknown>, maintenant)
    const donnees = await c.interroger({
      zone: r.zone,
      rayonMetres: r.rayonMetres,
      signal: controleur.signal,
    })

    if (!Array.isArray(donnees)) {
      return echec(
        c,
        { ...r, signal: controleur.signal },
        `${c.nom} a répondu dans un format que je ne sais pas lire.`,
        maintenant,
      )
    }

    const couverture: Couverture = {
      source: c.id,
      interrogeeLe: maintenant.toISOString(),
      rayonMetres: r.rayonMetres,
      periode: c.precisionTemporelle,
      resultats: donnees.length,
      niveau: niveauDeCouverture(donnees.length),
      limitesConnues: c.limitesConnues,
      peutExisterAilleurs: true,
    }

    etat.cache.set(cle, {
      cle,
      donnees,
      ecriteLe: maintenant.valueOf(),
      couverture,
    } as EntreeCache<unknown>)

    return {
      donnees,
      statut: plafonner(donnees.length > 0 ? 'fait' : 'inconnu', c.statutMaximal),
      couverture,
      precisionSpatialeMetres: c.precisionSpatialeMetres,
      precisionTemporelle: c.precisionTemporelle,
      justification:
        donnees.length > 0
          ? `${c.nom} — ${donnees.length} résultat${donnees.length > 1 ? 's' : ''}. ${c.licence}.`
          : phraseCouverture(couverture),
      repli: donnees.length === 0 ? c.repli : null,
      depuisCache: false,
    }
  } catch (e) {
    const abandonne = controleur.signal.aborted
    return echec(
      c,
      { ...r, signal: controleur.signal },
      abandonne
        ? `${c.nom} n’a pas répondu dans le délai de ${c.timeoutMs} ms.`
        : `${c.nom} est injoignable : ${e instanceof Error ? e.message : 'raison inconnue'}.`,
      maintenant,
    )
  } finally {
    clearTimeout(minuterie)
  }
}

/* ------------------------------------------------------------------ */
/* Carte de couverture                                                 */
/* ------------------------------------------------------------------ */

export interface CarteCouverture {
  readonly zone: ZoneDeQuete
  readonly couvertures: readonly Couverture[]
  readonly sourcesInterrogees: readonly IdSourceContexte[]
  readonly totalResultats: number
  readonly phrase: string
}

/**
 * Nom interne `CarteCouverture`, nom narratif « Carte des ignorances ».
 *
 * Elle décrit ce que *nous* savons interroger, jamais ce qui existe. Rien de
 * ce qu'elle affiche ne peut être lu comme « il n'y a rien ici ».
 */
export function carteDeCouverture(
  zone: ZoneDeQuete,
  couvertures: readonly Couverture[],
): CarteCouverture {
  const total = couvertures.reduce((n, c) => n + c.resultats, 0)
  return {
    zone,
    couvertures,
    sourcesInterrogees: couvertures.map((c) => c.source),
    totalResultats: total,
    phrase:
      couvertures.length === 0
        ? 'Aucune source n’a encore été interrogée pour cette zone.'
        : total === 0
          ? `Les sources actuellement connectées documentent peu cette zone. ${couvertures.length} interrogée${couvertures.length > 1 ? 's' : ''}, aucun relevé rendu. D’autres données peuvent exister ailleurs.`
          : `${total} relevé${total > 1 ? 's' : ''} rendu${total > 1 ? 's' : ''} par ${couvertures.length} source${couvertures.length > 1 ? 's' : ''}. Cette carte décrit ce que je sais interroger, pas ce qui existe.`,
  }
}
