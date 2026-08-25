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
/* Faits externes — datés, situés, périssables                         */
/* ------------------------------------------------------------------ */

/**
 * Un `Datum` dit d'où vient une information. Un `FaitExterne` dit en plus
 * *quand* elle a été vérifiée, *où* elle s'applique et *quand elle cesse
 * d'être fiable*.
 *
 * Règle dure : aucun nombre relevé pendant une recherche (un compte
 * d'observations, une limite légale, un horaire) ne doit être figé comme
 * vérité permanente. Un fait externe périmé se dégrade en `inconnu`, il ne
 * reste jamais affiché tel quel.
 */
export interface FaitExterne<T> {
  /** `null` obligatoire quand le statut est `inconnu`. */
  readonly valeur: T | null
  readonly statut: StatutProvenance
  readonly source: string
  readonly url: string | null
  /** Juridiction ou territoire de validité. Ex. `CA-QC`, `CA-QC/quebec`. */
  readonly territoire: string
  /** Date de publication de la source, si connue. */
  readonly publieLe: string | null
  /** Quand *nous* l'avons vérifiée. Jamais vide. */
  readonly verifieLe: string
  /** Échéance explicite, ou `null` si exprimée par `validiteJours`. */
  readonly expireLe: string | null
  /** Durée de validité en jours à partir de `verifieLe`. */
  readonly validiteJours: number | null
  readonly licence: string
  /** Identifiant de la règle citée : article de loi, numéro de règlement. */
  readonly identifiantRegle: string | null
  /** Extrait littéral de la source, pour que l'utilisateur puisse recouper. */
  readonly texteOriginal: string | null
  readonly justification: string
  /** Ce que fait le système quand ce fait est périmé, absent ou hors territoire. */
  readonly repli: string
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

/**
 * La thématique dit *de quoi il s'agit*, la famille dit *quelle forme cela
 * prend*. Une enquête locale peut être une mission ou un Boss.
 */
export type ThematiqueOperation =
  | 'enquete-locale'
  | 'nature'
  | 'demystification'
  | 'savoir-incarne'
  | 'action'
  | 'perception'
  | 'temporalite'
  | 'boss'
  | 'cooperation'
  | 'echec-fertile'

export type NiveauPhysique = 'assis' | 'marche-douce' | 'marche-soutenue' | 'terrain-accidente'

/**
 * Déclencheurs contextuels, déclaratifs.
 *
 * Volontairement des données et non des fonctions : le moteur les évalue
 * lui-même, ce qui les rend inspectables, testables et non contournables par
 * une proposition venue de l'extérieur. Un futur maître de jeu génératif peut
 * en composer, jamais en exécuter.
 */
export type Declencheur =
  | { readonly type: 'saison'; readonly valeurs: readonly string[]; readonly raison: string }
  | { readonly type: 'lumiere-minimum'; readonly minutes: number; readonly raison: string }
  | {
      readonly type: 'heure'
      readonly deHeure: number
      readonly aHeure: number
      readonly raison: string
    }
  | { readonly type: 'meteo-requise'; readonly valeurs: readonly string[]; readonly raison: string }
  | { readonly type: 'meteo-exclue'; readonly valeurs: readonly string[]; readonly raison: string }
  | { readonly type: 'temperature-max'; readonly celsius: number; readonly raison: string }
  | { readonly type: 'temperature-min'; readonly celsius: number; readonly raison: string }

/**
 * Trois issues, jamais deux.
 *
 * `indetermine` est la plus importante : quand la donnée manque, le
 * déclencheur n'est pas « non satisfait ». L'absence d'information n'est pas
 * une information contraire.
 */
export type IssueDeclencheur = 'satisfait' | 'non-satisfait' | 'indetermine'

export interface ConsequencesOperation {
  /** Ce que l'opération ajoute au Terrain du joueur. */
  readonly terrain: string
  /** Ce qu'elle inscrit au Registre, et que le réel viendra confronter. */
  readonly registre: string
}

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
  readonly thematique: ThematiqueOperation
  readonly titre: string
  readonly kicker: string
  readonly promesse: string
  /** Ce que l'opération cherche à déplacer chez le joueur. Une phrase. */
  readonly intention: string
  /**
   * Test des dix secondes. Champ obligatoire : si le joueur peut imaginer
   * la même activité en dix secondes, l'opération ne justifie pas l'app.
   * Une opération sans ce champ est rejetée au chargement.
   */
  readonly dixSecondes: string
  /** Conditions contextuelles évaluées par le moteur avant proposition. */
  readonly declencheurs: readonly Declencheur[]
  readonly dureeMinutes: readonly [number, number]
  /** Plage de distance, du plus proche au plus éloigné. */
  readonly distanceMetres: readonly [number, number]
  readonly niveauPhysique: NiveauPhysique
  /** Ce que l'opération exige du corps et du terrain, dit franchement. */
  readonly accessibilite: string
  readonly materiel: readonly string[]
  readonly risques: readonly string[]
  /** Quand s'arrêter. Une opération qui ne sait pas s'interrompre est un piège. */
  readonly conditionsAbandon: readonly string[]
  readonly preuveAttendue: TypePreuve
  readonly etapes: readonly Etape[]
  readonly bifurcations: readonly Bifurcation[]
  /** Ce que HORA suppose sans pouvoir le garantir, exposé au joueur. */
  readonly suppositions: readonly Datum<string>[]
  /** Sources réellement utilisées pour composer la proposition. */
  readonly sourcesUtilisees: readonly IdSourceContexte[]
  /** Deux canaux d'indices séparés. Voir `EchelleIndices`. */
  readonly indices: EchelleIndices
  readonly consequences: ConsequencesOperation
  /** Présent dès qu'une opération met le joueur en contact avec du vivant. */
  readonly nature?: CadreNature
}

/* ------------------------------------------------------------------ */
/* Indices — deux canaux séparés                                       */
/* ------------------------------------------------------------------ */

/**
 * Canal A. Aide à *trouver*. Le joueur peut y renoncer contre plus d'XP.
 */
export type CranIndice =
  | 'aucun'
  | 'contextuel'
  | 'sensoriel'
  | 'directionnel'
  | 'zone'
  | 'revelation'

export interface IndiceLocalisation {
  readonly cran: CranIndice
  readonly texte: string
}

/**
 * Canal B. Aide à *ne pas se blesser* et à *ne pas confondre*.
 *
 * Jamais monnayable, toujours affiché en entier, à coût nul. Le joueur ne
 * peut pas l'échanger contre de l'XP : on ne paie personne pour retirer
 * l'information qui l'empêche de confondre deux espèces.
 */
export interface IndiceSecurite {
  readonly categorie: 'discrimination' | 'sosie' | 'legal' | 'interdit'
  readonly texte: string
}

export interface EchelleIndices {
  readonly localisation: readonly IndiceLocalisation[]
  readonly securite: readonly IndiceSecurite[]
}

/* ------------------------------------------------------------------ */
/* Nature — garde-fous de cueillette                                   */
/* ------------------------------------------------------------------ */

/** Ce que le joueur est autorisé à faire d'un organisme vivant. */
export type GesteNature = 'observer' | 'photographier' | 'mesurer' | 'dessiner' | 'localiser' | 'prelever'

export interface RegleCueillette {
  readonly espece: string
  readonly territoire: string
  readonly prelevementPermis: FaitExterne<boolean>
  readonly quantiteMaxParAn: FaitExterne<number> | null
  readonly statutConservation: FaitExterne<string> | null
  readonly ventePermise: FaitExterne<boolean> | null
  readonly sanction: FaitExterne<string> | null
}

export interface CadreNature {
  /** Défaut `false`. Toute opération nature part sans droit de prélèvement. */
  readonly prelevementAutorise: boolean
  /**
   * Type littéral `false` : aucune opération ne peut compiler avec `true`.
   * La règle « jamais d'ingestion sur identification par image » devient
   * une erreur du compilateur, pas une intention documentée.
   */
  readonly ingestionAutorisee: false
  /** Espèces avec lesquelles une confusion est possible et coûteuse. */
  readonly sosiesDangereux: readonly string[]
  /** Cadre légal daté et situé. Périmé ou absent ⇒ prélèvement verrouillé. */
  readonly regle: RegleCueillette | null
  /** Si vrai, la position n'est jamais publiée à une précision exploitable. */
  readonly especeSensible: boolean
  readonly gestesAutorises: readonly GesteNature[]
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
