/**
 * Grand Portail Naturel du Québec — tranche « slice 1 » (source unique).
 * Libellés culturels / folkloriques : pas de claims médicinaux (voir requiresDisclaimer).
 */

/** @typedef {{ slug: string, titleFr: string, examples: string[] }} NatureCategory */

/**
 * @typedef {{
 *   slug: string,
 *   titleFr: string,
 *   archetype: string,
 *   portalName: string,
 *   portalTagline: string,
 *   requiresDisclaimer: boolean,
 *   hubTo: string | null,
 *   docTo: string | null,
 *   categories: NatureCategory[],
 * }} NatureDomain */

/** @type {NatureDomain[]} */
export const NATURE_QUEBEC_DOMAINS = [
  {
    slug: "mycologie",
    titleFr: "Mycologie boréale",
    archetype: "Le Mycologue du sous-bois",
    portalName: "Portail du réseau filamenteux",
    portalTagline: "Où le bois parle par sporées — cartes du vivant, pas du garde-manger.",
    requiresDisclaimer: true,
    hubTo: "/flora-hub",
    docTo: null,
    categories: [
      {
        slug: "saprobiontes",
        titleFr: "Saprobiontes & décomposeurs",
        examples: ["Tramètes du bouleau (étiquette culturelle)", "Clavaires des mousses (observation)"],
      },
      {
        slug: "symbioses",
        titleFr: "Symbioses racinaires",
        examples: ["Réseaux mycorhiziens (métaphore de réseau)", "Boucles du vivant (modèle)"],
      },
      {
        slug: "ethnomyces",
        titleFr: "Noms populaires et récits",
        examples: ["Surnoms de terrain (folklore)", "Contes de cueillette (patrimoine oral)"],
      },
    ],
  },
  {
    slug: "insectes",
    titleFr: "Insectes & petites bêtes",
    archetype: "L’Entomologiste des lisières",
    portalName: "Portail des six pattes et des murmures d’ailes",
    portalTagline: "Rythmes du pollen et de la sève — science et imaginaire sans « ordonnance ».",
    requiresDisclaimer: true,
    hubTo: "/insects-hub",
    docTo: null,
    categories: [
      {
        slug: "pollinisateurs",
        titleFr: "Pollinisateurs (symboles culturels)",
        examples: ["Abeille — figure de travail communautaire (métaphore)", "Bourdon — récit de jardin"],
      },
      {
        slug: "decomposeurs",
        titleFr: "Décomposeurs du sol",
        examples: ["Coléoptères du bois mort (écologie)", "Fourmi — organisation sociale (image, pas « acide thérapeutique »)"],
      },
      {
        slug: "aquatiques",
        titleFr: "Invertébrés des eaux",
        examples: ["Libellule — motif artisanal", "Éphémère — brièveté du cycle (poésie)"],
      },
    ],
  },
  {
    slug: "mineraux",
    titleFr: "Minéraux & pierres du bouclier",
    archetype: "Le Géologue contemplatif",
    portalName: "Portail du socle cristallin",
    portalTagline: "Quartz, amphiboles et fer — géologie d’abord, légendes ensuite.",
    requiresDisclaimer: false,
    hubTo: "/minerals-hub",
    docTo: null,
    categories: [
      {
        slug: "cristaux",
        titleFr: "Cristaux régionaux",
        examples: ["Quartz laiteux (champ)", "Grenat almandin (identification musée)"],
      },
      {
        slug: "roches",
        titleFr: "Roches mères",
        examples: ["Gneiss (bouclier canadien)", "Schistes métamorphiques (carte)"],
      },
    ],
  },
  {
    slug: "remedes_traditionnels",
    titleFr: "Remèdes traditionnels (patrimoine oral)",
    archetype: "L’Herboriste du conte",
    portalName: "Portail des récits de jarre et de cheminée",
    portalTagline: "Tisanes et dictons : mémoire collective, pas pharmacopée validée ici.",
    requiresDisclaimer: true,
    hubTo: "/heritage",
    docTo: "/docs/magique",
    categories: [
      {
        slug: "tisanes_folklore",
        titleFr: "Tisanes nommées dans le folklore",
        examples: ["Plantes citées en chansons / récits (culture)", "Usages rapportés par des sources orales (non vérifiés médicalement)"],
      },
      {
        slug: "preparations_maison",
        titleFr: "Préparations « maison » historiques",
        examples: ["Macérations décrites comme coutumes (musée)", "Formules familiales archivées (contexte)"],
      },
    ],
  },
  {
    slug: "astuces_maison",
    titleFr: "Astuces maison & bricolage doux",
    archetype: "L’Artisan du seuil",
    portalName: "Portail du loquet qui tient encore",
    portalTagline: "Réparations, rangements, petits systèmes — prudence et bon sens.",
    requiresDisclaimer: false,
    hubTo: "/micro-outils",
    docTo: null,
    categories: [
      {
        slug: "entretien",
        titleFr: "Entretien et réemploi",
        examples: ["Détartrage doux (test discret)", "Rangement circulaire (moins de perte)"],
      },
      {
        slug: "energie",
        titleFr: "Confort sans promesse miracle",
        examples: ["Isolation artisanale (pilote mesuré)", "Ventilation naturelle (carte des pièces)"],
      },
    ],
  },
  {
    slug: "astuces_cuisine",
    titleFr: "Astuces cuisine & « alchimie » domestique",
    archetype: "L’Alchimiste de la casserole",
    portalName: "Portail des odeurs qui réconcilient",
    portalTagline: "Réactions utiles et sécurité — chimie quotidienne, pas élixir.",
    requiresDisclaimer: false,
    hubTo: "/chemistry-hub",
    docTo: null,
    categories: [
      {
        slug: "reactions_utiles",
        titleFr: "Réactions utiles au foyer",
        examples: ["Acides/bases ménagers (étiquettes)", "Caramélisation (thermique)"],
      },
      {
        slug: "conservation",
        titleFr: "Conservation raisonnée",
        examples: ["Congélation / salaison (hygiène)", "Réduction du gaspillage (Ω cuisine)"],
      },
    ],
  },
  {
    slug: "savoirs_populaires",
    titleFr: "Savoirs populaires québécois",
    archetype: "Le Conteur du rang",
    portalName: "Portail des histoires sans GPS",
    portalTagline: "Météores, glaces et bêtes — cartes narratives de l’Atlas vivant.",
    requiresDisclaimer: false,
    hubTo: "/atlas",
    docTo: null,
    categories: [
      {
        slug: "meteo_pays",
        titleFr: "Météores du pays",
        examples: ["Grêle des saints (dicton)", "Lune des semailles (calendrier oral)"],
      },
      {
        slug: "faune_flore",
        titleFr: "Faune & flore dans le dire",
        examples: ["Orignal — géographie du récit", "Érablière — cycle sucré (culture)"],
      },
    ],
  },
  {
    slug: "symboles_naturels",
    titleFr: "Symboles naturels & mythologies",
    archetype: "Le Symbologique des rives",
    portalName: "Portail des signes dans l’eau et le vent",
    portalTagline: "Images partagées — lecture symbolique, pas oracle de terrain.",
    requiresDisclaimer: false,
    hubTo: "/mythologies",
    docTo: "/docs/magique",
    categories: [
      {
        slug: "eau_foret",
        titleFr: "Eau et forêt",
        examples: ["Rivière comme fil conducteur (récit)", "Feuille compassée (ornement)"],
      },
      {
        slug: "cycles",
        titleFr: "Cycles et saisons",
        examples: ["Équinoxe — repère culturel", "Givre — motif visuel"],
      },
    ],
  },
];

/** Métadonnées hub (SEO, titre court). */
export const NATURE_QUEBEC_HUB_META = {
  title: "Grand Portail Naturel du Québec",
  description:
    "Carte d’orientation vers les hubs CirculAI : mycologie, insectes, minéraux, patrimoine oral, outils, chimie douce, atlas et mythologies — avec garde-fous explicites.",
  canonicalPath: "/portail/nature-quebec",
};
