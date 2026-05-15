import {
  ShoppingBag,
  Compass,
  Zap,
  Gamepad2,
  Sparkles,
  Home,
} from "lucide-react";

/** Cinq pôles de navigation — regroupe les routes existantes sans les retirer du routeur. */
export const NAV_POLES = [
  {
    id: "echanger",
    label: "Échanger",
    labelDeep: "Échanger · circulation",
    icon: ShoppingBag,
    color: "text-[#39FF14]",
    defaultPath: "/marketplace",
  },
  {
    id: "explorer",
    label: "Explorer",
    labelDeep: "Explorer · atlas & cartes",
    icon: Compass,
    color: "text-[#FFD700]",
    defaultPath: "/atlas",
  },
  {
    id: "agir",
    label: "Agir",
    labelDeep: "Agir · impact & soin",
    icon: Zap,
    color: "text-[#FF1744]",
    defaultPath: "/reporters",
  },
  {
    id: "jouer",
    label: "Jouer",
    labelDeep: "Jouer · quêtes & jeux",
    icon: Gamepad2,
    color: "text-[#BF00FF]",
    defaultPath: "/world",
  },
  {
    id: "univers",
    label: "Univers Egor69",
    labelDeep: "Univers Egor69 · souveraineté",
    icon: Sparkles,
    color: "text-[#D4AF37]",
    defaultPath: "/",
  },
];

/**
 * Blocs sujets par pôle — navigation pilote (5–7 blocs max visibles en mode pilote).
 * `routes[].to` : path ou { pathname, hash } ; labels courts pour la sidebar.
 */
export const NAV_POLE_BLOCKS = {
  echanger: [
    {
      id: "circulation",
      label: "Marketplace",
      descriptionSimple: "Dons, trocs, réparations et ventes.",
      descriptionDeep: "Circulation des biens · impact mesurable.",
      pilot: true,
      routes: [
        { to: "/marketplace", label: "Marketplace" },
        { to: "/feed", label: "Communauté" },
        { to: "/artisans", label: "Artisans" },
      ],
    },
    {
      id: "publier",
      label: "Publier",
      descriptionSimple: "Publie en quelques minutes.",
      descriptionDeep: "Offrir, vendre ou proposer un échange.",
      pilot: true,
      routes: [
        { to: "/publier", label: "Publier" },
        { to: "/create-post", label: "Créer une annonce" },
        { to: "/actualite", label: "Actualité" },
      ],
    },
    {
      id: "coffre",
      label: "Mon coffre",
      descriptionSimple: "Tes objets et favoris.",
      descriptionDeep: "Coffre personnel · alertes liées.",
      pilot: true,
      routes: [{ to: "/vault", label: "Mon coffre" }],
    },
  ],
  explorer: [
    {
      id: "atlas",
      label: "Atlas",
      descriptionSimple: "Fiches vivantes et savoirs.",
      descriptionDeep: "Atlas vivant · cartes et manuel.",
      pilot: true,
      routes: [
        { to: "/atlas", label: "Atlas vivant" },
        { to: "/manuel", label: "Manuel" },
        { to: "/carte-site", label: "Carte & parcours" },
      ],
    },
    {
      id: "codex-encyclo",
      label: "Encyclopédies & Codex",
      descriptionSimple: "PDF et éditions Codex.",
      descriptionDeep: "Encyclopédie · investisseur · rituel · magique.",
      pilot: true,
      routes: [
        { to: { pathname: "/", hash: "#accueil-encyclopedies" }, label: "Encyclopédies" },
        { to: "/encyclopedie-biblique", label: "Encyclopédie biblique" },
        { to: "/docs/investisseur", label: "Codex investisseur" },
        { to: "/docs/preuves", label: "Preuves en 2 min" },
      ],
    },
    {
      id: "vivant",
      label: "Faune & flore",
      descriptionSimple: "Bestiaire et botanique.",
      descriptionDeep: "Hubs faune, flore, insectes, minéraux.",
      pilot: false,
      routes: [
        { to: "/fauna-hub", label: "Faune" },
        { to: "/flora-hub", label: "Flore" },
        { to: "/insects-hub", label: "Insectes" },
        { to: "/minerals-hub", label: "Minéraux" },
      ],
    },
  ],
  agir: [
    {
      id: "radar",
      label: "Radar",
      descriptionSimple: "Signaux forts, sources vérifiables.",
      descriptionDeep: "Mur de la victoire · reporters.",
      pilot: true,
      routes: [
        { to: { pathname: "/", hash: "#accueil-radar" }, label: "Mur Radar (accueil)" },
        { to: "/reporters", label: "Reporters" },
        { to: "/paparazzi", label: "Paparazzi" },
      ],
    },
    {
      id: "sentinelle",
      label: "Sentinelle",
      descriptionSimple: "Sécurité et transparence.",
      descriptionDeep: "Authenticité · journal de transparence.",
      pilot: true,
      routes: [
        { to: "/sentinelle", label: "Sentinelle" },
        { to: "/authenticity", label: "Authenticity" },
        { to: "/transparency-log", label: "Transparency" },
        { to: "/security", label: "Sécurité" },
      ],
    },
    {
      id: "fact-check",
      label: "Fact-check",
      descriptionSimple: "Vérifier avant de partager.",
      descriptionDeep: "Vérité avec garde-fous.",
      pilot: true,
      routes: [{ to: "/fact-check", label: "Fact Check" }],
    },
    {
      id: "impact",
      label: "Impact & soin",
      descriptionSimple: "Bien-être et campagnes.",
      descriptionDeep: "Wellness · impact · soutien.",
      pilot: false,
      routes: [
        { to: "/wellness", label: "Wellness" },
        { to: "/impact", label: "Impact global" },
        { to: "/campaigns", label: "Campagnes" },
        { to: "/soutien", label: "Soutien" },
      ],
    },
  ],
  jouer: [
    {
      id: "verse",
      label: "Verse 3D",
      descriptionSimple: "Vol cosmique · anneaux.",
      descriptionDeep: "Entrer dans le Verse · portails vers le site.",
      pilot: true,
      featured: true,
      routes: [{ to: "/world", label: "Entrer dans le Verse" }],
    },
    {
      id: "jeux",
      label: "Jeux",
      descriptionSimple: "Arcade et défis rapides.",
      descriptionDeep: "Jeux circulaires · playtime.",
      pilot: true,
      routes: [
        { to: "/jeu", label: "Hub jeux" },
        { to: "/game", label: "Arcade" },
        { to: "/playtime", label: "Playtime" },
      ],
    },
    {
      id: "quetes",
      label: "Quêtes",
      descriptionSimple: "Missions et défis du jour.",
      descriptionDeep: "Quêtes partage · défis quotidiens.",
      pilot: false,
      routes: [
        { to: "/daily-challenges", label: "Défis quotidiens" },
        { to: "/share-quests", label: "Quêtes partage" },
      ],
    },
  ],
  univers: [
    {
      id: "vision",
      label: "Vision",
      descriptionSimple: "Pourquoi Egor69 existe.",
      descriptionDeep: "Vision · à propos · contact.",
      pilot: true,
      routes: [
        { to: "/vision", label: "Vision" },
        { to: "/about", label: "À propos" },
        { to: "/contact", label: "Contact" },
      ],
    },
    {
      id: "codex-profond",
      label: "Codex profond",
      descriptionSimple: "Éditions rituel et magique.",
      descriptionDeep: "Investisseur · rituel · magique · preuves.",
      pilot: true,
      routes: [
        { to: "/docs/investisseur", label: "Codex investisseur" },
        { to: "/docs/rituel", label: "Codex rituel" },
        { to: "/docs/magique", label: "Codex magique" },
        { to: "/docs/preuves", label: "Preuves" },
      ],
    },
    {
      id: "alliance-docs",
      label: "Alliance IA",
      descriptionSimple: "Orchestration et manifests.",
      descriptionDeep: "Docs alliance · hubs souverains.",
      pilot: true,
      routes: [
        { to: "/docs/alliance", label: "Alliance IA (doc)" },
        { to: "/alliance", label: "Alliance mondiale" },
        { to: "/hub-souverain", label: "Hub souverain" },
        { to: "/profil", label: "Mon profil" },
      ],
    },
  ],
};

/** Cartes accueil — un bloc phare par pôle (2 CTAs). */
export const HOME_POLE_CARDS = NAV_POLES.map((pole) => {
  const blocks = NAV_POLE_BLOCKS[pole.id] || [];
  const primary = blocks.find((b) => b.pilot) || blocks[0];
  const secondary = blocks.filter((b) => b !== primary).find((b) => b.pilot) || blocks[1];
  const ctas = [];
  if (primary?.routes[0]) {
    ctas.push({
      to: primary.routes[0].to,
      label: primary.routes[0].label,
      blockId: primary.id,
    });
  }
  if (secondary?.routes[0]) {
    ctas.push({
      to: secondary.routes[0].to,
      label: secondary.routes[0].label,
      blockId: secondary.id,
    });
  }
  const tagline =
    pole.id === "jouer"
      ? "Verse cinéma — dérive lente entre les anneaux, comme un voyage Planet Earth."
      : pole.id === "echanger"
        ? "Circule, publie, partage — l’économie vivante."
        : pole.id === "explorer"
          ? "Savoirs, atlas, encyclopédies qui respirent."
          : pole.id === "agir"
            ? "Radar, vérité, impact mesurable."
            : "Vision souveraine et Codex de confiance.";

  return {
    poleId: pole.id,
    pole,
    tagline,
    ctas: ctas.slice(0, 2),
    verseHighlight: pole.id === "jouer",
  };
});

function routeKey(to) {
  if (typeof to === "string") return to;
  return `${to.pathname || "/"}${to.hash || ""}`;
}

function pathMatchesRoute(pathname, hash, to) {
  if (typeof to === "string") {
    return pathname === to || pathname.startsWith(`${to}/`);
  }
  const base = to.pathname || "/";
  const wantHash = to.hash ? (to.hash.startsWith("#") ? to.hash : `#${to.hash}`) : "";
  if (pathname !== base && !pathname.startsWith(`${base}/`)) return false;
  if (wantHash) return hash === wantHash;
  return true;
}

export function getBlocksForPole(poleId, { pilotOnly = false } = {}) {
  const blocks = NAV_POLE_BLOCKS[poleId] || [];
  if (!pilotOnly) return blocks;
  return blocks.filter((b) => b.pilot);
}

export function getBlockIdForPath(pathname, hash = "") {
  const poleId = getPoleIdForPath(pathname);
  const blocks = NAV_POLE_BLOCKS[poleId] || [];
  for (const block of blocks) {
    if (block.routes.some((r) => pathMatchesRoute(pathname, hash, r.to))) {
      return block.id;
    }
  }
  return blocks[0]?.id ?? null;
}

export function getAllPilotRouteKeys() {
  const keys = new Set();
  for (const blocks of Object.values(NAV_POLE_BLOCKS)) {
    for (const block of blocks) {
      if (!block.pilot) continue;
      for (const r of block.routes) keys.add(routeKey(r.to));
    }
  }
  return keys;
}

/** Préfixe de route → pôle (ordre : plus spécifique d’abord). */
const PATH_POLE_RULES = [
  { prefix: "/marketplace", pole: "echanger" },
  { prefix: "/publier", pole: "echanger" },
  { prefix: "/feed", pole: "echanger" },
  { prefix: "/artisans", pole: "echanger" },
  { prefix: "/create-post", pole: "echanger" },
  { prefix: "/annonce", pole: "echanger" },
  { prefix: "/blog", pole: "echanger" },
  { prefix: "/actualite", pole: "echanger" },
  { prefix: "/smart-contrats", pole: "echanger" },
  { prefix: "/vault", pole: "echanger" },
  { prefix: "/atlas", pole: "explorer" },
  { prefix: "/manuel", pole: "explorer" },
  { prefix: "/carte-site", pole: "explorer" },
  { prefix: "/encyclopedie-biblique", pole: "explorer" },
  { prefix: "/docs", pole: "explorer" },
  { prefix: "/pantheon", pole: "explorer" },
  { prefix: "/fauna-hub", pole: "explorer" },
  { prefix: "/flora-hub", pole: "explorer" },
  { prefix: "/insects-hub", pole: "explorer" },
  { prefix: "/minerals-hub", pole: "explorer" },
  { prefix: "/vision", pole: "univers" },
  { prefix: "/about", pole: "univers" },
  { prefix: "/contact", pole: "univers" },
  { prefix: "/outils-integration", pole: "explorer" },
  { prefix: "/paparazzi", pole: "agir" },
  { prefix: "/reporters", pole: "agir" },
  { prefix: "/fact-check", pole: "agir" },
  { prefix: "/wellness", pole: "agir" },
  { prefix: "/impact", pole: "agir" },
  { prefix: "/campaigns", pole: "agir" },
  { prefix: "/soutien", pole: "agir" },
  { prefix: "/pricing", pole: "agir" },
  { prefix: "/donations", pole: "agir" },
  { prefix: "/security", pole: "agir" },
  { prefix: "/sentinelle", pole: "agir" },
  { prefix: "/authenticity", pole: "agir" },
  { prefix: "/transparency-log", pole: "agir" },
  { prefix: "/world", pole: "jouer" },
  { prefix: "/jeu", pole: "jouer" },
  { prefix: "/playtime", pole: "jouer" },
  { prefix: "/game", pole: "jouer" },
  { prefix: "/daily-challenges", pole: "jouer" },
  { prefix: "/share-quests", pole: "jouer" },
  { prefix: "/profil", pole: "univers" },
  { prefix: "/mon-univers", pole: "univers" },
  { prefix: "/hub-souverain", pole: "univers" },
  { prefix: "/hub-fondations", pole: "univers" },
  { prefix: "/avatar-creator", pole: "univers" },
  { prefix: "/alerts", pole: "univers" },
  { prefix: "/admin", pole: "univers" },
  { prefix: "/cosmic-portal", pole: "univers" },
  { prefix: "/piliers", pole: "univers" },
  { prefix: "/carte-ciel", pole: "univers" },
  { prefix: "/numerology", pole: "univers" },
  { prefix: "/sanctuary", pole: "univers" },
  { prefix: "/ue-aiouy", pole: "univers" },
  { prefix: "/alliance", pole: "univers" },
];

const EXACT_PATH_POLE = {
  "/": "univers",
};

export function getPoleIdForPath(pathname) {
  if (EXACT_PATH_POLE[pathname]) return EXACT_PATH_POLE[pathname];
  const rule = PATH_POLE_RULES.find((r) => pathname === r.prefix || pathname.startsWith(`${r.prefix}/`));
  return rule?.pole ?? "univers";
}

export function getPoleById(id) {
  return NAV_POLES.find((p) => p.id === id) ?? NAV_POLES[4];
}

export function groupNavItemsByPole(navItems) {
  const groups = Object.fromEntries(NAV_POLES.map((p) => [p.id, []]));
  for (const item of navItems) {
    const poleId = getPoleIdForPath(item.path);
    groups[poleId].push(item);
  }
  return NAV_POLES.map((pole) => ({
    pole,
    items: groups[pole.id],
  })).filter((g) => g.items.length > 0);
}

export function poleLabel(pole, simple) {
  return simple ? pole.label : pole.labelDeep;
}

export function blockDescription(block, simple) {
  return simple ? block.descriptionSimple : block.descriptionDeep;
}

export function resolveNavItemForRoute(navItems, to) {
  const key = routeKey(to);
  const pathOnly = typeof to === "string" ? to : to.pathname || "/";
  const hash = typeof to === "object" && to.hash ? (to.hash.startsWith("#") ? to.hash.slice(1) : to.hash) : null;

  const exact = navItems.find((item) => {
    const itemKey = `${item.path}${item.hash ? `#${item.hash.replace(/^#/, "")}` : ""}`;
    if (itemKey === key.replace(/^#/, "") || itemKey === key) return true;
    if (item.path === pathOnly && (hash ? item.hash === hash : !item.hash)) return true;
    return false;
  });
  if (exact) return exact;

  return navItems.find((item) => item.path === pathOnly);
}

export const HOME_POLE_ICON = Home;
