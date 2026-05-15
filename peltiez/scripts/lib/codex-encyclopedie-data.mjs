/**
 * Données éditoriales — encyclopédie Codex (ordre blueprint, fiches, formules).
 * Source fiches : docs/companion.md — texte : docs/codex-magique-egor69.md
 */

export const PHI = 1.6180339887;

/** Ordre de publication PDF (sections 1→12, A→C). */
export const BLUEPRINT_IMAGE_ORDER = [
  "codex-encyclopedie-1A-couverture.png",
  "codex-encyclopedie-1B-cadre-or.png",
  "codex-encyclopedie-1C-fractal-circulaire.png",
  "codex-encyclopedie-1D-texture-noir-dorures.png",
  "codex-encyclopedie-2A-titre.png",
  "codex-encyclopedie-2B-sous-titre.png",
  "codex-encyclopedie-2C-ligne-editoriale.png",
  "codex-encyclopedie-3A-sommaire-ornement.png",
  "codex-encyclopedie-3B-index-visuel.png",
  "codex-encyclopedie-3C-ornements.png",
  "codex-encyclopedie-4A-chapitre1-opening.png",
  "codex-encyclopedie-4B-chapitre1-divider.png",
  "codex-encyclopedie-4C-chapitre1-icons.png",
  "codex-encyclopedie-5A-chapitre2-opening.png",
  "codex-encyclopedie-5B-chapitre2-divider.png",
  "codex-encyclopedie-5C-chapitre2-footer.png",
  "codex-encyclopedie-6A-chapitre3-opening.png",
  "codex-encyclopedie-6B-chapitre3-margin.png",
  "codex-encyclopedie-6C-chapitre3-corners.png",
  "codex-encyclopedie-7A-diagramme-abstract.png",
  "codex-encyclopedie-7B-diagramme-reseau.png",
  "codex-encyclopedie-7C-diagramme-radial.png",
  "codex-encyclopedie-8A-medallions.png",
  "codex-encyclopedie-8B-bordures.png",
  "codex-encyclopedie-8C-textures.png",
  "codex-encyclopedie-9A-annexes-tabs.png",
  "codex-encyclopedie-9B-annexes-grille.png",
  "codex-encyclopedie-9C-annexes-sceaux.png",
  "codex-encyclopedie-10A-credits-header.png",
  "codex-encyclopedie-10B-colophon-divider.png",
  "codex-encyclopedie-10C-colophon-footer.png",
  "codex-encyclopedie-11A-dos-spine.png",
  "codex-encyclopedie-11B-tranche.png",
  "codex-encyclopedie-11C-tranche-top.png",
  "codex-encyclopedie-12A-fermeture-sceau.png",
  "codex-encyclopedie-12B-fermeture-rubans.png",
  "codex-encyclopedie-12C-fermeture-vignette.png",
];

/** Raccourcis formules par plage d’images (symbolique / heuristique). */
export const FORMULA_HINTS_BY_INDEX = {
  0: "Porte d’entrée — φ comme cadre d’harmonie visuelle (proportion, pas loi physique).",
  3: "Texture socle — fond noir/or pour toutes les pages texte.",
  6: "Sommaire — repères vers formules Φ, Ω et modèles circulaires.",
  10: "Chapitre I — Φ = (A×V)/P : intention avant publication (seuils indicatifs).",
  13: "Chapitre II — Richesse = Partage × φ^n (cycles de réciprocité).",
  16: "Chapitre III — Paix = Respiration × φ (rythme et régénération).",
  19: "Diagrammes — Alliance IA : A = (R×C×V)^(1/φ) ; Pont : T×C×φ/F.",
  22: "Glossaire visuel — constantes φ, φ², φ⁵ pour pondération symbolique.",
  25: "Annexes — modèle financier (heures semées, cohérence, jubilé).",
  28: "Colophon — crédits, version PDF, renvoi LICENSE du dépôt.",
  31: "Dos / tranche — édition reliure (export séparé si impression).",
  34: "Fermeture — Ω_v et Ascension : synthèse symbolique, non prédiction scientifique.",
};

/** Mapping des [IMAGE n] du Codex Magique vers fichiers PNG (ordre blueprint). */
export function imageMappingTable() {
  return BLUEPRINT_IMAGE_ORDER.map((filename, i) => ({
    imageNum: i + 1,
    filename,
    code: filename.replace("codex-encyclopedie-", "").replace(".png", ""),
  }));
}
