import { shadowScan } from "@/radar/shadow/engine";
import { getShadowRssUrls } from "@/radar/shadow/settings";

/**
 * Fetch a fresh ZeldaTower scan (Golden Nuggets).
 * This is the single integration point so we can later swap polling for SSE/WebSocket.
 */
export async function fetchGoldenNuggetsScan() {
  const rssUrls = getShadowRssUrls();
  // Mithril-only scan (high signal, low noise)
  return shadowScan({ query: "", rssUrls, limit: 10 });
}

/**
 * Minimal "realtime" subscription via polling.
 * Returns an unsubscribe function.
 */
export function subscribeGoldenNuggets({ intervalMs = 15_000, onData, onError } = {}) {
  if (typeof onData !== "function") throw new Error("subscribeGoldenNuggets: onData is required");

  let disposed = false;
  let timer = null;

  const tick = async () => {
    try {
      const data = await fetchGoldenNuggetsScan();
      if (!disposed) onData(data);
    } catch (e) {
      if (!disposed && typeof onError === "function") onError(e);
    } finally {
      if (!disposed) timer = setTimeout(tick, intervalMs);
    }
  };

  // start immediately
  tick();

  return () => {
    disposed = true;
    if (timer) clearTimeout(timer);
  };
}

