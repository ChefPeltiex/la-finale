/**
 * Sept formules affichées dans le Netherealm — lisibles intégralement avec Pass Souverain.
 * Encodage « Base44 » côté UI = chaîne dérivée Base64 (couche fiction / cosmétique).
 */

export const SINGULARITY_FORMULAS = [
  {
    id: "euler",
    title: "Identité d’Euler",
    formula: "e^(iπ) + 1 = 0",
    note: "Anneau où imaginaire et réel se rejoignent sans bruit.",
  },
  {
    id: "gauss",
    title: "Intégrale de Gauss",
    formula: "∫_{−∞}^{∞} e^(−x²) dx = √π",
    note: "Normalisation du continuum — tout est sous la cloche.",
  },
  {
    id: "shannon",
    title: "Entropie de Shannon",
    formula: "H(X) = − Σ_x p(x) · log p(x)",
    note: "Mesure du soupçon : ordre et surprise dans le même cadre.",
  },
  {
    id: "bayes",
    title: "Théorème de Bayes",
    formula: "P(A|B) = P(B|A) · P(A) / P(B)",
    note: "Retournement des preuves : conditionner sans dogme.",
  },
  {
    id: "lorentz",
    title: "Facteur de Lorentz",
    formula: "γ = 1 / √(1 − v²/c²)",
    note: "Quand la vitesse courbe la simultanéité.",
  },
  {
    id: "golden",
    title: "Nombre d’or",
    formula: "φ = (1 + √5) / 2",
    note: "Proportion qui refuse la médiocrité.",
  },
  {
    id: "igor-omega",
    title: "Constante de circulation Ω",
    formula: "Ω̇ = ∮_Γ (flux_utile − perte) · dμ",
    note: "Fiction métrique Egor69 : boucler utile vs gaspillage sur un contour Γ.",
  },
];
