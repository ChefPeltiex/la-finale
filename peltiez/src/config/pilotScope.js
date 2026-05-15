/**
 * Routes et entrées de navigation visibles en mode pilote (parcours nouvel utilisateur).
 */
import { getAllPilotRouteKeys } from "@/config/navPoles";

export const PILOT_ROUTES = [
  "/",
  "/marketplace",
  "/publier",
  "/vault",
  "/atlas",
  "/encyclopedie.pdf",
  "/docs/investisseur",
  "/docs/preuves",
  "/docs/rituel",
  "/docs/magique",
  "/docs/alliance",
  "/world",
  "/reporters",
  "/fact-check",
  "/sentinelle",
  "/jeu",
  "/vision",
  "/profil",
  "/pilote",
];

const PILOT_PATH_PREFIXES = [
  "/marketplace",
  "/publier",
  "/vault",
  "/atlas",
  "/docs/investisseur",
  "/docs/preuves",
  "/docs/rituel",
  "/docs/magique",
  "/docs/alliance",
  "/world",
  "/reporters",
  "/fact-check",
  "/sentinelle",
  "/jeu",
  "/vision",
];

const PILOT_EXACT = new Set(["/", "/profil", "/pilote"]);

function pilotKeysFromBlocks() {
  return getAllPilotRouteKeys();
}

/** Correspondance d’un item de menu latéral (path + hash optionnel). */
export function isNavItemInPilotScope(item) {
  const path = item?.path ?? "";
  const hash = item?.hash ? (item.hash.startsWith("#") ? item.hash : `#${item.hash}`) : "";
  const key = `${path}${hash}`;

  for (const pilotKey of pilotKeysFromBlocks()) {
    if (pilotKey === key || pilotKey === path) return true;
    if (pilotKey.startsWith(path) && path !== "/") return true;
  }

  if (path === "/" && item.hash === "accueil-encyclopedies") return true;
  if (PILOT_EXACT.has(path)) return true;
  return PILOT_PATH_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/** Correspondance d’une route applicative (pathname). */
export function isPathInPilotScope(pathname) {
  if (!pathname) return false;
  if (PILOT_EXACT.has(pathname)) return true;
  return PILOT_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function filterNavItemsForPilot(items, pilotMode, showAdvanced) {
  if (!pilotMode || showAdvanced) return items;
  return items.filter(isNavItemInPilotScope);
}
