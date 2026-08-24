/**
 * Types du moteur Horaïsme.
 *
 * Séparation imposée : contexte, sécurité, provenance, composition, état,
 * preuves, mémoire, XP, affichage. Aucun de ces domaines ne doit importer
 * l'affichage, et l'affichage ne doit jamais recalculer une règle.
 */

/* ------------------------------------------------------------------ */
/* Provenance — les quatre statuts du Registre                         */
/* ------------------------------------------------------------------ */

export type StatutProvenance = 'fait' | 'plausible' | 'simule' | 'inconnu'

export interface Datum<T> {
  /** `null` obligatoire quand le statut est `inconnu`. */
  readonly valeur: T | null
  readonly statut: StatutProvenance
  /** D'où vient l'information. Jamais vide. */
  readonly source: string
  /** Pourquoi ce statut, en une phrase lisible par l'utilisateur. */
  readonly justification: string
  readonly capteA?: string
}

/* ------------------------------------------------------------------ */
/* Contexte                                                            */
/* ------------------------------------------------------------------ */

export type IdSourceContexte =
  | 'horloge'
  | 'position'
  | 'lumiere'
  | 'meteo'
  | 'saison'
  | 'mobilite'
  | 'budget'
  | 'historique'

export interface SourceContexte {
  readonly id: IdSourceContexte
  readonly nom: string
  readonly description: string
  /** Statut maximal que cette source peut produire dans la build actuelle. */
  readonly statutMax: StatutProvenance
  /** L'utilisateur peut couper n'importe quelle source. */
  readonly active: boolean
}

export interface Contexte {
  readonly heureLocale: Datum<string>
  readonly minutesDeLumiere: Datum<number>
  readonly meteo: Datum<string>
  readonly temperature: Datum<number>
  readonly saison: Datum<string>
  readonly zone: Datum<string>
  readonly coordonnees: Datum<{ lat: number; lon: number }>
  readonly rayonMobiliteMetres: Datum<number>
}

/* ------------------------------------------------------------------ */
/* Quêtes, missions, opérations                                        */
/* ------------------------------------------------------------------ */

export type FamilleAction = 'quete' | 'mission' | 'operation' | 'boss'

export type TypeEtape =
  | 'fragment' /* Observer  — recevoir sans comprendre */
  | 'inventaire' /* Lier      — confronter plusieurs lectures */
  | 'sortie' /* Agir      — quitter l'écran */
  | 'terrain' /* Observer le résultat */
  | 'ancrage' /* Ajuster   — ce que le réel a corrigé */

export interface Hypothese {
  readonly id: string
  readonly enonce: string
  /** Une hypothèse n'est jamais un fait, quelle que soit sa force. */
  readonly origine: 'joueur' | 'hora'
  readonly retenue: boolean
}

export interface Bifurcation {
  readonly id: string
  /** Ce que le joueur a réellement constaté sur place. */
  readonly constat: string
  readonly suite: string
  /** Un constat d'échec sincère reste une action réelle. */
  readonly echecSincere: boolean
  readonly xp: number
}

export interface Etape {
  readonly id: string
  readonly type: TypeEtape
  readonly titre: string
  readonly corps: string
  /** Consigne d'action réelle, absente des étapes purement narratives. */
  readonly consigne?: string
  /** Nombre minimal d'hypothèses concurrentes exigé (étapes `inventaire`). */
  readonly hypothesesMinimum?: number
  /** Coupe l'écran : la technologie s'efface pendant l'action. */
  readonly modePoche?: boolean
}

export interface Operation {
  readonly id: string
  readonly famille: FamilleAction
  readonly titre: string
  readonly kicker: string
  readonly promesse: string
  /**
   * Test des dix secondes. Champ obligatoire : si le joueur peut imaginer
   * la même activité en dix secondes, l'opération ne justifie pas l'app.
   * Une opération sans ce champ est rejetée au chargement.
   */
  readonly dixSecondes: string
  readonly dureeMinutes: readonly [number, number]
  readonly rayonMetres: number
  readonly etapes: readonly Etape[]
  readonly bifurcations: readonly Bifurcation[]
  /** Ce que HORA suppose sans pouvoir le garantir, exposé au joueur. */
  readonly suppositions: readonly Datum<string>[]
  /** Sources réellement utilisées pour composer la proposition. */
  readonly sourcesUtilisees: readonly IdSourceContexte[]
}

/* ------------------------------------------------------------------ */
/* Preuves et XP                                                       */
/* ------------------------------------------------------------------ */

export type TypePreuve = 'presence' | 'observation' | 'photo' | 'echange'

export interface Preuve {
  readonly id: string
  readonly type: TypePreuve
  readonly contenu: string
  readonly horodatage: string
}

export interface AttributionXp {
  readonly operationId: string
  readonly montant: number
  readonly motif: string
  /** Aucun XP sans preuve d'action réelle. Le tableau ne peut être vide. */
  readonly preuves: readonly Preuve[]
  readonly horodatage: string
}

/* ------------------------------------------------------------------ */
/* Mémoire du joueur                                                   */
/* ------------------------------------------------------------------ */

export interface EntreeRegistre {
  readonly id: string
  readonly operationId: string
  readonly enonce: string
  readonly statutInitial: StatutProvenance
  /** Ce que le réel a répondu. `null` tant que non confronté. */
  readonly verdictReel: string | null
  readonly horodatage: string
}

export interface Ancrage {
  readonly id: string
  readonly operationId: string
  readonly bifurcationId: string
  readonly observation: string
  readonly ajustement: string
  readonly horodatage: string
}

export interface LieuTerrain {
  readonly id: string
  readonly nom: string
  readonly lat: number
  readonly lon: number
  readonly revelePar: string
}

export interface MemoireJoueur {
  readonly xpTotal: number
  readonly attributions: readonly AttributionXp[]
  readonly registre: readonly EntreeRegistre[]
  readonly ancrages: readonly Ancrage[]
  readonly lieux: readonly LieuTerrain[]
  readonly operationsRefusees: readonly string[]
  readonly operationsAbandonnees: readonly string[]
}

/* ------------------------------------------------------------------ */
/* État d'une opération en cours                                       */
/* ------------------------------------------------------------------ */

export type Phase = 'avant' | 'pendant' | 'apres'

export interface EtatOperation {
  readonly operationId: string
  readonly phase: Phase
  readonly indexEtape: number
  readonly hypotheses: readonly Hypothese[]
  readonly preuves: readonly Preuve[]
  readonly bifurcationChoisie: string | null
  readonly demarreeA: string
}
