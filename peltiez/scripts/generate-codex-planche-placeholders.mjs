/**
 * Génère les 37 PNG Codex (fond noir, or, motif unique par code) si absents.
 * Sortie : ../assets/codex-encyclopedie/ (ou --output)
 */
import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BLUEPRINT_IMAGE_ORDER } from "./lib/codex-encyclopedie-data.mjs";
import { loadPlanches, readMd } from "./lib/encyclopedie-pdf-layout.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const peltiezRoot = join(__dirname, "..");
const repoRoot = join(peltiezRoot, "..");

function argValue(name) {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
}

const outDir = resolve(argValue("--output") ?? join(repoRoot, "assets", "codex-encyclopedie"));
const force = process.argv.includes("--force");
const W = 1240;
const H = 1754;

/** @param {string} code e.g. 1A */
function svgPlanche(code, title, legend) {
  const n = code.replace(/\D/g, "") || "0";
  const rot = (n.charCodeAt(0) % 12) * 30;
  const t = title.slice(0, 80).replace(/[<>&]/g, "");
  const leg = (legend || "").slice(0, 120).replace(/[<>&]/g, "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a"/>
      <stop offset="50%" style="stop-color:#111810"/>
      <stop offset="100%" style="stop-color:#000000"/>
    </linearGradient>
    <radialGradient id="halo" cx="50%" cy="35%" r="55%">
      <stop offset="0%" style="stop-color:#d4af37;stop-opacity:0.35"/>
      <stop offset="100%" style="stop-color:#d4af37;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#halo)"/>
  <g transform="translate(${W / 2},${H * 0.38}) rotate(${rot})" opacity="0.55">
    <circle r="180" fill="none" stroke="#d4af37" stroke-width="1.2"/>
    <circle r="120" fill="none" stroke="#d4af37" stroke-width="0.6" opacity="0.7"/>
    <circle r="60" fill="none" stroke="#f5f0e6" stroke-width="0.4" opacity="0.5"/>
  </g>
  <rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none" stroke="#d4af37" stroke-width="2" opacity="0.9"/>
  <rect x="62" y="62" width="${W - 124}" height="${H - 124}" fill="none" stroke="#d4af37" stroke-width="0.5" opacity="0.45"/>
  <text x="${W / 2}" y="120" text-anchor="middle" fill="#d4af37" font-family="Georgia, serif" font-size="42" font-weight="bold">CirculAI · Egor69</text>
  <text x="${W / 2}" y="168" text-anchor="middle" fill="#a89b74" font-family="Helvetica, Arial, sans-serif" font-size="22" letter-spacing="4">PLANCHE ${code}</text>
  <text x="${W / 2}" y="${H - 200}" text-anchor="middle" fill="#f5f0e6" font-family="Georgia, serif" font-size="28">${t}</text>
  <text x="${W / 2}" y="${H - 140}" text-anchor="middle" fill="#a89b74" font-family="Helvetica, Arial, sans-serif" font-size="18" font-style="italic">${leg}</text>
  <text x="${W / 2}" y="${H - 72}" text-anchor="middle" fill="#d4af37" font-family="Helvetica" font-size="16">φ = 1,618 · Encyclopédie Totale</text>
</svg>`;
}

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const planches = loadPlanches(peltiezRoot);
const byFile = new Map(planches.map((p) => [p.file, p]));

let created = 0;
let skipped = 0;

for (const file of BLUEPRINT_IMAGE_ORDER) {
  const dest = join(outDir, file);
  if (existsSync(dest) && !force) {
    skipped++;
    continue;
  }
  const meta = byFile.get(file) ?? { title: file, legend: "" };
  const code = file.replace("codex-encyclopedie-", "").replace(".png", "").toUpperCase();
  const svg = svgPlanche(code, meta.title ?? code, meta.legend ?? "");
  await sharp(Buffer.from(svg)).png().toFile(dest);
  created++;
  if (created % 10 === 0) console.log(`[planches] ${created} générées…`);
}

console.log(`[planches] Terminé → ${outDir} · créées: ${created} · ignorées: ${skipped}`);
