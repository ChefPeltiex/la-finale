export const BIBLE_CATEGORIES = [
  "Tous",
  "Livres",
  "Personnes",
  "Lieux",
  "Thèmes",
  "Objets & Symboles",
  "Lignes du temps",
];

// NOTE: contenu de base (squelette). Conçu pour être enrichi massivement.
export const BIBLE_ENTRIES = [
  {
    id: "book-genesis",
    category: "Livres",
    title: "Genèse",
    subtitle: "Origines · Alliance · Commencements",
    tags: ["création", "alliance", "patriarches", "origines"],
    summary:
      "Livre des commencements: création, humanité, promesses, patriarches. Fondations narratives et théologiques.",
    sections: [
      { h: "Vue d’ensemble", p: "Structure, grands arcs narratifs, motifs récurrents et langage symbolique." },
      { h: "Personnages", p: "Adam, Ève, Noé, Abraham, Isaac, Jacob, Joseph… (fiches liées)." },
      { h: "Thèmes", p: "Création, chute, bénédiction, promesse, alliance, exil, rédemption." },
    ],
    media: {
      hero:
        "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1600&h=900&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&h=900&fit=crop",
      ],
      videoUrl: null,
    },
    virtual: {
      scene: "cosmic-scroll",
      props: ["parchment", "stars", "omega-seal"],
    },
    refs: ["theme-covenant", "person-moses", "place-jerusalem"],
  },
  {
    id: "book-exodus",
    category: "Livres",
    title: "Exode",
    subtitle: "Libération · Loi · Traversée",
    tags: ["libération", "mosaïque", "alliance", "désert"],
    summary:
      "Sortie d’Égypte, traversée, formation d’un peuple, Loi et sanctuaire. Grande dynamique: oppression → liberté → cohésion.",
    sections: [
      { h: "Vue d’ensemble", p: "Narration de libération et établissement d’une identité collective." },
      { h: "Logistique du récit", p: "Déplacements, étapes, ressources, tensions, leadership et rites." },
    ],
    media: {
      hero:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=900&fit=crop",
      gallery: [],
      videoUrl: null,
    },
    virtual: { scene: "desert-crossing", props: ["sand", "fire", "water"] },
    refs: ["person-moses", "place-jerusalem", "theme-covenant"],
  },
  {
    id: "theme-covenant",
    category: "Thèmes",
    title: "Alliance",
    subtitle: "Promesse · Loi · Fidélité",
    tags: ["alliance", "promesse", "fidélité", "peuple"],
    summary:
      "Motif structurant: engagement, conditions, signes, mémoire. L’alliance organise la cohésion et la transmission.",
    sections: [
      { h: "Définition", p: "Alliance comme cadre relationnel: promesse, loyauté, bénédiction, responsabilité." },
      { h: "Signes", p: "Marqueurs symboliques (rites, objets, mémoriaux) et leurs fonctions sociales." },
    ],
    media: {
      hero:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=900&fit=crop",
      gallery: [],
      videoUrl: null,
    },
    virtual: { scene: "seal-chamber", props: ["seal", "light", "tablets"] },
    refs: ["book-genesis", "book-exodus"],
  },
  {
    id: "person-moses",
    category: "Personnes",
    title: "Moïse",
    subtitle: "Leadership · Loi · Traversée",
    tags: ["leader", "désert", "loi", "libération"],
    summary:
      "Figure de passage: médiation, gouvernance, endurance, organisation, transmission et crise.",
    sections: [
      { h: "Rôle", p: "Médiateur, guide, organisateur, figure de transition." },
      { h: "Défis", p: "Conflits internes, gestion des ressources, cohésion du groupe, fatigue décisionnelle." },
    ],
    media: {
      hero:
        "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1600&h=900&fit=crop",
      gallery: [],
      videoUrl: null,
    },
    virtual: { scene: "mountain-revelation", props: ["mountain", "cloud", "fire"] },
    refs: ["book-exodus", "theme-covenant"],
  },
  {
    id: "place-jerusalem",
    category: "Lieux",
    title: "Jérusalem",
    subtitle: "Ville · Mémoire · Centre",
    tags: ["ville", "temple", "pèlerinage", "mémoire"],
    summary:
      "Lieu pivot (spirituel, politique, culturel). Une topographie de la mémoire.",
    sections: [
      { h: "Repères", p: "Axes symboliques, lieux de rassemblement, récits associés." },
      { h: "Fonction", p: "Centre rituel et narratif, densité de sens." },
    ],
    media: {
      hero:
        "https://images.unsplash.com/photo-1569163139394-de4798aa62b2?w=1600&h=900&fit=crop",
      gallery: [],
      videoUrl: null,
    },
    virtual: { scene: "city-map", props: ["map", "markers", "light"] },
    geo: { lat: 31.7683, lng: 35.2137 },
    refs: ["theme-covenant"],
  },
  {
    id: "book-psalms",
    category: "Livres",
    title: "Psaumes",
    subtitle: "Poésie · Prière · Lamentation · Louange",
    tags: ["poésie", "temple", "lamentation", "louange", "justice"],
    summary:
      "Recueil lyrique immense : cris individuels et collectifs, temporalités emotives, ancrage géographique et rituel sans figer Dieu en slogan.",
    sections: [
      {
        h: "Structure vivante",
        p: "Cinq livres internes, genres multiples : individual piety, royal ideology, wisdom echoes, communal trauma.",
      },
      {
        h: "Lecture sensible",
        p: "Les psaumes impécatoires demandent cadres historiques et éthiques contemporains — pas d’instrumentalisation hâtive.",
      },
    ],
    media: {
      hero: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1600&h=900&fit=crop",
      gallery: [],
      videoUrl: null,
    },
    virtual: { scene: "echo-hall", props: ["harp", "echo", "dawn"] },
    refs: ["theme-covenant", "place-jerusalem"],
  },
  {
    id: "book-revelation",
    category: "Livres",
    title: "Apocalypse (Révélation)",
    subtitle: "Vision · Symbolisme · Résistance narrative",
    tags: ["apocalyptique", "symbolisme", "résistance", "liturgie céleste"],
    summary:
      "Texte saturé d’images : liturgie cosmique, critique des empires, eschatologie ouverte — lecture littérale unique insuffisante ; rigueur symbolique requise.",
    sections: [
      {
        h: "Cadres",
        p: "Genre apocalyptique juif/chrétien primitif : réconfort en persécution, dénonciation idolâtrique, victoire paradoxale.",
      },
      {
        h: "Prudence herméneutique",
        p: "Éviter amalgames avec actualités contemporaines forcées ; cartographier réseaux métaphoriques avant projection.",
      },
    ],
    media: {
      hero: "https://images.unsplash.com/photo-1465101162946-4377e57745ec?w=1600&h=900&fit=crop",
      gallery: [],
      videoUrl: null,
    },
    virtual: { scene: "seven-seals", props: ["scroll", "lampstands", "throne"] },
    refs: ["theme-covenant"],
  },
];

export const BIBLE_TIMELINE = [
  {
    id: "t-creation",
    era: "Origines",
    title: "Création (arc symbolique)",
    when: "Genèse (début)",
    summary: "Fondation du récit: ordre, sens, bénédiction et responsabilité.",
    entryIds: ["book-genesis", "theme-covenant"],
  },
  {
    id: "t-patriarchs",
    era: "Patriarches",
    title: "Promesse & Patriarches",
    when: "Genèse (arcs patriarcaux)",
    summary: "Promesse, alliance, déplacements, identité collective en formation.",
    entryIds: ["book-genesis", "theme-covenant"],
  },
  {
    id: "t-exodus",
    era: "Libération",
    title: "Exode & Traversée",
    when: "Exode",
    summary: "Oppression → libération → cohésion: naissance d’un peuple.",
    entryIds: ["book-exodus", "person-moses"],
  },
  {
    id: "t-jerusalem",
    era: "Centre",
    title: "Jérusalem (centre de mémoire)",
    when: "Périodes multiples",
    summary: "Lieu pivot: densité narrative, spirituelle et politique.",
    entryIds: ["place-jerusalem"],
  },
  {
    id: "t-poetry",
    era: "Poétique",
    title: "Corpus psalmique",
    when: "Monarchique → post-exilique",
    summary: "Expressivité rituelle et personnelle ; mémoire collective en chant.",
    entryIds: ["book-psalms"],
  },
  {
    id: "t-apocalyptic",
    era: "Apocalyptique",
    title: "Imaginaire de résistance",
    when: "Ier siècle",
    summary: "Symboles contre empires ; espérance sans carte géopolitique simpliste.",
    entryIds: ["book-revelation"],
  },
];

