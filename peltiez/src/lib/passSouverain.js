/** Clés locales pour le flux Pass Souverain (aucune garantie serveur côté client). */

export const PASS_SOUVERAIN_STORAGE_KEY = "igor:pass_souverain:v1";
export const UNLOCKED_FICHES_STORAGE_KEY = "igor:unlocked_fiches";
export const PASS_SOUVERAIN_ANCHOR_ID = "pass-souverain";
export const FICHE_UNLOCK_ID = "fiche_001";

function parseUnlockedIds() {
  try {
    const raw = localStorage.getItem(UNLOCKED_FICHES_STORAGE_KEY);
    if (!raw) return new Set();
    const data = JSON.parse(raw);
    const arr = Array.isArray(data.ids) ? data.ids : [];
    return new Set(arr.map(String));
  } catch {
    return new Set();
  }
}

function persistUnlocked(ids) {
  localStorage.setItem(UNLOCKED_FICHES_STORAGE_KEY, JSON.stringify({ ids: [...ids] }));
}

function recordPassAndFiche001() {
  localStorage.setItem(PASS_SOUVERAIN_STORAGE_KEY, "1");
  const ids = parseUnlockedIds();
  ids.add(FICHE_UNLOCK_ID);
  ids.add("fiche_canonique_001");
  persistUnlocked(ids);
}

/**
 * Retour de Stripe après achat Pass: `success=1` + `igor_pass=1` + `session_id` (placeholder rempli par Stripe).
 */
export function consumePassSouverainFromUrl(searchParams) {
  if (!searchParams) return false;
  const ok =
    searchParams.get("success") === "1" &&
    searchParams.get("igor_pass") === "1" &&
    Boolean(searchParams.get("session_id")?.trim());
  if (!ok) return false;
  try {
    recordPassAndFiche001();
    return true;
  } catch {
    return false;
  }
}

export function stripPassSouverainSearchParams(searchParams) {
  if (!searchParams) return;
  searchParams.delete("success");
  searchParams.delete("igor_pass");
  searchParams.delete("session_id");
}

export function hasPassSouverain() {
  try {
    return localStorage.getItem(PASS_SOUVERAIN_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Lit la Fiche vivante canonique n°001 (après passage boutique enregistré localement). */
export function unlockFiche001Available() {
  const ids = parseUnlockedIds();
  if (hasPassSouverain()) return true;
  return ids.has(FICHE_UNLOCK_ID) || ids.has("fiche_canonique_001");
}
