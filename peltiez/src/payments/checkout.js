/**
 * Stripe checkout requires a server-side endpoint to create sessions.
 * This client is sovereign: it only calls YOUR endpoint (e.g. Vercel Serverless).
 */

export async function createStripeCheckout({ priceId, mode, passSouverain, tier, metadata } = {}) {
  if (!priceId) throw new Error("createStripeCheckout: priceId required");

  const endpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT || "/api/stripe/checkout";

  // If no backend is deployed, fail gracefully.
  if (!endpoint) return { url: null, error: "Missing checkout endpoint" };

  window.dispatchEvent(new CustomEvent("igor:stripe:tx", { detail: { state: "start" } }));

  try {
    const body = {
      priceId,
      mode,
      ...(passSouverain ? { passSouverain: true } : {}),
      ...(tier ? { tier } : {}),
      ...(metadata && typeof metadata === "object" && !Array.isArray(metadata) ? { metadata } : {}),
    };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch((e) => ({ ok: false, error: e }));

    if (!res?.ok) {
      return { url: null, error: "Checkout backend unavailable" };
    }

    const json = await res.json().catch(() => null);
    return { url: json?.url || null, error: json?.error || null };
  } finally {
    window.dispatchEvent(new CustomEvent("igor:stripe:tx", { detail: { state: "end" } }));
  }
}

