/**
 * Génère maillage 108 fiches + atlas + mondes + natures + manifest.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  loadOntologie,
  buildAllFiches,
  buildSpineOrder,
  DOMAINE_MONDE,
  DOMAINE_NATURE,
  peltiezRoot,
} from "./lib/encyclopedie-graph.mjs";

const root = peltiezRoot;
const genRoot = join(root, "docs", "encyclopedie", "generated");
const maillageDir = join(genRoot, "maillage");
const atlasDir = join(genRoot, "atlas-domaines");
const mondesDir = join(genRoot, "mondes");
const naturesDir = join(genRoot, "natures");
const seuilsDir = join(genRoot, "lettres-seuil");

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function mondeTitle(onto, id) {
  return onto.mondes.find((m) => m.id === id)?.title ?? id;
}
function natureTitle(onto, id) {
  return onto.natures.find((n) => n.id === id)?.title ?? id;
}

function extraLoisirsSports(f) {
  if (f.domainId === "loisirs") {
    return `
## Focus loisirs

Jeux de société circulants, ateliers créatifs, musique de rue, soirées contes — le **temps libre** est un bien commun fragile. CirculAI peut lister ce qui est **prêté** ; Egor peut en faire une quête légère. Jamais promettre la joie : la documenter quand elle a eu lieu.

`;
  }
  if (f.domainId === "sports") {
    return `
## Focus sports

Raquettes, bâtons, filets, maillots — l'équipement coûte cher neuf et dort souvent dans un garage. Un pilote sportif = **un club**, **un terrain**, **un registre d'heures d'usage** réelles. Le corps mérite le respect ; le chiffre inventé mérite le silence.

`;
  }
  return "";
}

function writeFicheMd(onto, f) {
  const monde = mondeTitle(onto, f.mondeId);
  const nature = natureTitle(onto, f.natureId);
  const voir = f.related.filter((r) => !r.startsWith("MONDE-") && !r.startsWith("NAT-")).slice(0, 8);
  const extra = extraLoisirsSports(f);

  const md = `# Fiche maillage ${f.id}

**${f.domain.title}** × **${f.subject.title}** · Tome ${f.tome}  
**Monde :** ${monde} · **Nature :** ${nature}

---

## Prisme Terrain

À Limoilou et partout où le réel résiste aux slides, **${f.domain.title}** rencontre **${f.subject.title}** dans le monde **${monde}**. CirculAI exige des preuves : pas d'avis fabriqués, pas de tonne de CO₂ fantôme. Cette fiche est un nœud du maillage — si vous la lisez seule, vous entendez un seul instrument ; lisez les voir-aussi pour l'orchestre.

> **Terrain :** trace datée avant récit triomphal.

${extra}
---

## Prisme Verse

Dans Egor69, **${f.subject.title}** devient symbole : clé sur la porte **${f.domain.title}**, lueur or & noir. φ = proportion, pas loi imposée. Le Verse guérit par la culture, pas en remplaçant le vote municipal.

---

## Pilote 90 jours

| Phase | Action \`${f.id}\` |
|-------|-------------------|
| J0–J7 | Site · référent · indicateur |
| J8–J45 | Journal des flux **${f.subject.title}** |
| J46–J90 | 3 preuves : flux · matching · confiance |

---

## Méditation du cousu

Je vous écris comme à un héros qui tiendrait ce livre pour **bible personnelle** — yeux brillants, cœur trop grand. **${f.domain.title}** et **${f.subject.title}** sont un fil d'or de plus. Le fleuve passe ; un meuble attend ; un rêve attend qu'on le nomme.

---

## Maillage

${voir.map((v) => `- \`${v}\` · fiche voisine`).join("\n")}
- \`MONDE-${f.mondeId}\` · ${monde}
- \`NAT-${f.natureId}\` · ${nature}
- \`COVER-BACK\` · histoire du fondateur

---

## Songe prolongé

La nuit, **${f.subject.title}** murmure : *Ne ferme pas la boucle trop tôt.* Codex enregistre ; CirculAI mesure ; Egor69 chante. Trois natures, cinq mondes, **un être** — vous — au centre. Page excessive ? Assumez la sainteté **à vos yeux** sans l'imposer aux autres.

Vers **${voir[0] ?? f.id}** quand vous êtes prêt.

---

*Dominic Pelletier / Igor 69 · ${f.id}*
`;
  const path = join(maillageDir, `${f.id}.md`);
  writeFileSync(path, md, "utf8");
  return path;
}

function writeAtlasDomaine(onto, d) {
  const monde = mondeTitle(onto, DOMAINE_MONDE[d.id]);
  const nature = natureTitle(onto, DOMAINE_NATURE[d.id]);
  let md = `# Atlas ${d.code} — ${d.title}\n\n**Monde ${monde}** · **Nature ${nature}**\n\n`;
  for (const s of onto.sujets) {
    md += `## ${d.code}-${s.code} — ${s.title}\n\n`;
    md += `Porte vers la fiche \`${d.code}-${s.code}\`. En pilote : qu'est-ce que **${s.title}** change pour **${d.title}** cette semaine ? Si « rien », notez-le — l'honnêteté est preuve.\n\n`;
    md += `> Résonance φ : l'organe et le sang — ${d.title} sans ${s.title} dort ; inversement aussi.\n\n`;
  }
  md += `## Convergence\n\nTous les domaines mènent à **ETRE-01** : vous, lecteur souverain.\n`;
  const path = join(atlasDir, `${d.code}-atlas.md`);
  writeFileSync(path, md, "utf8");
  return path;
}

function writeMonde(onto, m) {
  const doms = onto.domaines.filter((d) => DOMAINE_MONDE[d.id] === m.id);
  const md = `# ${m.title}\n\n**${m.role}**\n\n## Domaines\n\n${doms.map((d) => `- ${d.code} ${d.title}`).join("\n")}\n\n## Serment\n\nMesurer avant d'afficher. Rêver sans mentir au terrain. Coudre au maillage global.\n`;
  const path = join(mondesDir, `monde-${m.id}.md`);
  writeFileSync(path, md, "utf8");
  return path;
}

function writeNature(onto, n) {
  const md = `# ${n.title}\n\nSymbole **${n.symbol}** · pôle **${n.monde}**\n\nMatière = poids ; Rêve = métaphore ; Lien = contrat entre les deux.\n\n*Je cous ${n.symbol} comme une étoile dans un manteau — pour que vous vous reconnaissiez.*\n`;
  const path = join(naturesDir, `nature-${n.id}.md`);
  writeFileSync(path, md, "utf8");
  return path;
}

function writeLettreSeuil(tomeNum, title) {
  const md = `# Lettre du seuil — Tome ${tomeNum}\n\n> *${title}*\n\nAmi lecteur, vous franchissez un seuil. Ce n'est pas une fin : c'est un **pli** dans le manteau de l'encyclopédie. CirculAI veille la mesure ; Egor69 veille la flamme ; vous veillez sur le choix.\n\nSi votre cœur bat trop fort, posez le livre, respirez, revenez. La boucle vous attend.\n\n— Dominic, depuis la rive de Limoilou\n`;
  const path = join(seuilsDir, `seuil-tome-${tomeNum}.md`);
  writeFileSync(path, md, "utf8");
  return path;
}

function main() {
  const onto = loadOntologie();
  const fiches = buildAllFiches(onto);
  [maillageDir, atlasDir, mondesDir, naturesDir, seuilsDir].forEach(ensureDir);

  const fichePaths = Object.fromEntries(fiches.map((f) => [f.id, writeFicheMd(onto, f)]));
  const atlasPaths = Object.fromEntries(onto.domaines.map((d) => [d.code, writeAtlasDomaine(onto, d)]));
  const mondePaths = Object.fromEntries(onto.mondes.map((m) => [m.id, writeMonde(onto, m)]));
  const naturePaths = Object.fromEntries(onto.natures.map((n) => [n.id, writeNature(onto, n)]));

  const ficheCount = onto.domaines.length * onto.sujets.length;
  const carte = `# Carte de l'ensemble\n\n**1 être · 3 natures · 5 mondes · 14 domaines · 9 sujets = ${ficheCount} fiches**\n\nInclut **D13 Loisirs** et **D14 Sports** — jeu, temps libre, mouvement, équipement.\n\n| Domaine | Code |\n|---------|------|\n${onto.domaines.map((d) => `| ${d.title} | ${d.code} |`).join("\n")}\n\nLecture : face → dos → carte → tomes I–VII · chapitre **loisirs-sports** (Tome V).\n`;
  writeFileSync(join(genRoot, "maillage-carte.md"), carte, "utf8");

  const spine = buildSpineOrder(onto, root);
  for (const item of spine) {
    if (item.type === "fiche-maillage") item.path = fichePaths[item.id];
    if (item.type === "maillage-carte") item.path = join(genRoot, "maillage-carte.md");
    if (item.type === "nature-chapter") item.path = naturePaths[item.id.replace("NAT-", "")];
    if (item.type === "monde-chapter") item.path = mondePaths[item.id.replace("MONDE-", "")];
  }
  for (const t of onto.tomes) {
    spine.push({
      type: "lettre-seuil",
      id: `SEUIL-${t.num}`,
      path: writeLettreSeuil(t.num, t.title),
      tome: t.num,
      title: `Lettre du seuil ${t.num}`,
    });
  }
  for (const d of onto.domaines) {
    spine.push({
      type: "atlas-domaine",
      id: `ATLAS-${d.code}`,
      path: atlasPaths[d.code],
      tome: 7,
      title: `Atlas ${d.code}`,
    });
  }

  const graph = {
    version: "1.0",
    fiches: fiches.map((f) => ({ id: f.id, tome: f.tome, related: f.related, path: fichePaths[f.id] })),
    edges: fiches.flatMap((f) => f.related.map((t) => ({ from: f.id, to: t }))),
  };
  writeFileSync(join(genRoot, "mega-graphe.json"), JSON.stringify(graph, null, 2), "utf8");
  writeFileSync(
    join(genRoot, "ensemble-manifest.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), spine }, null, 2),
    "utf8",
  );
  console.log(`OK ${fiches.length} fiches · manifest écrit`);
}

main();
