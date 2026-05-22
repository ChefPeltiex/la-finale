import crypto from "crypto";

function emptyToUndefined(v) {
  if (v == null) return undefined;
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== "object") body = {};

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "invalid_body", details: { email: "valid email required" } });
  }

  const record = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    email,
    name: emptyToUndefined(body.name),
    source: emptyToUndefined(body.source),
    message: emptyToUndefined(body.message),
    intent: emptyToUndefined(body.intent),
    page_path: emptyToUndefined(body.page_path),
    utm_source: emptyToUndefined(body.utm_source),
    utm_medium: emptyToUndefined(body.utm_medium),
    utm_campaign: emptyToUndefined(body.utm_campaign),
  };

  // Serverless: no persistent file storage. Log to console (Vercel logs).
  console.log("[crm:lead]", { id: record.id, source: record.source, page_path: record.page_path });

  return res.status(200).json({
    ok: true,
    id: record.id,
    merci: "L'équipe IGOR vous recontactera. Votre demande a été enregistrée.",
  });
}
