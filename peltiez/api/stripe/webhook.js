import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey) return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });
  if (!webhookSecret) return res.status(500).json({ error: "Missing STRIPE_WEBHOOK_SECRET" });

  try {
    const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
    const raw = await readRawBody(req);
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);

    // Minimal, safe default: acknowledge events. Extend with your CRM/revenue pipeline.
    // You can log event.id/type in your own storage (Base44/DB/Log service).
     
    console.log("[stripe:webhook]", event.type, event.id);

    return res.status(200).json({ received: true });
  } catch (e) {
    return res.status(400).json({ error: e?.message || "Webhook error" });
  }
}

