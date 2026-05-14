/**
 * Génère icon-192.png et icon-512.png à partir de public/favicon.svg (Sharp).
 * Exécuter après clone : npm run icons:pwa
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const svgPath = path.join(root, "public", "favicon.svg");

async function run() {
  if (!fs.existsSync(svgPath)) {
    console.error("Fichier manquant:", svgPath);
    process.exit(1);
  }

  for (const size of [192, 512]) {
    const outPath = path.join(root, "public", `icon-${size}.png`);
    await sharp(svgPath)
      .resize(size, size, { fit: "cover" })
      .png()
      .toFile(outPath);
    console.log("Écrit", path.relative(root, outPath));
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
