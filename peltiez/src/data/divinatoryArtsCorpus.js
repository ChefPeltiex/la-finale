/**
 * Lexique comparé — arts divinatoires (cadre anthropologique, psychologie, cadre légal indicatif).
 * Pas de promesse de vérité surnaturelle ; distinction fiction / outil d’introspection / commerce.
 */

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   domain: string,
 *   overview: string,
 *   modalities: string[],
 *   evidence: string,
 *   precautions: string,
 *   legalNote: string,
 *   seeDoctor: string[],
 *   grimoireVerse: {
 *     sortilege: string,
 *     enchantement: string,
 *     potionArtefact: string,
 *     pouvoirMagique: string,
 *     utiliteDuRite: string,
 *     puissance: string,
 *     miseEnScene: string,
 *   },
 * }} DivinatoryFamily
 */

/** @type {DivinatoryFamily[]} */
export const DIVINATORY_ARTS_FAMILIES = [
  {
    id: "tarot",
    label: "Tarot & cartes symboliques",
    domain: "Jeux de cartes à signification conventionnelle ; interprétation narrative",
    overview:
      "Le tarot (Marseille, Waite-Smith, Thoth, jeux contemporains) fonctionne comme langage d’images et de positions : tirage, récit, projection. Les études psychologiques parlent d’effets de sens, de priming et de cadre thérapeutique lorsque le praticien est formé — pas de prédiction physique des événements. Les dérives : prix excessifs, peur, « malédictions » à payer pour lever.",
    modalities: ["Tirages positions fixes, journal de tirage, comparaison des écoles de lecture.", "Distinction jeu / thérapie / spectacle.", "Éthique : aucune décision majeure imposée par une carte."],
    evidence:
      "Recherches en psychologie sur projection, archétypes (usage critique du terme), cadre narratif ; pas de reproductibilité « physique » des tirages comme instrument de mesure.",
    precautions:
      "Vulnérabilité émotionnelle, dépendance aux consultations, arnaques ; ne pas remplacer avis juridique, médical ou financier par une interprétation.",
    legalNote:
      "Statut professionnel variable (psychologue, coach, « voyant ») selon pays ; publicité encadrée ; mineurs protégés.",
    seeDoctor: ["Idées suicidaires ou crise aiguë — contacter urgences / psychiatre", "Violences conjugales révélées en séance", "Addiction aux tirages quotidiens"],
    grimoireVerse: {
      sortilege: "**Arc mineur du recadrage** : retourner une carte = poser une question au récit, pas au destin.",
      enchantement: "**Voile du spread** : chaque position est un rôle théâtral, pas une loi physique.",
      potionArtefact: "**Paquet du traité** — artefact imprimé ; sa puissance = qualité de l’attention.",
      pouvoirMagique: "Invocation de **métaphores** : utile pour langage intérieur ; inutile pour contraindre autrui.",
      utiliteDuRite: "Scène de **table ronde symbolique** : voix, silence, consentement à la fiction.",
      puissance: "Puissance **II/V** introspective ; **0/V** comme oracle judiciaire.",
      miseEnScene: "Nappe sombre, bougie éteinte avant la fin, carnet ouvert — la dernière ligne est toujours humaine.",
    },
  },
  {
    id: "astrologie-natale",
    label: "Astrologie natale (cadrage)",
    domain: "Carte du ciel à la naissance ; traditions hellénistiques, modernes, indiennes",
    overview:
      "L’astrologie natal relie positions planétaires à interprétations culturelles. Les tests empiriques globaux (e.g. « signe » et personnalité) ne montrent pas d’effet robuste au-delà du biais de confirmation ; l’intérêt anthropologique et historique reste massif. Les maisons, aspects et techniques (progressions, transits) forment un système dense à enseigner avec honnêteté sur les limites prédictives.",
    modalities: ["Calcul d’éphémérides, fuseaux, correction historique du calendrier.", "Jyotiṣa vs astrologie occidentale : cadres différents.", "Astrologie psychologique (post-Jung) : métaphore, pas diagnostic DSM."],
    evidence:
      "Études statistiques sur Sun-sign et traits : résultats nuls ou fragiles ; littérature sociologique sur croyance et communautés.",
    precautions:
      "Éviter fatalisme, discrimination (embauche, couple) basée sur carte ; éviter prédiction médicale.",
    legalNote:
      "Annonce commerciale encadrée ; certaines juridictions exigent disclaimers ; distinction divertissement / conseil réglementé.",
    seeDoctor: ["Toute décision de santé basée uniquement sur transits", "Isolement social par peur des rétrogrades"],
    grimoireVerse: {
      sortilege: "**Tracer le cercle des maisons** sans confondre carte et territoire.",
      enchantement: "**Sceau du natal** : rappeler que le thème est une photographie symbolique, pas une empreinte digitale du destin.",
      potionArtefact: "**Globe éphéméride** — logiciel honnête qui cite sources astronomiques.",
      pouvoirMagique: "Lecture du **champ stellaire** comme poésie temporelle ; pas de gravité supplémentaire sur la vie réelle.",
      utiliteDuRite: "Atelier de **vocabulaire intérieur** : nommer phases sans les subir comme ordres.",
      puissance: "Puissance **III/V** culturelle ; **I/V** empirique globale.",
      miseEnScene: "Salle circulaire, projecteur céleste, chaise tournante — le sujet garde le volant.",
    },
  },
  {
    id: "astrologie-chinoise",
    label: "Astrologie chinoise (Ba Zi, calendrier)",
    domain: "Piliers du destin, cycles sexagénaires, branches et tiges",
    overview:
      "Les systèmes chinois (bazi, sélection de dates) relient calendrier sexagésinaire et wuxing à des interprétations. Pratiques vivantes en Asie et diaspora ; réception occidentale parfois simplifiée. L’approche pédagogique distingue calcul technique, folklore et marketing « animal sign ».",
    modalities: ["Conversion calendaire luni-solaire, fuseaux, heure solaire vraie.", "Distinction folklore zodiacal pop vs analyse de quatre piliers.", "Respect des praticiens et des lignées."],
    evidence:
      "Études statistiques généralement absentes ou locales ; importance ethnographique et commerciale.",
    precautions:
      "Éviter stéréotypes ethniques ; éviter décisions d’investissement sur « jour propice » seul.",
    legalNote:
      "Produits et consultations : droit local ; publicité honnête sur ce qui est calculé vs interprété.",
    seeDoctor: ["Détresse majeure interprétée comme « malchance structurelle » sans soutien humain"],
    grimoireVerse: {
      sortilege: "**Compter les soixante-dix combinaisons** sans oublier le contexte social du consultant.",
      enchantement: "**Boucle du cycle** : chaque année redevient question, pas sentence.",
      potionArtefact: "**Compas à baguettes** — calendrier et règle ; pas baguette magique.",
      pouvoirMagique: "Organiser le **temps vécu** en chapitres ; ne pas figer l’avenir.",
      utiliteDuRite: "Scène de **atelier calendaire** : tableaux, pas mystère obscur.",
      puissance: "Puissance **III/V** rituelle communautaire ; prudence **V/V** si instrumentalisation financière.",
      miseEnScene: "Rouleaux suspendus, encre fraîche, fenêtre sur cour — le dehors continue sans le rituel.",
    },
  },
  {
    id: "yi-jing",
    label: "Yi Jing (Classique des mutations)",
    domain: "Texte chinois ancien ; tirages par achillea ou numériques",
    overview:
      "Le Zhouyi / Yi Jing combine textes oraculaires et commentaires philosophiques (Confucianisme, taoïsme). Les tirages (achillée, pièces, apps) produisent des lignes et hexagrammes ; la lecture mêle poésie, éthique et stratégie. Ce n’est pas une table de probabilités validée pour décisions critiques.",
    modalities: ["Traductions comparées (Wilhelm, Lynn…), lecture des ailes (Xici).", "Tirage manuel vs RNG : honnêteté sur le geste.", "Contextualisation historique vs « secret d’Orient »."],
    evidence:
      "Corpus philologique solide ; pas d’effet paranormal documenté au sens scientifique moderne.",
    precautions:
      "Éviter surinterprétation en crise psychiatrique ; éviter vente de « transmission secrète » abusive.",
    legalNote:
      "Œuvre classique dans le domaine public selon édition ; ateliers commerciaux encadrés comme loisirs ou enseignement.",
    seeDoctor: ["Crise suicidaire masquée en quête d’oracle"],
    grimoireVerse: {
      sortilege: "**Muter la ligne mobile** : le changement est permis dans le texte, pas imposé à la vie.",
      enchantement: "**Voile des hexagrammes** : figure et contre-figure en dialogue.",
      potionArtefact: "**Tige de mille-feuille** (ou RNG honnête) — outil, pas juge.",
      pouvoirMagique: "Penser en **scénarios** ; refuser la sentence unique.",
      utiliteDuRite: "Séance de **stratégie poétique** avec carnet de bord.",
      puissance: "Puissance **III/V** littéraire et morale.",
      miseEnScene: "Table basse, trois pièces ou bouquet sec, fenêtre ouverte sur la ville.",
    },
  },
  {
    id: "runes-nordiques",
    label: "Runes & lots nordiques",
    domain: "Alphabets runiques, inscriptions historiques, réinventions modernes",
    overview:
      "Les runes furent d’abord écriture ; les usages divinatoires modernes (tirage de lots) sont largement post-médiévaux et populaires dans certaines scènes néopaïennes. La runologie académique étudie inscriptions, datations, contextes — à ne pas confondre avec « magie viking » commerciale.",
    modalities: ["Distinguer futhark vieux / anglo-saxon / younger ; copier vs comprendre.", "Tirage de lots comme jeu symbolique avec règles locales.", "Critique des discours racialisés autour des runes."],
    evidence:
      "Archéologie et philologie ; divination runique comme pratique contemporaine documentée ethnographiquement.",
    precautions:
      "Extrême droite et runes : signaler détournements ; éviter initiation « sang et sol ».",
    legalNote:
      "Objets vendus comme divertissement ; pas de promesse de guérison ou de protection physique.",
    seeDoctor: ["Incitation à la haine ou à l’exclusion fondée sur symboles"],
    grimoireVerse: {
      sortilege: "**Jeter les bois gravés** : le sort parle du tirage, pas de la valeur d’une personne.",
      enchantement: "**Anneau d’Odin** (fiction) : savoir acheté au prix d’une métaphore, pas d’un membre.",
      potionArtefact: "**Sac de pierre et de lin** — lots matériels honnêtes.",
      pouvoirMagique: "Structurer une **question** ; ne pas sceller un destin collectif.",
      utiliteDuRite: "Atelier **museal + créatif** : pierre, bois, histoire.",
      puissance: "Puissance **II/V** narrative ; vigilance **max** si idéologie.",
      miseEnScene: "Salle froide, bois résineux, étagère de fac-similés d’inscriptions réelles.",
    },
  },
  {
    id: "geomancie",
    label: "Géomancie (tradition méditerranéenne & africaine)",
    domain: "Figures à quatre points ; lignes impaires/paires ; interprétations régionales",
    overview:
      "La géomancie classique (traités latins médiévaux, traditions ouest-africaines apparentées) utilise figures et maisons. Transmission historique complexe ; aujourd’hui livres, apps et ateliers. Comme tout système divinatoire : cadre symbolique, pas capteur physique de futur.",
    modalities: ["Tracer figures, maison du juge, modes de lecture par école.", "Comparer traditions islamiques, africaines et latines sans les fusionner abusivement.", "Éthique : pas de diagnostic médical."],
    evidence:
      "Histoire des sciences et anthropologie ; pas de validation expérimentale de précision prédictive.",
    precautions:
      "Respect des contextes culturels ; éviter extractivisme « mystique africain ».",
    legalNote:
      "Consultations loisir vs conseil professionnel réglementé selon domaine (droit, santé).",
    seeDoctor: ["Décisions d’asile ou de migration basées sur tirage"],
    grimoireVerse: {
      sortilege: "**Quatre points dans le sable** puis lecture — le geste efface la prétention d’infailibilité.",
      enchantement: "**Palais des douze maisons** en miniature sur la table.",
      potionArtefact: "**Sable du sablier** — support neutre, réutilisable.",
      pouvoirMagique: "Cartographier **l’incertitude** plutôt que l’éliminer.",
      utiliteDuRite: "Scène **marchande médiévale** revisitée en pédagogie.",
      puissance: "Puissance **II/V** symbolique.",
      miseEnScene: "Cour intérieure, bruit d’eau, figures tracées au doigt puis photographiées pour journal.",
    },
  },
  {
    id: "cartomancie",
    label: "Cartomancie (jeu de 32 / 52)",
    domain: "Fortune-telling populaire ; conventions locales fortes",
    overview:
      "La cartomancie utilise jeux standard avec significations apprises par oralité et livres. Moins codifiée que le tarot « ésotérique » ; forte variété régionale. Cadre : divertissement, théâtre, parfois support en consultation psychosociale informelle — avec limites éthiques.",
    modalities: ["Apprentissage des combinaisons locales ; honnêteté sur l’origine des interprétations.", "Prix clairs ; durée limitée.", "Distinction jeu de salon / consultation publique."],
    evidence:
      "Folklore et études de genre sur pratiquantes ; pas de preuve de précognition.",
    precautions:
      "Publics vulnérables ; éviter peurs liées aux cartes « mauvaises ».",
    legalNote:
      "Réglementation des « arts divinatoires » en France et ailleurs ; TVA, enseigne, mineurs.",
    seeDoctor: ["Enfant amené en consultation sans cadre légal clair"],
    grimoireVerse: {
      sortilege: "**Battre trois fois** puis couper — le geste public du jeu.",
      enchantement: "**Tap vert** : espace où les cartes sont des masques, pas des masques sur les visages.",
      potionArtefact: "**Jeu neuf** encore craquant — plaisir tactile légitime.",
      pouvoirMagique: "Donner une **phrase** à emporter, pas une chaîne.",
      utiliteDuRite: "Café-concert, ton modeste, rires autorisés.",
      puissance: "Puissance **I/V** à **III/V** selon cadre et respect.",
      miseEnScene: "Petite table, lumière tamisée, horloge visible sur le mur du fond.",
    },
  },
  {
    id: "oniromancie",
    label: "Oniromancie & symboles de rêves",
    domain: "Interprétation des rêves ; psychologie analytique ; traditions religieuses",
    overview:
      "L’oniromancie historique (Oneirocritica grecs, traités islamiques, Jung) varie du catalogue de symboles à l’exploration clinique. La science du sommeil décrit consolidation mémorielle et rêves bizarres sans valider un dictionnaire universel de signes. La pratique honnête distingue métaphore, traumatisme et hasard.",
    modalities: ["Journal de rêve, questions ouvertes, renvoi thérapeutique si cauchemars répétés.", "Lecture comparée des traités sans autorité absolue.", "Pas de « preuve » d’agression basée sur seul rêve."],
    evidence:
      "Neurosciences du sommeil ; psychothérapies avec travail du rêve encadré.",
    precautions:
      "Rêves traumatiques (ESPT) : orientation spécialisée ; éviter interprétations culpabilisantes.",
    legalNote:
      "Psychothérapie encadrée vs coaching onirique : titres selon pays.",
    seeDoctor: ["Cauchemars avec réveils en sursaut et hypervigilance — dépistage ESPT", "Paralysie du sommeil fréquente"],
    grimoireVerse: {
      sortilege: "**Ouvrir la lucarne** : le rêve est scène, pas tribunal.",
      enchantement: "**Brume du matin** : détails qui s’effacent — noter vite, interpréter lentement.",
      potionArtefact: "**Carnet cousu** — artefact d’encre et de date.",
      pouvoirMagique: "Accueillir **l’inconnu** sans coloniser l’inconscient d’autrui.",
      utiliteDuRite: "Groupe de **lecture douce** ou séance clinique référencée.",
      puissance: "Puissance **II/V** en journal ; **IV/V** en thérapie si formé.",
      miseEnScene: "Chambre bleue, réveil reculé, tasse vide — le jour prend le relais.",
    },
  },
];
