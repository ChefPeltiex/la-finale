/**
 * Fiches EsotericPractice — thèmes bien-être, herboristerie, limites légales / éthiques.
 */

export const WELLNESS_ESOTERIC_PARTIALS = [
  {
    title: "Phytothérapie — interactions médicamenteuses",
    tradition: "autre",
    origin: "Europe · pharmacovigilance",
    description:
      "Les extraits de plantes modulent enzymes et transporteurs (ex. cas documentés selon molécules). Croiser monographies EMA/HMPC et base médicale du patient avant association.",
    principles: ["Polypharmacie", "Foie / reins"],
  },
  {
    title: "Herboristerie — identification & contamination",
    tradition: "autre",
    origin: "Terrain · récolte",
    description:
      "Confusion d’espèces, champignons, lots non tracés : risques aigus. Les circuits courts ne remplacent pas l’analyse de qualité.",
    principles: ["Traçabilité", "Toxico"],
  },
  {
    title: "Naturopathie — titres et juridictions",
    tradition: "autre",
    origin: "France · Québec · Suisse",
    description:
      "Les compétences légales et les actes autorisés diffèrent : ce que l’on peut dire, mesurer ou « diagnostiquer » varie. Cartographier avant toute promesse publique.",
    principles: ["Cadre légal", "Honnêteté"],
  },
  {
    title: "Massage — cancer, lymphœdème, anticoagulants",
    tradition: "autre",
    origin: "Oncologie · médecine vasculaire",
    description:
      "Contre-indications relatives/absolues selon état et protocole. Le massage « détox » lymphatique grand public n’est pas la MLD médicale.",
    principles: ["Consentement", "Red flags"],
  },
  {
    title: "Aromathérapie — chats, enfants, épilepsie",
    tradition: "autre",
    origin: "Toxicologie",
    description:
      "Molécules convulsivantes, hépatotoxicité, sensibilités spécifiques des populations. Diffusion prolongée : irritation voies aériennes.",
    principles: ["Populations vulnérables", "Dose"],
  },
  {
    title: "Sophrologie — troubles psychiatriques non stabilisés",
    tradition: "autre",
    origin: "Repères cliniques",
    description:
      "La relaxation peut décompenser certaines structures défensives ; co-triage avec psychiatre/psychologue. Pas de promesse de guérison.",
    principles: ["Orientation", "Alliance"],
  },
  {
    title: "Homéopathie — substitution aux antibiotiques",
    tradition: "autre",
    origin: "Santé publique",
    description:
      "Les autorités signalent le risque majeur de retard thérapeutique en infection. Séparer débat académique et urgence vitale.",
    principles: ["Urgence", "Preuve"],
  },
  {
    title: "Approche holistique — médecine intégrative hospitalière",
    tradition: "autre",
    origin: "XXe–XXIe siècle",
    description:
      "Programmes encadrés (douleur, oncologie supportive) : protocoles, consentements, mesures d’outcome. Le holisme marketplace ≠ intégration clinique.",
    principles: ["Protocole", "Mesure"],
  },
  {
    title: "Micronutrition — méga-doses et marketing",
    tradition: "autre",
    origin: "Compléments",
    description:
      "Vitamine D, fer, A, B6 : fenêtres thérapeutiques et toxicités réelles. Les formes « premium » exigent encore des données par indication.",
    principles: ["Biologie", "Évidence"],
  },
  {
    title: "Thermalisme médical vs spa",
    tradition: "autre",
    origin: "Europe",
    description:
      "Cures prescrites, indications, contre-indications cardiovasculaires documentées. Le jacuzzi festif n’hérite pas automatiquement des preuves des eaux.",
    principles: ["Indication", "Sécurité"],
  },
  {
    title: "Thérapies psychocorporelles — trauma-informed",
    tradition: "autre",
    origin: "Clinique",
    description:
      "Stabilisation avant exploration ; fenêtre de tolérance ; pas de reconstitution « héroïque » sans cadre. Toucher : cadre éthique strict.",
    principles: ["Consentement", "Stabilisation"],
  },
  {
    title: "Acupuncture — nausées, douleur chronique",
    tradition: "taoisme",
    origin: "Recherche clinique",
    description:
      "Certaines indications ont des méta-analyses ; d’autres restent débattues. Qualité d’essai et sham design influencent les conclusions.",
    principles: ["Méta-analyse", "Pragmatisme"],
  },
  {
    title: "Ayurveda — plomb et qualité des préparations",
    tradition: "autre",
    origin: "Toxicologie internationale",
    description:
      "Cas documentés de contaminants dans produits importés. Distinguer pratiques institutionnelles en Inde et marchés occidentaux peu contrôlés.",
    principles: ["Qualité", "Import"],
  },
  {
    title: "Réflexologie — zone maps et preuves",
    tradition: "autre",
    origin: "Bien-être",
    description:
      "Cartographies plantaires hétérogènes ; effets relaxants possibles ; revendications organiques fortes souvent non prouvées. Honnêteté commerciale.",
    principles: ["Relaxation", "Marketing"],
  },
  {
    title: "Ostéopathie / chiropraxie — cadres nationaux",
    tradition: "autre",
    origin: "Ouest",
    description:
      "Manipulations cervicales : débats de risque/bénéfice selon indications. Distinguer professions réglementées et « cracking » viral.",
    principles: ["Régulation", "Risque"],
  },
  {
    title: "Hypnose ericksonienne — spectacle vs clinique",
    tradition: "autre",
    origin: "XXe siècle",
    description:
      "Applications validées pour certaines douleurs et addictions en cadre clinique ; spectacle TV ≠ thérapie. Contre-indications psychotiques.",
    principles: ["Cadre", "Suggestion"],
  },
  {
    title: "Méditation pleine conscience — MBSR / MBCT",
    tradition: "bouddhisme_tibetain",
    origin: "Recherche",
    description:
      "Programmes structurés pour anxiété/dépression en relaps ; pas substitut immédiat aux soins aigus. Effets adverses rares mais documentés (dissociation).",
    principles: ["Programme", "Suivi"],
  },
  {
    title: "Jeûne thérapeutique & wellness",
    tradition: "autre",
    origin: "Mode",
    description:
      "Populations à risque (diabète insulino-dépendant, TCA, grossesse). Les « cures » commerciales peuvent déclencher crises métaboliques.",
    principles: ["Dépistage", "Urgence"],
  },
  {
    title: "Tests d’intolérance alimentaire non validés",
    tradition: "autre",
    origin: "Santé publique",
    description:
      "IgG sériques, bioresonance, cheveux : positions négatives des autorités pour diagnostic d’allergie. Éviter régimes restrictifs iatrogènes.",
    principles: ["Évidence", "Nutrition"],
  },
  {
    title: "« Détox » — foie et rein déjà présents",
    tradition: "alchimie",
    origin: "Marketing bien-être",
    description:
      "Les organes d’élimination fonctionnent sans packs commerciaux. Rediriger vers sommeil, alcool modéré, activité physique, soins médicaux si ictère.",
    principles: ["Sobriété narrative", "Biologie"],
  },
];
