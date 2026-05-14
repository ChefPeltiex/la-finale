/**
 * Régénère peltiez/public/encyclopedie.pdf — placeholder Codex (fond noir, or).
 * Remplacer ce fichier par l’export final (InDesign / Canva / etc.).
 */
import PDFDocument from "pdfkit";
import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "encyclopedie.pdf");

const GOLD = "#d4af37";
const M = 56;

const doc = new PDFDocument({ size: "A4", margins: { top: M, bottom: M, left: M, right: M } });
const stream = createWriteStream(outPath);
doc.pipe(stream);

const W = doc.page.width;
const H = doc.page.height;
doc.save();
doc.rect(0, 0, W, H).fill("#000000");
doc.restore();

const textW = W - M * 2;
doc.fillColor(GOLD).font("Helvetica-Bold").fontSize(20).text("CirculAI / Egor69", M, M + 40, {
  width: textW,
  align: "center",
});
doc.moveDown(0.6);
doc.font("Helvetica").fontSize(11).fillColor("#e8d5a3").text(
  "Codex — encyclopédie visuelle (placeholder PDF). Remplacer ce fichier par le livrable final dans public/encyclopedie.pdf.",
  { width: textW, align: "center", lineGap: 4 },
);
doc.moveDown(1.2);
doc.fontSize(9).fillColor("#a89b74").text(`Généré automatiquement — ${new Date().toISOString().slice(0, 10)}`, {
  width: textW,
  align: "center",
});

doc.end();

await new Promise((resolve, reject) => {
  stream.on("finish", resolve);
  stream.on("error", reject);
});
console.log("Wrote", outPath);
