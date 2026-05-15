/**
 * Régénère peltiez/docs/companion.md à partir de assets/codex-encyclopedie/*.png
 * Usage (racine du repo) : node scripts/generate_companion.cjs
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO_ROOT = path.join(__dirname, "..");
const ASSETS_DIR = path.join(REPO_ROOT, "assets", "codex-encyclopedie");
const COMPANION_PATH = path.join(REPO_ROOT, "peltiez", "docs", "companion.md");

function scanPngs() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error("Dossier introuvable:", ASSETS_DIR);
    process.exit(1);
  }
  return fs
    .readdirSync(ASSETS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .sort((a, b) => a.localeCompare(b, "en"));
}

function slugToTitle(filename) {
  const base = filename.replace(/\.png$/i, "");
  const parts = base.split("-");
  const tail = parts.slice(2).join(" ");
  return tail.replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveFromFilename(filename) {
  const lower = filename.toLowerCase();
  const keywords = [];
  const chunks = [
    "couverture",
    "titre",
    "sous-titre",
    "sommaire",
    "index",
    "chapitre",
    "diagramme",
    "annexes",
    "colophon",
    "credits",
    "fermeture",
    "tranche",
    "dos",
    "medallions",
    "bordures",
    "textures",
    "ornements",
    "fractal",
    "cadre",
    "sceau",
    "rubans",
    "vignette",
    "icons",
    "divider",
    "opening",
    "footer",
    "header",
    "margin",
    "corners",
    "grille",
    "tabs",
    "radial",
    "reseau",
    "abstract",
    "ligne-editoriale",
  ];
  for (const w of chunks) {
    if (lower.includes(w)) keywords.push(w);
  }
  const uniq = [...new Set(keywords)].slice(0, 8);
  const hypothese =
    uniq.length > 0
      ? `Planche liée au thème : ${uniq.join(", ")} (à affiner après inspection visuelle).`
      : "Planche graphique du codex — à affiner après inspection visuelle.";
  const intention =
    "Composante visuelle du PDF encyclopédie (mise en page / chapitre / ornement).";
  return { mots_cles: uniq.length ? uniq.join(", ") : "codex, png, encyclopedie", hypothese, intention };
}

function sha256File(absPath) {
  const buf = fs.readFileSync(absPath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function makeEntry(filename, index) {
  const rel = `assets/codex-encyclopedie/${filename}`;
  const abs = path.join(ASSETS_DIR, filename);
  const sha = fs.existsSync(abs) ? sha256File(abs) : "";
  const title = slugToTitle(filename);
  const { mots_cles, hypothese, intention } = deriveFromFilename(filename);
  return [
    `### ${index + 1}. ${filename}`,
    `- **filename**: \`${filename}\``,
    `- **chemin relatif**: \`${rel}\``,
    `- **title**: ${title}`,
    `- **hypothese**: ${hypothese}`,
    `- **mots_clés**: ${mots_cles}`,
    `- **intention**: ${intention}`,
    `- **sha256_fichier** (empreinte contenu): \`${sha}\``,
    `- **merkle_hash**: _(réservé — non calculé dans ce script)_`,
    `- **signature**: _(réservé — workflow hors périmètre)_`,
    "",
  ].join("\n");
}

function buildDocument(files, entries) {
  const now = new Date().toISOString();
  const toc = files.map((fn, i) => `${i + 1}. \`${fn}\``).join("\n");
  return `# Companion Codex CirculAI

**Inventaire des planches PNG (encyclopédie)**  
**Chemin source** : \`assets/codex-encyclopedie/\`  
**Dernière génération** : ${now} (script \`scripts/generate_companion.cjs\`)

---

## Prologue (court)

Ce document **indexe** les images sources du codex. Il ne remplace pas une **lecture visuelle** : les champs *hypothèse* et *intention* sont des **amorces** dérivées du nom de fichier. Complète-les après revue humaine.

---

## Mode d’emploi

| Champ | Rôle |
|--------|------|
| **filename** / **chemin relatif** | Référence stable dans le dépôt |
| **title** | Libellé lisible (dérivé du nom) |
| **hypothese** | Ce que la planche *semble* structurer (à valider à l’œil) |
| **mots_clés** | Filtrage / glossaire |
| **sha256_fichier** | Empreinte du fichier (reproductible) |
| **merkle_hash** / **signature** | Réservés à un workflow de preuve externe si tu l’implémentes |

---

## Table des matières (ordre alphabétique fichier)

${toc}

---

## Index image par image

<!-- BEGIN_AUTOGEN -->

${entries.join("\n")}

<!-- END_AUTOGEN -->

---

## Glossaire (amorce)

| Terme | Sens (projet) |
|--------|----------------|
| **Codex** | Jeu de planches graphiques assemblées dans \`encyclopedie.pdf\` |
| **Planche** | Un fichier PNG source listé ci-dessus |
| **SHA256** | Hash du contenu binaire du fichier (intégrité) |

---

## Preuves, licences et limites

- **Traçabilité** : commits Git + hashes ci-dessus pour intégrité fichier.  
- **Merkle / signature / L2 / JWT** : non générés ici ; champs réservés si tu ajoutes un pipeline dédié.  
- **Légendes** : hypothèses éditoriales à valider humainement — pas une prétention de « vérité » automatique.

---

## Régénérer l’inventaire

\`\`\`bash
node scripts/generate_companion.cjs
\`\`\`

Puis commit : \`git add peltiez/docs/companion.md && git commit -m "docs: refresh codex companion inventory"\`
`;
}

function main() {
  const files = scanPngs();
  const entries = files.map((f, i) => makeEntry(f, i));
  const doc = buildDocument(files, entries);
  fs.mkdirSync(path.dirname(COMPANION_PATH), { recursive: true });
  fs.writeFileSync(COMPANION_PATH, doc, "utf8");
  console.log("Companion écrit:", COMPANION_PATH);
  console.log("Entrées PNG:", files.length);
}

main();
