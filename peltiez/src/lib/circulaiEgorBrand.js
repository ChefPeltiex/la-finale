/** CirculAI = produit territorial / B2B. Egor69 = jumeau numérique divertissement. */
import { CIRCULAI_BRAND, SITE_NAME } from "@/lib/site";

export const CIRCULAI_EGOR_SPLIT = {
  circulai: {
    name: CIRCULAI_BRAND,
    role: "Intelligence circulaire · pilotes territoriaux",
    pitch:
      "Hub mesurable : économie circulaire, Nature Québec, marketplace, preuves en 90 jours — pour municipalités, OBNL et entreprises locales.",
    routes: ["/entreprises", "/pilote", "/portail/nature-quebec", "/marketplace", "/docs/preuves"],
  },
  egor: {
    name: SITE_NAME,
    role: "Jumeau numérique · divertissement & culture",
    pitch:
      "Verse 3D, encyclopédie, codex et univers narratif — pour le public qui explore, pas pour la slide mairie.",
    routes: ["/world", "/boutique", "/encyclopedie.pdf"],
  },
};

export const CIRCULAI_KIT_REGIONAL_PATH = "/docs/circulai-kit-regional";

/** @typedef {Object} CirculaiKitDocMeta
 * @property {string} id
 * @property {string} title
 * @property {string} path
 * @property {string} file
 * @property {string} [summary]
 * @property {string} pageTitle
 * @property {string} description
 */

/** @type {CirculaiKitDocMeta[]} */
export const CIRCULAI_KIT_DOCS = [
  {
    id: "lettre",
    title: "Lettre pilote municipal",
    path: "/docs/circulai/lettre-municipale",
    file: "circulai/lettre-pilote-municipal.md",
    summary: "Lettre type — Ville de Québec, pilote 90 j, un site.",
    pageTitle: "Lettre pilote municipal — CirculAI",
    description:
      "Lettre type pour pilote territorial CirculAI à Québec : OBNL d'abord, un site, trois preuves — sans partenariat HQ ou IQ allégué.",
  },
  {
    id: "plan-affaires",
    title: "Plan d'affaires régional",
    path: "/docs/circulai/plan-affaires",
    file: "circulai/plan-affaires-regional.md",
    summary: "v2 · synthèse exécutive, financier prudent, risques, pilote 90 j, annexes.",
    pageTitle: "Plan d'affaires régional v2 — CirculAI · Québec",
    description:
      "Plan d'affaires professionnel 12 mois : synthèse exécutive, modèle économique, projections prudentes, pilote 90 jours et contexte Ville de Québec (sources documentées).",
  },
  {
    id: "plan-action-quebec",
    title: "Plan d'action Québec 2026",
    path: "/docs/circulai/plan-action-quebec",
    file: "circulai/plan-action-quebec-2026.md",
    summary: "Checklist semaine par semaine — pilote 90 jours.",
    pageTitle: "Plan d'action Québec 2026 — CirculAI",
    description:
      "Checklist opérationnelle 13 semaines pour pilote Ville de Québec : OBNL, preuves, clôture, recherche IQ post-pilote.",
  },
  {
    id: "plan-demo",
    title: "Plan de démonstration (10 min)",
    path: "/docs/circulai/plan-demonstration",
    file: "circulai/plan-demonstration-10min.md",
    summary: "Script démo CirculAI seul + talking points Québec.",
    pageTitle: "Démonstration 10 min — CirculAI · Québec",
    description:
      "Script minute par minute pour cabinet ou OBNL : routes réelles, FAQ tramway, Hydro-Québec et Investissement Québec.",
  },
  {
    id: "valeur-eco-env",
    title: "Valeur · économie & environnement",
    path: "/docs/circulai/valeur-economie-environnement",
    file: "circulai/valeur-economie-environnement.md",
    summary: "Chiffres publics QC (circularité 2,5 %, 685 kg/hab.) + apport CirculAI.",
    pageTitle: "Valeur économique & environnementale — CirculAI",
    description:
      "Indice de circularité, déchets, entreprises et potentiel de pilote — sources RECYC-QUÉBEC et Statistique Québec.",
  },
  {
    id: "main-oeuvre",
    title: "Main-d'œuvre · 40 jours solo",
    path: "/docs/circulai/main-oeuvre",
    file: "circulai/main-oeuvre-40-jours.md",
    summary: "~61k lignes code · équivalent 60–150 k$ CAD (estimation).",
    pageTitle: "Main-d'œuvre — 40 jours solo — CirculAI",
    description:
      "Estimation méthodologique du travail accompli seul : inventaire dépôt, heures équipe, fourchettes marché Québec.",
  },
  {
    id: "partenaires",
    title: "Partenaires à approcher",
    path: "/docs/circulai/partenaires",
    file: "circulai/partenaires-a-approcher.md",
    summary: "Qui fait le terrain pendant que le fondateur code.",
    pageTitle: "Partenaires à approcher — CirculAI",
    description:
      "Liste OBNL, municipal, finance, culture — rôles INTRO, TERRAIN, PREUVES, FIN, COMM, JUR.",
  },
  {
    id: "references-culture",
    title: "Références culturelles",
    path: "/docs/circulai/references-culturelles",
    file: "circulai/references-culturelles.md",
    summary: "Diderot, Werber, Québec — encyclopédie & Egor.",
    pageTitle: "Références culturelles — CirculAI / Egor69",
    description:
      "Filiation Lumières et narration FR — séparation CirculAI opérationnel vs Egor divertissement.",
  },
  {
    id: "artifacts-copilot",
    title: "Artifacts Copilot ↔ kit",
    path: "/docs/circulai/artifacts-copilot",
    file: "circulai/artifacts-copilot.md",
    summary: "5 liens Copilot mappés aux docs du dépôt.",
    pageTitle: "Artifacts Copilot — CirculAI kit",
    description:
      "Correspondance entre partages Microsoft Copilot et documents officiels versionnés du kit régional.",
  },
  {
    id: "equations-systeme",
    title: "Équations → produit",
    path: "/docs/circulai/equations-systeme",
    file: "circulai/equations-systeme.md",
    summary: "8 équations · routes code · métriques pilote 90 j.",
    pageTitle: "Cartographie des équations — CirculAI / Egor69",
    description:
      "Pont entre formules (flux matière, softmax, confiance…) et pages du site — statut live, partiel ou roadmap.",
  },
  {
    id: "equation-pilote",
    title: "Équation du pilote (mairie)",
    path: "/docs/circulai/equation-pilote-municipal",
    file: "circulai/equation-pilote-municipal.md",
    summary: "Ton humble · μ/λ/ε · 90 j · 3 preuves.",
    pageTitle: "Équation du pilote — CirculAI",
    description:
      "Note pour élu : pilote limité, variation terrain assumée, sans promesse scientifique excessive.",
  },
  {
    id: "codex-valorisation",
    title: "Codex · valorisation humble",
    path: "/codex-metaphores#valoriser",
    file: "circulai/codex-valorisation.md",
    summary: "Copy-paste FB, mairie, investisseur · ligne rouge.",
    pageTitle: "Codex valorisation — CirculAI",
    description: "Symboles, équations métaphore, blocs prêts à copier — sans faux chiffres.",
  },
  {
    id: "prompts-ia",
    title: "Prompts IA (guide)",
    path: "/circulai/prompts-ia",
    file: "circulai/prompts-ia-guide.md",
    summary: "Méta-prompt, challenger, mairie, FB, data — sources citées.",
    pageTitle: "Prompts IA — CirculAI · Québec",
    description: "Prompts adaptés du web pour entrepreneurs et pros du digital, recalibrés ton humble.",
  },
];

/** @param {string} id */
export function getCirculaiKitDocById(id) {
  const doc = CIRCULAI_KIT_DOCS.find((d) => d.id === id);
  if (!doc) throw new Error(`CirculAI kit doc inconnu: ${id}`);
  return doc;
}
