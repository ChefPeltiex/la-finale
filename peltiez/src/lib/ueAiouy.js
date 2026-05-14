/**
 * UEAIOUY — ponts Quixel / Unreal / assets web vers la plateforme Egor69 (peltiez).
 * Le navigateur ne bundle pas l’éditeur UE ; ce module centralise le registre local
 * et les URLs optionnelles (Pixel Streaming, docs).
 */

export const UEAIOUY_REGISTRY_KEY = "igor:ue-aiouy:registry:v1";
export const UEAIOUY_DOC_ANCHOR = "docs/unreal-bridge.md#programme-ue-aiouy";

/** @typedef {{ id: string; title: string; source: "quixel" | "unreal" | "manual" | "other"; gltfUrl: string; notes?: string; megascanId?: string; createdAt: string }} UeAiouyEntry */

function safeParse(json) {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** @returns {UeAiouyEntry[]} */
export function loadUeAiouyRegistry() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(UEAIOUY_REGISTRY_KEY);
    if (!raw) return [];
    return safeParse(raw).filter(
      (e) =>
        e &&
        typeof e.id === "string" &&
        typeof e.title === "string" &&
        typeof e.gltfUrl === "string" &&
        typeof e.source === "string"
    );
  } catch {
    return [];
  }
}

/** @param {UeAiouyEntry[]} entries */
export function saveUeAiouyRegistry(entries) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(UEAIOUY_REGISTRY_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent("igor-ue-aiouy-change"));
}

export function createUeAiouyId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `ue-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getUeAiouyPixelStreamUrl() {
  const u = import.meta.env.VITE_UEAIOUY_PIXEL_STREAM_PLAYER_URL;
  return typeof u === "string" && u.trim().startsWith("http") ? u.trim() : "";
}

/** Lien affiché (doc interne). */
export function getUeAiouyExternalDocsUrl() {
  const u = import.meta.env.VITE_UEAIOUY_EXTERNAL_DOCS_URL;
  return typeof u === "string" && u.trim().startsWith("http") ? u.trim() : "";
}
