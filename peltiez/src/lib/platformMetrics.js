/** Agrégats plateforme — mode souverain : données = entité locale `EcoProfile`. */

const FREE_TIERS = new Set(["", "gratuit", "free", "citoyen", "citoyen libre"]);

/**
 * Abonnement payant si champ explicite ou palier hors gratuit.
 * Étendez les clés si vous persistez Stripe côté profil (`subscription_status`, etc.).
 */
export function isPaidSubscription(profile) {
  if (!profile || typeof profile !== "object") return false;
  if (profile.subscription_active === true) return true;
  if (profile.subscription_status === "active" && profile.subscription_plan && !FREE_TIERS.has(String(profile.subscription_plan).toLowerCase())) {
    return true;
  }
  const tier = String(profile.subscription_tier || profile.subscription_plan || profile.plan || "").toLowerCase().trim();
  if (!tier || FREE_TIERS.has(tier)) return false;
  return ["pro", "premium", "business", "boost"].includes(tier);
}

/** Adhésions = profils enregistrés ; abonnements = sous-ensemble payant / actif. */
export function summarizeEcoProfiles(profiles) {
  const list = Array.isArray(profiles) ? profiles : [];
  return {
    memberships: list.length,
    subscriptions: list.filter(isPaidSubscription).length,
  };
}
