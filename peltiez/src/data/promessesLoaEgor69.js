/**
 * Huit lois structurelles — cadre positif remplaçant le marketing LoA (P1-INS-8).
 * Source unique pour l’UI ; le Codex reprend le même contenu en prose.
 */

export const PROMESSES_LOA_SYNTHESIS =
  "Ces huit promesses ne manifestent ni richesse ni miracles : elles charpentent la responsabilité. L’attraction devient alignement mesurable, la vibration devient cohérence vérifiable, l’univers devient boucle que tu fermes toi-même.";

export const PROMESSES_LOA = [
  {
    id: "alignement",
    title: "Alignement",
    rule: "Intention, action et indicateur pointent dans la même direction avant de décider.",
    egor69: "Charte CirculAI, filtre positif IA et pilote 90 j — une seule ligne de cap.",
    equation: "A = Σ vᵢ · û  (somme vectorielle vers û — modèle symbolique)",
  },
  {
    id: "coherence-vibratoire",
    title: "Cohérence vibratoire",
    rule: "Une session = un ton et un rythme ; réduire le bruit entre ce que tu annonces et ce que tu fais.",
    egor69: "Palette souveraine, disclaimers homogènes — pas de Hz guérison ni promesse miracle.",
    equation: "H↓ quand σ(intention, action) → 0  (entropie métaphorique, pas physique)",
  },
  {
    id: "causalite-active",
    title: "Causalité active",
    rule: "Chaque objectif a une action traçable sous 48 h — le souhait seul ne compte pas.",
    egor69: "Commits Git, preuves `/docs/preuves`, jalons pilote — cause avant effet narratif.",
    equation: "ΔÉtat = f(Action)  ;  ¬(ΔÉtat = f(Souhait))",
  },
  {
    id: "resonance",
    title: "Résonance",
    rule: "Chercher partenaires et outils déjà en phase avec le protocole, sans « aimant univers ».",
    egor69: "Alliance IA à facettes : orchestrateur + spécialistes, pas oracle unique.",
    equation: "R = ⟨s₁, s₂⟩ / (‖s₁‖‖s₂‖)  (similarité — pas attraction magique)",
  },
  {
    id: "non-contradiction",
    title: "Non-contradiction",
    rule: "Si deux priorités se contredisent, trancher par écrit avant d’avancer.",
    egor69: "Glossaire central, anti dark patterns — une vérité affichée à la fois.",
    equation: "¬(P ∧ ¬P)  — cohérence logique des messages publics",
  },
  {
    id: "expansion",
    title: "Expansion",
    rule: "Grandir par itérations mesurées, jamais par promesse exponentielle illusoire.",
    egor69: "MVP, boucles fermées, Ω heuristique — croissance dans le périmètre du pilote.",
    equation: "Cₙ₊₁ = Cₙ + Δₘ  (Δ mesuré, pas manifestation infinie)",
  },
  {
    id: "retour",
    title: "Retour",
    rule: "Clore chaque cycle par revue et réemploi — ce qui sort peut rentrer.",
    egor69: "Jubilé documenté, ΔM, économie circulaire — la boucle respire.",
    equation: "Sortie → Réentrée → ΔM ≥ 0  (masse utile dans la boucle)",
  },
  {
    id: "temporalite-juste",
    title: "Temporalité juste",
    rule: "Jalons datés et renoncement explicite aux délais fantasmés (« timing divin »).",
    egor69: "Tempus Meum, calendrier pilote — Chronos sert, ne domine pas.",
    equation: "τ* = argmin |t_action − t_jalon|  sous contraintes réelles",
  },
];

export const PROMESSES_SELF_CHECK = [
  { value: "aligned", label: "Aligné" },
  { value: "in_progress", label: "En cours" },
  { value: "review", label: "À revoir" },
];
