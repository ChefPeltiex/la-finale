/**
 * Assemble une prévisualisation PDF à partir de PNG existants (pdfkit, sans navigateur).
 * Gabarit : docs/codex-pdf-blueprint.md
 * Textes (--with-text) : docs/encyclopedie/planches-texte.json
 *
 * Sans images : message clair et sortie 0 (no-op).
 * --with-text : page A4 texte (or/crème sur noir) avant chaque PNG.
 */
import PDFDocument from "pdfkit";
import { createWriteStream, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BLUEPRINT_IMAGE_ORDER } from "./lib/codex-encyclopedie-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const peltiezRoot = join(__dirname, "..");
const repoRoot = join(peltiezRoot, "..");

const GOLD = "#D4AF37";
const CREAM = "#F5F0E6";
const BLACK = "#000000";
const MARGIN_TOP = 28.35;
const MARGIN_BOTTOM = 28.35;
const MARGIN_OUTER = 28.35;
const MARGIN_INNER = 34.02;

function argValue(name) {
  const i = process.argv.indexOf(name);
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  return null;
}

function hasFlag(name) {
  return process.argv.includes(name);
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

function orderPngPaths(paths) {
  const byName = new Map(paths.map((p) => [basename(p), p]));
  const blueprint = BLUEPRINT_IMAGE_ORDER.map((f) => byName.get(f)).filter(Boolean);
  if (blueprint.length === paths.length) return blueprint;
  return sortPngPaths(paths);
}

function loadPlancheTexts() {
  const jsonPath = join(peltiezRoot, "docs", "encyclopedie", "planches-texte.json");
  if (!existsSync(jsonPath)) {
    console.warn(`[assemble-codex-pdf] planches-texte.json introuvable : ${jsonPath}`);
    return new Map();
  }
  const raw = JSON.parse(readFileSync(jsonPath, "utf8"));
  const list = Array.isArray(raw) ? raw : raw.planches ?? [];
  const map = new Map();
  for (const entry of list) {
    if (entry?.file) map.set(entry.file, entry);
  }
  return map;
}

function addTextPage(doc, entry, pageIndex, totalPlanches) {
  doc.addPage({ size: "A4", margins: { top: 0, bottom: 0, left: 0, right: 0 } });
  const { width: pageWidth, height: pageHeight } = doc.page;

  doc.save();
  doc.fillColor(BLACK).rect(0, 0, pageWidth, pageHeight).fill();
  doc.restore();

  const left = MARGIN_INNER;
  const right = pageWidth - MARGIN_OUTER;
  const textWidth = right - left;
  let y = MARGIN_TOP + 8;

  const code = entry.file?.replace(/^codex-encyclopedie-/, "").replace(/\.png$/i, "") ?? "";
  if (code) {
    doc.fillColor(GOLD).font("Helvetica").fontSize(9).text(code.toUpperCase(), left, y, { width: textWidth });
    y += 14;
  }

  doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(16).text(entry.title ?? "Planche Codex", left, y, {
    width: textWidth,
    lineGap: 2,
  });
  y = doc.y + 10;

  doc.fillColor(CREAM).font("Helvetica").fontSize(10.5).text(entry.body ?? "", left, y, {
    width: textWidth,
    lineGap: 4,
    align: "left",
  });

  if (entry.legend) {
    const legendY = Math.min(doc.y + 12, pageHeight - MARGIN_BOTTOM - 36);
    doc.fillColor(GOLD).font("Helvetica-Oblique").fontSize(9).text(entry.legend, left, legendY, {
      width: textWidth,
      lineGap: 2,
    });
  }

  doc.fillColor("#8a7f5a")
    .font("Helvetica")
    .fontSize(7.5)
    .text(`EGOR69 — Codex Magique · texte ${pageIndex}/${totalPlanches}`, left, pageHeight - MARGIN_BOTTOM - 10, {
      width: textWidth,
      align: "right",
    });
}

function addImagePage(doc, file) {
  doc.addPage({ size: "A4", margin: 0 });
  const { width: pageWidth, height: pageHeight } = doc.page;
  doc.save();
  doc.fillColor(BLACK).rect(0, 0, pageWidth, pageHeight).fill();
  doc.image(file, 0, 0, {
    fit: [pageWidth, pageHeight],
    align: "center",
    valign: "center",
  });
  doc.restore();
}

const withText = hasFlag("--with-text");
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

const ordered = orderPngPaths(pngFiles);
const plancheTexts = withText ? loadPlancheTexts() : new Map();

if (withText) {
  try {
    JSON.parse(readFileSync(join(peltiezRoot, "docs", "encyclopedie", "planches-texte.json"), "utf8"));
    console.log("[assemble-codex-pdf] planches-texte.json : OK");
  } catch (e) {
    console.warn("[assemble-codex-pdf] planches-texte.json invalide :", e.message);
  }
}

const pdfInfo = withText
  ? {
      Title: "EGOR69 — Codex Magique de l'Oméga Vert",
      Author: "Dominic Peltier / Igor 69",
      Subject: "Encyclopédie visuelle CirculAI — édition Codex Magique",
      Keywords: "EGOR69, CirculAI, Codex, Oméga Vert, économie circulaire",
    }
  : {
      Title: "Encyclopédie visuelle CirculAI — assemblage PNG (prévisualisation)",
      Author: "CirculAI",
      Subject: "Codex — assemblage automatique depuis PNG",
      Keywords: "CirculAI, Codex, encyclopédie",
    };

const doc = new PDFDocument({
  autoFirstPage: false,
  size: "A4",
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  info: pdfInfo,
});

const stream = createWriteStream(outputPath);
doc.pipe(stream);

for (let i = 0; i < ordered.length; i++) {
  const file = ordered[i];
  const fname = basename(file);

  if (withText) {
    const entry = plancheTexts.get(fname) ?? {
      file: fname,
      title: fname.replace(/^codex-encyclopedie-/, "").replace(/\.png$/i, "").replace(/-/g, " "),
      body: "Texte éditorial en attente — compléter dans docs/encyclopedie/planches-texte.json.",
      legend: "CirculAI · Codex Magique",
    };
    addTextPage(doc, entry, i + 1, ordered.length);
    if (i === 0 || (i + 1) % 5 === 0 || i === ordered.length - 1) {
      console.log(`[assemble-codex-pdf] Texte ${i + 1}/${ordered.length} ← ${fname}`);
    }
  }

  addImagePage(doc, file);
  if (!withText && (i === 0 || (i + 1) % 5 === 0 || i === ordered.length - 1)) {
    console.log(`[assemble-codex-pdf] Image ${i + 1}/${ordered.length} ← ${fname}`);
  }
}

doc.end();

await new Promise((res, rej) => {
  stream.on("finish", res);
  stream.on("error", rej);
});

const pageCount = withText ? ordered.length * 2 : ordered.length;
console.log(`[assemble-codex-pdf] Écrit : ${outputPath} (${pageCount} pages${withText ? ", --with-text" : ""})`);
if (!withText) {
  console.log("[assemble-codex-pdf] Ajoutez --with-text pour une page explicative avant chaque PNG.");
}
