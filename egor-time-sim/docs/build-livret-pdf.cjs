/**
 * Génère EGOR-flou-temporel-LIVRET.pdf depuis EGOR-flou-temporel-LIVRET.md
 * sans Pandoc ni navigateur : Node + pdfkit + police système (Arial).
 * Usage : node build-livret-pdf.cjs
 */
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const SRC = path.join(__dirname, "EGOR-flou-temporel-LIVRET.md");
const OUT = path.join(__dirname, "EGOR-flou-temporel-LIVRET.pdf");

function stripYaml(md) {
  if (md.startsWith("---")) {
    const end = md.indexOf("\n---", 3);
    if (end !== -1) return md.slice(end + 4).replace(/^\n+/, "");
  }
  return md;
}

function cleanInline(s) {
  return s
    .replace(/\$\$?([^$]+)\$\$?/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

function fontPath() {
  const windir = process.env.WINDIR || "C:\\Windows";
  const candidates = [
    path.join(windir, "Fonts", "arial.ttf"),
    path.join(windir, "Fonts", "calibri.ttf"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function main() {
  const ttf = fontPath();
  const md = stripYaml(fs.readFileSync(SRC, "utf8"));
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 54, bottom: 54, left: 54, right: 54 },
    info: {
      Title: "EGOR — Flou temporel (livret)",
      Author: "EGOR",
    },
  });
  const stream = fs.createWriteStream(OUT);
  doc.pipe(stream);

  if (ttf) {
    doc.registerFont("body", ttf);
    doc.font("body");
  } else {
    doc.font("Helvetica");
  }

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const left = doc.page.margins.left;

  let inCode = false;
  const lines = md.split(/\r?\n/);

  function heading(size, line) {
    doc.moveDown(0.4);
    doc.fontSize(size).fillColor("#111111");
    if (ttf) doc.font("body");
    else doc.font("Helvetica-Bold");
    doc.text(cleanInline(line), left, undefined, { width: pageWidth, align: "left" });
    doc.fillColor("#000000");
    doc.fontSize(11);
    if (ttf) doc.font("body");
    else doc.font("Helvetica");
    doc.moveDown(0.25);
  }

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (line.trim() === "\\newpage") {
      doc.addPage();
      continue;
    }
    if (line.startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      doc.fontSize(9).fillColor("#222266");
      if (ttf) doc.font("body");
      else doc.font("Courier");
      doc.text(line || " ", left, undefined, { width: pageWidth, align: "left" });
      doc.fillColor("#000000");
      doc.fontSize(11);
      if (ttf) doc.font("body");
      else doc.font("Helvetica");
      continue;
    }
    if (!line.trim()) {
      doc.moveDown(0.35);
      continue;
    }
    if (/^\|/.test(line) && line.includes("|")) {
      doc.fontSize(9);
      doc.text(cleanInline(line.replace(/\|/g, "  ")), left, undefined, { width: pageWidth });
      doc.fontSize(11);
      continue;
    }
    if (line.startsWith("# ")) {
      heading(16, line.slice(2).trim());
      continue;
    }
    if (line.startsWith("## ")) {
      heading(13, line.slice(3).trim());
      continue;
    }
    if (line.startsWith("### ")) {
      heading(11.5, line.slice(4).trim());
      continue;
    }
    if (line.startsWith("- [ ]")) {
      doc.text("☐ " + cleanInline(line.slice(5).trim()), left, undefined, { width: pageWidth });
      continue;
    }
    if (line.startsWith("- ")) {
      doc.text("• " + cleanInline(line.slice(2).trim()), left, undefined, { width: pageWidth });
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      doc.text(cleanInline(line), left, undefined, { width: pageWidth });
      continue;
    }
    doc.text(cleanInline(line), left, undefined, { width: pageWidth, align: "left" });
  }

  doc.end();
  stream.on("finish", () => {
    console.log("Écrit :", OUT);
  });
}

main();
