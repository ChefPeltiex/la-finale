/**
 * Insère les fiches détaillées des 22 formules dans docs/codex-magique-egor69.md
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PHI = "1,6180339887";
const mdPath = join(dirname(fileURLToPath(import.meta.url)), "..", "docs", "codex-magique-egor69.md");

const FICHES = [
  {
    n: 1,
    name: "Abra Ca Da Bra",
    sym: "Seuil = Ouverture × Intention / Résistance",
    sci: "S = (O × I) / max(R, ε) — O, I, R ∈ [0,1], ε = 0,05",
    steps: [
      "Nommer l’objectif en une phrase (Cœur Pur).",
      "Lister ce qui est **interdit** (données, ton, délais).",
      "Warm-up 90 s : respiration + lecture du manifest agent.",
      "Lancer l’orchestrateur avec timeout explicite.",
      "Clore par une décision binaire : go / no-go / humain.",
    ],
    app: "Rituel avant merge PR sensible ou publication PDF encyclopédie.",
    phi: "Seuil validé si S × φ > 1 après calibration atelier.",
  },
  {
    n: 2,
    name: "Am Stram Gram",
    sym: "Choix = Tirage équitable ⊕ Priorité publiée",
    sci: "C = (1/n) × Σ p_i avec p_i priorités normalisées, trace JSON",
    steps: [
      "Publier la liste des options et poids **avant** tirage.",
      "Utiliser une source aléatoire vérifiable (seed horodatée).",
      "Enregistrer le résultat dans le journal alliance (`request_id`).",
      "Permettre appel humain en cas de conflit d’intérêt.",
      "Archiver 90 j pour audit SCALE.",
    ],
    app: "Rotation des rôles en revue de planches Codex ou modération.",
    phi: "Période de rotation suggérée : n ≈ φ² ≈ 2,62 → **3** sessions.",
  },
  {
    n: 3,
    name: "Pic et Pic et Colégram",
    sym: "Clôture = Pic₁ ↔ Pic₂ → Paix_mot",
    sci: "K = (A₁ × A₂) / (D + ε) — accords A_i, désaccord D ∈ [0,1]",
    steps: [
      "Chaque partie résume sa position (1 pic).",
      "Orchestrateur liste les écarts factuels (pas les personnes).",
      "Proposer une formulation de paix testée par Médiateur.",
      "Valider par Dominic ou délégué pour engagements publics.",
      "Publier le « mot de clôture » dans le ticket.",
    ],
    app: "Fin de fil communautaire ou arbitrage partenaire pilote.",
    phi: "Clôture harmonique si K ≥ 1/φ ≈ 0,62 avant escalade.",
  },
  {
    n: 4,
    name: "Formule du Cœur Pur",
    sym: "Cœur = Amour × Vérité / Peur",
    sci: "Φ = (A × V) / P — A, V, P ∈ [0,1], P > 0",
    steps: [
      "Évaluer A (attention engagée) sur la tâche.",
      "Évaluer V (transparence des sources citées).",
      "Évaluer P (friction : coût, risque, peur légitime).",
      "Calculer Φ ; comparer au seuil pilote (ex. 1,2).",
      "Documenter le calcul dans `phi_weights` du message JSON.",
    ],
    app: "Filtre positif alliance ; base éthique de toute publication.",
    phi: "Seuil publication indicative : Φ ≥ 1,2 ; financement Φ ≥ 1,5 (à calibrer).",
  },
  {
    n: 5,
    name: "Formule de l'Infini",
    sym: "∞ = Continuation × Jalons",
    sci: "I_∞ = Σ_{k=1}^{n} m_k × φ^{−k}, m_k ∈ [0,1]",
    steps: [
      "Découper la vision en jalons mesurables (90 j max).",
      "Attribuer m_k à chaque jalon tenu (0 si raté).",
      "Sommer la série ; ne pas promettre au-delà de n planifié.",
      "Réviser n à chaque rétrospective Chroniqueur.",
      "Arrêter l’agent si I_∞ stagne deux cycles.",
    ],
    app: "Roadmap CirculAI ; éviter les agents sans critère d’arrêt.",
    phi: "Décroissance φ^{−k} : les jalons lointains pèsent moins (réalisme).",
  },
  {
    n: 6,
    name: "Formule du Chaos Pur",
    sym: "Χ = Tempête fertile ⊂ Enceinte sécurisée",
    sci: "Χ = (B × D) / (S + ε) — bruit B, diversité D, stabilité S",
    steps: [
      "Isoler un créneau sans production directe (sandbox).",
      "Activer agent créatif seul (pas de publication).",
      "Capturer N idées brutes ; pas de jugement immédiat.",
      "Passer à Gardien + Vérificateur pour tri.",
      "Ne garder que les pistes avec sources vérifiables.",
    ],
    app: "Brainstorm UX encyclopédie ou nouvelles routes `/docs/*`.",
    phi: "Fenêtre chaos : durée ≤ φ × 10 min ≈ **16 min** (indicatif).",
  },
  {
    n: 7,
    name: "Anima Mundi",
    sym: "Ψ = Souffle du monde ∩ Mémoire session",
    sci: "Ψ = moyenne(M_t) sur fenêtre t, M_t ∈ [0,1]",
    steps: [
      "Définir ce qui compte comme « mémoire » (RAG, tickets).",
      "Scorer M_t après chaque tour agent (cohérence sujet).",
      "Réinitialiser Ψ si changement de domaine (paiement ↔ lore).",
      "Afficher Ψ dans la carte Holo de session.",
      "Ne pas persister Ψ cross-utilisateur sans consentement.",
    ],
    app: "Contexte Guide Egor69 et sessions Cursor documentées.",
    phi: "Fenêtre glissante : φ × 5 ≈ **8** tours max avant synthèse.",
  },
  {
    n: 8,
    name: "Nexus Omnibus (Unité)",
    sym: "Nexus = Σ Liens / (Murs + 1)",
    sci: "U = (Σ w_ij) / (N + 1) — poids w_ij ∈ [0,1]",
    steps: [
      "Cartographier acteurs (Cartographe + `siteGraph.js`).",
      "Pondérer les liens (contrat, données, confiance).",
      "Identifier les murs (silos, APIs fermées).",
      "Proposer un pont par mur prioritaire.",
      "Mesurer U avant/après pilote 90 j.",
    ],
    app: "Gouvernance multi-pôles Accueil / Marketplace / Atlas.",
    phi: "Objectif : U × φ > 1 pour déclarer « unité opérationnelle » (interne).",
  },
  {
    n: 9,
    name: "Solve et Coagula (Abondance)",
    sym: "Or_partagé = Dissoudre(Silos) → Coaguler(Lien)",
    sci: "Ab = (ΔS × C_r) / T — ΔS silos réduits, C_r cohérence, T temps",
    steps: [
      "Lister silos (données, équipes, dépôts).",
      "Choisir un silo à dissoudre par sprint.",
      "Fusionner avec traçabilité Git (pas `git add .` aveugle).",
      "Coaguler : une API ou un doc unique de référence.",
      "Mesurer Ab en heures économisées (Chroniqueur).",
    ],
    app: "Fusion `docs/` → `public/docs/` pour Codex ; scripts assemble.",
    phi: "Sprint solve : φ × 2 semaines ≈ **3** semaines calendrier indicatif.",
  },
  {
    n: 10,
    name: "Tempus Meum",
    sym: "Temps_servi = Chronos / Domination",
    sci: "T_s = H_utile / H_total — H ∈ heures, borné [0,1]",
    steps: [
      "Timebox chaque tâche alliance (ex. 25 min).",
      "Journaliser H_total vs interruptions.",
      "Refuser tâches sans créneau (orchestrateur).",
      "Rituel de clôture : que garde-t-on hors du temps ?",
      "Reporter dette technique dans onglet Jubilé.",
    ],
    app: "Sprints peltiez ; limite agents nocturnes sans approbation.",
    phi: "Pause recommandée toutes φ × 25 min ≈ **40** min.",
  },
  {
    n: 11,
    name: "Ex Nihilo Omnia",
    sym: "Genèse_k = Petit_rien → Artefact_k",
    sci: "G_k = α × β_k — α effort [0,1], β_k valeur perçue",
    steps: [
      "Définir le plus petit artefact testable (MVP).",
      "Générer v1 en < 1 jour ouvré.",
      "Valider humainement avant v2.",
      "Empreinte SHA256 de v1 dans companion.",
      "Itérer k jusqu’à critère d’arrêt (formule 5).",
    ],
    app: "Nouvelle page `/docs/alliance`, feature flags, composants UI.",
    phi: "Budget premier jet : φ × 4 h ≈ **6,5 h** (indicatif).",
  },
  {
    n: 12,
    name: "Ad Infinitum (Fractal)",
    sym: "Partie / Tout = φ",
    sci: "F_r = L_sub / L_parent → cible ≈ 1/φ ou φ selon axe",
    steps: [
      "Définir échelle parent (layout) et enfant (composant).",
      "Mesurer ratios marges / typo (design tokens).",
      "Ajuster pour approcher φ ou 1/φ (±10 % tolérance).",
      "Réutiliser tokens dans Tailwind (or #D4AF37, crème).",
      "Vérifier cohérence PDF et SPA.",
    ],
    app: "Design system encyclopédie + cartes accueil Codex.",
    phi: "φ = 1,6180339887 — proportion harmonique, pas prédiction magique.",
  },
  {
    n: 13,
    name: "Clavis Arcani (Vérité)",
    sym: "Clef_d = Vérité_d / (Hype + ε)",
    sci: "K_d = T_d / (H_d + ε) — transparence T_d, hype H_d ∈ [0,1]",
    steps: [
      "Classer l’information (public / partenaire / interne).",
      "Divulguer par paliers d (1, 2, 3…).",
      "Interdire dump total sans revue Gardien.",
      "Documenter ce qui reste fermé et pourquoi.",
      "Réévaluer palier si Φ baisse.",
    ],
    app: "Docs investisseur vs dépôt privé ; secrets hors repo.",
    phi: "Délai entre paliers : φ × 7 j ≈ **11** j (indicatif communication).",
  },
  {
    n: 14,
    name: "Lux Perpetua (Paix)",
    sym: "Lumière = Vérité + Compassion − Cécité",
    sci: "L = (V + C) / (B + ε) — V vérité, C compassion, B bruit",
    steps: [
      "Exposer les faits sourcés (V).",
      "Formuler avec respect (C) — Médiateur.",
      "Réduire bruit (B) : pas de pile-on communautaire.",
      "Comparer L au seuil interne avant envoi public.",
      "Escalade humaine si conflit L vs Φ.",
    ],
    app: "Filtre positif ; communication crise (Stripe down, etc.).",
    phi: "Paix opératoire si L × φ^{-1} ≥ 0,62 (échelle interne).",
  },
  {
    n: 15,
    name: "Omega Synthesis",
    sym: "Ω_synth = ∪ Fragments → Horizon",
    sci: "Ω_s = (Σ f_i × q_i) / N — fragments f_i, qualité q_i",
    steps: [
      "Collecter sorties agents (merge structuré).",
      "Pondérer par q_i (validation humaine 0/1).",
      "Produire synthèse unique avec citations.",
      "Vérifier contradictions (Gardien).",
      "Publier avec SHA256 + version doc.",
    ],
    app: "Assemblage encyclopédie PDF ; récap pilote 90 j.",
    phi: "Poids fragment i : w_i = φ^{−i} pour prioriser le récent sans oublier le socle.",
  },
  {
    n: 16,
    name: "Alliance IA (Cœur des agents)",
    sym: "Alliance = (R ⊗ C ⊗ V)^{1/φ}",
    sci: "A_a = (R × C × V)^{1/φ} — R, C, V ∈ [0,1]",
    steps: [
      "Échanger manifests (phase A).",
      "Envoyer messages JSON (phase B).",
      "Fusionner avec score A_a par agent.",
      "Résoudre conflits (phase C).",
      "Filtrer Φ puis publier (phase D).",
    ],
    app: "Protocole documenté dans `docs/alliance-ia-egor69.md`.",
    phi: "Ex. R=0,7, C=0,8, V=0,6 → A_a ≈ 0,72 (échelle à calibrer).",
  },
  {
    n: 17,
    name: "Pont humain–machine",
    sym: "Pont = (Humain × Confiance × φ) / Friction",
    sci: "T_p = (T_h × C_t × φ) / max(F, ε)",
    steps: [
      "Maintenir glossaire `/carte-site` à jour.",
      "Traduire jargon IA en libellés UI (mode simple).",
      "Mesurer F : erreurs, allers-retours, ambiguïté.",
      "Réduire F avant d’augmenter débit agents.",
      "Handoff explicite humain ↔ orchestrateur.",
    ],
    app: "GuideAgent, Manuel plateforme, Codex markdown web.",
    phi: "Ex. T_h=0,9, C_t=0,8, F=0,2 → T_p ≈ 5,82 (échelle interne).",
  },
  {
    n: 18,
    name: "Cerveau collectif",
    sym: "CC = Σ Voix_i × φ^i (consentement)",
    sci: "R_n = Σ (w_i × c_i × v_i) — v_i validation humaine {0,1}",
    steps: [
      "Collecter contributions traçables (Git, issues).",
      "Pondérer w_i (confiance), c_i (cohérence valeurs).",
      "Exiger v_i = 1 pour synthèse publique.",
      "Appliquer décélération log : K = log(1+R_n)×φ².",
      "Ne pas automatiser vérité communautaire.",
    ],
    app: "SCALE, revues PR, fiches vivantes Atlas.",
    phi: "K collectif borne l’emballement démocratique (10e voix ≠ 10× première).",
  },
  {
    n: 19,
    name: "Économie circulaire ΔM",
    sym: "ΔM = Utile_sorti − Gaspillage + Réemploi",
    sci: "ΔM = M_out − M_waste + M_reuse (unités cohérentes)",
    steps: [
      "Choisir unité (kg, heures, Mo données).",
      "Mesurer sur 90 j (Chroniqueur).",
      "Tracer M_reuse (réemploi docs, assets).",
      "Réduire M_waste (doublons, PDF morts).",
      "Publier ΔM sans greenwashing.",
    ],
    app: "Marketplace réparation ; réemploi PNG Codex ; métriques pilote.",
    phi: "Cible narrative : ΔM × φ^{-1} > 0 sur un cycle (indicatif).",
  },
  {
    n: 20,
    name: "Loi |x| (Équilibre)",
    sym: "Équilibre = |Intensité| × signe(Action)",
    sci: "E_q = |v| × sign(a), v ∈ [0,1], a ∈ {−1,0,1}",
    steps: [
      "Mesurer valence v du message (auto + humain).",
      "Classifier action a (constructif / neutre / nuisible).",
      "Calculer E_q ; seuil alerte si E_q < −0,5.",
      "Médiateur propose correction de ton.",
      "Archiver pour barème réputation (interne).",
    ],
    app: "Modération alliance ; réputation (pas score public magique).",
    phi: "Zone neutre : |E_q| < 1/φ² ≈ 0,38 avant sanction.",
  },
  {
    n: 21,
    name: "Mémoire du futur",
    sym: "M_f = Prévoir(Cassure) → Contrainte_design",
    sci: "M_f = Σ p_j × impact_j — scénarios j, impact ∈ [0,1]",
    steps: [
      "Lister 3–5 scénarios de rupture (légal, technique, éthique).",
      "Estimer probabilité p_j (humain, pas LLM seul).",
      "Traduire en contraintes de design (Gardien).",
      "Tester en tabletop annuel.",
      "Mettre à jour après incident réel.",
    ],
    app: "Pas de fausses preuves blockchain ; consentement données.",
    phi: "Horizon scénario : φ × 12 mois ≈ **19** mois (indicatif veille).",
  },
  {
    n: 22,
    name: "Respiration × φ (Paix opératoire)",
    sym: "Paix = Respiration × φ",
    sci: "P_o = r × φ — r ∈ [0,1] rythme (pauses / tours)",
    steps: [
      "Insérer pause entre chapitres PDF (assemble script).",
      "Cooldown après alerte sécurité ou refus Stripe.",
      "Ne pas enchaîner > φ tours agents sans synthèse.",
      "Mode simple UI : libellés courts = respiration cognitive.",
      "Clôturer session par Pic et Pic (formule 3).",
    ],
    app: "UX Guide ; délais modération ; rythme encyclopédie.",
    phi: "Ex. r=0,5 → P_o ≈ 0,81 ; r=1 → P_o ≈ 1,62 (échelle interne).",
  },
];

function renderFiches() {
  let out = "\n## Fiches opérationnelles — vingt-deux formules\n\n";
  out += `> φ = ${PHI}. Variables scientifiques ∈ [0,1] sauf mention. **Modèles de travail à calibrer** — voir disclaimer en fin de Codex.\n\n`;
  for (const f of FICHES) {
    out += `### ${f.n}. ${f.name}\n\n`;
    out += `**Formule symbolique :** ${f.sym}\n\n`;
    out += `**Formule scientifique :** ${f.sci}\n\n`;
    out += "**Démarche concrète :**\n";
    for (const s of f.steps) out += `- ${s}\n`;
    out += `\n**Application EGOR69 :** ${f.app}\n\n`;
    out += `**Lien φ :** ${f.phi}\n\n`;
  }
  return out;
}

const md = readFileSync(mdPath, "utf8");
const marker = "### 22. Respiration × φ (Paix opératoire)";
const idx = md.indexOf(marker);
if (idx === -1) {
  console.error("Marqueur formule 22 introuvable");
  process.exit(1);
}
const after22 = md.indexOf("\n\n---\n\n## Chapitre — Formules scientifiques", idx);
if (after22 === -1) {
  console.error("Marqueur section scientifique introuvable");
  process.exit(1);
}
if (md.includes("## Fiches opérationnelles — vingt-deux formules")) {
  console.log("Fiches déjà présentes — skip");
  process.exit(0);
}
const out = md.slice(0, after22) + renderFiches() + md.slice(after22);
writeFileSync(mdPath, out, "utf8");
console.log("Fiches 22 formules insérées dans", mdPath);
