/** Indices courts pour le guide agent selon la page courante. */
export function getGuideHintsForPath(pathname) {
  if (pathname === "/" || pathname.startsWith("/#")) {
    return {
      title: "Accueil",
      steps: [
        "Choisis une carte rapide : Publier, Marketplace, Atlas ou Verse 3D.",
        "Ouvre le guide (coin bas-droit) pour basculer mode simple / profond.",
        "Relance le parcours initiatique depuis le profil ou le pied de page.",
      ],
    };
  }
  if (pathname.startsWith("/marketplace") || pathname.startsWith("/publier")) {
    return {
      title: "Échanger",
      steps: [
        "Parcours les annonces ou publie un objet en quelques minutes.",
        "Filtre par type : don, échange, réparation ou vente.",
        "Consulte une fiche avant de contacter le membre.",
      ],
    };
  }
  if (pathname.startsWith("/atlas") || pathname.startsWith("/world")) {
    return {
      title: "Explorer",
      steps: [
        "L’Atlas regroupe fiches et savoirs ; le Verse 3D est le vestibule immersif.",
        "Utilise la carte du site pour ne pas te perdre dans les modules.",
        "Mode simple : libellés courts dans la navigation.",
      ],
    };
  }
  if (pathname.startsWith("/jeu") || pathname.startsWith("/playtime")) {
    return {
      title: "Jouer",
      steps: [
        "Les quêtes et jeux récompensent l’engagement sans promesses irréalistes.",
        "Ton profil conserve badges et progression.",
      ],
    };
  }
  if (pathname.startsWith("/docs/investisseur") || pathname.startsWith("/docs/rituel")) {
    return {
      title: "Codex",
      steps: [
        "Édition investisseur : résumé pour partenaires et pilote 90 jours.",
        "Édition rituel : pratique personnelle — optionnelle, non imposée.",
        "Télécharge l’encyclopédie PDF depuis l’accueil ou le bandeau de cette page.",
      ],
    };
  }
  if (pathname.startsWith("/profil") || pathname.startsWith("/mon-univers")) {
    return {
      title: "Univers & profil",
      steps: [
        "Personnalise ton univers et tes alertes.",
        "Relance le parcours initiatique depuis ce profil.",
      ],
    };
  }
  return {
    title: "Navigation",
    steps: [
      "Cinq pôles : Échanger, Explorer, Agir, Jouer, Univers Egor69.",
      "Toutes les routes historiques restent accessibles dans le menu déplié.",
      "Doc compagnon : docs/modeles-operationnels.md (modèles à calibrer).",
    ],
  };
}

export const COMPANION_DOC_PATH = "docs/modeles-operationnels.md";
