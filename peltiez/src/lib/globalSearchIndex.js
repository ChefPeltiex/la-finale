import { NAV_POLES } from "@/config/navPoles";
import { LAYOUT_NAV_ITEMS } from "@/config/layoutNavItems";
import { ACCUEIL_SECTION_LINKS, linkToHomeSection, navLinkTarget } from "@/lib/accueilSections";

/** Routes App.jsx absentes du menu latéral — titres lisibles pour la recherche. */
const EXTRA_APP_ROUTES = [
  { title: "Preuves en 2 minutes", path: "/docs/preuves", keywords: "preuves checklist credibilite verifiable" },
  { title: "Codex investisseur", path: "/docs/investisseur", keywords: "codex docs investisseur" },
  { title: "Codex rituel", path: "/docs/rituel", keywords: "codex docs rituel" },
  { title: "Codex magique", path: "/docs/magique", keywords: "codex docs magique" },
  { title: "Alliance", path: "/alliance", keywords: "alliance partenaires" },
  { title: "Charte", path: "/charte" },
  { title: "Abonnement", path: "/abonnement" },
  { title: "Communautés", path: "/communautes" },
  { title: "Artisans", path: "/artisans" },
  { title: "Jeu (arcade)", path: "/game" },
  { title: "Défis quotidiens", path: "/daily-challenges" },
  { title: "Quêtes partage", path: "/share-quests" },
  { title: "Campagnes", path: "/campaigns" },
  { title: "Impact global", path: "/impact" },
  { title: "Sécurité", path: "/security" },
  { title: "Donations", path: "/donations" },
  { title: "Mythologies", path: "/mythologies" },
  { title: "Ésotérisme", path: "/esotericism" },
  { title: "Arts divinatoires", path: "/arts-divinatoires" },
  { title: "Hub magie", path: "/magic-hub" },
  { title: "Génome", path: "/genome" },
  { title: "Mentions légales", path: "/legal" },
  { title: "Intro", path: "/intro" },
  { title: "Smart contrats", path: "/smart-contrats" },
  { title: "Piliers 144K", path: "/piliers" },
  { title: "Dashboard royal", path: "/dashboard-royal" },
  { title: "Métriques temps réel", path: "/plateforme/temps-reel" },
];

const EMOJI_RE = /[\u{1F300}-\u{1F9FF}\u2600-\u27BF]/gu;

function stripDecorativeEmoji(label) {
  const cleaned = label.replace(EMOJI_RE, "").replace(/\s+/g, " ").trim();
  return cleaned || label;
}

function pathFromTo(to) {
  if (typeof to === "string") return to;
  const base = to.pathname || "/";
  return `${base}${to.hash || ""}`;
}

function normalizeForSearch(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/**
 * Index plat : titre, destination react-router, chaîne de recherche.
 * @returns {Array<{ title: string, to: string | object, path: string, searchText: string }>}
 */
export function buildGlobalSearchIndex() {
  const byPath = new Map();

  const add = (title, to, extraKeywords = "") => {
    const cleanTitle = stripDecorativeEmoji(title);
    const path = pathFromTo(to);
    if (!path || byPath.has(path)) return;
    const searchText = normalizeForSearch(`${cleanTitle} ${path} ${extraKeywords}`);
    byPath.set(path, { title: cleanTitle, to, path, searchText });
  };

  for (const item of LAYOUT_NAV_ITEMS) {
    add(item.label, navLinkTarget(item));
  }

  for (const pole of NAV_POLES) {
    add(pole.label, pole.defaultPath, pole.labelDeep);
    add(pole.labelDeep, pole.defaultPath, pole.label);
  }

  for (const section of ACCUEIL_SECTION_LINKS) {
    add(section.label, linkToHomeSection(section.id), "accueil home");
  }

  for (const route of EXTRA_APP_ROUTES) {
    add(route.title, route.path, route.keywords || "");
  }

  return Array.from(byPath.values());
}

function matchScore(entry, q) {
  const title = normalizeForSearch(entry.title);
  const path = normalizeForSearch(entry.path);
  if (title.startsWith(q)) return 100;
  if (title.includes(q)) return 70;
  if (path.includes(q)) return 45;
  if (entry.searchText.includes(q)) return 25;
  return 0;
}

/**
 * @param {ReturnType<typeof buildGlobalSearchIndex>} index
 * @param {string} query
 * @param {number} [limit]
 */
export function searchGlobalIndex(index, query, limit = 10) {
  const q = normalizeForSearch(query.trim());
  if (!q) return [];
  return index
    .map((entry) => ({ entry, score: matchScore(entry, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, "fr"))
    .slice(0, limit)
    .map(({ entry }) => entry);
}

/** Index singleton (routes statiques). */
export const GLOBAL_SEARCH_INDEX = buildGlobalSearchIndex();
