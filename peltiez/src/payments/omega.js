import { clamp } from "@/lib/godMode";

export const OMEGA_DEFAULTS = Object.freeze({
  caRate: 0.10, // 10% commission
  bfMax: 0.05,  // founder bonus up to 5% (proof-gated)
});

export function computeBfRate({ nugget } = {}) {
  // Proof-gated bonus: requires at least one verifiable signal
  const proof = nugget?.proof || {};
  const hasProof = Boolean(
    nugget?.source_url ||
      nugget?.sourceUrl ||
      proof?.source ||
      proof?.collector ||
      proof?.id ||
      proof?.hash
  );
  if (!hasProof) return 0;

  const confidence =
    typeof nugget?.confidence === "number"
      ? nugget.confidence
      : typeof proof?.confidence === "number"
        ? proof.confidence
        : 0.6;

  const valueScore = typeof nugget?.value_score === "number" ? nugget.value_score : 6;
  const urgencyBoost =
    nugget?.urgency === "critique" ? 1 :
    nugget?.urgency === "haute" ? 0.85 :
    nugget?.urgency === "moyenne" ? 0.65 : 0.45;

  const raw = (clamp(confidence, 0, 1) * 0.6 + clamp(valueScore / 10, 0, 1) * 0.4) * urgencyBoost;
  return clamp(raw * OMEGA_DEFAULTS.bfMax, 0, OMEGA_DEFAULTS.bfMax);
}

export function computeOmega({ vp, caRate = OMEGA_DEFAULTS.caRate, bfRate = 0 } = {}) {
  const value = Math.max(0, Number(vp) || 0);
  // Ca must remain exactly 10% unless you change the constant above.
  const ca = clamp(Number(caRate) || 0, 0, 0.5);
  const bf = clamp(Number(bfRate) || 0, 0, OMEGA_DEFAULTS.bfMax);
  const commission = value * ca;
  const bonus = value * bf;
  const omega = commission + bonus;

  return {
    vp: value,
    caRate: ca,
    bfRate: bf,
    commission,
    bonus,
    omega,
  };
}

