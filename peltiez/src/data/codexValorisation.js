/**
 * Blocs copy-paste — valorisation humble (FB, courriel, pitch).
 */
import { ONE_LINK_SPEECH, TEAM_SLOGAN } from "@/lib/codexIntegrity";
import { DELTA_M, NOUVEAU_CHIC } from "@/lib/math/consumerEquations";

export { TEAM_SLOGAN };

/** @type {Array<{ id: string, audience: string, title: string, body: string }>} */
export const COPY_BLOCKS = [
  {
    id: "fb-public",
    audience: "Facebook / citoyen",
    title: "Post court — seconde main Québec",
    body: `Marre du neuf par défaut ? ${NOUVEAU_CHIC.plain}

Vente, don, échange, réparation — un fil local à Québec. Inscription gratuite en moins d'une minute.
${ONE_LINK_SPEECH.publicUrl}

${TEAM_SLOGAN}`,
  },
  {
    id: "email-obnl",
    audience: "OBNL / partenaire terrain",
    title: "Courriel d'intro (8 lignes)",
    body: `Bonjour,

CirculAI regroupe sur un même site ce que vos membres font déjà : donner, troquer, réparer, vendre d'occasion — avec une lecture simple des flux (${DELTA_M.plain}).

Nous cherchons un pilote territorial humble : 90 jours, trois preuves vérifiables, sans promesse gonflée.

Dossier : ${ONE_LINK_SPEECH.decideurUrl}

Merci d'écouter avant d'ouvrir le kit complet.`,
  },
  {
    id: "mairie-elevator",
    audience: "Mairie / élu",
    title: "Ascenseur 60 s",
    body: ONE_LINK_SPEECH.speechMairie60s,
  },
  {
    id: "investisseur-hook",
    audience: "Investisseur prudent",
    title: "Accroche — sans hype blockchain",
    body: `Plateforme québécoise en production : ~61k lignes, marketplace locale, kit régional documenté. Deux jumeaux : CirculAI (B2B / pilote) et Egor69 (culture 3D) — même code, rôles séparés.

Démo sérieuse : ${ONE_LINK_SPEECH.decideurUrl}
Public : ${ONE_LINK_SPEECH.entrerUrl}`,
  },
];

/** Liens recommandés par contexte */
export const LINK_PLAYBOOK = [
  { context: "Citoyen curieux", path: "/seconde-main", label: "Page seconde main" },
  { context: "Décideur / OBNL", path: "/docs/circulai-kit-regional", label: "Kit régional" },
  { context: "Élu — équations", path: "/circulai/equation-pilote", label: "Équation pilote" },
  { context: "Symboles & copy", path: "/codex-metaphores", label: "Codex métaphores" },
  { context: "Travailler avec ChatGPT / Cursor", path: "/circulai/prompts-ia", label: "Prompts IA" },
  { context: "Deux mondes", path: "/entrer", label: "Porte d'entrée" },
  { context: "Culture (hors mairie)", path: "/encyclopedie", label: "Encyclopédie" },
];
