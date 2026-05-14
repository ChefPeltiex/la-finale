/**
 * Économie de progression Egor69 — points d’expérience stockés localement.
 *
 * IMPORTANT — Ce ne sont pas des crypto-actifs, pas un dépôt de valeur réglementé,
 * pas une promesse de rendement. Conversion « marchande » affichée = estimation pédagogique
 * pour rapprocher mental XP ↔ euro (ou autre) avec coefficient configurable (défaut 1.5).
 */

const XP_KEY = "igor:xp:balance";
const LEDGER_KEY = "igor:xp:ledger";
const FIAT_HINT_MULTIPLIER = 1.5;

export function getXpBalance() {
  if (typeof window === "undefined") return 0;
  try {
    const n = Number(localStorage.getItem(XP_KEY));
    return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
  } catch {
    return 0;
  }
}

export function setXpBalance(n) {
  if (typeof window === "undefined") return;
  localStorage.setItem(XP_KEY, String(Math.max(0, Math.floor(n))));
}

export function appendLedger(entry) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LEDGER_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift({ t: Date.now(), ...entry });
    localStorage.setItem(LEDGER_KEY, JSON.stringify(arr.slice(0, 80)));
  } catch {
    /* ignore */
  }
}

export function awardXp(amount, reason, meta = {}) {
  const add = Math.max(0, Math.floor(amount));
  if (!add) return getXpBalance();
  const next = getXpBalance() + add;
  setXpBalance(next);
  appendLedger({ kind: "earn", amount: add, reason, ...meta });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("igor-xp-change", { detail: { balance: next } }));
  }
  return next;
}

export function spendXp(amount, reason) {
  const cost = Math.max(0, Math.floor(amount));
  const cur = getXpBalance();
  if (cur < cost) return { ok: false, balance: cur };
  const next = cur - cost;
  setXpBalance(next);
  appendLedger({ kind: "spend", amount: cost, reason });
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("igor-xp-change", { detail: { balance: next } }));
  }
  return { ok: true, balance: next };
}

/**
 * Estimation illustrative : combien d’unités fiat « équivalentes » pour un bloc XP,
 * si l’utilisateur fixe manuellement un taux (ex. 1 XP ≈ 0.02 €).
 * Multiplicateur 1.5 = coefficient demandé produit (à ajuster côté admin plus tard).
 */
export function estimateFiatEquivalent(xpAmount, userXpPerFiatUnit) {
  const rate = Number(userXpPerFiatUnit);
  if (!Number.isFinite(rate) || rate <= 0) return null;
  const base = xpAmount / rate;
  return base * FIAT_HINT_MULTIPLIER;
}

export function getFiathintMultiplier() {
  return FIAT_HINT_MULTIPLIER;
}

export function readLedger() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LEDGER_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
