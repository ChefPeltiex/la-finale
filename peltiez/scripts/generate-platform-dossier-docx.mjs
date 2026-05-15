/**
 * Génère EGOR69-CirculAI-Dossier-Plateforme.docx depuis le markdown source.
 * Usage: node scripts/generate-platform-dossier-docx.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from "docx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MD_PATH = path.join(ROOT, "docs", "EGOR69-CirculAI-Dossier-Plateforme.md");
const OUT_PATH = path.join(ROOT, "docs", "EGOR69-CirculAI-Dossier-Plateforme.docx");

function parseInline(text) {
  const runs = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) runs.push(new TextRun(text.slice(last, m.index)));
    const token = m[0];
    if (token.startsWith("**")) {
      runs.push(new TextRun({ text: token.slice(2, -2), bold: true }));
    } else {
      runs.push(new TextRun({ text: token.slice(1, -1), font: "Consolas" }));
    }
    last = m.index + token.length;
  }
  if (last < text.length) runs.push(new TextRun(text.slice(last)));
  if (runs.length === 0) runs.push(new TextRun(text));
  return runs;
}

function isTableRow(line) {
  return line.trim().startsWith("|") && line.trim().endsWith("|");
}

function parseTableRow(line) {
  return line
    .trim()
    .slice(1, -1)
    .split("|")
    .map((c) => c.trim());
}

function isSeparatorRow(cells) {
  return cells.every((c) => /^:?-+:?$/.test(c.replace(/\s/g, "")));
}

function mdToDocxChildren(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const children = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "" || trimmed === "---") {
      i++;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.TITLE,
          children: parseInline(trimmed.slice(2)),
          spacing: { after: 200 },
        })
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: parseInline(trimmed.slice(3)),
          spacing: { before: 280, after: 120 },
        })
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: parseInline(trimmed.slice(4)),
          spacing: { before: 200, after: 80 },
        })
      );
      i++;
      continue;
    }

    if (isTableRow(line)) {
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) {
        const cells = parseTableRow(lines[i]);
        if (!isSeparatorRow(cells)) rows.push(cells);
        i++;
      }
      if (rows.length > 0) {
        const tableRows = rows.map(
          (cells, ri) =>
            new TableRow({
              children: cells.map(
                (cell) =>
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: parseInline(cell),
                        alignment: AlignmentType.LEFT,
                      }),
                    ],
                    width: { size: Math.floor(9000 / cells.length), type: WidthType.DXA },
                  })
              ),
            })
        );
        children.push(
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );
        children.push(new Paragraph({ text: "" }));
      }
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (t.startsWith("- ") || t.startsWith("* ")) {
          items.push(t.slice(2));
          i++;
        } else break;
      }
      for (const item of items) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "• " }), ...parseInline(item)],
            indent: { left: 360 },
            spacing: { after: 60 },
          })
        );
      }
      continue;
    }

    const paraLines = [trimmed];
    i++;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (
        next === "" ||
        next.startsWith("#") ||
        isTableRow(lines[i]) ||
        next.startsWith("- ") ||
        next.startsWith("* ") ||
        next === "---"
      )
        break;
      paraLines.push(next);
      i++;
    }
    children.push(
      new Paragraph({
        children: parseInline(paraLines.join(" ")),
        spacing: { after: 120 },
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  }

  return children;
}

async function main() {
  if (!fs.existsSync(MD_PATH)) {
    console.error("Markdown introuvable:", MD_PATH);
    process.exit(1);
  }
  const md = fs.readFileSync(MD_PATH, "utf8");
  const children = mdToDocxChildren(md);

  const doc = new Document({
    creator: "CirculAI / EGOR69",
    title: "Dossier plateforme CirculAI — Dominic Pelletier",
    description: "Dossier investisseur et technique — mai 2026",
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUT_PATH, buffer);
  const words = md.split(/\s+/).filter(Boolean).length;
  console.log(JSON.stringify({ out: OUT_PATH, words, generator: "docx-npm" }));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
