export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  const raw = req.query?.limit;
  const limit = raw != null ? Math.min(Math.max(1, Number(raw) || 24), 100) : 24;
  // Serverless: no persistent file storage — returns empty preview list.
  res.status(200).json({
    items: [],
    count: 0,
    time: new Date().toISOString(),
  });
}
