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
  /**
   * Champ qui appartient au joueur. Sa présence signale au moteur qu'aucune
   * valeur ne peut y être pré-écrite, quelle qu'en soit l'origine.
   */
  readonly saisie?: ChampSaisie
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
  /**
   * Ce que l'opération avance et que le terrain peut démentir. Au moins une :
   * une opération qui n'affirme rien de réfutable ne se prête pas au
   * Contrechamp.
   */
  readonly propositions: readonly PropositionOperation[]
  /** Sources réellement utilisées pour composer la proposition. */
  readonly sourcesUtilisees: readonly IdSourceContexte[]
  /** Deux canaux d'indices séparés. Voir `EchelleIndices`. */
  readonly indices: EchelleIndices
  readonly consequences: ConsequencesOperation
  /** Présent dès qu'une opération met le joueur en contact avec du vivant. */
  readonly nature?: CadreNature
  /** Présent dès qu'une opération touche à un inconfort choisi. */
  readonly enjeu?: CadreEnjeu
  /** Présent dès qu'une opération met le joueur en contact avec un tiers. */
  readonly tiers?: CadreTiers
  /** Présent dès qu'une opération produit un savoir à rappeler plus tard. */
  readonly savoir?: CadreSavoir
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
/* Souveraineté des champs — ce que HORA ne remplit jamais             */
/* ------------------------------------------------------------------ */

/**
 * Les champs qui appartiennent au joueur.
 *
 * La règle n'est pas « HORA ne génère rien ». HORA a le droit de composer une
 * opération, une contrainte, une question, une contradiction, une information
 * sourcée, un exemple identifié comme tel, et des hypothèses concurrentes
 * présentées comme concurrentes.
 *
 * Ce qu'il ne peut pas faire, c'est écrire *à la place* du joueur dans l'un de
 * ces huit champs. Une app qui rédige ton souvenir te l'a pris.
 */
export type ChampSouverain =
  | 'engagement'
  | 'souvenir'
  | 'observation'
  | 'temoignage'
  | 'interpretation'
  | 'verdict'
  | 'creation'
  | 'savoir-recu'

export interface ChampSaisie {
  readonly champ: ChampSouverain
  /** Poser la question est permis. C'est y répondre qui ne l'est pas. */
  readonly invite: string
  /**
   * Type littéral `null` : aucune opération ne peut compiler avec un
   * pré-remplissage sur un champ de souveraineté. Comme pour
   * `ingestionAutorisee`, la règle devient une erreur du compilateur.
   */
  readonly valeurPreRemplie: null
  /**
   * Exemples explicitement présentés comme des exemples. Autorisés : ils
   * montrent la forme attendue sans fournir le contenu.
   */
  readonly exemples?: readonly string[]
}

/* ------------------------------------------------------------------ */
/* Le tiers humain                                                     */
/* ------------------------------------------------------------------ */

/**
 * Ce qu'on peut, avec accord, conserver d'une personne qui transmet.
 *
 * Aucune de ces données n'est nécessaire pour accomplir une transmission :
 * le savoir se conserve sans identifier personne. Si le transmetteur veut
 * être crédité, son nom devient une attribution volontaire — jamais une
 * pièce justificative.
 */
export type DonneeTiers = 'nom' | 'voix' | 'photo' | 'oeuvre' | 'position' | 'publication'

export interface ConsentementTiers {
  readonly donnee: DonneeTiers
  readonly accorde: boolean
  readonly obtenuLe: string
  /** Un consentement révoqué entraîne la suppression, pas un simple drapeau. */
  readonly revoqueLe: string | null
  /**
   * Obligatoire pour `position` : une position ne peut être conservée que
   * si elle désigne un lieu public. Jamais un domicile.
   */
  readonly lieuPublic?: boolean
}

export interface Transmetteur {
  /** Identifiant local opaque. Ne contient jamais de nom. */
  readonly id: string
  /** Défaut du système, et cas normal. */
  readonly anonyme: boolean
  readonly consentements: readonly ConsentementTiers[]
  /** Non `null` uniquement si le consentement `nom` est accordé et vivant. */
  readonly attribution: string | null
}

export interface CadreTiers {
  /** Type littéral : aucune opération ne peut exiger l'identification. */
  readonly anonymeParDefaut: true
  /** Ce qui *peut* être demandé, jamais ce qui doit l'être. */
  readonly donneesFacultatives: readonly DonneeTiers[]
  /** Ce que le joueur annonce au tiers avant de commencer. */
  readonly formuleDeConsentement: string
  /** Comment l'opération se termine si le tiers refuse. Sans pénalité. */
  readonly siRefus: string
}

/* ------------------------------------------------------------------ */
/* Boss — engagements autodéterminés                                   */
/* ------------------------------------------------------------------ */

/**
 * Trois classes, et une seule que le moteur compose librement.
 *
 * `hors-cadre` couvre le trauma, la violence, l'automutilation, la crise
 * psychologique, le danger physique sérieux et l'illégalité. Aucune quête
 * d'exposition n'y est jamais générée — le moteur n'a rien à y faire, et
 * prétendre le contraire serait la faute la plus grave possible ici.
 */
export type ClasseEnjeu = 'defi-ordinaire' | 'enjeu-sensible' | 'hors-cadre'

/**
 * Trois axes évalués séparément.
 *
 * Une chose qui ne coûte rien au corps peut coûter beaucoup au social. Les
 * confondre dans une note unique de « difficulté » efface exactement
 * l'information dont le joueur a besoin pour choisir.
 */
export interface AxesDifficulte {
  readonly physique: 0 | 1 | 2 | 3
  readonly social: 0 | 1 | 2 | 3
  readonly emotionnel: 0 | 1 | 2 | 3
}

/**
 * Un palier.
 *
 * Aucun champ `xp` : c'est délibéré et c'est structurel. Un palier ne peut
 * pas rapporter davantage parce qu'il fait plus peur. Le type rend
 * impossible de rémunérer la souffrance.
 */
export interface Palier {
  readonly id: string
  readonly ordre: number
  readonly formulation: string
  /** Réversible en tout temps. Type littéral : aucune autre valeur ne compile. */
  readonly reversible: true
  readonly difficulte: AxesDifficulte
  /** Confirmé par le joueur au moment de l'exécuter, jamais d'avance. */
  readonly confirmeLe: string | null
  readonly accompliLe: string | null
  /** Renoncer à un palier n'a aucun effet. Consigné pour le joueur seul. */
  readonly renonceLe: string | null
}

export interface Engagement {
  readonly id: string
  /** Les mots du joueur. Jamais générés, jamais reformulés. */
  readonly formulationDuJoueur: string
  /** Type littéral : un engagement d'origine HORA ne compile pas. */
  readonly origine: 'joueur'
  readonly classe: ClasseEnjeu
  /** Tous les paliers, visibles dès le départ. Aucun palier secret. */
  readonly paliers: readonly Palier[]
  readonly creeLe: string
  readonly closLe: string | null
  readonly noteDeCloture: string | null
}

/** Ce qu'une opération de type Boss déclare sur son propre terrain. */
export interface CadreEnjeu {
  readonly classe: ClasseEnjeu
  readonly difficulte: AxesDifficulte
  /** Comment tout arrêter, immédiatement, écrit noir sur blanc. */
  readonly arretImmediat: string
  /** Ce que l'opération ne prétend pas faire. Dit avant, pas après. */
  readonly nonPrise: string
}

/* ------------------------------------------------------------------ */
/* La deuxième fois — transmission et rappel différé                   */
/* ------------------------------------------------------------------ */

export type CategorieSavoir =
  | 'geste'
  | 'histoire'
  | 'recette'
  | 'orientation'
  | 'technique'
  | 'saisonnier'

/** La preuve n'est jamais l'identité du transmetteur. */
export type FormePreuveRappel =
  | 'reformulation'
  | 'reproduction-geste'
  | 'resultat-materiel'
  | 'croquis'
  | 'demonstration'
  | 'enregistrement'
  | 'correction-du-transmetteur'

export interface CadreSavoir {
  readonly categorie: CategorieSavoir
  /**
   * Fenêtre minimale avant le rappel. Déclarée par l'opération, jamais
   * universelle : un geste simple ne s'oublie pas au même rythme qu'une
   * histoire ou qu'un savoir saisonnier.
   */
  readonly fenetreMinimaleJours: number
  readonly justificationFenetre: string
  readonly formesDePreuve: readonly FormePreuveRappel[]
}

export interface Rappel {
  /** Réécrit de mémoire par le joueur, original masqué pendant la saisie. */
  readonly enonceDeMemoire: string
  readonly forme: FormePreuveRappel
  /**
   * Le verdict est humain, intégralement. HORA affiche les deux versions
   * côte à côte et se tait : aucune similarité, aucune note, aucun
   * pourcentage de maîtrise. Noter un savoir humain, c'est le confisquer.
   */
  readonly verdictDuJoueur: 'tenu' | 'partiel' | 'perdu'
  readonly noteDuJoueur: string
  readonly rappeleLe: string
}

export interface SavoirRecu {
  readonly id: string
  readonly operationId: string
  readonly categorie: CategorieSavoir
  /** Écrit par le joueur au retour. Jamais par HORA. */
  readonly enonceInitial: string
  readonly recuLe: string
  readonly fenetreMinimaleJours: number
  readonly justificationFenetre: string
  /** `null` est le cas normal : la transmission n'exige aucune collecte. */
  readonly transmetteur: Transmetteur | null
  readonly rappel: Rappel | null
}

/**
 * Rappel local, créé explicitement par le joueur.
 *
 * Aucun champ de récurrence : le type interdit la répétition automatique.
 * Il ne quitte pas l'appareil et se supprime en un geste.
 */
export interface RappelLocal {
  readonly savoirId: string
  readonly dateSouhaitee: string
  readonly creeLe: string
}

/* ------------------------------------------------------------------ */
/* Le Constat                                                          */
/* ------------------------------------------------------------------ */

export type CategorieConstat =
  | 'ecart-thematique'
  | 'ecart-exigence'
  | 'abandon'
  | 'rappel-en-attente'

/**
 * Un fait de jeu, suivi d'un aveu d'ignorance.
 *
 * « Tu as écarté quatre opérations qui comportaient une conversation avec
 * une personne inconnue. Je ne sais pas pourquoi. »
 *
 * Quatre refus ne font pas un profil psychologique. Le compte est
 * observable, la cause ne l'est pas — et HORA s'arrête exactement là.
 */
export interface Constat {
  readonly id: string
  readonly categorie: CategorieConstat
  readonly enonce: string
  /** Les événements qui l'ont produit, consultables un par un. */
  readonly evenementIds: readonly string[]
  readonly produitLe: string
}

export interface ReglagesConstat {
  /** Désactivé jusqu'à consentement explicite. */
  readonly actif: boolean
  readonly categoriesExclues: readonly CategorieConstat[]
  /** Le joueur peut interdire définitivement qu'il serve à composer. */
  readonly alimenteLaComposition: boolean
  /** Constats rejetés par le joueur : jamais reproduits. */
  readonly constatsRejetes: readonly string[]
}

export const REGLAGES_CONSTAT_PAR_DEFAUT: ReglagesConstat = {
  actif: false,
  categoriesExclues: [],
  alimenteLaComposition: false,
  constatsRejetes: [],
}

/* ------------------------------------------------------------------ */
/* Contrechamp du réel                                                 */
/* ------------------------------------------------------------------ */

/**
 * Ce que l'opération avance et qui peut être démenti.
 *
 * Distinct des `suppositions`, et la distinction compte : une supposition dit
 * *d'où vient* une information, une proposition dit *ce qu'on devrait
 * observer si elle est vraie*. Le statut de provenance ne décrit pas la
 * vérité d'un énoncé — confondre les deux rendrait tout démenti illusoire.
 *
 * Sans `resultatAttendu` explicite, rien ne peut être contredit.
 */
export interface PropositionOperation {
  readonly id: string
  /** L'affirmation, en clair. */
  readonly enonce: string
  /** Ce qu'on devrait constater sur place si l'affirmation tient. */
  readonly resultatAttendu: string
  /** Confiance affichée, bornée de 0 à 1. */
  readonly confiance: number
  /** Provenance de l'affirmation, pas sa vérité. */
  readonly statutEpistemique: StatutProvenance
}

/**
 * Trois issues. `indeterminee` n'est pas un échec de mesure : c'est le cas
 * le plus fréquent et le plus honnête. Une absence de preuve ne bascule
 * jamais d'elle-même en contradiction.
 */
export type IssueVerification = 'confirmee' | 'contredite' | 'indeterminee'

export interface Verification {
  readonly id: string
  readonly operationId: string
  readonly propositionId: string
  readonly propositionInitiale: string
  readonly resultatAttendu: string
  readonly confianceInitiale: number
  readonly statutEpistemique: StatutProvenance
  /** Ce que le joueur a réellement constaté. `null` tant qu'il n'a rien dit. */
  readonly observationReelle: string | null
  readonly issue: IssueVerification
  /** Preuves rattachées. Un démenti sans preuve n'est pas un démenti. */
  readonly preuveIds: readonly string[]
  readonly proposeeLe: string
  readonly trancheeLe: string | null
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
  /** Contrechamp : ce que HORA a avancé, et ce que le terrain en a fait. */
  readonly verifications: readonly Verification[]
  readonly ancrages: readonly Ancrage[]
  readonly lieux: readonly LieuTerrain[]
  readonly operationsRefusees: readonly string[]
  readonly operationsAbandonnees: readonly string[]
  /** Boss : ce que le joueur a nommé lui-même. */
  readonly engagements: readonly Engagement[]
  /** Savoirs reçus d'un humain, en attente de leur deuxième fois. */
  readonly savoirs: readonly SavoirRecu[]
  /** Rappels créés explicitement par le joueur. Locaux, non récurrents. */
  readonly rappelsLocaux: readonly RappelLocal[]
  readonly reglagesConstat: ReglagesConstat
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
