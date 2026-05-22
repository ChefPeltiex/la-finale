export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  // Serverless: no persistent file storage. Returns live zero-state.
  res.status(200).json({
    source: "stripe",
    stripeSubscriptionsActive: 0,
    ledgerUpdatedAt: null,
  });
}
