function parseRss(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  const items = Array.from(doc.querySelectorAll("item")).slice(0, 25);
  return items.map((it) => ({
    title: it.querySelector("title")?.textContent?.trim() || "",
    link: it.querySelector("link")?.textContent?.trim() || "",
    description: it.querySelector("description")?.textContent?.trim() || "",
    pubDate: it.querySelector("pubDate")?.textContent?.trim() || "",
    source: "rss",
  }));
}

export async function collectFromRss({ url, timeoutMs = 5000 } = {}) {
  if (!url) throw new Error("collectFromRss: url required");
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    const text = await res.text();
    return parseRss(text);
  } finally {
    clearTimeout(t);
  }
}

