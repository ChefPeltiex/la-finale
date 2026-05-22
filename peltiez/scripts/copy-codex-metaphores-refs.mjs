/**
 * Copie les captures Cursor → public/codex-metaphores/refs/ + manifest.json
 * Sources : .cursor/projects/.../assets et la finale/assets
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const repoRoot = join(root, "..");

const SOURCES = [
  join(
    repoRoot,
    "..",
    ".cursor",
    "projects",
    "c-Users-CHEFP-OneDrive-Desktop-la-finale",
    "assets"
  ),
  join(repoRoot, "assets"),
  join(repoRoot, "assets", "codex-metaphores-refs"),
];

const destDir = join(root, "public", "codex-metaphores", "refs");
mkdirSync(destDir, { recursive: true });

/** @param {string} name */
function categorize(name) {
  const n = name.toLowerCase();
  if (n.includes("153112") || n.includes("103032") || n.includes("163751") || n.includes("165321")) {
    return "canvas_codex";
  }
  if (n.includes("fibonacci") || n.includes("golden") || n.includes("spiral")) {
    return "nature_phi";
  }
  if (n.includes("211951") || n.includes("leibniz") || n.includes("binary")) {
    return "leibniz_binary";
  }
  if (/capture_d__cran_2026-05-19_21/.test(n) || n.includes("math") || n.includes("integral")) {
    return "math_inspiration";
  }
  if (n.includes("dowsing") || n.includes("revolt") || n.includes("697323484")) {
    return "signal_social";
  }
  if (n.startsWith("t_l_charger") || n.startsWith("images__")) {
    return "references_user";
  }
  if (/capture_d__cran_2026-05-19/.test(n)) {
    return "math_inspiration";
  }
  return "references_user";
}

/** Garde une entrée par clé logique (évite doublons même horodatage). */
const seen = new Map();

for (const src of SOURCES) {
  if (!existsSync(src)) continue;
  for (const f of readdirSync(src)) {
    if (!f.endsWith(".png")) continue;
    const keyMatch = f.match(/Capture_d__cran_(\d{4}-\d{2}-\d{2}_\d{6})/);
    const key = keyMatch ? keyMatch[1] : f.replace(/-[a-f0-9-]{36}\.png$/i, "").slice(-48);
    if (seen.has(key)) continue;
    const category = categorize(f);
    const safeId = `${category}-${seen.size + 1}`.replace(/[^a-z0-9_-]/gi, "-");
    const outName = `${safeId}.png`;
    copyFileSync(join(src, f), join(destDir, outName));
    seen.set(key, { id: safeId, file: outName, category, sourceName: f });
  }
}

const items = [...seen.values()].sort((a, b) => a.category.localeCompare(b.category));
const byCategory = {};
for (const item of items) {
  if (!byCategory[item.category]) byCategory[item.category] = [];
  byCategory[item.category].push(item);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  count: items.length,
  baseUrl: "/codex-metaphores/refs/",
  categories: {
    canvas_codex: { label: "Codex Canvas (jumeaux, œil, pont)", items: byCategory.canvas_codex ?? [] },
    math_inspiration: { label: "Grilles maths — solidité & clarté", items: byCategory.math_inspiration ?? [] },
    nature_phi: { label: "Fibonacci & équilibre φ", items: byCategory.nature_phi ?? [] },
    leibniz_binary: { label: "0 et 1 — valeur qui renaît", items: byCategory.leibniz_binary ?? [] },
    signal_social: { label: "Signaux — perle, réponse vite", items: byCategory.signal_social ?? [] },
    references_user: { label: "Références visuelles", items: byCategory.references_user ?? [] },
  },
};

writeFileSync(join(destDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`OK ${items.length} refs → public/codex-metaphores/refs/manifest.json`);
