/**
 * Parcours guidés — chaque étape pointe vers du contenu **existant** ou une doc dépôt.
 * Les modules ERP / compta complets = hors périmètre actuel ; les étapes renvoient vers le cadre et les hubs pédagogiques.
 */
export const GUIDED_SCENARIOS = [
  {
    id: "decouvrir-egor",
    title: "Découvrir Egor69 en 5 minutes",
    intro: "Sans installer de logiciel : navigateur uniquement.",
    steps: [
      { label: "Accueil & sections", to: "/", hint: "Ancres accueil" },
      { label: "Manuel utilisateur", to: "/manuel" },
      { label: "Carte du site", to: "/carte-site" },
      { label: "Sécurité & transparence", to: "/security" },
    ],
  },
  {
    id: "verse-unreal",
    title: "Créer un univers parallèle (Verse web → Unreal)",
    intro: "Le Verse du site est WebGL ; Unreal est un pipeline séparé. Étapes honnêtes :",
    steps: [
      { label: "Explorer le Verse 3D", to: "/world" },
      { label: "Hub glTF / UEAIOUY", to: "/ue-aiouy" },
      { label: "Directives Unreal (doc dépôt)", doc: "docs/unreal-bridge.md" },
      { label: "Exemple JSON univers (échantillon)", doc: "public/ue-aiouy/universe-config.sample.json" },
      { label: "Outils & intégrations", to: "/outils-integration" },
    ],
  },
  {
    id: "entreprise-cadre",
    title: "Structurer une démarche entreprise (cadre & ressources)",
    intro: "Pas d’ERP complet dans cette SPA — parcours vers hubs et feuille de route documentaire.",
    steps: [
      { label: "Hub fondations (grilles & leçons)", to: "/hub-fondations" },
      { label: "Hub souverain (noyau & éco-UI)", to: "/hub-souverain" },
      { label: "Roadmap entreprise & orchestration", doc: "docs/ORCHESTRATION-ROADMAP.md" },
      { label: "Intégrations & bus de données", doc: "docs/BUS-INTEGRATION.md" },
    ],
  },
  {
    id: "confiance-transparence",
    title: "Vérifier la confiance (authenticité, faits, logs)",
    steps: [
      { label: "Authenticity", to: "/authenticity" },
      { label: "Fact check", to: "/fact-check" },
      { label: "Transparency log", to: "/transparency-log" },
      { label: "Sentinelle", to: "/sentinelle" },
    ],
  },
  {
    id: "soutien-pricing",
    title: "Soutenir ou s’abonner",
    steps: [
      { label: "Pricing", to: "/pricing" },
      { label: "Soutien", to: "/soutien" },
      { label: "Dashboard royal", to: "/dashboard-royal" },
    ],
  },
];
