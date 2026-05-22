/** Planches PNG + markdown encyclopédie → public/ pour l'UI web */
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const repoRoot = join(root, "..");

const planchesSrc = join(repoRoot, "assets", "codex-encyclopedie");
const planchesDest = join(root, "public", "encyclopedie", "codex");
const mdSrc = join(root, "docs", "encyclopedie");
const mdDest = join(root, "public", "docs", "encyclopedie");
const circulaiSrc = join(root, "docs", "circulai");
const circulaiDest = join(root, "public", "docs", "circulai");

mkdirSync(planchesDest, { recursive: true });

let png = 0;
if (existsSync(planchesSrc)) {
  for (const f of readdirSync(planchesSrc)) {
    if (f.endsWith(".png")) {
      copyFileSync(join(planchesSrc, f), join(planchesDest, f));
      png += 1;
    }
  }
} else {
  console.warn("Planches absentes — lancez: npm run encyclopedie:planches");
}

if (existsSync(mdSrc)) {
  cpSync(mdSrc, mdDest, { recursive: true });
  console.log(`OK markdown → public/docs/encyclopedie/`);
} else {
  console.warn("docs/encyclopedie introuvable");
}

if (existsSync(circulaiSrc)) {
  cpSync(circulaiSrc, circulaiDest, { recursive: true });
  console.log("OK circulai markdown → public/docs/circulai/");
}

console.log(`OK ${png} planches → public/encyclopedie/codex/`);
