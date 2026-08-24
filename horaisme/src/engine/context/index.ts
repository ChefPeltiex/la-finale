import type { Contexte, IdSourceContexte, SourceContexte } from '../types'
import { fait, inconnu, plausible, simule } from '../provenance'

/**
 * Données contextuelles.
 *
 * Chaque source déclare le statut maximal qu'elle peut honnêtement produire
 * dans la build actuelle, et chacune peut être coupée par l'utilisateur.
 */

export const SOURCES_PAR_DEFAUT: readonly SourceContexte[] = [
  {
    id: 'horloge',
    nom: 'Horloge locale',
    description: 'L’heure de ton appareil. Sert à savoir ce qui est encore possible aujourd’hui.',
    statutMax: 'fait',
    active: true,
  },
  {
    id: 'position',
    nom: 'Position approximative',
    description:
      'Uniquement si tu l’autorises. Sans autorisation, une position de démonstration est utilisée.',
    statutMax: 'fait',
    active: true,
  },
  {
    id: 'lumiere',
    nom: 'Lumière restante',
    description: 'Calcul astronomique du coucher du soleil. Non corrigé du relief réel.',
    statutMax: 'plausible',
    active: true,
  },
  {
    id: 'meteo',
    nom: 'Météo',
    description: 'Aucun service météo n’est branché. HORA répondra « je ne sais pas ».',
    statutMax: 'inconnu',
    active: true,
  },
  {
    id: 'saison',
    nom: 'Saison',
    description: 'Déduite de la date et de l’hémisphère.',
    statutMax: 'fait',
    active: true,
  },
  {
    id: 'mobilite',
    nom: 'Rayon de déplacement',
    description: 'Ce que tu déclares pouvoir parcourir. Tu peux le changer à tout moment.',
    statutMax: 'fait',
    active: true,
  },
  {
    id: 'budget',
    nom: 'Budget',
    description: 'Non déclaré pour l’instant. Aucune opération payante n’est proposée.',
    statutMax: 'inconnu',
    active: true,
  },
  {
    id: 'historique',
    nom: 'Historique de terrain',
    description: 'Tes ancrages passés, conservés uniquement sur cet appareil.',
    statutMax: 'fait',
    active: true,
  },
]

/** Position de repli, explicitement simulée. Vieux-Québec. */
export const POSITION_DEMO = { lat: 46.8139, lon: -71.208 }

const MS_PAR_JOUR = 86_400_000
const J1970 = 2_440_587.5
const J2000 = 2_451_545
const RAD = Math.PI / 180

function versJulien(d: Date): number {
  return d.valueOf() / MS_PAR_JOUR + J1970
}

function depuisJulien(j: number): Date {
  return new Date((j - J1970) * MS_PAR_JOUR)
}

/**
 * Coucher du soleil par l'algorithme solaire usuel. Volontairement classé
 * `plausible` : le calcul ignore le relief, les bâtiments et la réfraction
 * réelle. C'est une approximation utile, pas une certitude.
 */
export function coucherDuSoleil(date: Date, lat: number, lon: number): Date {
  const n = Math.round(versJulien(date) - J2000 - 0.0009 + lon / 360)
  const jEtoile = n + 0.0009 - lon / 360
  const m = (357.5291 + 0.98560028 * jEtoile) % 360
  const c = 1.9148 * Math.sin(m * RAD) + 0.02 * Math.sin(2 * m * RAD) + 0.0003 * Math.sin(3 * m * RAD)
  const lambda = (m + c + 180 + 102.9372) % 360
  const jTransit = J2000 + jEtoile + 0.0053 * Math.sin(m * RAD) - 0.0069 * Math.sin(2 * lambda * RAD)
  const declinaison = Math.asin(Math.sin(lambda * RAD) * Math.sin(23.44 * RAD))
  const cosOmega =
    (Math.sin(-0.833 * RAD) - Math.sin(lat * RAD) * Math.sin(declinaison)) /
    (Math.cos(lat * RAD) * Math.cos(declinaison))

  if (cosOmega > 1) return depuisJulien(jTransit)
  if (cosOmega < -1) return depuisJulien(jTransit + 0.5)

  const omega = Math.acos(cosOmega) / RAD
  return depuisJulien(jTransit + omega / 360)
}

export function saisonDe(date: Date): string {
  const m = date.getMonth()
  if (m === 11 || m <= 1) return 'Hiver'
  if (m <= 4) return 'Printemps'
  if (m <= 7) return 'Été'
  return 'Automne'
}

export interface EntreeContexte {
  readonly maintenant: Date
  readonly position: { lat: number; lon: number } | null
  readonly positionAutorisee: boolean
  readonly rayonDeclareMetres: number | null
  readonly sources: readonly SourceContexte[]
}

function actif(sources: readonly SourceContexte[], id: IdSourceContexte): boolean {
  return sources.find((s) => s.id === id)?.active ?? false
}

/** Assemble le contexte. Toute source coupée produit un datum `inconnu`. */
export function assemblerContexte(e: EntreeContexte): Contexte {
  const pos = e.position ?? POSITION_DEMO
  const positionReelle = e.positionAutorisee && e.position !== null

  const heureLocale = actif(e.sources, 'horloge')
    ? fait(
        e.maintenant.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
        'Horloge de l’appareil',
        'Lue directement sur ton appareil.',
      )
    : inconnu<string>('Horloge locale', 'Source désactivée par toi.')

  const coordonnees = !actif(e.sources, 'position')
    ? inconnu<{ lat: number; lon: number }>('Position', 'Source désactivée par toi.')
    : positionReelle
      ? fait(pos, 'Géolocalisation du navigateur', 'Autorisation accordée sur cet appareil.')
      : simule(
          POSITION_DEMO,
          'Position de démonstration',
          'Aucune autorisation de géolocalisation. Vieux-Québec est utilisé comme repli.',
        )

  const zone = !actif(e.sources, 'position')
    ? inconnu<string>('Position', 'Source désactivée par toi.')
    : positionReelle
      ? plausible(
          'Ta zone actuelle',
          'Géolocalisation du navigateur',
          'Coordonnées réelles, mais le nom du quartier n’est pas vérifié auprès d’un service.',
        )
      : simule('Vieux-Québec', 'Position de démonstration', 'Zone de repli pour la démonstration.')

  let minutesDeLumiere = inconnu<number>('Lumière restante', 'Source désactivée par toi.')
  if (actif(e.sources, 'lumiere') && actif(e.sources, 'position')) {
    const coucher = coucherDuSoleil(e.maintenant, pos.lat, pos.lon)
    const minutes = Math.max(0, Math.round((coucher.valueOf() - e.maintenant.valueOf()) / 60_000))
    minutesDeLumiere = plausible(
      minutes,
      'Calcul astronomique local',
      'Approximation du coucher du soleil. Le relief et les bâtiments ne sont pas pris en compte.',
    )
  }

  const meteo = inconnu<string>(
    'Météo',
    'Aucun service météo n’est branché dans cette version. Je ne sais pas.',
  )

  const temperature = inconnu<number>(
    'Météo',
    'Aucun service météo n’est branché dans cette version. Je ne sais pas.',
  )

  const saison = actif(e.sources, 'saison')
    ? fait(saisonDe(e.maintenant), 'Date de l’appareil', 'Déduite de la date, hémisphère nord.')
    : inconnu<string>('Saison', 'Source désactivée par toi.')

  const rayonMobiliteMetres =
    actif(e.sources, 'mobilite') && e.rayonDeclareMetres !== null
      ? fait(e.rayonDeclareMetres, 'Déclaration du joueur', 'Tu as toi-même fixé cette distance.')
      : inconnu<number>('Rayon de déplacement', 'Tu ne l’as pas encore déclaré.')

  return {
    heureLocale,
    minutesDeLumiere,
    meteo,
    temperature,
    saison,
    zone,
    coordonnees,
    rayonMobiliteMetres,
  }
}

/** Distance approximative entre deux points, en mètres. */
export function distanceMetres(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6_371_000
  const dLat = (b.lat - a.lat) * RAD
  const dLon = (b.lon - a.lon) * RAD
  const lat1 = a.lat * RAD
  const lat2 = b.lat * RAD
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return Math.round(2 * R * Math.asin(Math.sqrt(h)))
}
