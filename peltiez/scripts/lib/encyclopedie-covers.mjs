/**
 * Couverture maîtresse — face (contenant des 7 tomes) et dos (histoire Dominic).
 */
import {
  GOLD,
  CREAM,
  MUTED,
  BLACK,
  M,
  FRAME_INSET,
  fillBlack,
  drawGoldFrame,
  drawFooter,
  parseMarkdownBlocks,
  renderBlocks,
} from "./encyclopedie-pdf-layout.mjs";

const PHI = "φ = 1,6180339887";

/**
 * @param {import('pdfkit').PDFDocument} doc
 * @param {object} onto
 * @param {{ pageNum: number, tomeLabel: string, runningTitle: string }} meta
 */
export function renderMasterCoverFace(doc, onto, meta) {
  doc.addPage({ size: "A4", margins: M });
  fillBlack(doc);
  drawGoldFrame(doc);
  const W = doc.page.width;
  const H = doc.page.height;
  const innerW = W - M.left - M.right;

  doc.save();
  doc.strokeColor(GOLD).lineWidth(1.2).opacity(0.5);
  doc.circle(W / 2, H * 0.36, 90).stroke();
  doc.circle(W / 2, H * 0.36, 55).stroke();
  doc.restore();

  doc.font("Helvetica-Bold").fontSize(22).fillColor(GOLD);
  doc.text("ENCYCLOPÉDIE TOTALE", M.left, M.top + 8, { width: innerW, align: "center" });
  doc.font("Helvetica").fontSize(11).fillColor(CREAM);
  doc.text("Dont vous êtes le héros", M.left, doc.y + 6, { width: innerW, align: "center" });
  doc.moveDown(0.8);
  doc.font("Helvetica-Oblique").fontSize(9).fillColor(MUTED);
  doc.text("Atlas hybride humain · machine — pour tous", { width: innerW, align: "center" });
  doc.moveDown(1.2);
  doc.font("Helvetica").fontSize(8).fillColor(GOLD);
  doc.text("LE CONTENANT DES SEPT TOMES · PORTE DE L'OMÉGA VERT", { width: innerW, align: "center" });
  doc.moveDown(0.6);
  doc.text(PHI + " · 1 être · 3 natures · 5 mondes · 14 domaines · loisirs & sports", {
    width: innerW,
    align: "center",
  });

  let y = doc.y + 28;
  doc.font("Helvetica-Bold").fontSize(9).fillColor(GOLD);
  doc.text("Ce coffre renferme", M.left, y, { width: innerW, align: "center" });
  y = doc.y + 14;

  for (const t of onto.tomes) {
    doc.font("Helvetica").fontSize(8.5).fillColor(CREAM);
    doc.text(`Tome ${t.num} — ${t.title.replace(/^Tome [IVX]+ — /, "")}`, M.left + 24, y, { width: innerW - 48 });
    y = doc.y + 6;
  }

  doc.font("Helvetica-Oblique").fontSize(8).fillColor(MUTED);
  doc.text(
    "CirculAI tient la boussole du réel. Egor69 tient la lampe du sens. Vous tenez la main qui tourne la page.",
    M.left,
    H - M.bottom - 72,
    { width: innerW, align: "center", lineGap: 2 },
  );
  doc.font("Helvetica").fontSize(7.5).fillColor(GOLD);
  doc.text("Dominic Pelletier / Igor 69 · Limoilou, Québec", M.left, H - M.bottom - 36, {
    width: innerW,
    align: "center",
  });

  drawFooter(doc, { ...meta, runningTitle: "Couverture maîtresse — face" });
}

/**
 * @param {import('pdfkit').PDFDocument} doc
 * @param {string} md
 * @param {{ pageNum: number, tomeLabel: string, runningTitle: string, onHeading?: Function, tome: number }} meta
 */
export function renderMasterCoverBack(doc, md, meta) {
  const blocks = parseMarkdownBlocks(md);
  const W = doc.page.width - M.left - M.right;
  doc.addPage({ size: "A4", margins: M });
  fillBlack(doc);
  drawGoldFrame(doc);
  doc.x = M.left;
  doc.y = M.top;
  doc.font("Helvetica-Bold").fontSize(14).fillColor(GOLD);
  doc.text("Dos du contenant", { width: W, align: "center" });
  doc.moveDown(0.3);
  doc.font("Helvetica-Oblique").fontSize(9).fillColor(MUTED);
  doc.text("L'histoire de celui qui a cousu les mondes", { width: W, align: "center" });
  doc.moveDown(0.8);
  renderBlocks(doc, W, blocks.slice(1), meta.onHeading, { tome: meta.tome, chapter: "COVER-BACK" });
  drawFooter(doc, { ...meta, runningTitle: "Couverture maîtresse — dos" });
}
