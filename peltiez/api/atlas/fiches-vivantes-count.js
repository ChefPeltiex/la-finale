const RADAR_SCAN_TARGET = 3871;

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  res.status(200).json({
    fiches_vivantes_count: 0,
    radar_scans_total: RADAR_SCAN_TARGET,
    time: new Date().toISOString(),
  });
}
