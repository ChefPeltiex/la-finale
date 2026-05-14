import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = __dirname;

const backup = fs.readFileSync(path.join(base, 'CODEX-SOUVERAIN-COMPLET.pre-merge-backup.md'), 'utf8');
let imp = fs.readFileSync(
  path.join(base, 'import-Egor69-La-Vraie-Cle-des-Secrets-des-Portes-de-lUnivers.md'),
  'utf8'
);
if (imp.charCodeAt(0) === 0xfeff) imp = imp.slice(1);
imp = imp.replace(/^---[\s\S]*?---\s*\r?\n/, '');

const splitRe = /^# II\. Préambule Souverain\r?\n/m;
const parts = backup.split(splitRe);
if (parts.length < 2) throw new Error('split fail: # II. Préambule Souverain');
let head = parts[0];
const tail = '# II. Préambule Souverain\n' + parts.slice(1).join('');

const newYaml = `---
title: "IGOR — Le Codex Souverain"
subtitle: "L'Intelligence Circulaire du Québec"
author: "Dominic Peltiez — Le Maître du Multivers"
version: "2026"
lang: fr
sources:
  - "import-Egor69-La-Vraie-Cle-des-Secrets-des-Portes-de-lUnivers.md (DOCX extrait)"
  - "Édition harmonisée plateforme (sections II–VIII)"
merged: true
---

`;
head = head.replace(/^---[\s\S]*?---\s*\r?\n/m, newYaml);

const bridge = `

---

# Partie I — Manuscrit « La Vraie Clé des Secrets des Portes de l'Univers »

*Texte issu de l'import DOCX (Egor69). Orthographe et noms propres conservés tels qu'extraits ; relire la mise en forme si besoin.*

---

${imp.trim()}

---

# Partie II — Édition harmonisée (documentation plateforme Igor / Egor69)

*Sections II à VIII : préambule et corps courts alignés **STRUCTURE-FINALE** — grille éditoriale et export PDF harmonisé. Les lois et modules diffèrent du manuscrit de la Partie I.*

---

`;

const colophon = `

---

*Colophon — Document fusionné : Partie I = import DOCX ; Partie II = édition harmonisée d'origine. Sauvegarde pré-fusion : \`CODEX-SOUVERAIN-COMPLET.pre-merge-backup.md\`.*
`;

const merged = head.trimEnd() + bridge + tail.trim() + colophon + '\n';
const out = path.join(base, 'CODEX-SOUVERAIN-COMPLET.md');
fs.writeFileSync(out, merged, 'utf8');
console.log('OK', merged.length, 'chars');
