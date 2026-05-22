/**
 * Mise en page PDF — Encyclopédie Totale (or / crème / noir, cadre 1B).
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const GOLD = "#D4AF37";
export const CREAM = "#F5F0E6";
export const MUTED = "#A89B74";
export const BLACK = "#000000";
export const M = { top: 52, bottom: 56, left: 48, right: 48 };
export const FRAME_INSET = 14;

/** @typedef {{ page: number, tome: number|null, chapter: string, title: string, level: number }} TocEntry */

/**
 * @param {import('pdfkit').PDFDocument} doc
 */
export function fillBlack(doc) {
  const { width: W, height: H } = doc.page;
  doc.save();
  doc.rect(0, 0, W, H).fill(BLACK);
  doc.restore();
}

/**
 * @param {import('pdfkit').PDFDocument} doc
 */
export function drawGoldFrame(doc) {
  const { width: W, height: H } = doc.page;
  doc.save();
  doc.strokeColor(GOLD).lineWidth(0.8).opacity(0.85);
  doc.rect(FRAME_INSET, FRAME_INSET, W - FRAME_INSET * 2, H - FRAME_INSET * 2).stroke();
  doc.restore();
}

/**
 * @param {import('pdfkit').PDFDocument} doc
 * @param {{ pageNum: number, tomeLabel: string, runningTitle: string }} meta
 */
export function drawFooter(doc, meta) {
  const { width: W, height: H } = doc.page;
  const y = H - M.bottom + 12;
  doc.save();
  doc.font("Helvetica").fontSize(7).fillColor(MUTED);
  doc.text(`Encyclopédie Totale · ${meta.tomeLabel} · p. ${meta.pageNum}`, M.left, y, {
    width: W - M.left - M.right,
    align: "left",
  });
  doc.text(meta.runningTitle.slice(0, 60), M.left, y, {
    width: W - M.left - M.right,
    align: "right",
  });
  doc.restore();
}

/**
 * @param {import('pdfkit').PDFDocument} doc
 * @param {() => void} draw
 * @param {{ pageNum: number, tomeLabel: string, runningTitle: string }} meta
 */
export function addTextPage(doc, draw, meta) {
  doc.addPage({ size: "A4", margins: M });
  fillBlack(doc);
  drawGoldFrame(doc);
  const W = doc.page.width - M.left - M.right;
  doc.x = M.left;
  doc.y = M.top;
  draw(W);
  drawFooter(doc, meta);
}

/**
 * @param {import('pdfkit').PDFDocument} doc
 * @param {string} filePath
 */
export function addFullBleedImage(doc, filePath) {
  doc.addPage({ size: "A4", margin: 0 });
  const { width: W, height: H } = doc.page;
  fillBlack(doc);
  if (existsSync(filePath)) {
    doc.image(filePath, 0, 0, { fit: [W, H], align: "center", valign: "center" });
  } else {
    doc.font("Helvetica").fontSize(10).fillColor(MUTED).text("Planche — image à intégrer", 0, H / 2 - 10, {
      width: W,
      align: "center",
    });
  }
}

/**
 * @param {string} md
 */
export function parseMarkdownBlocks(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  /** @type {{ type: string, text?: string, level?: number, rows?: string[][] }}[] */
  const blocks = [];
  let para = [];
  let inCode = false;
  let code = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: "p", text: para.join(" ").trim() });
      para = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      flushPara();
      if (inCode) {
        blocks.push({ type: "code", text: code.join("\n") });
        code = [];
        inCode = false;
      } else inCode = true;
      continue;
    }
    if (inCode) {
      code.push(line);
      continue;
    }
    if (/^#{1,4}\s/.test(line)) {
      flushPara();
      const level = line.match(/^#+/)[0].length;
      blocks.push({ type: "h", level, text: line.replace(/^#+\s*/, "").trim() });
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara();
      blocks.push({ type: "quote", text: line.replace(/^>\s?/, "").trim() });
      continue;
    }
    if (/^\|/.test(line) && line.includes("|")) {
      flushPara();
      const cells = line
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c && !/^[-:]+$/.test(c));
      if (cells.length) {
        const last = blocks[blocks.length - 1];
        if (last?.type === "table") last.rows.push(cells);
        else blocks.push({ type: "table", rows: [cells] });
      }
      continue;
    }
    if (line.trim() === "---") {
      flushPara();
      blocks.push({ type: "hr" });
      continue;
    }
    if (!line.trim()) {
      flushPara();
      continue;
    }
    if (line.trim().startsWith("**Suite :**") || line.trim().startsWith("**Précédent :**")) continue;
    para.push(line.trim());
  }
  flushPara();
  return blocks;
}

/**
 * @param {import('pdfkit').PDFDocument} doc
 * @param {number} W
 * @param {ReturnType<typeof parseMarkdownBlocks>} blocks
 * @param {(e: TocEntry) => void} [onHeading]
 * @param {{ tome: number, chapter: string }} ctx
 */
export function renderBlocks(doc, W, blocks, onHeading, ctx) {
  for (const b of blocks) {
    if (doc.y > doc.page.height - M.bottom - 40) {
      doc.addPage({ size: "A4", margins: M });
      fillBlack(doc);
      drawGoldFrame(doc);
      doc.x = M.left;
      doc.y = M.top;
    }
    if (b.type === "h") {
      const size = b.level === 1 ? 16 : b.level === 2 ? 13 : 11;
      doc.moveDown(0.4);
      doc.font("Helvetica-Bold").fontSize(size).fillColor(GOLD).text(stripMd(b.text), { width: W });
      doc.moveDown(0.25);
      onHeading?.({
        page: doc.bufferedPageRange().count,
        tome: ctx.tome,
        chapter: ctx.chapter,
        title: stripMd(b.text),
        level: b.level,
      });
    } else if (b.type === "quote") {
      doc.font("Helvetica-Oblique").fontSize(9).fillColor(CREAM).text(stripMd(b.text), {
        width: W - 16,
        indent: 12,
        lineGap: 2,
      });
      doc.moveDown(0.3);
    } else if (b.type === "code") {
      doc.font("Courier").fontSize(7.5).fillColor(CREAM).text(b.text, { width: W, lineGap: 1 });
      doc.moveDown(0.35);
    } else if (b.type === "table" && b.rows?.length) {
      doc.font("Helvetica").fontSize(8).fillColor(CREAM);
      for (const row of b.rows.slice(0, 12)) {
        doc.text(row.join(" · "), { width: W, lineGap: 1 });
      }
      doc.moveDown(0.3);
    } else if (b.type === "hr") {
      doc.moveDown(0.2);
      doc.strokeColor(GOLD).opacity(0.4).moveTo(M.left, doc.y).lineTo(M.left + W, doc.y).stroke();
      doc.opacity(1);
      doc.moveDown(0.3);
    } else if (b.type === "p" && b.text) {
      doc.font("Helvetica").fontSize(9.5).fillColor(CREAM).text(stripMd(b.text), {
        width: W,
        align: "justify",
        lineGap: 2,
      });
      doc.moveDown(0.25);
    }
  }
}

function stripMd(s) {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export function readMd(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf8");
}

export function loadPlanches(peltiezRoot) {
  const jsonPath = join(peltiezRoot, "docs", "encyclopedie", "planches-texte.json");
  if (!existsSync(jsonPath)) return [];
  const raw = JSON.parse(readFileSync(jsonPath, "utf8"));
  return Array.isArray(raw) ? raw : raw.planches ?? [];
}
