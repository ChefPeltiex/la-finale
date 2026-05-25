/** Domaine canonique — `VITE_SITE_URL` en build (ex. circulai.com plus tard), sinon egor69.ca. */
function resolveSiteOrigin() {
  const raw =
    typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL
      ? String(import.meta.env.VITE_SITE_URL).trim()
      : "";
  if (!raw) return "https://egor69.ca";
  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return u.origin;
  } catch {
    return "https://egor69.ca";
  }
}

export const SITE_ORIGIN = resolveSiteOrigin();
export const SUPPORT_EMAIL = "support@egor69.ca";

/** Marque produit (acquisition, SEO, CTA). */
export const CIRCULAI_BRAND = "CirculAI";

/** Tagline vivante — plateforme vivante, pas corporate. */
export const CIRCULAI_TAGLINE =
  "la plateforme vivante où chaque contribution trouve sa place.";

/** Phrase d'accueil hero — ton inclusif, mot directeur VIVANT. */
export const CIRCULAI_HERO_HEADLINE =
  "Ici, chaque contribution circule et trouve sa place.";

/** Sous-titre hero — sobre, territorial, inclusif. */
export const CIRCULAI_HERO_SUBTEXT =
  "Ensemble, nous faisons germer une économie circulaire au Québec — citoyens, OBNL, élus, entreprises locales. Chaque geste résonne dans la communauté.";

/** Invitation de bas de page hero — avant les 4 portes. */
export const CIRCULAI_HERO_INVITATION =
  "Où te situes-tu dans cette symphonie ?";

/** Footer narratif court — ancrage territorial + coopératif. */
export const CIRCULAI_FOOTER_NOTE =
  "CirculAI · Québec · Structure coopérative en devenir · Pilote 90 jours · Données honnêtes";

/** Nom court de l'univers technique (sous-marque). */
export const SITE_NAME = "Egor69";

/** Slogan historique — surfaces internes ; SEO public = CIRCULAI_* ci-dessous. */
export const SITE_TAGLINE =
  "Egor69 — fidèle serviteur de l'humanité pour le service de la planète et de tout l'univers entier";

/** Titre SEO accueil / partages (sans manifeste long). */
export const CIRCULAI_SEO_TITLE = "CirculAI — économie circulaire, pilote Québec";

/** Description SEO accueil — circularité, Québec, pilote 90 jours. */
export const CIRCULAI_SEO_DESCRIPTION =
  "CirculAI : intelligence circulaire au Québec — don, échange, réparation, atlas vivant et pilote 90 jours avec preuves vérifiables. Rejoignez le hub ou explorez l'univers Egor69 (Verse 3D).";

/**
 * Mots-clés SEO (méta `keywords`) — courts, alignés CirculAI + Québec + pilote.
 * Google dépriorise cette balise ; sitemap + titres + contenu restent prioritaires.
 */
export const SITE_SEO_KEYWORDS =
  "circulai, économie circulaire, québec, pilote 90 jours, don d'objets, troc, réparation, atlas vivant, egor69, intelligence circulaire, pass souverain";

/** Routes marketing indexables (sitemap statique). */
export const SITEMAP_MARKETING_PATHS = [
  "/entrer",
  "/",
  "/boutique",
  "/pricing",
  "/pilote",
  "/docs/preuves",
  "/portail/nature-quebec",
  "/world",
  "/entreprises",
  "/circulai",
  "/docs/circulai-kit-regional",
  "/docs/circulai/plan-affaires",
];

/** Fil conducteur narratif et éthique — réutilisable dans SEO, onboarding et HUD. */
export const WORLD_ETHOS = {
  tagline: SITE_TAGLINE,
  /** Mandat prioritaire : une seule vérité produit à travers l’ensemble des surfaces. */
  absoluteCohesion: [
    "Cohérence absolue de toute la plateforme : prioritaire et primordiale — navigation, libellés, schémas de données, narration du Verse, API, SEO et documentation doivent converger ; nulle zone ne se contredit avec une autre sans signal explicite.",
    "Tout écart intentionnel (démo, bêta, fiction, projection) doit être nommé au bon endroit : jamais deux vérités implicites pour le même geste utilisateur (paiement, donnée personnelle, promesse d’impact, tirage divinatoire présenté comme mesure objective).",
  ],
  /** Égalité du périmètre : même promesse de cadre pour chaque utilisateur (réalité technique + narration). */
  personalGarden: [
    "Chaque citoyen possède le même socle de protection narrative : charte lisible, sécurité documentée, pas de double débit moral entre ‘gros’ et ‘petit’ monde.",
    "Les préférences, XP locaux et ‘lutins’ symboliques restent ton jardin : agrégation minimale, secrets hors navigateur, HTTPS imposé en production.",
    "Les routes immersives (intro, Verse, Outworld fictif) ne dispensent pas des règles — elles partagent le même filet de transparence et les mêmes garde-fous.",
  ],
  /** Paix réelle + joie : la fiction absorbe la tension pour qu’elle ne se retourne pas contre les vivants. */
  catharsisAndCare: [
    "Entraide et partage sont au centre : plaisir consenti, don et échange honnêtes, recherche du bonheur sans mépris ni rabaissement d’autrui.",
    "Les zones ludiques fictives servent à exprimer irritation, sarcasme ou « méchant » intérieur en symboles reversibles — pour soulager la pression sans blesser personne dans la rue.",
    "Réduire les gestes violents dans le monde réel passe aussi par des valves numériques sûres, par la parole et par l’économie circulaire ; ce dispositif ne remplace pas une thérapie ni une urgence médico-sociale.",
  ],
  /** Risques courants → réponse préparée (transparence ops, pas promesse magique). */
  operationalPlaybook: [
    {
      risk: "Alerte dépendance npm (audit)",
      remedy: "Mettre à jour en mineur d’abord, relire le changelog, relancer `npm run verify` avant déploiement.",
    },
    {
      risk: "Secret Stripe ou clé API fuite dans le bundle",
      remedy: "Vérifier qu’aucune variable `VITE_*` sensible ; garder les secrets sur `server/` + `.env.server` hors Git.",
    },
    {
      risk: "CORS / origine non autorisée sur checkout",
      remedy: "Aligner `STRIPE_ALLOWED_ORIGINS` et `PUBLIC_SITE_URL` avec l’URL réelle (prod + préprod).",
    },
    {
      risk: "Spam sur endpoint CRM `/api/crm/lead`",
      remedy: "Rate-limit côté API ; persistance locale `server/data/crm-leads.ndjson` (hors Git) ; captcha si abus ; base légale RGPD pour prospection.",
    },
    {
      risk: "Hook React conditionnel (crash runtime)",
      remedy: "Toujours appeler les hooks au sommet du composant, avant tout `return` anticipé.",
    },
    {
      risk: "Raccourcis de finition (tests sautés, dette technique, démo vendue comme prod)",
      remedy:
        "Traiter la release comme une recette versionnée : `npm run verify`, revue des changements critiques, pas de « assurance narrative » à la place de la qualité réelle.",
    },
    {
      risk: "Incohérence entre deux surfaces (libellés, promesses, états réels)",
      remedy:
        "Aligner routes, `siteGraph`, charte et `WORLD_ETHOS` ; une source de vérité par domaine (ex. tarifs = `/pricing` + Stripe) ; marquer démo / fiction partout où ça diverge.",
    },
    {
      risk: "XP / données locales corrompues (localStorage)",
      remedy: "Déjà isolées par préfixe `igor:` ; script de reset utilisateur = effacer clés préfixées ou onglet dédié futur.",
    },
  ],
  charter: [
    "Cohérence absolue : priorité sur toute autre ambition esthétique ou marketing — une promesse affichée doit tenir sur chaque route et chaque couche (2D, 3D, e-mail, API).",
    "La plateforme refuse les métriques d’audience inventées : ce qui ressemble à une statistique doit être sourçable ou explicitement fictif.",
    "Chaque domaine spirituel, ésotérique ou divinatoire (tarot, astrologie, tirages, rêves…) est contextualisé : histoire, psychologie, risques, cadre légal — jamais une promesse de vérité surnaturelle mesurable ni une exploitation de la peur.",
    "L’open world WebGL sert de vestibule spatial vers des fonctions réelles : marketplace, atlas, encyclopédies, genome — pas un décor vide.",
    "Les engagements contractuels et de paiement sont rédigés sans chantage émotionnel ; Stripe encadre les flux décrits dans la documentation.",
    "La richesse du contenu croît par contributions curatées et communautaires contrôlées — pas par scraping irresponsable de tiers protégés.",
    "Les espaces de défoulement virtuel (Outworld, arène narrative) restent sans cible humaine et sans incitation au danger : ils protègent la dignité réelle en dérivant la charge vers le jeu.",
  ],
};
