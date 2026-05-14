/**
 * Assemble une prévisualisation PDF à partir de PNG existants (pdfkit, sans navigateur).
 * Gabarit : docs/codex-pdf-blueprint.md — guide : docs/encyclopedie/README.md
 *
 * Sans images : message clair et sortie 0 (no-op).
 */
import PDFDocument from "pdfkit";
import { createWriteStream, existsSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const peltiezRoot = join(__dirname, "..");
const repoRoot = join(peltiezRoot, "..");

function argValue(name) {
  const i = process.argv.indexOf(name);
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  return null;
}

function parseCodexOrder(filename) {
  const base = basename(filename, extname(filename));
  const m = base.match(/(\d+)([A-Za-z])(?:$|[-_])/);
  if (m) {
    return { num: Number(m[1], 10), letter: m[2].toUpperCase(), base };
  }
  return { num: 9999, letter: "Z", base };
}

function sortPngPaths(paths) {
  return [...paths].sort((a, b) => {
    const oa = parseCodexOrder(a);
    const ob = parseCodexOrder(b);
    if (oa.num !== ob.num) return oa.num - ob.num;
    if (oa.letter !== ob.letter) return oa.letter.localeCompare(ob.letter);
    return basename(a).localeCompare(basename(b), "fr", { sensitivity: "base" });
  });
}

const inputDir = resolve(
  argValue("--input") ?? process.env.CODEX_ENCYCLOPEDIE_INPUT ?? join(repoRoot, "assets", "codex-encyclopedie"),
);

const defaultOut = join(peltiezRoot, "docs", "encyclopedie", "codex-assembled-preview.pdf");
const outputPath = resolve(
  argValue("--output") ?? process.env.CODEX_ENCYCLOPEDIE_OUTPUT ?? defaultOut,
);

if (!existsSync(inputDir) || !statSync(inputDir).isDirectory()) {
  console.warn(`[assemble-codex-pdf] Dossier d'entrée introuvable ou invalide : ${inputDir}`);
  console.warn("[assemble-codex-pdf] Aucun assemblage. Créez le dossier ou passez --input.");
  process.exit(0);
}

const pngFiles = readdirSync(inputDir)
  .filter((f) => f.toLowerCase().endsWith(".png"))
  .map((f) => join(inputDir, f));

if (pngFiles.length === 0) {
  console.warn(`[assemble-codex-pdf] Aucun fichier .png dans : ${inputDir}`);
  console.warn("[assemble-codex-pdf] No-op — ajoutez des visuels (voir assets/codex-encyclopedie/) ou ajustez --input.");
  process.exit(0);
}

const ordered = sortPngPaths(pngFiles);

const doc = new PDFDocument({
  autoFirstPage: false,
  size: "A4",
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  info: {
    Title: "Encyclopédie visuelle CirculAI — assemblage PNG (prévisualisation)",
    Author: "CirculAI",
    Subject: "Codex — assemblage automatique depuis PNG",
    Keywords: "CirculAI, Codex, encyclopédie",
  },
});

const stream = createWriteStream(outputPath);
doc.pipe(stream);

for (let i = 0; i < ordered.length; i++) {
  const file = ordered[i];
  doc.addPage({ size: "A4", margin: 0 });
  const { width: pageWidth, height: pageHeight } = doc.page;
  doc.save();
  doc.fillColor("#000000").rect(0, 0, pageWidth, pageHeight).fill();
  doc.image(file, 0, 0, {
    fit: [pageWidth, pageHeight],
    align: "center",
    valign: "center",
  });
  doc.restore();
  if (i === 0 || (i + 1) % 5 === 0 || i === ordered.length - 1) {
    console.log(`[assemble-codex-pdf] Page ${i + 1}/${ordered.length} ← ${basename(file)}`);
  }
}

doc.end();

await new Promise((res, rej) => {
  stream.on("finish", res);
  stream.on("error", rej);
});

console.log(`[assemble-codex-pdf] Écrit : ${outputPath}`);
console.log("[assemble-codex-pdf] Après validation humaine, copier vers public/encyclopedie.pdf si approprié.");
