/**
 * Lexique comparé — herboristerie, médecines douces, massages, homéopathie, approches holistiques.
 * Visée éducative : repères scientifiques, cadre légal indicatif (non conseil médical), signaux d’alerte.
 */

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   domain: string,
 *   overview: string,
 *   modalities: string[],
 *   evidence: string,
 *   precautions: string,
 *   legalNote: string,
 *   seeDoctor: string[],
 *   grimoireVerse: {
 *     sortilege: string,
 *     enchantement: string,
 *     potionArtefact: string,
 *     pouvoirMagique: string,
 *     utiliteDuRite: string,
 *     puissance: string,
 *     miseEnScene: string,
 *   },
 * }} WellnessFamily
 */

/** @type {WellnessFamily[]} */
export const WELLNESS_THERAPIES_FAMILIES = [
  {
    id: "herboristerie",
    label: "Herboristerie & phytothérapie",
    domain: "Plantes médicinales, galénique, compléments à base de plantes",
    overview:
      "L’usage traditionnel des plantes repose sur des corpus ethnopharmacologiques et des monographies modernes (EMA, HMPC en Europe). Les principes actifs varient selon la partie utilisée, le solvant, la dose et l’interaction médicamenteuse. La phytothérapie « raisonnée » confronte indications traditionnelles et essais cliniques (souvent hétérogènes). Les risques incluent interactions avec anticoagulants, immunosuppresseurs, grossesse, insuffisance hépatique/rénale.",
    modalities: [
      "Teintures-mères, extraits secs titrés, infusions, huiles essentielles (usage interne uniquement sous avis qualifié).",
      "Identification botanique stricte ; risque de confusion entre espèces ou avec des toxiques.",
      "Circuits court circuit / circuits qualité (bio, récolte, séchage, stockage).",
    ],
    evidence:
      "Certaines plantes ont des données RCT ou méta-analyses (ex. cas isolés) ; beaucoup reposent sur usage traditionnel + études précliniques. L’OMS et les autorités de santé publient des listes et mises en garde.",
    precautions:
      "Ne pas remplacer un traitement prescrit sans accord médical ; méfiance face aux « détox » marketing ; attention aux mélanges Internet non contrôlés.",
    legalNote:
      "En Europe, statuts produits (complément alimentaire, médicament à base de plantes, médicament traditionnel) diffèrent ; au Québec, encadrement Santé Canada / BPF. Vérifier les labels et revendications autorisées.",
    seeDoctor: ["Douleur thoracique, fièvre persistante, saignements", "Grossesse / allaitement avant toute prise interne", "Polypharmacie (≥5 médicaments)"],
    grimoireVerse: {
      sortilege: "Rite des **Sept Racines-Noms** : prononcer trois fois le nom latin avant d’ouvrir le flacon.",
      enchantement: "**Circonscription du vert** — nulle feuille n’entre sans monographie ; les interactions restent visibles comme filaments rouges.",
      potionArtefact: "**Élixir chromatographique** (teinture titrée) dans une fiole qui n’accepte que les dosages mesurés.",
      pouvoirMagique: "Invocation des principes actifs : modulation réelle des voies métaboliques — pouvoir conditionné à la preuve et au respect des contre-indications.",
      utiliteDuRite: "Mettre en scène le **contrat** entre plante et organisme : consentement, dose, durée, sortie de secours médicale.",
      puissance: "Puissance **IV/V** en phytothérapie encadrée ; retombe à **I/V** si cueillette sauvonge ou Internet opaque.",
      miseEnScene: "Serre de minuit : lampes de bureau, balance de précision, herbiers ouverts ; le vent souffle parfois une feuille vénéneuse qu’il faut refuser.",
    },
  },
  {
    id: "naturopathie",
    label: "Naturopathie",
    domain: "Hygiènes de vie, bilan holistique, référentiels de pratique (selon pays)",
    overview:
      "La naturopathie regroupe souvent nutrition, exercice, gestion du stress, hydrologie, parfois phytothérapie et techniques manuelles — selon formation et cadre légal du praticien. Les titres et reconnaissances varient fortement (France, Québec, Suisse…). Elle ne doit pas se substituer au diagnostic médical ni retarder une prise en charge urgente.",
    modalities: [
      "Bilan de vitalité / terrain (concepts hétérogènes selon écoles).",
      "Conseils diététiques, chronobiologie, respiration, thermocomfort.",
      "Délégation vers professionnels de santé lorsque symptômes red flags.",
    ],
    evidence:
      "Les composantes isolées (activité physique, alimentation méditerranéenne, sommeil) ont des niveaux de preuve solides ; l’« ensemble naturopathique » est plus difficile à randomiser.",
    precautions:
      "Refus de vaccination, promesses de guérison du cancer, « tests intolérances » non validés : signaler comme dérives fréquentes documentées par les autorités.",
    legalNote:
      "Vérifier le cadre d’exercice local : certaines juridictions limitent les actes ou exigent collaboration avec médecins.",
    seeDoctor: ["Perte de poids involontaire", "Masse ou douleur nouvelle et progressive", "Symptômes neurologiques aigus"],
    grimoireVerse: {
      sortilege: "**Balayer les quatre vents du quotidien** : sommeil, assiette, pas, silence — sans promettre de miracle.",
      enchantement: "**Toile du terrain** : chaque symptôme se voit relié à un contexte (travail, air, relation) comme nœuds sur une carte.",
      potionArtefact: "**Compas de vitalité** (carnet + chronomètre) : artefact trivial dont la magie est la constance.",
      pouvoirMagique: "Pouvoir d’**orientation** : rassembler les hygiènes de vie documentées ; jamais de clairvoyance diagnostique.",
      utiliteDuRite: "Scène de **tente de conseil** : table ronde entre corps, calendrier et professionnels de santé quand le drapeau rouge flotte.",
      puissance: "Puissance **III/V** sur habitudes ; chute à **0/V** si le rite retarde une urgence médicale.",
      miseEnScene: "Atelier en bois clair, pluie sur la vitre, trois bougies symboliques (sommeil, mouvement, repas) jamais allumées en même temps.",
    },
  },
  {
    id: "massages",
    label: "Massages & techniques manuelles du bien-être",
    domain: "Relaxation, circulation, douleur musculo-squelettique bénigne",
    overview:
      "Le massage bien-être vise la détente, la proprioception et parfois la douleur fonctionnelle. Il se distingue de la kinésithérapie/massothérapie réglementée selon pays. Les indications publicitaires doivent rester prudentes (pas de « dissout les toxines » sans preuve).",
    modalities: [
      "Suédois, californien, pierres chaudes, amma assis, drainages « bien-être » (non confondre avec MLD médicale).",
      "Thaï sur futon, shiatsu d’inspiration (≠ shiatsu médical japonais institutionnel).",
      "Fascias : approches variées, littérature en évolution.",
    ],
    evidence:
      "Effets sur anxiété légère, qualité perçue du sommeil, douleur chronique non spécifique dans certains essais ; effets forts sur plaisir immédiat (légitime).",
    precautions:
      "Contre-indications : phlébite aiguë, fièvre, infections cutanées, cancers / zones irradiées sans accord oncologique, grossesse (positions et pressions).",
    legalNote:
      "Les massothérapeutes ont des ordres ou associations selon territoire ; le massage « spa » n’est pas une thérapie curative encadrée de la même façon.",
    seeDoctor: ["Douleur thoracique ou irradiation bras/mâchoire", "Paralysie, engourdissement brutal", "Fièvre + raideur nuque"],
    grimoireVerse: {
      sortilege: "**Lier les fils du fascia** sous chant bas — pression graduée, expiration synchronisée.",
      enchantement: "**Peau en parchemin apaisé** : la douleur bénigne se dissout en sensation de largeur (tant que les signaux vitaux sont verts).",
      potionArtefact: "**Huile du pacte des paumes** (macération neutre + consentement écrit) — potion de friction, pas de transmutation.",
      pouvoirMagique: "Magie du **toucher négocié** : modulation de l’arousal sympathique ; pouvoir réel = relaxation et proprioception, pas extraction de toxines.",
      utiliteDuRite: "Mise en scène du **spa-honnête** : draps, musique, chronomètre ; le thérapeute nomme ce qu’il ne fera pas.",
      puissance: "Puissance **II/V** thérapeutique publique ; **V/V** sur le plaisir immédiat (légitime) tant que la sécurité prime.",
      miseEnScene: "Salle tamisée, pierres tièdes en ellipse, horloge visible : le rituel finit quand le sablier dit « assez ».",
    },
  },
  {
    id: "aromatherapie",
    label: "Aromathérapie",
    domain: "Huiles essentielles (HE) — usage cutané, olfactif / parfois interne selon cadre",
    overview:
      "Les HE sont des mélanges complexes de molécules volatiles ; puissance dose-dépendante. Les voies olfactives modulent l’humeur et l’arousal ; la dermatologie exige dilutions et tests cutanés. L’ingestion systématique est déconseillée en autodidaxie (toxicité hépatique, neurologique, interactions).",
    modalities: [
      "Diffusion courte, inhalations guidées, synergies topiques diluées.",
      "HE « psycho » (stress, sommeil) : effets modestes dans certaines études, risque de sur-marketing.",
    ],
    evidence:
      "Quelques RCT sur anxiété pré-opératoire, sommeil ; qualité hétérogène. Base de données toxico (ANSES, poison centers).",
    precautions:
      "Enfants, femmes enceintes, animaux : sensibilités spécifiques ; chats et HE ; épilepsie et molécules convulsivantes.",
    legalNote:
      "Statut biocide / cosmétique / alimentaire ; revendications thérapeutiques encadrées.",
    seeDoctor: ["Asthme aigu après diffusion", "Brûlures chimiques importantes", "Convulsions"],
    grimoireVerse: {
      sortilege: "**Brume des neuf gouttes** : diffuser trois cycles puis fermer le grimoire (aérer la pièce).",
      enchantement: "**Voile olfactif** qui modifie l’humeur sans réécrire la chimie du sang — parfum de scène, pas de sort définitif.",
      potionArtefact: "**Flacon de lunes diluées** (HE dans huile support) — potion topique, jamais bue en autodidaxie.",
      pouvoirMagique: "Charme des **molécules volatiles** : vraie action sur nez et peau ; faux pouvoir : « guérir » l’âme par inhalation seule.",
      utiliteDuRite: "Rituel de **seuil** : marquer le passage du travail au repos par une odeur stable, ancrage sensoriel.",
      puissance: "Puissance **III/V** en diffusion courte prudente ; **V/V** de danger si ingestion ou surdose.",
      miseEnScene: "Alambics de verre, reflets bleus, chat repoussé hors du cercle — le félin n’a pas signé le pacte.",
    },
  },
  {
    id: "sophrologie",
    label: "Sophrologie",
    domain: "Relaxation structurée, visualisation, conscience corporelle",
    overview:
      "Méthode créée au XXe siècle (Caycedo), combinant relaxation dynamique, respiration et activation positive. Utilisée en accompagnement du stress, préparation à un événement, douleurs chroniques en complément — pas comme seule prise en charge de pathologies aiguës.",
    modalities: [
      "Séances individuelles / groupes, protocoles en nombre de séances.",
      "Intégration en milieu scolaire, entreprise, sport de haut niveau (selon contextes).",
    ],
    evidence:
      "Études sur stress perçu, anxiété, qualité de vie ; effets modérés, bonne adhérence souvent.",
    precautions:
      "Troubles psychiatriques non stabilisés : orientation vers psychiatre/psychologue ; éviter retraumatisation.",
    legalNote:
      "Cadres professionnels nationaux ; pas de titre médical.",
    seeDoctor: ["Idées suicidaires", "Manie, psychose aiguë", "Douleur aiguë sévère non expliquée"],
    grimoireVerse: {
      sortilege: "**Strophe des sept vagues** : inspiration, retention douce, expiration — répétée sans vanter de transmutation.",
      enchantement: "**Calme du miroir intérieur** : l’activation positive dessine un futur plausible, pas une prophétie.",
      potionArtefact: "**Globe de silence** (casque audio + chronomètre) — artefact technologique au service du rite.",
      pouvoirMagique: "Magie de **recadrage nerveux** : baisse du ton sympathique chez certains ; pouvoir nul sur psychose non stabilisée.",
      utiliteDuRite: "Préparer **examens, scène, naissance** : rôle théâtral de confiance et de répétition mentale.",
      puissance: "Puissance **II/V** sur stress léger ; tombe si le rite remplace une crise psychiatrique encadrée.",
      miseEnScene: "Salle en gradins doux, voix du praticien comme métronome, projecteurs tamisés sur le sol — le corps est seul acteur.",
    },
  },
  {
    id: "homeopathie",
    label: "Homéopathie",
    domain: "Préparations hautement diluées selon principes hahnemannien",
    overview:
      "L’homéopathie repose sur des paradigmes distincts de la pharmacologie dose-effet classique. Les autorités de santé (ex. méta-analyses Cochrane, rapports HAS passés) concluent souvent à absence de preuve robuste au-delà de l’effet placebo pour de nombreuses indications. Son usage reste populaire ; l’enjeu public est la non-substitution aux traitements efficaces et la transparence.",
    modalities: [
      "Granules, gouttes, doses ; « terrain » vs pathologies aiguës (discours à contextualiser).",
    ],
    evidence:
      "Littérature controversée ; effet contexte thérapeutique / régression vers la moyenne possibles dans essais cliniques.",
    precautions:
      "Ne pas retarder antibiotiques, chimiothérapies, vaccinations ou diagnostics urgents ; vigilance sur infections pédiatriques.",
    legalNote:
      "Statut médicament ou non selon pays ; certains pays retirent le remboursement.",
    seeDoctor: ["Toute infection grave ou douleur aiguë intense", "Toute indication où des traitements validés existent"],
    grimoireVerse: {
      sortilege: "**Granule du miroir dilué** : formule scandée pour rappeler que la matière active se cache derrière un océan de sucrose.",
      enchantement: "**Charme du simillimum** (fiction grimoire) : l’étiquette promet résonance ; la science demande preuve indépendante.",
      potionArtefact: "**Fiole du presque-absent** — potion symbolique ; son utilité rituelle peut coexister avec transparence sur le débat des preuves.",
      pouvoirMagique: "Pouvoir **contextuel** (alliance, rituel, régression vers la moyenne) souvent confondu avec magie atomique — à nommer honnêtement.",
      utiliteDuRite: "Scène de **consult** : boîte blanche, écoute longue, promesse de ne pas retarder l’antibiotique si la fièvre hurle.",
      puissance: "Puissance narrative **IV/V** dans la culture populaire ; puissance biologique directe **non étayée** pour la plupart des indications.",
      miseEnScene: "Apothicaire minimaliste : compte-gouttes, lumière froide, carnet où chaque granule est une question, pas une sentence.",
    },
  },
  {
    id: "approche-holistique",
    label: "Approche holistique (cadre)",
    domain: "Corps-esprit-environnement ; intégration des dimensions de la santé OMS",
    overview:
      "« Holistique » décrit une posture : considérer symptômes dans leur contexte (sommeil, travail, relations, nutrition, mouvement, sens). Ce n’est pas une liste d’actes techniques figés. La médecine intégrative hospitalière explore ce cadre avec des protocoles évalués.",
    modalities: [
      "Entretien long, coordination interdisciplinaire, auto-mesure raisonnée (pas obsessions quantified-self).",
      "Arts, nature, mouvement doux comme adjuvants documentés pour qualité de vie.",
    ],
    evidence:
      "Modèles biopsychosociaux en médecine ; effets de la cohérence des soins et de l’alliance thérapeutique.",
    precautions:
      "Éviter le holisme « magique » qui nie biologie ; éviter la charge mentale de culpabilisation du patient.",
    legalNote:
      "Le mot « holistique » n’est pas un titre réglementé.",
    seeDoctor: ["Tout symptôme nouveau alarmant", "Détérioration fonctionnelle rapide"],
    grimoireVerse: {
      sortilege: "**Tisser la carte à trois strates** : biologie, psyché, milieu — sans nier la fièvre ni la chimie.",
      enchantement: "**Anneau du biopsychosocial** : chaque symptôme brille d’un fil vers sommeil, boulot, amour, air.",
      potionArtefact: "**Boussole sans baguette** (questionnaire + rendez-vous partagés) — artefact de navigation, pas d’oracle.",
      pouvoirMagique: "Magie de **cohérence des soins** : pouvoir réel documenté en médecine intégrative quand protocoles et mesures existent.",
      utiliteDuRite: "Mettre en scène la **table ronde** : patient au centre, spécialistes en demi-cercle, monstres (stigmates) nommés sans honte.",
      puissance: "Puissance **IV/V** quand holisme = méthode ; **I/V** quand holisme = slogan marketing ou culpabilisation.",
      miseEnScene: "Salle vitrée sur ville vivante ; fils lumineux relient fenêtre, assiette, lit — la magie est la carte, pas le déni.",
    },
  },
  {
    id: "micronutrition",
    label: "Micronutrition & complémentation",
    domain: "Vitamines, minéraux, acides gras, oligo-éléments",
    overview:
      "Corriger des carences documentées (biologie, contexte) diffère du « cocktail » marketing. Les liposomales, formes « haute absorption », méga-doses peuvent poser risques (vitamine D, A, fer, B6 neuropathie…).",
    modalities: [
      "Alimentation d’abord ; compléments ciblés avec suivi.",
      "Oméga-3, magnésium, vitamine D : littératures spécifiques par indication et population.",
    ],
    evidence:
      "Niveaux de preuve très variables selon molécule et indication ; méta-analyses pour certaines populations.",
    precautions:
      "Interactions anticoagulants, thyroïde, chimiothérapies ; qualité des produits (contaminants, dosages réels).",
    legalNote:
      "Compléments alimentaires ≠ médicaments ; allégations encadrées.",
    seeDoctor: ["Anémie non expliquée", "Hypercalcémie", "Troubles du rythme"],
    grimoireVerse: {
      sortilege: "**Mesure du sang sur balance d’or** : biologie avant slogan ; nul élixir sans cible documentée.",
      enchantement: "**Sceau du bon dosage** : chaque capsule porte rune « interaction » visible sous lumière UV narrative.",
      potionArtefact: "**Ampoule du fer poli** / **Perle de vitamine D** — potions réelles à effet palpable si carence avérée.",
      pouvoirMagique: "Transmutation **chimique honnête** : corriger un déficit mesuré ; pas transformer plomb en or.",
      utiliteDuRite: "Scène d’**atelier d’orfèvre** : balance, pipette, liste des médicaments du voisinage toxique.",
      puissance: "Puissance **IV/V** quand indication + suivi ; **V/V** de risque en méga-dose ou self-prescription aveugle.",
      miseEnScene: "Laboratoire tamisé, comptoir vitré, fiches d’interactions qui bruissent quand on approche la thyroïde.",
    },
  },
  {
    id: "hydrothermalisme",
    label: "Thermalisme, cryothérapie de bien-être, contrastes",
    domain: "Eaux minérales médicales vs spa ; chaud/froid",
    overview:
      "Le thermalisme médical (prescription, cures) a des indications et contre-indications encadrées. Les spas et bains nordiques mélangent plaisir, récupération sportive et risques cardiovasculaires. La cryothérapie corps entier a une littérature encore discutée pour douleurs chroniques.",
    modalities: [
      "Cures thermales encadrées, balnéothérapie, hammam modéré.",
      "Immersions froides progressives ; précautions cardiaques.",
    ],
    evidence:
      "Certaines indications rhumatologiques en cure ; cryo : données limitées, effets placebo/contextuels.",
    precautions:
      "Hypertension non contrôlée, insuffisance cardiaque, grossesse, infections : avis médical.",
    legalNote:
      "Distinction spa / établissement thermal agréé.",
    seeDoctor: ["Douleur thoracique à l’effort", "Syncopes", "Plaies ouvertes en milieu aquatique"],
    grimoireVerse: {
      sortilege: "**Danse du chaud et du froid** : trois pas vers la vapeur, trois pas vers la glace — toujours avec chronomètre et pouls.",
      enchantement: "**Bouclier vasculaire** (fiction) : le cœur accepte le contraste ou hurle ; écouter avant de poursuivre.",
      potionArtefact: "**Eau des sources prescrites** (cure) vs **baignoire des mirages** (spa) — deux potions, deux juridictions.",
      pouvoirMagique: "Magie du **confort thermique** et de la récupération perçue ; cryo : pouvoir encore discuté, effet scène souvent fort.",
      utiliteDuRite: "Théâtre du **passage** : marquer la fin d’un cycle de travail, commencer une convalescence symbolique.",
      puissance: "Puissance **III/V** sur qualité de vie ; chute brutale si hypertension ou syncopes ignorées.",
      miseEnScene: "Vapeur qui monte en colonnes, bassin de glace carré, infirmière-fantôme qui tend une serviette et un tensiomètre.",
    },
  },
  {
    id: "therapies-psychocorporelles",
    label: "Thérapies psychocorporelles (aperçu)",
    domain: "Lien corps-émotion ; champs multiples",
    overview:
      "Regroupe des approches (bioénergétique inspirée de Reich — controversée et mal standardisée, analyse transactionnelle corporelle, danse-thérapie, sensorimotor psychotherapy…) aux cadres épistémologiques différents. La qualité dépend de la formation du thérapeute et de la supervision.",
    modalities: [
      "Travail respiratoire, toucher thérapeutique encadré, mouvement conscient.",
      "Trauma-informed care : principes de sécurité, lenteur, consentement renouvelé.",
    ],
    evidence:
      "Certaines approches intégratives en traumatologie ont des données en cours ; d’autres restent peu documentées.",
    precautions:
      "Risque de reactivation traumatique ; éviter toute technique invasive « énergétique » non validée.",
    legalNote:
      "Psychothérapie : titres encadrés selon pays ; distinguer coaching et thérapie.",
    seeDoctor: ["Idées suicidaires", "Hallucinations", "Addiction sévère non suivie"],
    grimoireVerse: {
      sortilege: "**Ouvrir la porte du corps sans fracturer l’âme** : respiration, consentement, silence entre deux phrases.",
      enchantement: "**Fil de trauma-informed** : chaque geste est réversible ; le patient peut dire « stop » sans perdre face.",
      potionArtefact: "**Coussin du seuil** — artefact humble où s’asseoir avant de traverser la mémoire.",
      pouvoirMagique: "Magie de **réintégration** (quand cadre clinique solide) ; faux pouvoir : « purifier l’énergie » sans formation ni éthique.",
      utiliteDuRite: "Mise en scène **théâtre-forum intérieur** : le corps répète une scène jusqu’à ce qu’elle change de fin.",
      puissance: "Puissance **III/V** en accompagnement spécialisé ; **interdit** de jouer avec feu si non stabilisé.",
      miseEnScene: "Salle basse, tapis épais, deux chaises seulement, sortie visible ; la lumière ne clignote jamais pour dramatiser.",
    },
  },
  {
    id: "acupuncture-tcm",
    label: "Acupuncture & MTC (cadrage)",
    domain: "Médecine traditionnelle chinoise en contexte moderne",
    overview:
      "L’acupuncture est étudiée pour nausées, douleurs chroniques sélectionnées ; les explications énergétiques coexistent avec modèles neurophysiologiques. La MTC complète (diététique TCM, pharmacopée) exige expertise locale et respect des réglementations pharmaceutiques.",
    modalities: [
      "Aiguilles à usage unique, électroacupuncture en recherche.",
      "Tuina, qi gong médical vs bien-être.",
    ],
    evidence:
      "NIST / WHO reviews ; effets modérés selon indications ; qualité des essais variable.",
    precautions:
      "Anticoagulation, grossesse (points classiquement évités), infections locales.",
    legalNote:
      "Exercice réservé ou non selon pays (médecin, ostéopathe formé, acupuncteur licencié…).",
    seeDoctor: ["Douleur aiguë sévère", "Symptômes neurologiques focalisés", "Fièvre inconnue"],
    grimoireVerse: {
      sortilege: "**Plantation des douze étoiles** sur méridiens imaginaires — aiguille stérile, geste précis, carte à jour.",
      enchantement: "**Voile du qi** (métaphore classique) : circulation narrée ; en coulisse, neurophysiologie et expectation.",
      potionArtefact: "**Boîte des aiguilles jetables** — relique technique plus puissante que tout grimoire rouillé.",
      pouvoirMagique: "Charme **anti-nausée** / modulateur de douleur dans certains essais — pouvoir modeste mais parfois mesurable.",
      utiliteDuRite: "Scène de **acuponcteur** : drap, masque calme, points nommés à voix haute, respiration du patient comptée.",
      puissance: "Puissance **III/V** sur indications ciblées ; respect absolu du cadre légal et des asepsies.",
      miseEnScene: "Bambou sur mur blanc, bol de spores d’encens lointain, silence ponctué de petit bruit sec — puis apaisement.",
    },
  },
  {
    id: "ayurveda",
    label: "Ayurveda (lecture anthropologique & clinique)",
    domain: "Constitutions (dosha), routines, pharmacopée indienne",
    overview:
      "Tradition médicale codifiée en Inde avec institutions modernes. Les purifications agressives, exportations « retreat » et ventes en ligne posent risques (plomb, arsenic dans certains produits historiques signalés par toxico).",
    modalities: [
      "Routines dina-charya, alimentation typologique, massages ayurvédiques spa vs clinique.",
    ],
    evidence:
      "Recherches cliniques croissantes mais biais publication ; qualité des préparations variable à l’international.",
    precautions:
      "Grossesse, enfants, pathologies hépatiques ; interactions avec médicaments occidentaux.",
    legalNote:
      "Produits importés : vigilance réglementaire ; pratiques non médicalisées en Occident.",
    seeDoctor: ["Ictère, fatigue sévère après cure", "Douleur abdominale aiguë"],
    grimoireVerse: {
      sortilege: "**Réveil des trois doshas** au lever du soleil — routines (dina-charya) comme strophes quotidiennes.",
      enchantement: "**Sceau des saisons** : alimentation et massage rythment le corps selon typologies millénaires.",
      potionArtefact: "**Ghrita du lion** (image) — potions institutionnelles vs sachets douteux : le grimoire exige traçabilité.",
      pouvoirMagique: "Magie de **longue durée** quand pharmacopée contrôlée ; malédiction documentée si métaux lourds ou import frelaté.",
      utiliteDuRite: "Mise en scène du **palais des saveurs** : repas, toucher, chant du bol — respect du vivant culturel.",
      puissance: "Puissance **IV/V** dans filières certifiées ; **danger** si cure agressive sans suivi hépatique.",
      miseEnScene: "Cour intérieure, turmeric en suspension dorée, tambour très loin ; le médecin local a le dernier mot.",
    },
  },
];
