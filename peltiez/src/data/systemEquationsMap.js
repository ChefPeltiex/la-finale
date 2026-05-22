/**
 * Pont équations ↔ produit CirculAI / Egor69.
 * Statut : guide d’orchestration — pas des prédictions certifiées sans calibration pilote.
 */

/** @typedef {'circulai' | 'egor' | 'both'} EquationLayer */
/** @typedef {'live' | 'partial' | 'roadmap'} ImplementationStatus */

/**
 * @typedef {Object} SystemEquationEntry
 * @property {string} id
 * @property {string} nameFr
 * @property {string} formula
 * @property {string} domain
 * @property {EquationLayer} layer
 * @property {ImplementationStatus} status
 * @property {string[]} productPaths
 * @property {string[]} codeRefs
 * @property {string} pilotMetric
 */

/** @type {SystemEquationEntry[]} */
export const SYSTEM_EQUATIONS_MAP = [
  {
    id: "matter-flux",
    nameFr: "Flux matière",
    formula: "ΔM = M_in − M_out − M_stock",
    domain: "Économie circulaire · logistique",
    layer: "circulai",
    status: "partial",
    productPaths: ["/marketplace", "/publier", "/impact"],
    codeRefs: ["src/components/UserImpactDashboard.jsx", "src/pages/BesoinsMatch.jsx"],
    pilotMetric: "Objets circulés / détournés du flux déchets (pilote)",
  },
  {
    id: "logistic-growth",
    nameFr: "Croissance logistique",
    formula: "dN/dt = rN(1 − N/K)",
    domain: "Adoption · communauté",
    layer: "circulai",
    status: "partial",
    productPaths: ["/pilote", "/marketplace", "/profil"],
    codeRefs: ["src/components/pilot/Pilot90Panel.jsx", "src/lib/geminiBridge.js"],
    pilotMetric: "Utilisateurs actifs qualifiés sur 90 j",
  },
  {
    id: "exponential-decay",
    nameFr: "Dégradation",
    formula: "C(t) = C₀ e^(−kt)",
    domain: "Patrimoine · maintenance",
    layer: "both",
    status: "roadmap",
    productPaths: ["/atlas", "/portail/nature-quebec"],
    codeRefs: ["src/data/netherealmSingularityFormulas.js"],
    pilotMetric: "Indice « fraîcheur » contenu / fiche (à calibrer)",
  },
  {
    id: "softmax-weight",
    nameFr: "Allocation pondérée",
    formula: "w_i = μ_i e^(−βΦ_i) / Σ_j μ_j e^(−βΦ_j)",
    domain: "Recommandations · arbitrage",
    layer: "circulai",
    status: "live",
    productPaths: ["/marketplace", "/recommandations", "/besoins"],
    codeRefs: [
      "src/pages/BesoinsMatch.jsx",
      "src/pages/Recommandations.jsx",
      "src/pages/BibleEntryDetail.jsx",
    ],
    pilotMetric: "Score de match annonce ↔ besoin (0–100)",
  },
  {
    id: "narrative-tension",
    nameFr: "Tension narrative",
    formula: "T(t) = w_s ∫s(τ)dτ + w_e E(t)",
    domain: "Médias · Verse · codex",
    layer: "egor",
    status: "partial",
    productPaths: ["/world", "/encyclopedie.pdf", "/docs/magique"],
    codeRefs: ["src/world/WorldScene.jsx", "src/components/VictoryWall.jsx"],
    pilotMetric: "Engagement session / progression Verse (qualitatif)",
  },
  {
    id: "trust-dynamics",
    nameFr: "Confiance dynamique",
    formula: "dC/dt = η/(1+e^(−λ(Q−Q₀))) − μC",
    domain: "Réputation · modération",
    layer: "circulai",
    status: "partial",
    productPaths: ["/sentinelle", "/authenticity", "/reporters", "/docs/preuves"],
    codeRefs: [
      "src/pages/ReportersDashboard.jsx",
      "src/lib/radarMetrics.js",
      "src/pages/GitCommits.jsx",
    ],
    pilotMetric: "Score confiance + témoignages signés (pilote)",
  },
  {
    id: "circulation-omega",
    nameFr: "Circulation Ω",
    formula: "Ω̇ = ∮_Γ (flux_utile − perte) · dμ",
    domain: "Métaphore Egor · boucle utile",
    layer: "egor",
    status: "live",
    productPaths: ["/netherealm", "/docs/alliance"],
    codeRefs: ["src/data/netherealmSingularityFormulas.js"],
    pilotMetric: "Affichage symbolique — lien impact CO₂ affiché",
  },
  {
    id: "entropy-shannon",
    nameFr: "Entropie (incertitude)",
    formula: "H(X) = −Σ p(x) log p(x)",
    domain: "Qualité signal · radar",
    layer: "circulai",
    status: "partial",
    productPaths: ["/reporters", "/fact-check"],
    codeRefs: ["src/data/netherealmSingularityFormulas.js", "src/pages/ReportersDashboard.jsx"],
    pilotMetric: "Pertinence alertes / fact-check (score)",
  },
];

export function getEquationsByLayer(layer) {
  return SYSTEM_EQUATIONS_MAP.filter((e) => e.layer === layer || e.layer === "both");
}
