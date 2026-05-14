import { collectFromRss } from "./collectors/rssCollector";

const DEFAULT_RSS = [];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return String(h >>> 0);
}

function classify(it) {
  const url = (it.link || "").toLowerCase();
  const title = (it.title || "").toLowerCase();
  if (url.includes("swpc.noaa.gov") || title.includes("solar") || title.includes("geomagnetic")) return "alerte";
  if (url.includes("usgs.gov") || title.includes("earthquake")) return "alerte";
  if (url.includes("coindesk.com") || title.includes("bitcoin") || title.includes("crypto")) return "financement";
  if (url.includes("investing.com") || title.includes("market") || title.includes("stocks")) return "financement";
  if (url.includes("arxiv.org") || url.includes("techcrunch.com") || url.includes("ycombinator.com")) return "tech";
  if (url.includes("nasa.gov") || url.includes("space.com")) return "tendance";
  return "opportunite";
}

function scoreItem(it, query) {
  const q = (query || "").toLowerCase().trim();
  const title = (it.title || "").toLowerCase();
  const desc = (it.description || "").toLowerCase();
  const hit = q ? (title.includes(q) ? 2 : 0) + (desc.includes(q) ? 1 : 0) : 1;
  const freshness = it.pubDate ? 1 : 0.7;
  return Math.min(10, Math.round((hit * 4 + freshness * 3) * 10) / 10);
}

function toNugget(it, query) {
  const value = scoreItem(it, query);
  const urgency = value >= 9 ? "critique" : value >= 8 ? "haute" : value >= 6 ? "moyenne" : "faible";
  const type = classify(it);
  const src = it.link || "";
  const proofId = src ? hash(src) : hash(`${it.title || ""}|${it.pubDate || ""}`);
  return {
    emoji: value >= 8 ? "🟡" : "✨",
    type,
    urgency,
    value_score: Math.max(1, Math.min(10, Math.round(value))),
    title: it.title || "Nugget",
    insight: (it.description || "").replace(/<[^>]+>/g, "").slice(0, 220),
    action: it.link ? "Ouvrir la source et transformer en quête" : "Transformer en quête",
    source_url: it.link || null,
    proof: {
      collector: it.source || "rss",
      id: proofId,
      confidence: it.pubDate ? 0.75 : 0.6,
      fetched_at: new Date().toISOString(),
    },
  };
}

export async function shadowScan({
  query = "",
  rssUrls = DEFAULT_RSS,
  limit = 12,
} = {}) {
  const sources = (rssUrls || []).filter(Boolean);
  const items = [];
  for (const url of sources) {
    try {
      const out = await collectFromRss({ url });
      items.push(...out);
    } catch {
      // silent by design (shadow)
    }
  }

  // Mithril filter: remove noise, keep only high-signal
  const seen = new Set();
  const nuggets = items
    .map((it) => toNugget(it, query))
    .filter((n) => (n.value_score || 0) >= 8 && (n.urgency === "haute" || n.urgency === "critique"))
    .filter((n) => {
      const k = (n.source_url || n.title || "").toLowerCase().slice(0, 160);
      if (!k) return true;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => (b.value_score || 0) - (a.value_score || 0))
    .slice(0, Math.max(6, limit));

  const top = nuggets[0]?.title || "Aucun Mithril détecté";

  return {
    top_opportunity: top,
    scan_summary:
      sources.length === 0
        ? "Shadow Scan: aucune source RSS configurée (mode souverain). Ajoute des flux pour activer le temps-réel."
        : `Shadow Scan (Mithril): ${sources.length} flux · ${items.length} items · ${nuggets.length} mithril`,
    nuggets,
  };
}

export function getShadowCacheKey({ query = "", rssUrls = [] } = {}) {
  return `shadow:${hash(`${query}|${(rssUrls || []).join("|")}`)}`;
}

