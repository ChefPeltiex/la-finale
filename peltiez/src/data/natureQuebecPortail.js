/**
 * Grand Portail Naturel du Québec — tranche « slice 1 » (source unique).
 * Libellés culturels / folkloriques : pas de claims médicinaux (voir requiresDisclaimer).
 */

/** @typedef {{ slug: string, titleFr: string, examples: string[] }} NatureCategory */

/**
 * @typedef {{
 *   slug: string,
 *   titleFr: string,
 *   archetype: string,
 *   portalName: string,
 *   portalTagline: string,
 *   requiresDisclaimer: boolean,
 *   hubTo: string | null,
 *   docTo: string | null,
 *   categories: NatureCategory[],
 * }} NatureDomain */

/** @type {NatureDomain[]} */
export const NATURE_QUEBEC_DOMAINS = [
  {
    slug: "mycologie",
    titleFr: "Mycologie boréale",
    archetype: "Le Mycologue du sous-bois",
    portalName: "Portail du réseau filamenteux",
    portalTagline: "Où le bois parle par sporées — cartes du vivant, pas du garde-manger.",
    requiresDisclaimer: true,
    hubTo: "/flora-hub",
    docTo: null,
    categories: [
      {
        slug: "saprobiontes",
        titleFr: "Saprobiontes & décomposeurs",
        examples: ["Tramètes du bouleau (étiquette culturelle)", "Clavaires des mousses (observation)"],
      },
      {
        slug: "symbioses",
        titleFr: "Symbioses racinaires",
        examples: ["Réseaux mycorhiziens (métaphore de réseau)", "Boucles du vivant (modèle)"],
      },
      {
        slug: "ethnomyces",
        titleFr: "Noms populaires et récits",
        examples: ["Surnoms de terrain (folklore)", "Contes de cueillette (patrimoine oral)"],
      },
    ],
  },
  {
    slug: "insectes",
    titleFr: "Insectes & petites bêtes",
    archetype: "L’Entomologiste des lisières",
    portalName: "Portail des six pattes et des murmures d’ailes",
    portalTagline: "Rythmes du pollen et de la sève — science et imaginaire sans « ordonnance ».",
    requiresDisclaimer: true,
    hubTo: "/insects-hub",
    docTo: null,
    categories: [
      {
        slug: "pollinisateurs",
        titleFr: "Pollinisateurs (symboles culturels)",
        examples: ["Abeille — figure de travail communautaire (métaphore)", "Bourdon — récit de jardin"],
      },
      {
        slug: "decomposeurs",
        titleFr: "Décomposeurs du sol",
        examples: ["Coléoptères du bois mort (écologie)", "Fourmi — organisation sociale (image, pas « acide thérapeutique »)"],
      },
      {
        slug: "aquatiques",
        titleFr: "Invertébrés des eaux",
        examples: ["Libellule — motif artisanal", "Éphémère — brièveté du cycle (poésie)"],
      },
    ],
  },
  {
    slug: "mineraux",
    titleFr: "Minéraux & pierres du bouclier",
    archetype: "Le Géologue contemplatif",
    portalName: "Portail du socle cristallin",
    portalTagline: "Quartz, amphiboles et fer — géologie d’abord, légendes ensuite.",
    requiresDisclaimer: false,
    hubTo: "/minerals-hub",
    docTo: null,
    categories: [
      {
        slug: "cristaux",
        titleFr: "Cristaux régionaux",
        examples: ["Quartz laiteux (champ)", "Grenat almandin (identification musée)"],
      },
      {
        slug: "roches",
        titleFr: "Roches mères",
        examples: ["Gneiss (bouclier canadien)", "Schistes métamorphiques (carte)"],
      },
    ],
  },
  {
    slug: "remedes_traditionnels",
    titleFr: "Remèdes traditionnels (patrimoine oral)",
    archetype: "L’Herboriste du conte",
    portalName: "Portail des récits de jarre et de cheminée",
    portalTagline: "Tisanes et dictons : mémoire collective, pas pharmacopée validée ici.",
    requiresDisclaimer: true,
    hubTo: "/heritage",
    docTo: "/docs/magique",
    categories: [
      {
        slug: "tisanes_folklore",
        titleFr: "Tisanes nommées dans le folklore",
        examples: ["Plantes citées en chansons / récits (culture)", "Usages rapportés par des sources orales (non vérifiés médicalement)"],
      },
      {
        slug: "preparations_maison",
        titleFr: "Préparations « maison » historiques",
        examples: ["Macérations décrites comme coutumes (musée)", "Formules familiales archivées (contexte)"],
      },
    ],
  },
  {
    slug: "astuces_maison",
    titleFr: "Astuces maison & bricolage doux",
    archetype: "L’Artisan du seuil",
    portalName: "Portail du loquet qui tient encore",
    portalTagline: "Réparations, rangements, petits systèmes — prudence et bon sens.",
    requiresDisclaimer: false,
    hubTo: "/micro-outils",
    docTo: null,
    categories: [
      {
        slug: "entretien",
        titleFr: "Entretien et réemploi",
        examples: ["Détartrage doux (test discret)", "Rangement circulaire (moins de perte)"],
      },
      {
        slug: "energie",
        titleFr: "Confort sans promesse miracle",
        examples: ["Isolation artisanale (pilote mesuré)", "Ventilation naturelle (carte des pièces)"],
      },
    ],
  },
  {
    slug: "astuces_cuisine",
    titleFr: "Astuces cuisine & « alchimie » domestique",
    archetype: "L’Alchimiste de la casserole",
    portalName: "Portail des odeurs qui réconcilient",
    portalTagline: "Réactions utiles et sécurité — chimie quotidienne, pas élixir.",
    requiresDisclaimer: false,
    hubTo: "/chemistry-hub",
    docTo: null,
    categories: [
      {
        slug: "reactions_utiles",
        titleFr: "Réactions utiles au foyer",
        examples: ["Acides/bases ménagers (étiquettes)", "Caramélisation (thermique)"],
      },
      {
        slug: "conservation",
        titleFr: "Conservation raisonnée",
        examples: ["Congélation / salaison (hygiène)", "Réduction du gaspillage (Ω cuisine)"],
      },
    ],
  },
  {
    slug: "savoirs_populaires",
    titleFr: "Savoirs populaires québécois",
    archetype: "Le Conteur du rang",
    portalName: "Portail des histoires sans GPS",
    portalTagline: "Météores, glaces et bêtes — cartes narratives de l’Atlas vivant.",
    requiresDisclaimer: false,
    hubTo: "/atlas",
    docTo: null,
    categories: [
      {
        slug: "meteo_pays",
        titleFr: "Météores du pays",
        examples: ["Grêle des saints (dicton)", "Lune des semailles (calendrier oral)"],
      },
      {
        slug: "faune_flore",
        titleFr: "Faune & flore dans le dire",
        examples: ["Orignal — géographie du récit", "Érablière — cycle sucré (culture)"],
      },
    ],
  },
  {
    slug: "symboles_naturels",
    titleFr: "Symboles naturels & mythologies",
    archetype: "Le Symbologique des rives",
    portalName: "Portail des signes dans l’eau et le vent",
    portalTagline: "Images partagées — lecture symbolique, pas oracle de terrain.",
    requiresDisclaimer: false,
    hubTo: "/mythologies",
    docTo: "/docs/magique",
    categories: [
      {
        slug: "eau_foret",
        titleFr: "Eau et forêt",
        examples: ["Rivière comme fil conducteur (récit)", "Feuille compassée (ornement)"],
      },
      {
        slug: "cycles",
        titleFr: "Cycles et saisons",
        examples: ["Équinoxe — repère culturel", "Givre — motif visuel"],
      },
    ],
  },
];

/** Métadonnées hub (SEO, titre court). */
export const NATURE_QUEBEC_HUB_META = {
  title: "Grand Portail Naturel du Québec",
  description:
    "Douze portails fiction (archétypes, quêtes-mères, compétences symboliques) + huit domaines atlas vers les hubs CirculAI — garde-fous explicites, sans promesse réelle.",
  canonicalPath: "/portail/nature-quebec",
};

/**
 * Douze portails « ciné-ludiques » — métaphore / jeu / fiction uniquement.
 * @type {readonly {
 *   id: string,
 *   title: string,
 *   hubPath: string | null,
 *   emoji: string,
 *   archetypeSlug: string,
 *   archetypeName: string,
 *   role: string,
 *   powers: string[],
 *   weaknesses: string[],
 *   sacredObject: string,
 *   trial: string,
 *   portalCinematic: string,
 *   questTitle: string,
 *   questHook: string,
 *   skillBranches: string[],
 * }[]}
 */
export const natureQuebecPortails = [
  {
    id: "mycelium",
    title: "Mycélium",
    hubPath: "/atlas",
    emoji: "🍄",
    archetypeSlug: "tisse-reseau",
    archetypeName: "Le Tisseur de réseaux invisibles",
    role: "Relier ce qui semble séparé : cartes, histoires et fragments en une toile narrative vivante.",
    powers: [
      "Cartographier des liens symboliques entre fiches (fiction / jeu de rôle).",
      "Deviner où un savoir « dort » sans prétention divinatoire réelle.",
      "Faire apparaître des ponts narratifs entre deux territoires du savoir.",
    ],
    weaknesses: ["Confondre métaphore et preuve empirique.", "Surcharger la carte jusqu’à l’illisibilité."],
    sacredObject: "Un fil de spores dessiné sur verre dépoli — souvenir de carte, pas d’instrument.",
    trial: "Tracer un réseau cohérent à partir de trois fragments sans nom, puis les nommer soi-même.",
    portalCinematic:
      "La brume se lève ; des lignes dorées pulsent sous la mousse comme un métro fantôme de souvenirs. La caméra plonge dans le sol et le titre apparaît dans le grain du bois pourri.",
    questTitle: "La quête du fil souterrain",
    questHook: "Suis la trace la plus fragile : elle mène souvent au cœur du récit.",
    skillBranches: ["Cartographie vivante", "Synapses de savoirs", "Silence fertile"],
  },
  {
    id: "insectes",
    title: "Insectes",
    hubPath: "/insects-hub",
    emoji: "🦋",
    archetypeSlug: "messager-micro",
    archetypeName: "La Messagère du micro-monde",
    role: "Annoncer les petits signaux : couleurs, cycles, détails que l’œil pressé ignore.",
    powers: [
      "Repérer un motif « presque rien » et en faire une vignette narrative.",
      "Changer d’échelle d’observation (fiction) pour raconter autrement.",
      "Assembler une chorale d’indices minuscules en une phrase d’atmosphère.",
    ],
    weaknesses: ["L’impatience : tout vouloir voir d’un coup.", "Mélanger fascination et crédulité."],
    sacredObject: "Aile de papier calque pliée en quatre — relique de cabinet de curiosités imaginaire.",
    trial: "Décrire trois « messagers » fictifs sans nommer d’espèce réelle à risque.",
    portalCinematic:
      "Gros plan sur une rosée qui devient prisme ; les reflets forment une horloge à sept aiguilles. Zoom arrière : la prairie entière clignote une fois, comme un écran d’accueil cosmique.",
    questTitle: "Les messagers du seuil",
    questHook: "Ce qui vole bas porte souvent la nouvelle la plus lourde.",
    skillBranches: ["Patience d’observateur", "Chorale d’indices", "Légèreté narrative"],
  },
  {
    id: "carapaces",
    title: "Carapaces",
    hubPath: null,
    emoji: "🐢",
    archetypeSlug: "gardien-seuil",
    archetypeName: "Le Gardien du seuil blindé",
    role: "Protéger une mémoire fragile derrière une forme lente et lisible.",
    powers: [
      "Sceller temporairement une idée (métaphore) pour la laisser mûrir.",
      "Résister au bruit narratif : garder le cap sur une seule ligne d’histoire.",
      "Transformer une peur de surface en rituel d’écriture ludique (sans magie réelle).",
    ],
    weaknesses: ["Rigidité : refuser tout mouvement.", "Confondre protection et secret toxique."],
    sacredObject: "Fragment de carapace céramique — bibelot, pas armure.",
    trial: "Écrire une défense symbolique en trois phrases, puis une brèche volontaire en une quatrième.",
    portalCinematic:
      "Pluie fine sur une carapace : chaque goutte grave une rune qui s’efface aussitôt. Le plan s’attarde sur le rythme des paupières qui se ferment à moitié.",
    questTitle: "La quête de la lenteur armée",
    questHook: "Ce qui avance lentement laisse des traces lisibles.",
    skillBranches: ["Seuils & barrières", "Matière & patience", "Ouverture maîtrisée"],
  },
  {
    id: "plantes",
    title: "Plantes",
    hubPath: "/flora-hub",
    emoji: "🌿",
    archetypeSlug: "botaniste-reveur",
    archetypeName: "Le Botaniste rêveur",
    role: "Classer, nommer et embellir le vivant végétal comme langage partagé.",
    powers: [
      "Inventer une taxonomie poétique locale (étiquettes de jeu, pas science).",
      "Relier une feuille à une saison du récit sans prédire la météo.",
      "Colorer une scène par associations végétales symboliques.",
    ],
    weaknesses: [
      "Sur-identification : croire que la métaphore remplace la botanique réelle.",
      "Cataloguer sans jamais raconter.",
    ],
    sacredObject: "Herbier factice : pages vierges parfumées au thé, souvenirs de promenade.",
    questTitle: "L’herbier des noms tendres",
    questHook: "Chaque nom manquant est une porte ; invente la serrure en papier.",
    portalCinematic:
      "Vent dans les feuilles : le son devient typographie animée. Une main tourne une page d’herbier vide où poussent des mots au lieu des plantes.",
    skillBranches: ["Noms & métaphores", "Saisons du récit", "Palette d’ambiances"],
  },
  {
    id: "astuces",
    title: "Astuces du territoire",
    hubPath: "/manuel",
    emoji: "🧭",
    archetypeSlug: "concierge-sentiers",
    archetypeName: "Le Concierge des sentiers",
    role: "Rendre la plateforme navigable par astuces, raccourcis et repères honnêtes.",
    powers: [
      "Proposer un raccourci symbolique entre deux pages sans casser la logique.",
      "Transformer une erreur courante en anecdote d’apprentissage.",
      "Alléger un parcours complexe par trois repères visuels fictifs.",
    ],
    weaknesses: ["Trop d’astuces : la carte devient labyrinthe.", "Promettre des gains automatiques (interdit ici : tout est jeu)."],
    sacredObject: "Boussole dont l’aiguille peint des spirales — objet de décoration.",
    trial: "Rédiger cinq astuces utiles marquées « fiction / rappel » sans promesse de résultat.",
    portalCinematic:
      "Travelling latéral sur une carte pliée : les plis deviennent vallées lumineuses. Un curseur imaginaire trace un chemin sans GPS, seulement des annotations à la mine.",
    questTitle: "Les cinq raccourcis honnêtes",
    questHook: "Le meilleur raccourci est celui qui évite la fausse promesse.",
    skillBranches: ["Repères & UX imaginaire", "Pédagogie légère", "Cartes mentales"],
  },
  {
    id: "objets_oublies",
    title: "Objets oubliés",
    hubPath: "/marketplace",
    emoji: "📦",
    archetypeSlug: "archiviste-perdu",
    archetypeName: "L’Archiviste du presque perdu",
    role: "Redonner une seconde scène narrative aux objets sans maître apparent.",
    powers: [
      "Inventer une « provenance imaginaire » pour un objet de fiction.",
      "Créer une étiquette d’humeur sans prix magique.",
      "Relier don et récit dans une phrase d’accroche symbolique.",
    ],
    weaknesses: ["Romantisme excessif du déchet.", "Oublier la sécurité et la vérifiabilité dans le monde réel."],
    sacredObject: "Étiquette en liège griffonnée « Pour qui ? » — question, pas réponse.",
    portalCinematic:
      "Étagère de boîtes anonymes ; la poussière danse en suspension. Un projecteur passe : chaque ombre ressemble brièvement à un visage, puis redevient rectangle.",
    questTitle: "L’étiquette qui interroge",
    questHook: "Si l’objet parle, c’est toi qui prêtes ta voix : assume le ton.",
    skillBranches: ["Circulation & don", "Provenance fictive", "Accroches honnêtes"],
  },
  {
    id: "faune",
    title: "Faune",
    hubPath: "/fauna-hub",
    emoji: "🦌",
    archetypeSlug: "heraut-bois",
    archetypeName: "Le Héraut des bois",
    role: "Donner corps aux rencontres, empreintes et récits de présence animale (fiction / atlas).",
    powers: [
      "Faire entendre un « pas absent » dans une phrase descriptive.",
      "Alterner respect du vivant et distance narrative.",
      "Créer une rencontre symbolique sans apprivoisement magique.",
    ],
    weaknesses: ["Projection humaine abusive sur l’animal.", "Confondre bestiaire et domestication morale."],
    sacredObject: "Sabot de bois sculpté pour enfant — jouet, pas totem.",
    portalCinematic:
      "Tracking dans une neige poudreuse : seules les empreintes racontent. Le son du vent coupe ; un souffle chaud traverse l’objectif comme buée de cinéma.",
    questTitle: "L’empreinte sans propriétaire",
    questHook: "Suis l’empreinte jusqu’au point où l’histoire bifurque.",
    skillBranches: ["Empreintes & traces", "Rencontres symboliques", "Respect du vivant"],
  },
  {
    id: "mineraux",
    title: "Minéraux & gel",
    hubPath: "/minerals-hub",
    emoji: "🪨",
    archetypeSlug: "scribe-strates",
    archetypeName: "Le Scribe des strates",
    role: "Lire le temps géologique comme métaphore de patience et de structure.",
    powers: [
      "Superposer des couches d’histoire comme des strates dessinées.",
      "Transformer une fracture en ligne de tension narrative.",
      "Nommer trois « âges de glace » fictifs d’un projet.",
    ],
    weaknesses: ["Froid absolu : figer tout dialogue.", "Confondre dureté et insensibilité."],
    sacredObject: "Cube de verre avec une bulle figée — paperweight, pas cristal magique.",
    portalCinematic:
      "Lumière rasante sur une falaise ; les strates deviennent pages d’un livre géant. Un gravier tombe au ralenti, chaque caillou sonne comme une note de piano étouffée.",
    questTitle: "Les trois âges de glace du projet",
    questHook: "Chaque couche raconte une décision ; aucune ne doit mentir sur son époque.",
    skillBranches: ["Strates & patience", "Fractures utiles", "Structure & poids"],
  },
  {
    id: "eaux_brumes",
    title: "Eaux & brumes",
    hubPath: "/local-map",
    emoji: "🌫️",
    archetypeSlug: "passeur-brouillard",
    archetypeName: "Le Passeur de brouillard",
    role: "Naviguer l’incertitude : rivières, marées et visibilité réduite du récit.",
    powers: [
      "Estomper une scène pour révéler un détail unique (effet cinéma, fiction).",
      "Tracer un cours d’eau imaginaire entre deux lieux du site.",
      "Utiliser la brume comme transition honnête entre deux chapitres.",
    ],
    weaknesses: ["Noyer le lecteur dans le flou.", "Abuser du mystère comme substitut au sens."],
    sacredObject: "Fiole d’eau teintée bleu papier — décor, pas remède.",
    portalCinematic:
      "Vue depuis un quai : le fleuve avale les néons du matin. La brume monte comme un rideau ; derrière, la ville semble une île flottante sur une mer de lait.",
    questTitle: "La traversée sans rive visible",
    questHook: "Quand la rive disparaît, la boussole devient phrase.",
    skillBranches: ["Transitions & brume", "Cours d’eau narratifs", "Visibilité partielle"],
  },
  {
    id: "foret_canopee",
    title: "Forêt & canopée",
    hubPath: "/atlas",
    emoji: "🌲",
    archetypeSlug: "veilleur-canopee",
    archetypeName: "Le Veilleur de canopée",
    role: "Tenir plusieurs niveaux de lecture : sol, tronc, cime — sans perdre le fil.",
    powers: [
      "Empiler trois niveaux de sens (sol / habitants / ciel) dans un même paragraphe.",
      "Créer une ombre portée qui devient indice de fiction.",
      "Ralentir le tempo narratif pour laisser respirer la forêt.",
    ],
    weaknesses: ["Vertige des hauteurs : trop de niveaux simultanés.", "Idéaliser la nature « sauvage » sans ancrage."],
    sacredObject: "Couronne de branches séchées — accessoire de scène, pas relique sacrée réelle.",
    portalCinematic:
      "Grue cinéma vers le feuillage : la canopée ondule comme une mer sombre. Une seule feuille tombe au centre du cadre et y reste suspendue, battement de cœur du montage.",
    questTitle: "Trois hauteurs, un seul fil",
    questHook: "Ce qui vit en bas éclaire parfois ce qui vit en haut.",
    skillBranches: ["Niveaux de lecture", "Ombres & indices", "Tempo & silence"],
  },
  {
    id: "phenologie",
    title: "Phénologie du temps",
    hubPath: "/encyclopedie-biblique",
    emoji: "🍂",
    archetypeSlug: "horloger-saisons",
    archetypeName: "L’Horloger des saisons",
    role: "Marquer les passages : bourgeons, neiges, dépliages — comme rythme de campagne fictive.",
    powers: [
      "Aligner quatre beats saisonniers sur un arc narratif.",
      "Prédire un « tournant d’ambiance » sans prédiction réelle.",
      "Synchroniser une quête avec un calendrier symbolique.",
    ],
    weaknesses: ["Déterminisme : croire que la saison décide à ta place.", "Oublier les exceptions et les micro-climats humains."],
    sacredObject: "Disque de bois gravé de quatre quadrants vides à remplir soi-même.",
    portalCinematic:
      "Montage accéléré d’une même fenêtre québécoise : quatre saisons en vingt secondes. Les vitres vibrent ; la poussière du rebord dessine un calendrier fantôme.",
    questTitle: "Le calendrier des quatre battements",
    questHook: "Chaque saison est un ton ; ne confonds pas ton avec ordre moral.",
    skillBranches: ["Rythme & beats", "Ambiances cycliques", "Calendrier symbolique"],
  },
  {
    id: "memoire_heritage",
    title: "Mémoire & héritage",
    hubPath: "/heritage",
    emoji: "📜",
    archetypeSlug: "griot-boreal",
    archetypeName: "Le Griot boréal",
    role: "Transmettre des histoires de territoire avec soin, sources et humilité.",
    powers: [
      "Tisser une chronologie « légende locale » clairement marquée fiction.",
      "Citer une source réelle quand c’est du fait ; séparer du mythe.",
      "Inviter à la correction plutôt qu’au dogme.",
    ],
    weaknesses: ["Folkloriser sans contexte.", "Confondre patrimoine et propriété exclusive des récits."],
    sacredObject: "Carnet de terrain aux pages moitié blanches — place pour le doute.",
    portalCinematic:
      "Archives : tiroirs qui coulissent avec un souffle de bois vieilli. La lampe de bureau tremble ; une poussière en suspension forme brièvement une carte du fleuve, puis retombe.",
    questTitle: "Le carnet moitié vide",
    questHook: "Ce que tu ne sais pas encore est une page d’honneur, pas une honte.",
    skillBranches: ["Transmission & sources", "Légendes balisées", "Humilité narrative"],
  },
];

export const NATURE_QUEBEC_PORTAIL_COUNT = natureQuebecPortails.length;
