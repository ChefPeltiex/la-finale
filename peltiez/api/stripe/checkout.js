import Stripe from "stripe";

function getOrigin(req) {
  const origin = req.headers?.origin;
  if (origin) return origin;
  const referer = req.headers?.referer;
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {}
  }
  return null;
}

function parseCsv(v) {
  return String(v || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", req.headers?.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });
  }

  const configuredSite = process.env.PUBLIC_SITE_URL || null;
  const origin = getOrigin(req) || configuredSite || "http://localhost:5173";

  // Origin allowlist: lock checkout to your site(s)
  const allowedOrigins = parseCsv(process.env.STRIPE_ALLOWED_ORIGINS || configuredSite || "");
  if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");

  const successUrl = `${origin}/pricing?success=1`;
  const cancelUrl = `${origin}/pricing?canceled=1`;

  let body = req.body;
  // Vercel may pass body as string in some runtimes
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const priceId = body?.priceId;
  const mode = body?.mode || "payment";
  if (!priceId) return res.status(400).json({ error: "Missing priceId" });
  if (mode !== "payment" && mode !== "subscription") {
    return res.status(400).json({ error: "Invalid mode" });
  }

  // Optional allowlist for priceIds
  const allowedPriceIds = parseCsv(process.env.STRIPE_ALLOWED_PRICE_IDS || "");
  if (allowedPriceIds.length > 0 && !allowedPriceIds.includes(priceId)) {
    return res.status(400).json({ error: "Unknown priceId" });
  }

  try {
    const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
    const idempotencyKey =
      (req.headers["x-idempotency-key"] && String(req.headers["x-idempotency-key"])) ||
      `peltiez_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      automatic_tax: { enabled: true },
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      metadata: {
        manifesto: "DE MOI, PAR MOI, POUR MOI. DOMINIC PELLETIER.",
        created_at: new Date().toISOString(),
        origin,
      },
    }, { idempotencyKey });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Stripe error" });
  }
}

