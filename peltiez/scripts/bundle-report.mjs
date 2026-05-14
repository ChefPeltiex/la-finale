import fs from "node:fs";

const file = process.argv[2] || "dist/dist/stats.html";
const html = fs.readFileSync(file, "utf8");

// rollup-plugin-visualizer emits: const data = {...};
const idx = html.lastIndexOf("const data = ");
if (idx < 0) {
  console.error("Unable to find visualizer data in", file);
  process.exit(1);
}
const start = idx + "const data = ".length;
const end = html.indexOf(";\n", start);
if (end < 0) {
  console.error("Unable to parse visualizer data terminator in", file);
  process.exit(1);
}

const raw = html.slice(start, end).trim();
const parsed = JSON.parse(raw);

// Visualizer v2 format: { version, tree, nodeParts, nodeMetas, ... }
const nodeParts = parsed?.nodeParts || {};
const nodeMetas = parsed?.nodeMetas || {};

/**
 * Aggregate sizes per module meta id across all chunk parts.
 * nodeMetas[*].moduleParts maps chunkFile -> partUid
 * nodeParts[partUid] has renderedLength/gzipLength/brotliLength
 */
const rows = [];
for (const metaUid of Object.keys(nodeMetas)) {
  const meta = nodeMetas[metaUid];
  const id = meta?.id || "";
  const moduleParts = meta?.moduleParts || {};

  let rendered = 0;
  let gzip = 0;
  let brotli = 0;
  const chunks = [];

  for (const [chunkFile, partUid] of Object.entries(moduleParts)) {
    const part = nodeParts[partUid];
    if (!part) continue;
    rendered += Number(part.renderedLength || 0);
    gzip += Number(part.gzipLength || 0);
    brotli += Number(part.brotliLength || 0);
    chunks.push(chunkFile);
  }

  if (rendered || gzip || brotli) {
    rows.push({
      id,
      rendered,
      gzip,
      brotli,
      chunks,
    });
  }
}

const sum = (k) => rows.reduce((acc, r) => acc + (r[k] || 0), 0);
const topBy = (k, n = 25) =>
  [...rows].sort((a, b) => (b[k] || 0) - (a[k] || 0)).slice(0, n).filter((r) => r[k] > 0);

const human = (n) => {
  const v = Number(n || 0);
  if (v < 1024) return `${v} B`;
  const kb = v / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

const report = {
  file,
  totals: {
    rendered: sum("rendered"),
    gzip: sum("gzip"),
    brotli: sum("brotli"),
  },
  topGzip: topBy("gzip", 30).map((r) => ({ ...r, h: human(r.gzip) })),
  topBrotli: topBy("brotli", 30).map((r) => ({ ...r, h: human(r.brotli) })),
  topRendered: topBy("rendered", 30).map((r) => ({ ...r, h: human(r.rendered) })),
};

console.log(JSON.stringify(report, null, 2));

