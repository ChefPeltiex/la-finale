export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-igor-atlas-token");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const secret = process.env.IGOR_ATLAS_BATCH_SECRET;
  if (secret) {
    const tok = req.headers["x-igor-atlas-token"];
    if (tok !== secret) return res.status(403).json({ error: "forbidden" });
  }
  // Serverless: no persistent file storage — conversion not available.
  return res.status(200).json({
    ok: true,
    processed: 0,
    totalTarget: 3871,
    offset: 0,
    limit: 0,
    fiches_vivantes_count: 0,
    note: "Atlas conversion requires persistent storage (not available in serverless mode).",
  });
}
