import { igor } from "@/api/igorClient";

const METRIC_ID = "igor:metrics:global";

export async function getRadarMetrics() {
  const rows = await igor.entities.Metric.list("-updated_at", 50);
  return rows.find(r => r.id === METRIC_ID) || null;
}

export async function ensureRadarMetrics() {
  const existing = await getRadarMetrics();
  if (existing) return existing;

  return igor.entities.Metric.create({
    id: METRIC_ID,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    hub_members: 1,
    regions: 1,
    cards: 0,
    archives: 0,
    radar_scans: 0,
    last_heartbeat: new Date().toISOString(),
  });
}

export async function tickRadar({ bump = true } = {}) {
  const m = await ensureRadarMetrics();

  // Pull current counts from local sovereign stores (fast, no network).
  const cards = await igor.entities.ContentCard.list("-created_at", 500);
  const archives = await igor.entities.Archive.list("-archived_at", 500);

  const patch = {
    updated_at: new Date().toISOString(),
    last_heartbeat: new Date().toISOString(),
    cards: cards.length,
    archives: archives.length,
    radar_scans: (m.radar_scans || 0) + (bump ? 1 : 0),
    // slow visible growth — proof-of-concept (replace later by real signals)
    hub_members: (m.hub_members || 1) + (bump ? 1 : 0),
    regions: Math.max(m.regions || 1, 1 + Math.floor(((m.hub_members || 1) + (bump ? 1 : 0)) / 25)),
  };

  return igor.entities.Metric.update(m.id, patch);
}

