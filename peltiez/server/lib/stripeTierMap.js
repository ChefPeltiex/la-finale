/**
 * Associe un Price Stripe à un palier IGOR (env `.env.server`).
 * Valeurs possibles : pro, premium, business, boost, ou paid si inconnu.
 */
export function tierFromPriceId(priceId, env) {
  if (!priceId) return "paid";
  const pairs = [
    [env.STRIPE_PRICE_TIER_PRO, "pro"],
    [env.STRIPE_PRICE_TIER_PREMIUM, "premium"],
    [env.STRIPE_PRICE_TIER_BUSINESS, "business"],
    [env.STRIPE_PRICE_TIER_BOOST, "boost"],
  ];
  for (const [pid, tier] of pairs) {
    if (pid && pid === priceId) return tier;
  }
  return "paid";
}
