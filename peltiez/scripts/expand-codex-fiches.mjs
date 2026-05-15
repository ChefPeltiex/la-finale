/**
 * Régénère la section « Annexes — Fiches planches » dans codex-magique-egor69.md
 * à partir de planches-texte.json (corps ~100 mots + extension éditoriale).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const peltiezRoot = join(__dirname, "..");
const jsonPath = join(peltiezRoot, "docs", "encyclopedie", "planches-texte.json");
const mdPath = join(peltiezRoot, "docs", "codex-magique-egor69.md");

const { planches } = JSON.parse(readFileSync(jsonPath, "utf8"));
const md = readFileSync(mdPath, "utf8");

const extensions = [
  "Dans l'atelier CirculAI, cette planche précède une page texte PDF (or #D4AF37, crème #F5F0E6) avant le visuel plein écran — voir assemble-codex-pdf.mjs --with-text.",
  "Les partenaires peuvent projeter l'image puis lire la fiche à voix haute : l'objectif est d'aligner les regards avant de chiffrer un pilote 90 jours (temps, coût, qualité des données).",
  "Egor69 n'interprète pas la planche à la place du groupe : il propose des questions. La validation reste humaine, conformément à la gouvernance SCALE.",
  "Si une lecture scientifique est tentée, rappelez l'étiquette « modèle de travail à calibrer » : coefficients à mesurer, jamais promesse absolue.",
];

let section = "## Annexes — Fiches planches (ordre blueprint 1A → 12C)\n\n";
section +=
  "*Versions courtes injectées dans le PDF : `docs/encyclopedie/planches-texte.json`. Fiches ci-dessous ~150–220 mots.*\n\n";

planches.forEach((p, i) => {
  const ext = extensions[i % extensions.length];
  const formulas =
    i < 4
      ? " Formules de référence : Cœur Pur, Omega Synthesis, φ."
      : i < 10
        ? " Formules de référence : Respiration × φ, Nexus Omnibus."
        : i < 20
          ? " Formules de référence : Φ, Alliance IA, R_n, Pont T×C×φ/F."
          : i < 28
            ? " Formules de référence : Cr, ΔM, modèle financier (3 onglets)."
            : " Formules de référence : Omega Synthesis, Infini.";

  section += `### [IMAGE ${i + 1}] ${p.file} — ${p.title}\n\n`;
  section += `${p.body} ${ext}${formulas}\n\n`;
  section += `**Légende :** ${p.legend}\n\n`;
});

const start = md.indexOf("## Annexes — Fiches planches");
const end = md.indexOf("## Glossaire");
if (start === -1 || end === -1) {
  console.error("Marqueurs section introuvables dans codex-magique-egor69.md");
  process.exit(1);
}

const out = md.slice(0, start) + section + md.slice(end);
writeFileSync(mdPath, out, "utf8");
console.log("Mis à jour :", mdPath, `(${planches.length} fiches)`);
