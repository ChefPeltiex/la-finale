/** @typedef {"netherealm" | "etherealm" | "outworld"} SovereignPassTier */

export const SOVEREIGN_STATUS_STORAGE_KEY = "igor:sovereign:status";
export const SOVEREIGN_TIER_STORAGE_KEY = "igor:sovereign:pass_tier";
export const SOVEREIGN_STATUS_LABEL = "Contributeur Souverain";

const PASS_TIERS = new Set(["netherealm", "etherealm", "outworld"]);

export function isValidPassTier(t) {
  return typeof t === "string" && PASS_TIERS.has(t);
}

/**
 * Persist “Contributeur Souverain” after a successful pass checkout / Elements return.
 * @param {SovereignPassTier | string} [passTier]
 */
export function setSovereignContributor(passTier) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SOVEREIGN_STATUS_STORAGE_KEY, SOVEREIGN_STATUS_LABEL);
    if (passTier && isValidPassTier(passTier)) {
      window.localStorage.setItem(SOVEREIGN_TIER_STORAGE_KEY, passTier);
    }
    window.dispatchEvent(new CustomEvent("igor:sovereign:status"));
  } catch {
    /* ignore quota / private mode */
  }
}

/** @returns {boolean} */
export function isSovereignContributor() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SOVEREIGN_STATUS_STORAGE_KEY) === SOVEREIGN_STATUS_LABEL;
  } catch {
    return false;
  }
}

/** @returns {SovereignPassTier | ""} */
export function getSovereignPassTier() {
  if (typeof window === "undefined") return "";
  try {
    const t = window.localStorage.getItem(SOVEREIGN_TIER_STORAGE_KEY) || "";
    return isValidPassTier(t) ? /** @type {SovereignPassTier} */ (t) : "";
  } catch {
    return "";
  }
}
