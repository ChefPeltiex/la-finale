/**
 * Carte du site pilotée par données : groupes, nœuds, liens latéraux pour navigation contextuelle.
 * Mettre à jour lorsque de nouvelles routes majeures sont ajoutées (voir `App.jsx` + `Layout.jsx` : routes statiques encyclopédie avant `:id`).
 */

export const SITE_GROUP_ORDER = [
  "coeur",
  "marche",
  "atlas_doctrine",
  "creation_3d",
  "confiance",
  "communaute",
  "pilotage",
];

export const SITE_GROUPS = {
  coeur: { label: "Univers — cœur & accueil", description: "Entrées principales et documentation." },
  marche: { label: "Marché & profil", description: "Offres, publication, identité." },
  atlas_doctrine: { label: "Atlas & doctrine", description: "Savoirs vivants, encyclopédies, textes fondateurs." },
  creation_3d: { label: "Création & 3D", description: "Verse WebGL, Unreal / glTF, mondes." },
  confiance: { label: "Confiance & transparence", description: "Vérification, sécurité, légal." },
  communaute: { label: "Communauté & contenu", description: "Fil, blog, jeux, bien-être." },
  pilotage: { label: "Pilotage & soutien", description: "Tarifs, soutien, métriques, intégrations." },
};

/** @type {Array<{ id: string, path: string, label: string, groupId: keyof SITE_GROUPS, relatedPaths?: string[] }>} */
export const SITE_NODES = [
  { id: "accueil", path: "/", label: "Accueil", groupId: "coeur", relatedPaths: ["/world", "/marketplace", "/manuel", "/carte-site"] },
  { id: "carte", path: "/carte-site", label: "Carte du site & liens", groupId: "coeur", relatedPaths: ["/manuel", "/outils-integration"] },
  { id: "manuel", path: "/manuel", label: "Manuel plateforme", groupId: "coeur", relatedPaths: ["/carte-site", "/hub-souverain", "/security"] },
  { id: "vision", path: "/vision", label: "Vision", groupId: "coeur", relatedPaths: ["/about", "/charte", "/pricing"] },
  { id: "about", path: "/about", label: "À propos", groupId: "coeur", relatedPaths: ["/contact", "/legal"] },
  { id: "contact", path: "/contact", label: "Contact", groupId: "coeur", relatedPaths: ["/soutien", "/security"] },

  { id: "marketplace", path: "/marketplace", label: "Marketplace", groupId: "marche", relatedPaths: ["/publier", "/profil", "/atlas"] },
  { id: "publier", path: "/publier", label: "Publier une annonce", groupId: "marche", relatedPaths: ["/marketplace", "/profil"] },
  { id: "profil", path: "/profil", label: "Mon profil", groupId: "marche", relatedPaths: ["/mon-univers", "/vault", "/alerts"] },
  { id: "mon-univers", path: "/mon-univers", label: "Mon univers", groupId: "marche", relatedPaths: ["/avatar-creator", "/world", "/manuel"] },
  { id: "avatar", path: "/avatar-creator", label: "Studio avatar", groupId: "marche", relatedPaths: ["/mon-univers", "/profil"] },
  { id: "alerts", path: "/alerts", label: "Mes alertes", groupId: "marche", relatedPaths: ["/marketplace", "/profil"] },
  { id: "vault", path: "/vault", label: "Mon coffre", groupId: "marche", relatedPaths: ["/profil", "/security"] },

  { id: "atlas", path: "/atlas", label: "Atlas vivant", groupId: "atlas_doctrine", relatedPaths: ["/encyclopedie-biblique", "/cosmic-portal", "/manuel"] },
  { id: "bible", path: "/encyclopedie-biblique", label: "Encyclopédie biblique", groupId: "atlas_doctrine", relatedPaths: ["/atlas", "/blog"] },
  { id: "cosmic", path: "/cosmic-portal", label: "Portail cosmique", groupId: "atlas_doctrine", relatedPaths: ["/atlas", "/world"] },

  { id: "world", path: "/world", label: "Verse 3D (WebGL)", groupId: "creation_3d", relatedPaths: ["/ue-aiouy", "/outils-integration", "/pantheon-3d", "/bien-etre-lexique", "/arts-divinatoires-lexique", "/mythologies"] },
  { id: "ueaiouy", path: "/ue-aiouy", label: "UEAIOUY — glTF / Unreal", groupId: "creation_3d", relatedPaths: ["/world", "/outils-integration", "/pantheon-3d"] },
  { id: "pantheon3d", path: "/pantheon-3d", label: "Panthéon 3D", groupId: "creation_3d", relatedPaths: ["/pantheon-renders", "/world"] },
  { id: "pantheonR", path: "/pantheon-renders", label: "Panthéon renders", groupId: "creation_3d", relatedPaths: ["/pantheon-3d", "/atlas"] },
  { id: "outils", path: "/outils-integration", label: "Outils & intégrations", groupId: "creation_3d", relatedPaths: ["/carte-site", "/hub-fondations", "/security"] },

  { id: "auth", path: "/authenticity", label: "Authenticity", groupId: "confiance", relatedPaths: ["/fact-check", "/sentinelle"] },
  { id: "fact", path: "/fact-check", label: "Fact check", groupId: "confiance", relatedPaths: ["/authenticity", "/transparency-log"] },
  { id: "transp", path: "/transparency-log", label: "Transparency log", groupId: "confiance", relatedPaths: ["/security", "/fact-check"] },
  { id: "sentinelle", path: "/sentinelle", label: "Sentinelle", groupId: "confiance", relatedPaths: ["/security", "/authenticity"] },
  { id: "security", path: "/security", label: "Sécurité", groupId: "confiance", relatedPaths: ["/legal", "/manuel", "/hub-souverain"] },
  { id: "legal", path: "/legal", label: "Propriété intellectuelle", groupId: "confiance", relatedPaths: ["/security", "/charte"] },
  { id: "charte", path: "/charte", label: "Charte", groupId: "confiance", relatedPaths: ["/legal", "/vision"] },

  { id: "mythologies", path: "/mythologies", label: "Mythologies comparées", groupId: "atlas_doctrine", relatedPaths: ["/world", "/pantheon-3d", "/esotericism", "/atlas", "/bien-etre-lexique", "/arts-divinatoires-lexique"] },
  { id: "bienEtreLex", path: "/bien-etre-lexique", label: "Lexique bien-être & médecines douces", groupId: "atlas_doctrine", relatedPaths: ["/wellness", "/wellness-quests", "/world", "/esotericism", "/mythologies", "/arts-divinatoires-lexique"] },
  { id: "divLex", path: "/arts-divinatoires-lexique", label: "Lexique arts divinatoires", groupId: "atlas_doctrine", relatedPaths: ["/arts-divinatoires", "/esotericism", "/carte-ciel", "/numerology", "/world", "/bien-etre-lexique"] },

  { id: "feed", path: "/feed", label: "Community feed", groupId: "communaute", relatedPaths: ["/blog", "/actualite"] },
  { id: "blog", path: "/blog", label: "Blog", groupId: "communaute", relatedPaths: ["/feed", "/actualite"] },
  { id: "actu", path: "/actualite", label: "Actualité", groupId: "communaute", relatedPaths: ["/feed", "/blog"] },
  { id: "wellness", path: "/wellness", label: "Wellness", groupId: "communaute", relatedPaths: ["/bien-etre-lexique", "/wellness-quests", "/jeu", "/sanctuary"] },
  { id: "jeu", path: "/jeu", label: "Games", groupId: "communaute", relatedPaths: ["/wellness", "/world"] },
  { id: "sanctuary", path: "/sanctuary", label: "Sanctuary animaux", groupId: "communaute", relatedPaths: ["/wellness", "/cosmic-portal"] },

  { id: "pricing", path: "/pricing", label: "Pricing", groupId: "pilotage", relatedPaths: ["/soutien", "/abonnement", "/dashboard-royal"] },
  { id: "soutien", path: "/soutien", label: "Soutien", groupId: "pilotage", relatedPaths: ["/pricing", "/contact"] },
  { id: "abonnement", path: "/abonnement", label: "Abonnement", groupId: "pilotage", relatedPaths: ["/pricing", "/profil"] },
  { id: "dash", path: "/dashboard-royal", label: "Dashboard royal", groupId: "pilotage", relatedPaths: ["/pricing", "/plateforme/temps-reel"] },
  { id: "live", path: "/plateforme/temps-reel", label: "Métriques temps réel", groupId: "pilotage", relatedPaths: ["/dashboard-royal", "/hub-souverain"] },
  { id: "hubf", path: "/hub-fondations", label: "Hub fondations (parcours)", groupId: "pilotage", relatedPaths: ["/hub-souverain", "/manuel", "/carte-site"] },
  { id: "hubs", path: "/hub-souverain", label: "Hub souverain (noyau)", groupId: "pilotage", relatedPaths: ["/security", "/hub-fondations", "/manuel"] },

  { id: "artisanWs", path: "/artisan-workshop", label: "Atelier artisan", groupId: "communaute", relatedPaths: ["/artisans", "/marketplace"] },
  { id: "corpPart", path: "/corporate-partners", label: "Partenaires corporate", groupId: "pilotage", relatedPaths: ["/partenaires", "/vision"] },
  { id: "divArts", path: "/arts-divinatoires", label: "Arts divinatoires", groupId: "communaute", relatedPaths: ["/arts-divinatoires-lexique", "/numerology", "/carte-ciel", "/esotericism"] },
  { id: "globDash", path: "/global-dashboard", label: "Dashboard global", groupId: "pilotage", relatedPaths: ["/dashboard-royal", "/plateforme/temps-reel"] },
  { id: "goldenEye", path: "/golden-eye", label: "Golden Eye", groupId: "communaute", relatedPaths: ["/jeu", "/world"] },
  { id: "infLeg", path: "/infinite-legions", label: "Infinite Legions", groupId: "communaute", relatedPaths: ["/test-your-might", "/jeu"] },
  { id: "liveFd", path: "/live-feed", label: "Live feed", groupId: "communaute", relatedPaths: ["/feed", "/actualite"] },
  { id: "locMap", path: "/local-map", label: "Carte locale", groupId: "marche", relatedPaths: ["/marketplace", "/city-hubs"] },
  { id: "microComm", path: "/micro-communities", label: "Micro-communities", groupId: "communaute", relatedPaths: ["/communautes", "/feed"] },
  { id: "piliersLegacy", path: "/piliers-classique", label: "Piliers (classique)", groupId: "atlas_doctrine", relatedPaths: ["/piliers", "/vision"] },
  { id: "reput", path: "/reputation", label: "Réputation", groupId: "marche", relatedPaths: ["/profil", "/marketplace"] },

  // — Compléments additifs (résolvent des `relatedPaths` orphelins + densifient la navigation contextuelle).
  { id: "piliers144k", path: "/piliers", label: "Piliers 144K", groupId: "atlas_doctrine", relatedPaths: ["/piliers-classique", "/vision", "/charte"] },
  { id: "partenaires", path: "/partenaires", label: "Partenaires", groupId: "pilotage", relatedPaths: ["/corporate-partners", "/vision", "/contact"] },
  { id: "communautes", path: "/communautes", label: "Micro-communautés", groupId: "communaute", relatedPaths: ["/micro-communities", "/feed", "/world"] },
  { id: "numerology", path: "/numerology", label: "Numérologie", groupId: "communaute", relatedPaths: ["/arts-divinatoires", "/arts-divinatoires-lexique", "/numerology-paranormal-dashboard", "/carte-ciel"] },
  { id: "carteCiel", path: "/carte-ciel", label: "Carte du ciel", groupId: "communaute", relatedPaths: ["/numerology", "/arts-divinatoires", "/arts-divinatoires-lexique", "/cosmic-portal"] },
  { id: "tym", path: "/test-your-might", label: "Test Your Might", groupId: "communaute", relatedPaths: ["/infinite-legions", "/jeu", "/golden-eye"] },
  { id: "artisans", path: "/artisans", label: "Hub artisans", groupId: "communaute", relatedPaths: ["/artisan-workshop", "/marketplace", "/hub-reparation"] },
  { id: "cityHubs", path: "/city-hubs", label: "City hubs", groupId: "marche", relatedPaths: ["/local-map", "/marketplace", "/communautes"] },
  { id: "wellnessQ", path: "/wellness-quests", label: "Wellness — quêtes", groupId: "communaute", relatedPaths: ["/wellness", "/bien-etre-lexique", "/daily-challenges", "/jeu"] },
  { id: "dailyCh", path: "/daily-challenges", label: "Défis quotidiens", groupId: "communaute", relatedPaths: ["/wellness-quests", "/jeu", "/feed"] },
  { id: "tutorials", path: "/tutorials", label: "Tutoriels", groupId: "coeur", relatedPaths: ["/manuel", "/carte-site", "/outils-integration"] },
  { id: "donations", path: "/donations", label: "Calendrier des dons", groupId: "communaute", relatedPaths: ["/marketplace", "/feed", "/sanctuary"] },
  { id: "credits", path: "/credits", label: "Remerciements", groupId: "coeur", relatedPaths: ["/about", "/vision", "/contact"] },
  { id: "fastTrack", path: "/fast-track", label: "Fast track", groupId: "pilotage", relatedPaths: ["/pricing", "/dashboard-royal", "/manuel"] },
  { id: "shareQuests", path: "/share-quests", label: "Quêtes de partage", groupId: "communaute", relatedPaths: ["/feed", "/jeu", "/wellness-quests"] },
  { id: "repair", path: "/hub-reparation", label: "Hub réparation", groupId: "communaute", relatedPaths: ["/artisans", "/marketplace", "/sanctuary"] },
  { id: "esoterism", path: "/esotericism", label: "Ésotérisme", groupId: "atlas_doctrine", relatedPaths: ["/paranormal-mystique", "/philosophies-beliefs", "/arts-divinatoires", "/arts-divinatoires-lexique", "/bien-etre-lexique"] },
  { id: "paraMyst", path: "/paranormal-mystique", label: "Paranormal & mystique", groupId: "atlas_doctrine", relatedPaths: ["/esotericism", "/numerology-paranormal-dashboard", "/conspiracy-myths"] },
  { id: "philos", path: "/philosophies-beliefs", label: "Philosophies & croyances", groupId: "atlas_doctrine", relatedPaths: ["/esotericism", "/charte", "/vision"] },
  { id: "numParaDash", path: "/numerology-paranormal-dashboard", label: "Tableau numéro & paranormal", groupId: "atlas_doctrine", relatedPaths: ["/numerology", "/paranormal-mystique", "/carte-ciel"] },
  { id: "consMyths", path: "/conspiracy-myths", label: "Conspirations & mythes", groupId: "atlas_doctrine", relatedPaths: ["/fact-check", "/transparency-log", "/sentinelle"] },
  { id: "florahub", path: "/flora-hub", label: "Flore", groupId: "atlas_doctrine", relatedPaths: ["/fauna-hub", "/insects-hub", "/atlas"] },
  { id: "faunahub", path: "/fauna-hub", label: "Faune", groupId: "atlas_doctrine", relatedPaths: ["/flora-hub", "/sanctuary", "/atlas"] },
  { id: "insectshub", path: "/insects-hub", label: "Insectes", groupId: "atlas_doctrine", relatedPaths: ["/flora-hub", "/fauna-hub", "/atlas"] },
  { id: "mineralshub", path: "/minerals-hub", label: "Minéraux", groupId: "atlas_doctrine", relatedPaths: ["/chemistry-hub", "/atlas", "/cosmic-portal"] },
  { id: "chemhub", path: "/chemistry-hub", label: "Chimie", groupId: "atlas_doctrine", relatedPaths: ["/minerals-hub", "/atlas", "/manuel"] },
  { id: "magichub", path: "/magic-hub", label: "Hub magique", groupId: "atlas_doctrine", relatedPaths: ["/esotericism", "/atlas", "/cosmic-portal"] },
  { id: "paparazzi", path: "/paparazzi", label: "Paparazzi", groupId: "confiance", relatedPaths: ["/reporters", "/fact-check", "/authenticity"] },
  { id: "reporters", path: "/reporters", label: "Reporters", groupId: "confiance", relatedPaths: ["/paparazzi", "/fact-check", "/transparency-log"] },
  { id: "competitor", path: "/competitor-intelligence", label: "Veille concurrentielle", groupId: "pilotage", relatedPaths: ["/global-dashboard", "/dashboard-royal", "/transparency-log"] },
  { id: "genome", path: "/genome", label: "Genome", groupId: "atlas_doctrine", relatedPaths: ["/atlas", "/cosmic-portal", "/manuel"] },
  { id: "syncMystical", path: "/sync-mystical-marketplace", label: "Sync marketplace mystique", groupId: "marche", relatedPaths: ["/marketplace", "/atlas", "/arts-divinatoires"] },
  { id: "smartContrats", path: "/smart-contrats", label: "Contrats intelligents", groupId: "pilotage", relatedPaths: ["/legal", "/security", "/manuel"] },
  { id: "negoIA", path: "/negociation-ia", label: "Négociation IA", groupId: "marche", relatedPaths: ["/marketplace", "/recommandations", "/manuel"] },
  { id: "recos", path: "/recommandations", label: "Recommandations", groupId: "marche", relatedPaths: ["/marketplace", "/profil", "/atlas"] },
  { id: "maitre", path: "/maitre", label: "Maître du jeu", groupId: "communaute", relatedPaths: ["/jeu", "/world", "/conseil-jedi"] },
  { id: "systeme", path: "/systeme", label: "Système vivant", groupId: "atlas_doctrine", relatedPaths: ["/atlas", "/cosmic-portal", "/charte"] },
  { id: "besoins", path: "/besoins", label: "Besoins & match", groupId: "marche", relatedPaths: ["/marketplace", "/communautes", "/local-map"] },
  { id: "heritage", path: "/heritage", label: "Héritage", groupId: "atlas_doctrine", relatedPaths: ["/charte", "/vision", "/legal"] },
  { id: "conseilJedi", path: "/conseil-jedi", label: "Conseil Jedi", groupId: "communaute", relatedPaths: ["/maitre", "/communautes", "/charte"] },
  { id: "portailsMondiaux", path: "/portails-mondiaux", label: "Portails mondiaux", groupId: "atlas_doctrine", relatedPaths: ["/world", "/cosmic-portal", "/atlas"] },
  { id: "microOutils", path: "/micro-outils", label: "Micro-outils", groupId: "pilotage", relatedPaths: ["/outils-integration", "/manuel", "/carte-site"] },
  { id: "sceau", path: "/sceau", label: "Sceau d’éternité", groupId: "atlas_doctrine", relatedPaths: ["/charte", "/heritage", "/vision"] },
  { id: "reves", path: "/reves", label: "Journal des rêves", groupId: "communaute", relatedPaths: ["/reves-symboles", "/wellness", "/numerology"] },
  { id: "revesSymboles", path: "/reves-symboles", label: "Symboles des rêves", groupId: "communaute", relatedPaths: ["/reves", "/numerology", "/arts-divinatoires"] },
  { id: "consciousness", path: "/consciousness", label: "Annuaire de conscience", groupId: "communaute", relatedPaths: ["/feed", "/atlas", "/wellness"] },
  { id: "epicJourney", path: "/epic-journey", label: "Épopée", groupId: "communaute", relatedPaths: ["/jeu", "/world", "/maitre"] },
  { id: "universalHub", path: "/universal-hub", label: "Hub universel", groupId: "coeur", relatedPaths: ["/atlas", "/world", "/manuel"] },
  { id: "alliance", path: "/alliance", label: "Alliance", groupId: "coeur", relatedPaths: ["/charte", "/vision", "/partenaires"] },
  { id: "impact", path: "/impact", label: "Impact mondial", groupId: "pilotage", relatedPaths: ["/global-dashboard", "/dashboard-royal", "/plateforme/temps-reel"] },
  { id: "ringMC", path: "/micro-communautes", label: "Micro-communautés (alias)", groupId: "communaute", relatedPaths: ["/communautes", "/micro-communities", "/feed"] },
];

const FALLBACK_RELATED = ["/manuel", "/carte-site", "/outils-integration", "/security"];

export function getSiteNodeByPath(pathname) {
  const exact = SITE_NODES.find((n) => n.path === pathname);
  if (exact) return exact;
  for (const n of SITE_NODES) {
    if (n.path !== "/" && pathname.startsWith(`${n.path}/`)) return n;
  }
  return null;
}

/** Liens latéraux pour panneau contextuel (évite les doublons, exclut la page courante). */
export function getContextualLinksForPath(pathname) {
  const node = getSiteNodeByPath(pathname);
  const pool = [...(node?.relatedPaths || []), ...FALLBACK_RELATED];
  const seen = new Set([pathname]);
  const out = [];
  for (const p of pool) {
    if (seen.has(p)) continue;
    const target = SITE_NODES.find((n) => n.path === p);
    if (target) {
      seen.add(p);
      out.push(target);
    }
    if (out.length >= 8) break;
  }
  return { current: node, links: out };
}
