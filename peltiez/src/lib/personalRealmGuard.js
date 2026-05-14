/**
 * Socle « garde du jardin » : même cadre de souveraineté pour chaque session,
 * quel que soit le monde, le niveau ou la route — sans collecte serveur implicite.
 */

export const IGOR_STORAGE_PREFIX = "igor:";

const SESSION_GARDEN_KEY = `${IGOR_STORAGE_PREFIX}garden:session`;

/** Identifiant opaque par onglet/session — métaphore du périmètre du jardin, inchangé tant que l’onglet vit. */
export function getOrCreateSessionGardenId() {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_GARDEN_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `g-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(SESSION_GARDEN_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

/** Préfixe recommandé pour toute clé localStorage/sessionStorage Egor69 (lisibilité + audits). */
export function namespacedKey(rest) {
  const clean = String(rest || "").replace(/^igor:+/, "");
  return `${IGOR_STORAGE_PREFIX}${clean}`;
}
