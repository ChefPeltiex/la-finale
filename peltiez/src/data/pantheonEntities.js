/** Schéma visuel 3D : `archon` = preset premium ; sinon couleurs torn/fog. */
export function getPantheonEntityVisual(entity) {
  if (!entity?.visual) {
    return { mode: "themed", accent: "#34d399", fog: 0x030712, emissive: "#064e3b", ringBoost: 1 };
  }
  if (entity.visual.mode === "archon") return { mode: "archon" };
  const v = entity.visual;
  return {
    mode: "themed",
    accent: v.accent || "#34d399",
    fog: typeof v.fog === "number" ? v.fog : 0x030712,
    emissive: v.emissive || "#064e3b",
    ringBoost: typeof v.ringBoost === "number" ? v.ringBoost : 1,
  };
}

export const PANTHEON_ENTITIES = [
  {
    id: "omega-archon",
    name: "Ω Archon",
    kind: "dieu",
    realm: "Souveraineté",
    rarity: "legendary",
    tagline: "Le sceau vivant qui stabilise l’abondance.",
    description:
      "Gardien de la Constante de Igor. Quand Ω(t₀) > 1, l’économie circulaire respire et se régénère.",
    tags: ["omega", "souveraineté", "abondance", "sceau", "fondateur"],
    stats: { power: 10, wisdom: 9, chaos: 2, mercy: 9 },
    visual: { mode: "archon" },
    media: {
      cover:
        "https://images.unsplash.com/photo-1520975958225-8f2b74b0a0f8?w=1600&h=900&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1600&h=900&fit=crop",
        "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1600&h=900&fit=crop",
      ],
    },
  },
  {
    id: "torus-forge",
    name: "Torus Forge",
    kind: "artefact",
    realm: "Économie circulaire",
    rarity: "epic",
    tagline: "Le beigne sacré où tout revient, amélioré.",
    description:
      "Signature des transactions: cercle → tore. Le glitch devient loi universelle (sans perdre la beauté).",
    tags: ["tore", "transaction", "circularité", "signature"],
    stats: { power: 8, wisdom: 7, chaos: 3, mercy: 6 },
    visual: { accent: "#38bdf8", fog: 0x020617, emissive: "#0369a1", ringBoost: 1.1 },
    media: {
      cover:
        "https://images.unsplash.com/photo-1520975869010-0a2b0d3a2a1c?w=1600&h=900&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&h=900&fit=crop",
        "https://images.unsplash.com/photo-1520975911564-6d5c2e0a7e5e?w=1600&h=900&fit=crop",
      ],
    },
  },
  {
    id: "higgs-lantern",
    name: "Lanterne de Higgs",
    kind: "artefact",
    realm: "Sciences",
    rarity: "rare",
    tagline: "Donne une masse au rêve, sans l’alourdir.",
    description:
      "Une lumière qui matérialise les idées. Le visible devient action, l’action devient impact.",
    tags: ["higgs", "science", "lumière", "matérialisation"],
    stats: { power: 6, wisdom: 9, chaos: 2, mercy: 7 },
    visual: { accent: "#a78bfa", fog: 0x0c0818, emissive: "#5b21b6", ringBoost: 1.05 },
    media: {
      cover:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&h=900&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&h=900&fit=crop",
      ],
    },
  },
  {
    id: "fermat-vow",
    name: "Vœu de Fermat",
    kind: "sceau",
    realm: "Éducation",
    rarity: "epic",
    tagline: "La preuve qu’on avance par beauté + rigueur.",
    description:
      "Un serment de logique: aucun raccourci, aucune triche. La clarté gagne toujours.",
    tags: ["fermat", "éducation", "preuve", "rigueur"],
    stats: { power: 7, wisdom: 10, chaos: 1, mercy: 6 },
    visual: { accent: "#fbbf24", fog: 0x0a0804, emissive: "#b45309", ringBoost: 1 },
    media: {
      cover:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=900&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&h=900&fit=crop",
      ],
    },
  },
  {
    id: "sanctuary-warden",
    name: "Sanctuary Warden",
    kind: "gardien",
    realm: "Nature",
    rarity: "legendary",
    tagline: "Protecteur des êtres: douceur invincible.",
    description:
      "Un gardien qui ne frappe jamais: il soigne, il relie, il restaure. La bonté comme technologie.",
    tags: ["nature", "sanctuary", "soin", "protection"],
    stats: { power: 8, wisdom: 8, chaos: 1, mercy: 10 },
    visual: { accent: "#4ade80", fog: 0x041910, emissive: "#047857", ringBoost: 1.08 },
    media: {
      cover:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=900&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=1600&h=900&fit=crop",
      ],
    },
  },
  {
    id: "chronos-braid",
    name: "Tresse de Chronos",
    kind: "oracle",
    realm: "Temps",
    rarity: "rare",
    tagline: "Chaque battement est une dette rendue au présent.",
    description:
      "Fil invisible entre hier et demain : tu ne maîtrises pas le flux, mais tu choisis où placer ton attention.",
    tags: ["temps", "rythme", "présence", "mémoire"],
    stats: { power: 5, wisdom: 10, chaos: 4, mercy: 8 },
    visual: { accent: "#22d3ee", fog: 0x041318, emissive: "#0e7490", ringBoost: 1.02 },
    media: {
      cover:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1600&h=900&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&h=900&fit=crop",
      ],
    },
  },
  {
    id: "veil-mercury",
    name: "Voile de Mercure",
    kind: "messager",
    realm: "Connexion",
    rarity: "epic",
    tagline: "Les nouvelles voyagent vite ; la vérité choisit son canal.",
    description:
      "Messager polymorphe : Latence, fidélité, respect du destinataire — la parole sacrée du réseau vivant.",
    tags: ["messager", "réseau", "signal", "confiance"],
    stats: { power: 7, wisdom: 8, chaos: 5, mercy: 7 },
    visual: { accent: "#94a3b8", fog: 0x06080f, emissive: "#475569", ringBoost: 1.06 },
    media: {
      cover:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&h=900&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600&h=900&fit=crop",
      ],
    },
  },
  {
    id: "crown-mycelium",
    name: "Couronne Mycélium",
    kind: "réseau",
    realm: "Réseau vivant",
    rarity: "legendary",
    tagline: "Sous terre, tout le monde est déjà relié.",
    description:
      "Arbitrage doux des flux : redistribution sans centre unique. La résilience naît du filet, pas de la tour.",
    tags: ["mycélium", "pair-à-pair", "résilience", "partage"],
    stats: { power: 9, wisdom: 9, chaos: 3, mercy: 9 },
    visual: { accent: "#eab308", fog: 0x080804, emissive: "#a16207", ringBoost: 1.15 },
    media: {
      cover:
        "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1600&h=900&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&h=900&fit=crop",
      ],
    },
  },
  {
    id: "aurora-quorum",
    name: "Aurora du Quorum",
    kind: "assemblée",
    realm: "Consensus",
    rarity: "rare",
    tagline: "La voix commune sans écraser la voix seule.",
    description:
      "Protocole de décision : pas le plus fort, pas le plus nombreux — le consentement éclairé mesurable.",
    tags: ["consensus", "gouvernance", "transparence", "vote"],
    stats: { power: 6, wisdom: 9, chaos: 2, mercy: 9 },
    visual: { accent: "#f472b6", fog: 0x100818, emissive: "#be185d", ringBoost: 1.04 },
    media: {
      cover:
        "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1600&h=900&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1465101162946-4377e57745c8?w=1600&h=900&fit=crop",
      ],
    },
  },
];

export const PANTHEON_REALMS = [
  "Tous",
  "Souveraineté",
  "Économie circulaire",
  "Sciences",
  "Éducation",
  "Nature",
  "Temps",
  "Connexion",
  "Réseau vivant",
  "Consensus",
];

