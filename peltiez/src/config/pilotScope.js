/**
 * Routes et entrées de navigation visibles en mode pilote (parcours nouvel utilisateur).
 */
export const PILOT_ROUTES = [
  "/",
  "/marketplace",
  "/publier",
  "/atlas",
  "/encyclopedie.pdf",
  "/docs/investisseur",
  "/docs/rituel",
  "/docs/magique",
  "/docs/alliance",
  "/profil",
];

const PILOT_PATH_PREFIXES = [
  "/marketplace",
  "/publier",
  "/atlas",
  "/docs/investisseur",
  "/docs/rituel",
  "/docs/magique",
  "/docs/alliance",
];

const PILOT_EXACT = new Set(["/", "/profil"]);

/** Correspondance d’un item de menu latéral (path + hash optionnel). */
export function isNavItemInPilotScope(item) {
  const path = item?.path ?? "";
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
