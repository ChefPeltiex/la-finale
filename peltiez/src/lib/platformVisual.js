/**
 * Variantes visuelles — crédible (CirculAI / marché) vs culture (encyclopédie / codex).
 */

const PRO_PREFIXES = [
  "/circulai",
  "/marketplace",
  "/seconde-main",
  "/publier",
  "/profil",
  "/entreprises",
  "/pilote",
  "/docs/circulai",
  "/hub-reparation",
  "/alerts",
  "/carte-site",
  "/manuel",
];

const CULTURE_PREFIXES = [
  "/encyclopedie",
  "/codex-metaphores",
  "/boutique",
  "/atlas",
  "/world",
  "/entrer",
  "/porte",
];

/** @param {string} pathname */
export function getPlatformShellVariant(pathname) {
  if (pathname === "/" || pathname === "/accueil") return "home";
  if (PRO_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return "pro";
  if (CULTURE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return "culture";
  return "default";
}

export function isProShell(pathname) {
  return getPlatformShellVariant(pathname) === "pro";
}

export function isCultureShell(pathname) {
  const v = getPlatformShellVariant(pathname);
  return v === "culture" || v === "home";
}
