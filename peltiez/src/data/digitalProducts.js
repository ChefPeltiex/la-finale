/**
 * Catalogue boutique numérique — produits dérivés d’actifs réels du dépôt.
 * Prix indicatifs CAD ; facturation réelle = Stripe / devis humain pour les leads.
 */

/** @typedef {'digital' | 'lead' | 'subscription'} DigitalProductType */

/**
 * @typedef {Object} DigitalProduct
 * @property {string} id
 * @property {string} titleFr
 * @property {string} descriptionFr
 * @property {number|null} priceCad
 * @property {string} priceLabel
 * @property {DigitalProductType} type
 * @property {string} ctaPath
 * @property {boolean} [ctaExternal]
 * @property {boolean} [ctaDownload]
 * @property {string[]} included
 * @property {boolean} availableToday
 * @property {string} [availabilityNote]
 * @property {string} [stripeEnvKey]
 * @property {'payment' | 'subscription'} [stripeMode]
 * @property {string} [badge]
 * @property {boolean} [featured]
 * @property {string[]} [categories]
 */

/** Filtres boutique (chips sur `/boutique`). */
export const BOUTIQUE_FILTER_CHIPS = [
  { id: "all", label: "Tout" },
  { id: "gratuit", label: "Gratuit" },
  { id: "aujourdhui", label: "Aujourd’hui" },
  { id: "premium", label: "Premium" },
];

/** @type {DigitalProduct[]} */
export const DIGITAL_PRODUCTS = [
  {
    id: "apercu-encyclopedie",
    titleFr: "Aperçu encyclopédie (PDF)",
    descriptionFr:
      "Extrait gratuit du PDF visuel CirculAI — planches, atlas et index. Idéal pour découvrir le ton avant l’édition complète.",
    priceCad: 0,
    priceLabel: "Gratuit",
    type: "digital",
    ctaPath: "/encyclopedie.pdf",
    ctaExternal: true,
    ctaDownload: false,
    included: [
      "Fichier PDF servi depuis le site (`public/encyclopedie.pdf`) — volume aperçu",
      "Accès immédiat, sans compte",
      "Même charte visuelle que l’édition complète",
    ],
    availableToday: true,
    badge: "Aperçu",
    categories: ["gratuit", "encyclopedie"],
  },
  {
    id: "encyclopedie-complete",
    titleFr: "Édition complète · Encyclopédie PDF",
    descriptionFr:
      "L’encyclopédie visuelle assemblée (codex, planches, atlas) — achat unique pour soutenir la circulation des savoirs.",
    priceCad: 19,
    priceLabel: "19 $ CA",
    type: "digital",
    ctaPath: "/boutique",
    included: [
      "PDF encyclopédie complète (même source que le build / dépôt)",
      "Mises à jour mineures du fichier tant que la version vendue est active",
      "Lien de téléchargement après paiement Stripe (quand configuré)",
    ],
    availableToday: true,
    stripeEnvKey: "VITE_STRIPE_PRICE_ENCYCLOPEDIE",
    stripeMode: "payment",
    featured: true,
    badge: "Best-seller",
    categories: ["encyclopedie"],
  },
  {
    id: "charpente-promesses",
    titleFr: "Charpente · 8 promesses (web)",
    descriptionFr:
      "Les engagements structurels du hub — lecture gratuite, ton symbolique, sans promesse de résultat garanti ni conseil médical.",
    priceCad: 0,
    priceLabel: "Gratuit",
    type: "digital",
    ctaPath: "/docs/promesses",
    included: [
      "Page `/docs/promesses` — charpente alignée Egor69",
      "Anti-hype : pas de métriques ou partenaires fictifs",
      "Complète l’encyclopédie et les Codex payants",
    ],
    availableToday: true,
    badge: "Gratuit",
    categories: ["gratuit", "codex"],
  },
  {
    id: "bundle-codex-investisseur-preuves",
    titleFr: "Bundle Codex · Investisseur + Preuves",
    descriptionFr:
      "Résumé exécutif, traction honnête et checklist vérifiable — pour partenaires et alliés qui veulent comprendre sans hype.",
    priceCad: 29,
    priceLabel: "29 $ CA",
    type: "digital",
    ctaPath: "/boutique",
    included: [
      "Pages `/docs/investisseur` et `/docs/preuves` (contenu web + export selon offre)",
      "Cadre pilote 90 jours (référence, pas de promesse de levée)",
      "Pas de chiffres inventés — aligné `enterpriseOffering.js`",
    ],
    availableToday: true,
    stripeEnvKey: "VITE_STRIPE_PRICE_CODEX_BUNDLE",
    stripeMode: "payment",
    categories: ["codex"],
  },
  {
    id: "kit-nature-quebec",
    titleFr: "Kit Nature Québec",
    descriptionFr:
      "Grand Portail Nature Québec : douze portails fictionnels (mycélium, insectes, carapaces, plantes…) pour explorer le vivant québécois en métaphore — ancré Québec, sans conseil médical ni pouvoir réel promis.",
    priceCad: 24,
    priceLabel: "24 $ CA",
    type: "digital",
    ctaPath: "/portail/nature-quebec",
    included: [
      "Accès portail `/portail/nature-quebec`",
      "Table Codex `/docs/nature-quebec-portail`",
      "Kit activation `/docs/nature-quebec-kit` (prompts & specs créateurs)",
    ],
    availableToday: true,
    stripeEnvKey: "VITE_STRIPE_PRICE_NATURE_QC_KIT",
    stripeMode: "payment",
    categories: ["nature"],
  },
  {
    id: "pass-explorateur-verse",
    titleFr: "Pass explorateur · Verse & Atlas",
    descriptionFr:
      "Abonnement mensuel Netherealm : exploration Verse 3D, atlas vivant et scans radar — tarif aligné sur `/pricing`.",
    priceCad: 44,
    priceLabel: "44 $ / mois",
    type: "subscription",
    ctaPath: "/pricing",
    included: [
      "Pass Netherealm (voir page Pricing)",
      "Verse 3D `/world` et progression locale",
      "Fonctions listées soumises à disponibilité produit",
    ],
    availableToday: true,
    stripeEnvKey: "VITE_STRIPE_PRICE_NETHERREALM",
    stripeMode: "subscription",
    categories: ["verse"],
  },
  {
    id: "codex-magique-companion",
    titleFr: "Codex magique · companion numérique",
    descriptionFr:
      "Texte source, formules et index des planches — companion de l’encyclopédie visuelle, lecture web immédiate incluse.",
    priceCad: 12,
    priceLabel: "12 $ CA",
    type: "digital",
    ctaPath: "/docs/magique",
    included: [
      "Page `/docs/magique` (lecture en ligne dès maintenant)",
      "Version PDF / export selon configuration Stripe",
      "Ton symbolique — pas de promesse de résultat garanti",
    ],
    availableToday: true,
    stripeEnvKey: "VITE_STRIPE_PRICE_CODEX_MAGIQUE",
    stripeMode: "payment",
    categories: ["codex"],
  },
  {
    id: "pilote-entreprise",
    titleFr: "Pilote entreprise · 90 jours",
    descriptionFr:
      "Pilote 90 jours aligné sur l’offre entreprise : votre idée, trois preuves mesurables (temps, impact, témoignages), modules déjà en ligne — devis humain, pas de checkout automatique.",
    priceCad: null,
    priceLabel: "Sur devis",
    type: "lead",
    ctaPath: "/pilote",
    included: [
      "Parcours /entreprises : dépôt d’idée → pilote 90 jours → co-construction",
      "Hub circulaire (marketplace, atlas, promesses, Nature QC) en démo réelle",
      "Preuves /docs/preuves — distinct des passes Stripe individuels",
    ],
    availableToday: true,
    badge: "Entreprise",
    categories: ["entreprise"],
  },
  {
    id: "pack-fondateur-codex",
    titleFr: "Pack fondateur · tous les Codex",
    descriptionFr:
      "Encyclopédie complète + bundles Codex + priorité créateur — palier premium pour early supporters du hub.",
    priceCad: 89,
    priceLabel: "89 $ CA",
    type: "lead",
    ctaPath: "/contact",
    included: [
      "Tous les numériques ci-dessus (après validation manuelle)",
      "File prioritaire pour retours produit",
      "Pas de partenaire ou ISO fictif — relation directe avec le fondateur",
    ],
    availableToday: false,
    availabilityNote: "Liste d’attente — écrivez-nous avec l’objet « pack-fondateur ».",
    badge: "Premium",
    categories: ["entreprise", "codex", "encyclopedie", "premium"],
  },
  {
    id: "feuille-route-publique",
    titleFr: "Feuille de route publique",
    descriptionFr:
      "Ce qui est en ligne aujourd’hui vs ce qui arrive — transparence honnête via la page entreprises, sans exposer le document interne de restructuration.",
    priceCad: 0,
    priceLabel: "Lecture",
    type: "digital",
    ctaPath: "/entreprises",
    included: [
      "Modules disponibles maintenant (formulaire, pilote, hubs)",
      "Projections nommées — pas de rapport ESG fantôme",
      "Lien vers preuves vérifiables `/docs/preuves`",
    ],
    availableToday: true,
    badge: "Transparence",
    categories: ["gratuit", "entreprise"],
  },
];

export function filterDigitalProducts(filterId) {
  if (!filterId || filterId === "all") return DIGITAL_PRODUCTS;
  if (filterId === "gratuit") return DIGITAL_PRODUCTS.filter((p) => p.priceCad === 0);
  if (filterId === "aujourdhui") return DIGITAL_PRODUCTS.filter((p) => p.availableToday);
  if (filterId === "premium") {
    return DIGITAL_PRODUCTS.filter(
      (p) =>
        p.badge === "Premium" ||
        p.id === "pack-fondateur-codex" ||
        (p.priceCad != null && p.priceCad >= 44),
    );
  }
  return DIGITAL_PRODUCTS.filter((p) => p.categories?.includes(filterId));
}

export function getDigitalProductById(id) {
  return DIGITAL_PRODUCTS.find((p) => p.id === id) ?? null;
}

export function getFeaturedDigitalProduct() {
  return DIGITAL_PRODUCTS.find((p) => p.featured) ?? null;
}

export function getProductStripePriceId(product) {
  if (!product?.stripeEnvKey) return "";
  const key = product.stripeEnvKey;
  return (typeof import.meta !== "undefined" && import.meta.env?.[key]) || "";
}

export function buildProductLeadPath(product) {
  const base = product?.ctaPath || "/contact";
  if (product?.type === "lead" && product?.id) {
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}product=${encodeURIComponent(product.id)}`;
  }
  return base;
}

export function buildProductMailto(product) {
  const subject = encodeURIComponent(`CirculAI — ${product.titleFr}`);
  const body = encodeURIComponent(
    `Bonjour,\n\nJe m'intéresse au produit : ${product.id} (${product.priceLabel}).\n\n— `,
  );
  return `mailto:${typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPPORT_EMAIL ? import.meta.env.VITE_SUPPORT_EMAIL : "support@egor69.ca"}?subject=${subject}&body=${body}`;
}
