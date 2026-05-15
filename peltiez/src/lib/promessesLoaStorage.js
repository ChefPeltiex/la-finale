import { namespacedKey } from "@/lib/personalRealmGuard";

const STORAGE_KEY = namespacedKey("promesses-loa:self-check");

/** @typedef {'aligned' | 'in_progress' | 'review'} PromesseStatus */

/** @returns {Record<string, PromesseStatus>} */
export function loadPromessesSelfCheck() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** @param {string} promiseId @param {PromesseStatus} status */
export function savePromesseStatus(promiseId, status) {
  if (typeof window === "undefined") return;
  try {
    const prev = loadPromessesSelfCheck();
    const next = { ...prev, [promiseId]: status };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("igor-promesses-loa-update", { detail: next }));
  } catch {
    /* quota / private mode */
  }
}

export function clearPromessesSelfCheck() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("igor-promesses-loa-update", { detail: {} }));
  } catch {
    /* ignore */
  }
}
