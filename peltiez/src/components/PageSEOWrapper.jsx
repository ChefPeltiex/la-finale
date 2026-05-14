import SEOMeta from "./SEOMeta";
import { SITE_ORIGIN, SITE_TAGLINE } from "@/lib/site";

export const DOMAIN_SEO_CONFIG = {
  home: {
    title: "Egor69",
    description: SITE_TAGLINE,
    keywords: "igor, économie circulaire, don objet, troc, réparation, radar, golden nuggets, encyclopédie vivante, planète",
    canonicalUrl: SITE_ORIGIN,
    type: "WebSite"
  },
  marketplace: {
    title: "Marketplace Circulaire — Don, Échange, Réparation | Egor69",
    description: "Achetez, vendez, échangez et donnez des objets. Marketplace éco-responsable avec matching IA. Impact CO₂ visible.",
    keywords: "marketplace, don objet, troc, échange, réparation gratuite, occasion, secondhand, upcycling, économie circulaire",
    canonicalUrl: `${SITE_ORIGIN}/marketplace`,
    type: "LocalBusiness"
  },
  astrologie: {
    title: "Astrologie Personnelle & Carte du Ciel | Analyses IA | Egor69",
    description: "Découvrez votre carte natale : signes solaire/lunaire, missions de vie, prédictions cosmiques. Analyses astrales et guidance spirituelle personnalisées.",
    keywords: "astrologie, carte natale, horoscope, interprétation rêves, spiritualité, numérologie, zodiac, guidance spirituelle",
    canonicalUrl: `${SITE_ORIGIN}/carte-du-ciel`,
    type: "CreativeWork"
  },
  reves: {
    title: "Journal des Rêves & Interprétation Spirituelle | Analyse IA | Egor69",
    description: "Déchiffrez vos rêves grâce à l'IA : symboles, archétypes jungiens, messages de l'inconscient. Guidance spirituelle et psychologie profonde.",
    keywords: "rêves, interprétation rêves, symbolisme, inconscient, archétypes, spiritualité, psychologie, analyse rêves",
    canonicalUrl: `${SITE_ORIGIN}/reves`,
    type: "CreativeWork"
  },
  besoin: {
    title: "Matching Prédictif IA — Trouve Exactement Ce Dont Tu As Besoin",
    description: "Décris ton besoin. Le moteur analyse les annonces disponibles et propose les meilleures correspondances. Impact CO₂ lorsque les données le permettent.",
    keywords: "matching, recherche intelligente, IA prédictive, correspondance, trouver objet, besoin spécifique",
    canonicalUrl: `${SITE_ORIGIN}/besoins`,
    type: "LocalBusiness"
  },
  recommandations: {
    title: "Moteur de Recommandation IA — Trouve le Parfait Match",
    description: "Egor69 analyse sémantiquement vos besoins et retourne les meilleures correspondances parmi tous les objets disponibles globalement.",
    keywords: "recommandation, IA, matching, moteur de recherche, circulaité, commerce intelligent",
    canonicalUrl: `${SITE_ORIGIN}/recommandations`,
    type: "LocalBusiness"
  },
  vision: {
    title: "Vision Egor69 — Le Futur de l'Économie Mondiale",
    description: "Notre manifeste : transformer la consommation mondiale. Circularité + Spiritualité + Innovation = Futur Durable.",
    keywords: "vision, mission, manifeste, futur, économie, durabilité, innovation, changement",
    canonicalUrl: `${SITE_ORIGIN}/vision`,
    type: "WebPage"
  },
  impact: {
    title: "Impact Global Mesuré — CO₂, Objets Sauvés, Vies Changées",
    description: "Tableau de bord : annonces, CO₂ estimé quand renseigné, et signaux d’impact. Transparence avant vanity metrics.",
    keywords: "impact, CO₂, environnement, statistiques, mesure d'impact, écologie, développement durable",
    canonicalUrl: `${SITE_ORIGIN}/impact`,
    type: "DataCatalog"
  },
};

export function PageSEOWrapper({ children, pageType = "home" }) {
  const config = DOMAIN_SEO_CONFIG[pageType] || DOMAIN_SEO_CONFIG.home;
  
  const schemaData = {
    "@context": "https://schema.org",
    "@type": config.type,
    "name": config.title,
    "description": config.description,
    "url": config.canonicalUrl,
    "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=630&fit=crop"
  };

  return (
    <>
      <SEOMeta
        title={config.title}
        description={config.description}
        keywords={config.keywords}
        canonicalUrl={config.canonicalUrl}
        schemaData={schemaData}
      />
      {children}
    </>
  );
}

export default PageSEOWrapper;