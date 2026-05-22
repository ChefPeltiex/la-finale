export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  const { scanId } = req.query;
  if (!scanId) return res.status(400).json({ error: "missing_scan_id" });
  // Serverless: no persistent file storage — scan data not available.
  res.status(404).json({ error: "not_found" });
}
