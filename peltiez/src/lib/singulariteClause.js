/** Acceptation locale de la clause Singularité (Pass Outworld) — pas de valeur notariale ; UX + trace navigateur. */

const STORAGE_ACCEPT = "igor:singularite_clause_accepted:v1";
const STORAGE_CLE = "igor:singularite_cle_signature:v1";
const STORAGE_AT = "igor:singularite_clause_at:v1";

export function hasSingularityClauseAccepted() {
  try {
    return localStorage.getItem(STORAGE_ACCEPT) === "1";
  } catch {
    return false;
  }
}

/**
 * Enregistre l’acceptation + une « Clé de Singularité » saisie par l’utilisateur (empreinte locale uniquement).
 */
export function acceptSingularityClause({ cle }) {
  try {
    localStorage.setItem(STORAGE_ACCEPT, "1");
    const trimmed = String(cle || "").trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_CLE, trimmed);
    }
    localStorage.setItem(STORAGE_AT, new Date().toISOString());
    window.dispatchEvent(new CustomEvent("igor-singularite-clause-change"));
  } catch {
    /* quota */
  }
}

export function revokeSingularityClauseAcceptance() {
  try {
    localStorage.removeItem(STORAGE_ACCEPT);
    localStorage.removeItem(STORAGE_CLE);
    localStorage.removeItem(STORAGE_AT);
    window.dispatchEvent(new CustomEvent("igor-singularite-clause-change"));
  } catch {
    /* */
  }
}
