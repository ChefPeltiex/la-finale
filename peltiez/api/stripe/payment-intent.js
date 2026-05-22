import Stripe from "stripe";

function parseCsv(v) {
  return String(v || "").split(",").map((s) => s.trim()).filter(Boolean);
}

function getOrigin(req) {
  const origin = req.headers?.origin;
  if (origin) return origin;
  const referer = req.headers?.referer;
  if (referer) {
    try { return new URL(referer).origin; } catch {}
  }
  return null;
}

const PASS_TIER_SET = new Set(["netherealm", "etherealm", "outworld"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers?.origin || "*");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-idempotency-key");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: "payment_intent_unavailable" });

  const configuredSite = process.env.PUBLIC_SITE_URL || null;
  const origin = getOrigin(req) || configuredSite || "http://localhost:5173";

  const allowedOrigins = parseCsv(process.env.STRIPE_ALLOWED_ORIGINS || configuredSite || "");
  if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== "object") body = {};

  const { priceId, tier: bodyTier, mode = "payment", email: bodyEmail } = body;
  if (!priceId || typeof priceId !== "string" || !priceId.trim()) {
    return res.status(400).json({ error: "invalid_body", details: { priceId: "required" } });
  }
  if (!bodyTier || !PASS_TIER_SET.has(String(bodyTier))) {
    return res.status(400).json({ error: "Invalid or missing tier" });
  }
  if (mode !== "payment" && mode !== "subscription") {
    return res.status(400).json({ error: "Invalid mode" });
  }
  const allowedPriceIds = parseCsv(process.env.STRIPE_ALLOWED_PRICE_IDS || "");
  if (allowedPriceIds.length > 0 && !allowedPriceIds.includes(priceId)) {
    return res.status(400).json({ error: "Unknown priceId" });
  }

  const stripeMeta = {
    holding: "Les Secrets du St-Laurent",
    business_name: "Les Secrets du St-Laurent",
    tier: String(bodyTier),
    origin,
    created_at: new Date().toISOString(),
  };

  try {
    const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
    const idempotencyKey =
      (req.headers["x-idempotency-key"] && String(req.headers["x-idempotency-key"])) ||
      `igor_pi_${Date.now()}_${Math.random().toString(16).slice(2)}`;

    const price = await stripe.prices.retrieve(priceId);
    const isRecurring = Boolean(price.recurring);
    if (mode === "subscription" && !isRecurring) return res.status(400).json({ error: "Price is not recurring" });
    if (mode === "payment" && isRecurring) return res.status(400).json({ error: "Use mode subscription for recurring prices" });

    if (mode === "payment") {
      if (price.unit_amount == null) return res.status(400).json({ error: "Price has no fixed unit amount" });
      const pi = await stripe.paymentIntents.create(
        { amount: price.unit_amount, currency: price.currency || "cad", automatic_payment_methods: { enabled: true }, metadata: stripeMeta },
        { idempotencyKey },
      );
      if (!pi.client_secret) return res.status(500).json({ error: "missing_client_secret" });
      return res.status(200).json({ clientSecret: pi.client_secret, kind: "payment" });
    }

    const email = (bodyEmail && typeof bodyEmail === "string" && EMAIL_RE.test(bodyEmail.trim())) ? bodyEmail.trim() : undefined;
    const customer = await stripe.customers.create(
      { email, metadata: stripeMeta },
      { idempotencyKey: `${idempotencyKey}_cust` },
    );
    const subscription = await stripe.subscriptions.create(
      {
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        metadata: stripeMeta,
        expand: ["latest_invoice.payment_intent"],
      },
      { idempotencyKey: `${idempotencyKey}_sub` },
    );
    const invoice = subscription.latest_invoice;
    const piInner = invoice && typeof invoice === "object" && invoice.payment_intent ? invoice.payment_intent : null;
    const clientSecret = piInner && typeof piInner === "object" && piInner.client_secret ? piInner.client_secret : null;
    if (!clientSecret) return res.status(500).json({ error: "missing_client_secret" });
    return res.status(200).json({ clientSecret, kind: "subscription" });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "payment_intent_unavailable" });
  }
}
