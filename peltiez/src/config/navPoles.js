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
    defaultPath: "/wellness",
  },
  {
    id: "jouer",
    label: "Jouer",
    labelDeep: "Jouer · quêtes & jeux",
    icon: Gamepad2,
    color: "text-[#BF00FF]",
    defaultPath: "/jeu",
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
  { prefix: "/atlas", pole: "explorer" },
  { prefix: "/manuel", pole: "explorer" },
  { prefix: "/carte-site", pole: "explorer" },
  { prefix: "/vision", pole: "explorer" },
  { prefix: "/about", pole: "explorer" },
  { prefix: "/contact", pole: "explorer" },
  { prefix: "/outils-integration", pole: "explorer" },
  { prefix: "/encyclopedie-biblique", pole: "explorer" },
  { prefix: "/world", pole: "explorer" },
  { prefix: "/pantheon", pole: "explorer" },
  { prefix: "/fauna-hub", pole: "explorer" },
  { prefix: "/flora-hub", pole: "explorer" },
  { prefix: "/insects-hub", pole: "explorer" },
  { prefix: "/minerals-hub", pole: "explorer" },
  { prefix: "/paparazzi", pole: "explorer" },
  { prefix: "/reporters", pole: "explorer" },
  { prefix: "/fact-check", pole: "explorer" },
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
  { prefix: "/vault", pole: "univers" },
  { prefix: "/admin", pole: "univers" },
  { prefix: "/cosmic-portal", pole: "univers" },
  { prefix: "/piliers", pole: "univers" },
  { prefix: "/carte-ciel", pole: "univers" },
  { prefix: "/numerology", pole: "univers" },
  { prefix: "/sanctuary", pole: "univers" },
  { prefix: "/ue-aiouy", pole: "univers" },
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

export const HOME_POLE_ICON = Home;
