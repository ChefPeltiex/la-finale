/**
 * Graphe de l'Encyclopédie Totale — 1 être · 3 natures · 5 mondes · 14 domaines · 9 sujets
 * Chaque fiche est un nœud ; les arêtes = voir-aussi, monde, nature, tome.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const peltiezRoot = join(__dirname, "..", "..");

/** @typedef {{ id: string, code: string, domainId: string, subjectId: string, domain: object, subject: object, mondeId: string, natureId: string, tome: number, related: string[] }} FicheNode */

export function loadOntologie() {
  const path = join(peltiezRoot, "docs", "encyclopedie", "mega-ontologie.json");
  return JSON.parse(readFileSync(path, "utf8"));
}

/** Domaine → monde primaire */
const DOMAINE_MONDE = {
  circulaire: "circulai",
  gouvernance: "pilote",
  culture: "egor",
  technologie: "codex",
  territoire: "quebec",
  obnl: "quebec",
  environnement: "quebec",
  reparation: "circulai",
  ethique: "pilote",
  narration: "egor",
  equations: "codex",
  transmission: "codex",
  loisirs: "quebec",
  sports: "quebec",
};

/** Domaine → nature primaire */
const DOMAINE_NATURE = {
  circulaire: "matiere",
  gouvernance: "matiere",
  culture: "reve",
  technologie: "lien",
  territoire: "matiere",
  obnl: "matiere",
  environnement: "matiere",
  reparation: "matiere",
  ethique: "lien",
  narration: "reve",
  equations: "lien",
  transmission: "lien",
  loisirs: "reve",
  sports: "matiere",
};

/** Répartition des fiches maillage (14×9) sur tomes 3–6 */
function tomeForFiche(domainIndex, subjectIndex) {
  const linear = domainIndex * 9 + subjectIndex;
  if (linear < 32) return 3;
  if (linear < 63) return 4;
  if (linear < 94) return 5;
  return 6;
}

/**
 * @returns {FicheNode[]}
 */
export function buildAllFiches(onto) {
  const nodes = [];
  onto.domaines.forEach((d, di) => {
    onto.sujets.forEach((s, si) => {
      const id = `${d.code}-${s.code}`;
      const related = [];
      const dPrev = onto.domaines[(di + 11) % 12];
      const dNext = onto.domaines[(di + 1) % 12];
      const sPrev = onto.sujets[(si + 8) % 9];
      const sNext = onto.sujets[(si + 1) % 9];
      related.push(`${d.code}-${sPrev.code}`, `${d.code}-${sNext.code}`);
      related.push(`${dPrev.code}-${s.code}`, `${dNext.code}-${s.code}`);
      const mondeId = DOMAINE_MONDE[d.id] ?? "circulai";
      const natureId = DOMAINE_NATURE[d.id] ?? "lien";
      related.push(`MONDE-${mondeId}`, `NAT-${natureId}`, "ETRE-01");
      nodes.push({
        id,
        code: id,
        domainId: d.id,
        subjectId: s.id,
        domain: d,
        subject: s,
        mondeId,
        natureId,
        tome: tomeForFiche(di, si),
        related: [...new Set(related)],
      });
    });
  });
  return nodes;
}

/**
 * Ordre de lecture « ensemble parfait » : spirale domaine×sujet + tomes + volumes
 * @returns {{ type: string, id: string, path?: string, tome?: number }[]}
 */
export function buildSpineOrder(onto, peltiezRootPath) {
  const fiches = buildAllFiches(onto);
  const byTome = new Map();
  for (const f of fiches) {
    if (!byTome.has(f.tome)) byTome.set(f.tome, []);
    byTome.get(f.tome).push(f);
  }

  /** @type {{ type: string, id: string, path?: string, tome: number, title?: string }[]} */
  const spine = [];

  const encRoot = join(peltiezRootPath, "docs", "encyclopedie");
  spine.push({ type: "cover-master-face", id: "COVER-FACE", path: join(encRoot, "couverture-maitre-face.md"), tome: 0, title: onto.title });
  spine.push({ type: "cover-master-back", id: "COVER-BACK", path: join(encRoot, "couverture-maitre-dos.md"), tome: 0, title: "Dos — histoire de Dominic" });
  spine.push({ type: "maillage-carte", id: "MAILLAGE", tome: 0, title: "Carte de l'ensemble" });
  spine.push({
    type: "volume-md",
    id: "CYOA",
    path: join(encRoot, "vous-etes-le-heros.md"),
    tome: 1,
    title: "Vous êtes le héros",
  });

  const volumeDirs = [
    { dir: "volume-0", tome: 1, glob: ["00-seuil.md", "01-origine.md", "02-deux-mondes.md", "03-circulai.md", "04-egor.md", "05-systeme-nerveux.md", "06-transmission.md", "annexes.md"] },
    { dir: "volume-1", tome: 5, glob: ["00-seuil.md", "01-quebec-ville.md", "02-nature-quebec.md", "03-acteurs-terrain.md", "04-journal-pilote.md", "05-ecosysteme.md", "06-cloture.md", "annexes.md"] },
    { dir: "volume-2", tome: 6, glob: ["00-seuil.md", "01-intention.md", "02-transparence.md", "03-lux.md", "04-chaos.md", "05-alliance.md", "06-cloture.md"] },
    { dir: "volume-3", tome: 6, glob: ["00-seuil.md", "01-nexus.md", "02-richesse-phi.md", "03-scale.md", "04-solve-coagula.md", "05-temps.md", "06-cloture.md"] },
    { dir: "volume-4", tome: 6, glob: ["00-seuil.md", "01-pic-colegam.md", "02-respiration.md", "03-diagramme-phi.md", "04-reseau-radial.md", "05-medailles.md", "06-cloture.md"] },
  ];
  for (const vol of volumeDirs) {
    const volPath = join(encRoot, vol.dir);
    for (const ch of vol.glob) {
      spine.push({
        type: "volume-md",
        id: `${vol.dir}-${ch}`,
        path: join(volPath, ch),
        tome: vol.tome,
        title: ch,
      });
    }
  }

  spine.push({ type: "tome-cover", id: "T2-COVER", tome: 2, title: "Tome II — 3 Natures" });
  for (const n of onto.natures) {
    spine.push({ type: "nature-chapter", id: `NAT-${n.id}`, tome: 2, title: n.title });
  }

  for (let t = 3; t <= 6; t++) {
    const tomeMeta = onto.tomes.find((x) => x.num === t);
    spine.push({ type: "tome-cover", id: `T${t}-COVER`, tome: t, title: tomeMeta?.title ?? `Tome ${t}` });
    const monde = onto.mondes[t - 3];
    if (monde) spine.push({ type: "monde-chapter", id: `MONDE-${monde.id}`, tome: t, title: monde.title });
    const list = byTome.get(t) ?? [];
    for (const f of list) {
      spine.push({ type: "fiche-maillage", id: f.id, tome: t, title: `${f.domain.title} × ${f.subject.title}` });
    }
  }

  spine.push({
    type: "volume-md",
    id: "LOISIRS-SPORTS",
    path: join(encRoot, "generated", "chapitres", "loisirs-sports.md"),
    tome: 5,
    title: "Loisirs & sports — chapitre fondateur",
  });

  spine.push({ type: "tome-cover", id: "T7-COVER", tome: 7, title: "Tome VII — Atlas" });
  spine.push({ type: "planches-atlas", id: "ATLAS", tome: 7, title: "Planches Codex" });
  spine.push({ type: "index-global", id: "INDEX", tome: 7, title: "Index & registre des pages" });

  return spine;
}

export { DOMAINE_MONDE, DOMAINE_NATURE, peltiezRoot };
