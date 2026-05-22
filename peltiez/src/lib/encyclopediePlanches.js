import planchesData from "../../docs/encyclopedie/planches-texte.json";

/** @param {string} file e.g. codex-encyclopedie-4A-chapitre1-opening.png */
export function getPlancheTexte(file) {
  return planchesData.planches?.find((p) => p.file === file) ?? null;
}
