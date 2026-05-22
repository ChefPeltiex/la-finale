/** Choix de monde — concret (CirculAI) vs fantaisiste (Egor69). */

export const WORLD_STORAGE_KEY = "circulai:world-choice:v1";
export const WORLD_CONCRETE = "concrete";
export const WORLD_FANTASY = "fantasy";

const VALID = new Set([WORLD_CONCRETE, WORLD_FANTASY]);

/** URL vitrine CirculAI (Base44 par défaut ; override via VITE_CIRCULAI_APP_URL). */
export function resolveCirculaiAppUrl() {
  const raw =
    typeof import.meta !== "undefined" && import.meta.env?.VITE_CIRCULAI_APP_URL
      ? String(import.meta.env.VITE_CIRCULAI_APP_URL).trim()
      : "";
  if (!raw) return "https://circulai.base44.app";
  try {
    return new URL(raw.startsWith("http") ? raw : `https://${raw}`).href;
  } catch {
    return "https://circulai.base44.app";
  }
}

/** @returns {"concrete"|"fantasy"|null} */
export function loadWorldChoice() {
  if (typeof localStorage === "undefined") return null;
  const v = localStorage.getItem(WORLD_STORAGE_KEY);
  return VALID.has(v) ? v : null;
}

/** @param {"concrete"|"fantasy"} world */
export function saveWorldChoice(world) {
  if (typeof localStorage === "undefined" || !VALID.has(world)) return;
  localStorage.setItem(WORLD_STORAGE_KEY, world);
}

export function worldChoiceLabel(world) {
  if (world === WORLD_CONCRETE) return "Monde concret";
  if (world === WORLD_FANTASY) return "Monde fantaisiste";
  return "Choisir un monde";
}
