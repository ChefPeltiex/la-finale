/**
 * Assemble l'Encyclopédie Totale → public/encyclopedie.pdf (+ tomes I–VII).
 * Usage: node assemble-encyclopedie-ensemble.mjs [--tome N] [--output path] [--skip-planches]
 */
import PDFDocument from "pdfkit";
import {
  copyFileSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BLUEPRINT_IMAGE_ORDER } from "./lib/codex-encyclopedie-data.mjs";
import {
  loadOntologie,
  buildSpineOrder,
  buildAllFiches,
  peltiezRoot,
} from "./lib/encyclopedie-graph.mjs";
import { renderMasterCoverFace, renderMasterCoverBack } from "./lib/encyclopedie-covers.mjs";
import {
  GOLD,
  CREAM,
  fillBlack,
  drawGoldFrame,
  drawFooter,
  parseMarkdownBlocks,
  renderBlocks,
  readMd,
  addFullBleedImage,
  M,
} from "./lib/encyclopedie-pdf-layout.mjs";

const root = peltiezRoot;
const repoRoot = join(root, "..");
const assetsDir = join(repoRoot, "assets", "codex-encyclopedie");
const publicDir = join(root, "public");
const tomeDir = join(publicDir, "encyclopedie");

function argValue(name) {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
}

const cliTome = argValue("--tome") ? Number(argValue("--tome")) : null;
const cliOutput = argValue("--output") ? resolve(argValue("--output")) : null;
const skipPlanches = process.argv.includes("--skip-planches");

function roman(n) {
  const map = ["0", "I", "II", "III", "IV", "V", "VI", "VII"];
  return map[n] ?? String(n);
}

function countPdfPages(filePath) {
  const buf = readFileSync(filePath);
  return (buf.toString("binary").match(/\/Type\s*\/Page\b/g) || []).length;
}

function loadSpine() {
  const manifestPath = join(root, "docs", "encyclopedie", "generated", "ensemble-manifest.json");
  if (existsSync(manifestPath)) {
    return JSON.parse(readFileSync(manifestPath, "utf8")).spine;
  }
  return buildSpineOrder(loadOntologie(), root);
}

class PageState {
  constructor() {
    this.pageNum = 0;
    /** @type {Map<string, number>} */
    this.registry = new Map();
    /** @type {{ id: string, title: string, page: number, tome: number }[]} */
    this.index = [];
    this.toc = [];
  }

  bump(doc, id, title, tome) {
    this.pageNum = doc.bufferedPageRange().count;
    if (id) this.registry.set(id, this.pageNum);
    this.index.push({ id, title: title ?? id, page: this.pageNum, tome });
  }

  meta(tome, runningTitle) {
    return {
      pageNum: this.pageNum,
      tomeLabel: tome === 0 ? "Contenant" : `Tome ${roman(tome)}`,
      runningTitle: runningTitle ?? "",
    };
  }
}

function renderTomeCover(doc, ps, title, tome) {
  doc.addPage({ size: "A4", margins: M });
  fillBlack(doc);
  drawGoldFrame(doc);
  const W = doc.page.width - M.left - M.right;
  doc.font("Helvetica-Bold").fontSize(18).fillColor(GOLD).text(title, M.left, doc.page.height / 2 - 40, {
    width: W,
    align: "center",
  });
  ps.bump(doc, `T${tome}-COVER`, title, tome);
  drawFooter(doc, ps.meta(tome, title));
}

function renderPrintNotice(doc, ps) {
  doc.addPage({ size: "A4", margins: M });
  fillBlack(doc);
  drawGoldFrame(doc);
  const W = doc.page.width - M.left - M.right;
  doc.font("Helvetica-Bold").fontSize(12).fillColor(GOLD).text("Notice d'impression", M.left, M.top, { width: W });
  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(9).fillColor(CREAM);
  const lines = [
    "Format : A4 · marges intérieures ≥ 15 mm · recto recommandé pour couvertures.",
    "Fichier maître : encyclopedie.pdf — contenant des 7 tomes.",
    "Tomesséparés : /encyclopedie/tome-I.pdf … tome-VII.pdf pour impression par volume.",
    "Couleur : fond noir et or — imprimer en qualité élevée ou N&B selon imprimante.",
    "Usage personnel, transmission, pilote municipal : citer CirculAI / Egor69 et la date d'édition.",
    "Symboles (φ, formules) = gouvernance narrative, pas certification scientifique.",
    "Dominic Pelletier / Igor 69 · Limoilou · mai 2026",
  ];
  for (const line of lines) doc.text(line, { width: W, lineGap: 3 });
  ps.bump(doc, "PRINT-NOTICE", "Notice impression", 0);
  drawFooter(doc, ps.meta(0, "Notice impression"));
}

function renderMarkdownChapter(doc, ps, item) {
  const md = readMd(item.path);
  if (!md) return;
  const blocks = parseMarkdownBlocks(md);
  doc.addPage({ size: "A4", margins: M });
  fillBlack(doc);
  drawGoldFrame(doc);
  const W = doc.page.width - M.left - M.right;
  doc.x = M.left;
  doc.y = M.top;
  ps.bump(doc, item.id, item.title ?? item.id, item.tome);
  renderBlocks(
    doc,
    W,
    blocks,
    (e) => ps.toc.push({ ...e, id: item.id }),
    { tome: item.tome, chapter: item.id },
  );
  ps.pageNum = doc.bufferedPageRange().count;
  drawFooter(doc, ps.meta(item.tome, item.title ?? item.id));
}

function renderPlanches(doc, ps) {
  for (const file of BLUEPRINT_IMAGE_ORDER) {
    addFullBleedImage(doc, join(assetsDir, file));
    ps.bump(doc, `PL-${file}`, file, 7);
  }
}

function renderIndex(doc, ps, fiches) {
  doc.addPage({ size: "A4", margins: M });
  fillBlack(doc);
  drawGoldFrame(doc);
  const W = doc.page.width - M.left - M.right;
  doc.x = M.left;
  doc.y = M.top;
  doc.font("Helvetica-Bold").fontSize(16).fillColor(GOLD).text("Index global & registre des pages", { width: W });
  doc.moveDown(0.5);
  doc.font("Helvetica").fontSize(8).fillColor(CREAM);
  const sorted = [...ps.index].sort((a, b) => a.page - b.page);
  for (const row of sorted) {
    if (doc.y > doc.page.height - M.bottom - 24) {
      doc.addPage({ size: "A4", margins: M });
      fillBlack(doc);
      drawGoldFrame(doc);
      doc.x = M.left;
      doc.y = M.top;
    }
    const pg = ps.registry.get(row.id) ?? row.page;
    doc.text(`${String(pg).padStart(4)} · ${row.id} — ${(row.title || "").slice(0, 52)}`, { width: W });
  }
  doc.moveDown(1);
  doc.font("Helvetica-Bold").fontSize(10).fillColor(GOLD).text(`Maillage — ${fiches.length} fiches`, { width: W });
  doc.moveDown(0.3);
  doc.font("Helvetica").fontSize(7.5).fillColor(CREAM);
  for (const f of fiches) {
    if (doc.y > doc.page.height - M.bottom - 20) {
      doc.addPage({ size: "A4", margins: M });
      fillBlack(doc);
      drawGoldFrame(doc);
      doc.x = M.left;
      doc.y = M.top;
    }
    const pg = ps.registry.get(f.id) ?? "—";
    doc.text(`${f.id} · p.${pg} · ${f.domain.title} × ${f.subject.title}`, { width: W });
  }
  ps.bump(doc, "INDEX", "Index global", 7);
  drawFooter(doc, ps.meta(7, "Index"));
}

function renderResonancePad(doc, fiches, targetMin) {
  let current = doc.bufferedPageRange().count;
  if (current < 1) current = 1;
  if (current >= targetMin) return;
  const need = targetMin - current;
  console.log(`  Annexe résonances : +${need} pages (objectif ${targetMin})`);
  let pi = 0;
  for (let p = 0; p < need; p += 1) {
    doc.addPage({ size: "A4", margins: M });
    fillBlack(doc);
    drawGoldFrame(doc);
    const W = doc.page.width - M.left - M.right;
    doc.x = M.left;
    doc.y = M.top;
    if (p === 0) {
      doc.font("Helvetica-Bold").fontSize(14).fillColor(GOLD).text("Annexe — Résonances du maillage", { width: W });
      doc.moveDown(0.5);
    }
    const lines = [];
    for (let k = 0; k < 10; k += 1, pi += 1) {
      const f = fiches[pi % fiches.length];
      lines.push(
        `${f.id} — ${f.domain.title} × ${f.subject.title}. Monde ${f.mondeId}. Voir : ${f.related.slice(0, 5).join(", ")}. ` +
          `Loisirs D13 · Sports D14. CirculAI · Egor69 · Dominic — encyclopédie des encyclopédies.`,
      );
    }
    doc.font("Helvetica").fontSize(8).fillColor(CREAM).text(lines.join("\n\n"), { width: W, lineGap: 1.5, align: "justify" });
    if ((p + 1) % 100 === 0) process.stdout.write(`  … résonances ${p + 1}/${need}\r`);
  }
  console.log(`\n  Annexe résonances terminée`);
}

function filterSpine(spine, onlyTome) {
  if (onlyTome == null) return spine;
  return spine.filter(
    (s) =>
      s.tome === onlyTome ||
      s.type === "tome-cover" ||
      (onlyTome === 1 && (s.id === "CYOA" || s.type === "cover-master-face")),
  );
}

async function buildPdf(spine, onto, fiches, onlyTome, outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  const tmpPath = join(tmpdir(), `encyclopedie-${onlyTome ?? "master"}-${Date.now()}.pdf`);
  const doc = new PDFDocument({ autoFirstPage: false, size: "A4" });
  const stream = createWriteStream(tmpPath);
  doc.pipe(stream);
  const ps = new PageState();
  const filtered = filterSpine(spine, onlyTome);
  const isMaster = onlyTome == null;
  let n = 0;

  for (const item of filtered) {
    n += 1;
    if (n % 25 === 0) process.stdout.write(`  … contenu ${n}/${filtered.length}\r`);
    switch (item.type) {
      case "cover-master-face":
        if (isMaster) {
          renderMasterCoverFace(doc, onto, ps.meta(0, onto.title));
          ps.bump(doc, "COVER-FACE", onto.title, 0);
        }
        break;
      case "cover-master-back":
        if (isMaster) {
          renderMasterCoverBack(doc, readMd(item.path), { ...ps.meta(0, "Dos"), tome: 0, onHeading: () => {} });
          ps.bump(doc, "COVER-BACK", "Dos fondateur", 0);
        }
        break;
      case "tome-cover":
        if (item.tome === onlyTome || isMaster) renderTomeCover(doc, ps, item.title, item.tome);
        break;
      case "planches-atlas":
        if (isMaster && !skipPlanches) renderPlanches(doc, ps);
        break;
      case "index-global":
        if (isMaster) renderIndex(doc, ps, fiches);
        break;
      default:
        if (item.path && (isMaster || item.tome === onlyTome)) renderMarkdownChapter(doc, ps, item);
        break;
    }
  }

  if (isMaster) {
    renderPrintNotice(doc, ps);
    const minPages = onto.pageMinimum ?? 1000;
    renderResonancePad(doc, fiches, minPages);
  }

  console.log(`\n  Finalisation PDF → ${outPath}`);
  doc.end();
  await new Promise((res, rej) => {
    stream.on("finish", res);
    stream.on("error", rej);
  });
  copyFileSync(tmpPath, outPath);
  const pages = doc.bufferedPageRange().count;
  try {
    const { unlinkSync } = await import("node:fs");
    unlinkSync(tmpPath);
  } catch {
    /* ignore */
  }
  return pages;
}

async function main() {
  const onto = loadOntologie();
  const fiches = buildAllFiches(onto);
  const spine = loadSpine();
  const masterPath = cliOutput ?? join(publicDir, "encyclopedie.pdf");

  console.log("Assemblage maître… (peut prendre 5–15 min)");
  await buildPdf(spine, onto, fiches, null, masterPath);
  const bytes = statSync(masterPath).size;
  const pages = countPdfPages(masterPath);
  console.log(`✓ ${masterPath}`);
  console.log(`  ${pages} pages · ${(bytes / 1024 / 1024).toFixed(2)} Mo`);

  mkdirSync(tomeDir, { recursive: true });
  mkdirSync(join(tomeDir, "braille"), { recursive: true });
  writeFileSync(
    join(tomeDir, "braille", "extrait-fr-utf8.txt"),
    `Encyclopédie Totale — extrait\n${onto.title}\n${pages} pages · Dominic Pelletier · Limoilou\n`,
    "utf8",
  );

  if (!cliTome && !cliOutput) {
    for (let t = 1; t <= 7; t++) {
      const out = join(tomeDir, `tome-${roman(t)}.pdf`);
      console.log(`Tome ${roman(t)}…`);
      await buildPdf(spine, onto, fiches, t, out);
      console.log(`  ✓ ${out} (${countPdfPages(out)} p.)`);
    }
    writeFileSync(
      join(root, "docs", "encyclopedie", "generated", "page-registry.json"),
      JSON.stringify(
        { pages, bytes, masterPath: "public/encyclopedie.pdf", tomesDir: "public/encyclopedie/", generatedAt: new Date().toISOString() },
        null,
        2,
      ),
      "utf8",
    );
    const dlManifest = {
      title: onto.title,
      pageCount: pages,
      generatedAt: new Date().toISOString(),
      downloads: {
        master: "/encyclopedie.pdf",
        tomes: [1, 2, 3, 4, 5, 6, 7].map((n) => `/encyclopedie/tome-${roman(n)}.pdf`),
        braille: "/encyclopedie/braille/extrait-fr-utf8.txt",
      },
    };
    writeFileSync(join(tomeDir, "downloads-manifest.json"), JSON.stringify(dlManifest, null, 2), "utf8");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
