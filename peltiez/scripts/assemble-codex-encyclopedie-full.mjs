/**
 * Assemble encyclopedie.pdf : texte Codex Magique + fiches companion + planches PNG.
 * Sortie par défaut : peltiez/public/encyclopedie.pdf
 */
import PDFDocument from "pdfkit";
import {
  copyFileSync,
  createWriteStream,
  existsSync,
  readFileSync,
  statSync,
} from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BLUEPRINT_IMAGE_ORDER,
  FORMULA_HINTS_BY_INDEX,
  PHI,
  imageMappingTable,
} from "./lib/codex-encyclopedie-data.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const peltiezRoot = join(__dirname, "..");
const repoRoot = join(peltiezRoot, "..");

const GOLD = "#d4af37";
const CREAM = "#e8d5a3";
const MUTED = "#a89b74";
const M = { top: 52, bottom: 52, left: 52, right: 52 };

function argValue(name) {
  const i = process.argv.indexOf(name);
  if (i !== -1 && process.argv[i + 1]) return process.argv[i + 1];
  return null;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

const inputDir = resolve(
  argValue("--input") ?? process.env.CODEX_ENCYCLOPEDIE_INPUT ?? join(repoRoot, "assets", "codex-encyclopedie"),
);

const defaultOut = join(peltiezRoot, "public", "encyclopedie.pdf");
const outputPath = resolve(argValue("--output") ?? process.env.CODEX_ENCYCLOPEDIE_OUTPUT ?? defaultOut);

const limitArg = argValue("--limit");
const imageLimit = limitArg ? Math.max(0, Number(limitArg, 10)) : null;
const skipImages = hasFlag("--skip-images");

/** @returns {Map<string, { title: string, hypothese: string, mots_cles: string }>} */
function parseCompanionMd(path) {
  const map = new Map();
  if (!existsSync(path)) return map;
  const text = readFileSync(path, "utf8");
  const autogen = text.match(/<!-- BEGIN_AUTOGEN -->([\s\S]*?)<!-- END_AUTOGEN -->/);
  const body = autogen ? autogen[1] : text;
  const sections = body.split(/^### \d+\. /m).slice(1);
  for (const section of sections) {
    const lines = section.trim().split("\n");
    const filename = lines[0]?.trim();
    if (!filename?.endsWith(".png")) continue;
    const pick = (key) => {
      const m = section.match(new RegExp(`\\*\\*${key}\\*\\*:\\s*(.+)`));
      return m ? m[1].trim() : "";
    };
    map.set(filename, {
      title: pick("title"),
      hypothese: pick("hypothese"),
      mots_cles: pick("mots_clés") || pick("mots_cles"),
    });
  }
  return map;
}

function fillBlackPage(doc) {
  const { width: W, height: H } = doc.page;
  doc.save();
  doc.rect(0, 0, W, H).fill("#000000");
  doc.restore();
}

function addCodexTextPage(doc, draw) {
  doc.addPage({ size: "A4", margins: M });
  fillBlackPage(doc);
  const W = doc.page.width - M.left - M.right;
  doc.x = M.left;
  doc.y = M.top;
  draw(W);
}

function addFullBleedImage(doc, filePath) {
  doc.addPage({ size: "A4", margin: 0 });
  const { width: pageWidth, height: pageHeight } = doc.page;
  doc.save();
  doc.fillColor("#000000").rect(0, 0, pageWidth, pageHeight).fill();
  doc.image(filePath, 0, 0, {
    fit: [pageWidth, pageHeight],
    align: "center",
    valign: "center",
  });
  doc.restore();
}

function writeFrontMatter(doc) {
  addCodexTextPage(doc, (W) => {
    doc.font("Helvetica-Bold").fontSize(22).fillColor(GOLD).text("EGOR69", { width: W, align: "center" });
    doc.moveDown(0.4);
    doc.fontSize(14).text("Codex Magique de l’Oméga Vert", { align: "center" });
    doc.moveDown(0.6);
    doc.font("Helvetica").fontSize(10).fillColor(CREAM).text(
      "Alliance des intelligences, économie circulaire et harmonie dorée",
      { align: "center", lineGap: 4 },
    );
    doc.moveDown(0.3);
    doc.fontSize(9).fillColor(MUTED).text(`φ = ${PHI}`, { align: "center" });
    doc.moveDown(1.2);
    doc.text("Dominic Peltier · CirculAI · Édition v1.0", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(8).text(
      "Les formules de ce document sont des modèles symboliques et heuristiques — pas des lois physiques ni des garanties financières.",
      { align: "center", lineGap: 3 },
    );
  });

  addCodexTextPage(doc, (W) => {
    doc.font("Helvetica-Bold").fontSize(14).fillColor(GOLD).text("Préface", { width: W });
    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(9.5).fillColor(CREAM);
    doc.text(
      "Ce Codex rassemble formules, protocoles d’orchestration IA et planches visuelles de l’encyclopédie Egor69. L’objectif est un manuel opérationnel et inspirant, aligné sur l’économie circulaire et la transparence — sans promesses chiffrées non sourcées.",
      { width: W, align: "justify", lineGap: 3 },
    );
    doc.moveDown(0.6);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(GOLD).text("Constante centrale", { width: W });
    doc.moveDown(0.25);
    doc.font("Helvetica").fontSize(9.5).fillColor(CREAM).text(
      `φ = ${PHI} sert de repère de proportion et de pondération dans les modèles ci-dessous. En design, elle harmonise titres, marges et hiérarchie visuelle (fond noir, accents or).`,
      { width: W, lineGap: 3 },
    );
  });

  addCodexTextPage(doc, (W) => {
    doc.font("Helvetica-Bold").fontSize(14).fillColor(GOLD).text("Sommaire", { width: W });
    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(9.5).fillColor(CREAM);
    const items = [
      "1. Formules magiques (symboliques)",
      "2. Formules chiffrées et seuils indicatifs",
      "3. Protocoles d’alliance IA",
      "4. Modèle financier (structure tableur)",
      "5. Annexes — 37 planches PNG avec fiches",
      "6. Mode d’emploi et annexes techniques",
    ];
    for (const item of items) {
      doc.text(`• ${item}`, { width: W, lineGap: 2 });
    }
    doc.moveDown(0.8);
    doc.fontSize(8).fillColor(MUTED).text(
      "Source texte : docs/codex-magique-egor69.md · Index visuels : docs/companion.md",
      { width: W },
    );
  });

  addCodexTextPage(doc, (W) => {
    doc.font("Helvetica-Bold").fontSize(13).fillColor(GOLD).text("Formules — résumé (1/2)", { width: W });
    doc.moveDown(0.4);
    doc.font("Courier").fontSize(8.5).fillColor(CREAM);
    const lines = [
      "Φ = (A × V) / P     — Cœur Pur (A,V,P ∈ [0,1], P > 0)",
      "Ω = Φ × (1 / E)     — Unité (E ∈ (0,1])",
      "R_n = S × φ^n       — Abondance circulaire",
      "Paix = Respiration × φ",
      "A_ia = (R × C × V)^(1/φ)  — Alliance IA",
      "Pont = (T × C × φ) / F    — Pont inter-IA",
      "CC = Σ IA_i × φ^i         — Cerveau collectif",
    ];
    doc.text(lines.join("\n"), { width: W, lineGap: 2 });
    doc.font("Helvetica").moveDown(0.5);
    doc.fontSize(8).fillColor(MUTED).text(
      "Seuils indicatifs : publier si Φ ≥ 1,2 ; financer si Φ ≥ 1,5 (à calibrer sur pilote).",
      { width: W },
    );
  });

  addCodexTextPage(doc, (W) => {
    doc.font("Helvetica-Bold").fontSize(13).fillColor(GOLD).text("Formules — résumé (2/2) · IA · Économie", {
      width: W,
    });
    doc.moveDown(0.4);
    doc.font("Courier").fontSize(8.5).fillColor(CREAM);
    doc.text(
      [
        "G = R × φ − D           — croissance (R ressources, D déchets)",
        "V_h = T × P × φ         — valeur humaine",
        "M = I × φ − Eg          — monnaie positive",
        "Ω_v = (B × I × N) × φ⁵  — Oméga Vert (symbolique)",
        "Ascension = (C × P × Cr) × φ⁸",
      ].join("\n"),
      { width: W, lineGap: 2 },
    );
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(GOLD).text("Protocoles IA (6 rôles)", { width: W });
    doc.moveDown(0.25);
    doc.fontSize(9).fillColor(CREAM).text(
      "Orchestrateur · Créatif · Vérificateur · Vision · Écosystémique · Filtre positif (Φ). Manifest par agent, fusion via formule d’Alliance, publication après filtre.",
      { width: W, lineGap: 2 },
    );
  });
}

const companionMap = parseCompanionMd(join(peltiezRoot, "docs", "companion.md"));

const filenames = BLUEPRINT_IMAGE_ORDER.filter((f) => {
  const p = join(inputDir, f);
  return existsSync(p);
});

if (filenames.length === 0) {
  console.warn(`[assemble-codex-encyclopedie-full] Aucun PNG dans : ${inputDir}`);
  process.exit(1);
}

const toProcess =
  imageLimit != null ? filenames.slice(0, Math.min(imageLimit, filenames.length)) : filenames;

if (existsSync(outputPath)) {
  const bak = `${outputPath}.bak`;
  try {
    copyFileSync(outputPath, bak);
    console.log(`[assemble-codex-encyclopedie-full] Sauvegarde : ${bak}`);
  } catch (e) {
    console.warn(`[assemble-codex-encyclopedie-full] Backup ignoré : ${e.message}`);
  }
}

const doc = new PDFDocument({
  autoFirstPage: false,
  size: "A4",
  info: {
    Title: "EGOR69 — Codex Magique de l’Oméga Vert",
    Author: "Dominic Peltier / CirculAI",
    Subject: "Encyclopédie visuelle CirculAI — texte et planches",
    Keywords: "Egor69, Codex, encyclopédie, économie circulaire, phi",
  },
});

const stream = createWriteStream(outputPath);
doc.pipe(stream);

writeFrontMatter(doc);

for (let i = 0; i < toProcess.length; i++) {
  const filename = toProcess[i];
  const imageNum = BLUEPRINT_IMAGE_ORDER.indexOf(filename) + 1;
  const fiche = companionMap.get(filename) ?? {
    title: basename(filename, ".png"),
    hypothese: "Planche encyclopédie — à affiner après inspection visuelle.",
    mots_cles: "codex, encyclopedie",
  };
  const formulaHint = FORMULA_HINTS_BY_INDEX[BLUEPRINT_IMAGE_ORDER.indexOf(filename)] ?? "";

  addCodexTextPage(doc, (W) => {
    doc.font("Helvetica-Bold").fontSize(11).fillColor(GOLD).text(`[IMAGE ${imageNum}] — ${fiche.title}`, {
      width: W,
    });
    doc.moveDown(0.2);
    doc.font("Helvetica").fontSize(8).fillColor(MUTED).text(filename, { width: W });
    doc.moveDown(0.4);
    doc.fontSize(9.5).fillColor(CREAM).text(`Hypothèse : ${fiche.hypothese}`, { width: W, lineGap: 2 });
    doc.moveDown(0.3);
    doc.text(`Mots-clés : ${fiche.mots_cles}`, { width: W });
    if (formulaHint) {
      doc.moveDown(0.4);
      doc.font("Helvetica-Oblique").fontSize(9).fillColor(GOLD).text(`Codex : ${formulaHint}`, { width: W });
    }
  });

  if (!skipImages) {
    const filePath = join(inputDir, filename);
    addFullBleedImage(doc, filePath);
  }

  if ((i + 1) % 5 === 0 || i === toProcess.length - 1) {
    console.log(`[assemble-codex-encyclopedie-full] Planche ${i + 1}/${toProcess.length} ← ${filename}`);
  }
}

doc.end();

await new Promise((res, rej) => {
  stream.on("finish", res);
  stream.on("error", rej);
});

const stat = statSync(outputPath);
console.log(`[assemble-codex-encyclopedie-full] Écrit : ${outputPath} (${(stat.size / 1024 / 1024).toFixed(2)} Mo)`);
console.log(`[assemble-codex-encyclopedie-full] Planches : ${toProcess.length} · Mapping IMAGE→PNG : ${imageMappingTable().length} entrées (voir docs/codex-magique-egor69.md)`);
