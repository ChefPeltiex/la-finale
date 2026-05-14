const KEY = "igor:shadow:rssUrls";

const DEFAULT_PUBLIC_RSS = Object.freeze([
  // Intergalactique / espace / "grande évasion"
  "https://www.nasa.gov/rss/dyn/breaking_news.rss",
  "https://www.space.com/feeds.xml",
  "https://www.swpc.noaa.gov/feeds/alerts.xml",
  "https://www.swpc.noaa.gov/feeds/news.xml",

  // "Jour de l'apocalypse" (alertes réelles)
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.atom",
  "https://www.nhc.noaa.gov/index-at.xml", // cyclones (Atlantique)

  // Indépendance financière (savoirs + signaux)
  "https://www.coindesk.com/arc/outboundfeeds/rss/",
  "https://feeds-api.dotdashmeredith.com/v1/rss/google/f8466ec3-5044-46bc-94b7-2df65f770eff",

  // Marchés (public, brut)
  // Note: some market RSS endpoints block CORS in browsers; keep optional
  "https://www.investing.com/rss/news_25.rss",

  // Innovations technologiques (public)
  "https://news.ycombinator.com/rss",
  "https://techcrunch.com/feed/",
  "https://arxiv.org/rss/cs.AI",
]);

export function getShadowRssUrls() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    if (Array.isArray(arr) && arr.length > 0) return arr;
    return DEFAULT_PUBLIC_RSS;
  } catch {
    return DEFAULT_PUBLIC_RSS;
  }
}

export function setShadowRssUrls(urls) {
  try {
    localStorage.setItem(KEY, JSON.stringify(urls || []));
  } catch {}
}

