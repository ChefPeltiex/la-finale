/**
 * Corpus cosmologique étendu — vulgarisation scientifique, nuances et ordres de grandeur.
 * Les valeurs numériques reflètent des consensus largement cités ; les incertitudes scientifiques réelles existent toujours.
 */

export const COSMIC_DATA = [
  {
    emoji: "🌌",
    title: "Galaxies Lointaines",
    desc: "Structures gigantesques : spirales, elliptiques, irrégulières — archives de l’histoire cosmique.",
    category: "astronomy",
    facts: [
      "La Voie lactée contient de l’ordre de 100 à 400 milliards d’étoiles (fourchette selon modèle et observation).",
      "La galaxie d’Andromède (M31) se rapproche du Groupe local à environ 110 km/s en projection.",
      "Les grands relevés (SDSS, DES, LSST…) cartographient millions de galaxies pour sonder matière noire et énergie sombre.",
      "Les amas galactiques révèlent via lentillage gravitationnel la masse non lumineuse dominante.",
    ],
  },
  {
    emoji: "⭐",
    title: "Constellations & nomenclature",
    desc: "Projection culturelle sur la sphère céleste — IAU et usages historiques.",
    category: "astro",
    facts: [
      "88 constellations « officielles » couvrent la sphère céleste moderne (Union astronomique internationale).",
      "Sirius (−1,46 mag apparente) domine le ciel nocturne comme étoile la plus brillante hors Soleil.",
      "Le triangle d’été (Véga, Altaïr, Deneb) encadre la Voie lactée dans l’hémisphère nord.",
      "Les constellations sont des alliances humaines : les distances réelles entre étoilles partagent peu de lien physique.",
    ],
  },
  {
    emoji: "🪐",
    title: "Système solaire interne",
    desc: "Planètes telluriques et géantes : dynamiques, anneaux, satellites majeurs.",
    category: "planets",
    facts: [
      "Jupiter — géante gazeuse — masse ~318 Terres ; champ magnétique colossal sculptant ses lunes.",
      "Saturne — densité moyenne inférieure à l’eau liquide à température standard (objet flotterait dans un océan imaginaire étendu).",
      "Vénus — rotation rétrograde lente ; effet de serre extrême (~460 °C surface).",
      "Mars — géologie ancienne hydraulique ; traces de rivières fossilisées.",
    ],
  },
  {
    emoji: "🌍",
    title: "Terre — planète océan",
    desc: "Climat, tectonique, biosphère en interaction non linéaire.",
    category: "earth",
    facts: [
      "Orbite sidérale ~365,256 jours ; année tropique calendaire ~365,2422 jours — d’où règles bissextiles.",
      "À l’équateur, vitesse de rotation ~1670 km/h ; nous ne la sentons pas car référentiel commun.",
      "Âge du système solaire ~4,56 Ga ; Terre consolidée peu après accrétion primitive.",
      "La plaque lithosphérique recycle la croûte sur ~100 Ma en ordre de grandeur global.",
    ],
  },
  {
    emoji: "🌙",
    title: "Lune & marées",
    desc: "Satellite majeur synchronisé — interaction gravitationnelle fine.",
    category: "moon",
    facts: [
      "Distance moyenne Terre–Lune ~384 400 km — ellipticité orbitale modulant marées et « super-lunes ».",
      "Période sidérale ~27,3 j ; synodique (phases) ~29,5 j.",
      "Rotation synchronisée : même face visible sauf librations.",
      "Freinage tidal lent qui éloigne la Lune et allonge journée terrestre sur Ga géologiques.",
    ],
  },
  {
    emoji: "☄️",
    title: "Astéroïdes & comètes",
    desc: "Reliques primitives ; impacts ayant sculpté l’évolution biologique.",
    category: "asteroids",
    facts: [
      "Halley — période ~76 ans ; traînée ionique et coma sous chauffage solaire.",
      "Ceinture principale entre Mars et Jupiter : réservoir dynamique pour futures missions.",
      "Événement K/Pg (~66 Ma) associé à extinction masse dont dinosaures non aviens dominants.",
      "Les météores sont grains/comettes vaporisant dans l’atmosphère.",
    ],
  },
  {
    emoji: "🕳️",
    title: "Relativité & trous noirs",
    desc: "Champs gravitationnels extrêmes — tests observationnels modernes.",
    category: "cosmology",
    facts: [
      "L’image du trou noir M87* par EHT confirme silhouette conforme à métrique de Kerr en première approximation.",
      "Les ondes gravitationnelles (LIGO/Virgo/KAGRA) ouvrent une fenêtre non électromagnétique.",
      "Le décalage spectral gravitationnel teste la relativité générale près des compact objects.",
      "Les jets relativistes émanent souvent de disques d’accrétion magnétisés.",
    ],
  },
  {
    emoji: "✨",
    title: "Cycle stellaire",
    desc: "Naissance sur séquences Hayashi → fusion centrale → géantes → naines ou explosions.",
    category: "stars",
    facts: [
      "Le Soleil (~1 M☉) restera ~10 Ga sur séquence principale fusionnant hydrogène en hélium.",
      "Les étoiles massives terminent en supernova II/Ib/Ic enrichissant le milieu interstellaire.",
      "Les naines blanches sont noyaux dégénérés ; limite Chandrasekhar ~1,4 M☉.",
      "Les naines brunes franchissent difficilement fusion durable du deutérium.",
    ],
  },
  {
    emoji: "🧭",
    title: "Cosmologie du fond diffus",
    desc: "CMB — snapshot univers à ~380 000 ans ; inflation comme paradigme (non observation directe unique).",
    category: "cosmology",
    facts: [
      "Température actuelle ~2,725 K ; anisotropies ΔT/T ~10⁻⁵.",
      "Composition standard ~68 % énergie sombre, ~27 % matière noire, ~5 % baryons.",
      "Le spectre de puissance du CMB contraint les paramètres cosmologiques ΛCDM.",
      "Les oscillations acoustiques baryoniques structurent distribution galaxies à grande échelle.",
    ],
  },
  {
    emoji: "🧪",
    title: "Astros chimiques",
    desc: "Nucléosynthèse primordiale vs stellaire — alphabet atomique du cosmos.",
    category: "chemistry_space",
    facts: [
      "Big Bang nucléosynthèse : H, He, traces Li — pas de métaux significatifs.",
      "Les étoiles forgent carbone jusqu’au fer ; Au et Pt viennent collisions neutroniques.",
      "Les grains interstellaires catalysent chimie froide formant molécules complexes.",
      "Les spectres révèlent métallicité et enrichissement chimique galactique.",
    ],
  },
  {
    emoji: "🔭",
    title: "Instruments & relevés",
    desc: "Du télescope spatial aux interféromètres radio — résolution et sensibilité.",
    category: "astronomy",
    facts: [
      "JWST observe infrarouge proche/moyen avec miroirs déployables refroidis.",
      "Gaia astrométrie milliards d’étoiles cartographie Voie lactée en 3D.",
      "Radioastronomie résout jets AGN au milliarcseconde avec VLBI.",
      "Les télescopes magellaniques futurs combineront surfaces segmentées adaptatives.",
    ],
  },
  {
    emoji: "🌀",
    title: "Matière noire — énigme dominante",
    desc: "Effets gravitationnels sans émission électromagnétique correspondante détectée.",
    category: "cosmology",
    facts: [
      "Courbes rotation galaxies plates à grand rayon — masse dynamique >> masse lumineuse.",
      "Les simulations structurelle N-corps reproduisent filaments avec halo CDM.",
      "Expériences directes WIMP axions etc. poursuivies sans confirmation définitive à ce jour.",
      "Alternatives MOND modifient gravité mais peinent synthèse cosmique globale.",
    ],
  },
  {
    emoji: "🛰️",
    title: "Exploration robotique",
    desc: "Sondes, astromobiles, échantillons — étapes vers présence humaine conditionnelle.",
    category: "earth",
    facts: [
      "Perseverance Mars cachettes potentielles biosignatures géochimiques anciennes.",
      "Cassini–Huygens dissèquent Titan et Encelade — océans sous surface plausible.",
      "Lucy explore astéroïdes Troyens Jupiter pour archives primitives.",
      "Artemis vise retour humain sur Lune comme tremplin martien réglementé.",
    ],
  },
];

export const COSMIC_CATEGORIES = [
  { key: "all", label: "Tous", emoji: "🌌" },
  { key: "astronomy", label: "Astronomie", emoji: "🔭" },
  { key: "astro", label: "Ciel & cultures", emoji: "♈" },
  { key: "planets", label: "Planètes", emoji: "🪐" },
  { key: "earth", label: "Terre & missions", emoji: "🌍" },
  { key: "moon", label: "Lune", emoji: "🌙" },
  { key: "asteroids", label: "Petits corps", emoji: "☄️" },
  { key: "cosmology", label: "Cosmologie", emoji: "🧭" },
  { key: "stars", label: "Étoiles", emoji: "✨" },
  { key: "chemistry_space", label: "Astros chimiques", emoji: "🧪" },
];
