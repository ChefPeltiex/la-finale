/**
 * Prompts IA prêts à copier — adaptés CirculAI / Egor69 (sources externes citées dans le MD).
 */

export const PROMPT_SOURCES = [
  { label: "Blog du Modérateur", url: "https://www.blogdumoderateur.com/ia-prompts-professionnels-digital/" },
  { label: "Mon-IA.ca — entrepreneurs", url: "https://mon-ia.ca/blog/chatgpt-pour-entrepreneurs-20-prompts-qui-boostent-votre-productivite/" },
  { label: "Vie de dingue", url: "https://viededingue.com/meilleurs-prompts-chatgpt-entrepreneurs/" },
  { label: "Webikeo — contenu", url: "https://pro.webikeo.fr/blog/50-idees-de-prompts-chatgpt-pour-creer-du-contenu-engageant/" },
  { label: "Data Bird — data", url: "https://www.data-bird.co/blog/10-prompts-data-analyst" },
  { label: "Sitew", url: "https://www.sitew.com/intelligence-artificielle/prompts-chatgpt" },
];

export const PROMPT_GUARDRAIL = `Tu travailles pour CirculAI (pilote territorial Québec) et Egor69 (culture / encyclopédie).
INTERDIT : inventer partenariats, chiffres de pilote, ou promesses scientifiques.
OBLIGATOIRE : ton humble, français québécois, distinguer CirculAI (mairie) vs Egor69 (public).
Si une donnée manque, dis « baseline honnête — pilote non démarré ».`;

/** @type {Array<{ id: string, tag: string, title: string, source: string, body: string }>} */
export const CIRCULAI_PROMPTS_COPY = [
  {
    id: "meta",
    tag: "Écouter d'abord",
    title: "Méta-prompt — questions avant réponse",
    source: "Blog du Modérateur",
    body: `J'ai besoin d'aide pour [OBJECTIF EN UNE PHRASE].
Avant de rédiger quoi que ce soit, pose-moi toutes les questions utiles :
public (maire / OBNL / citoyen / investisseur), contraintes, format, longueur, ce qu'il ne faut PAS dire.
Ne produis aucun contenu tant que je n'ai pas répondu.
Organise tes questions : essentiel d'abord, puis détails.`,
  },
  {
    id: "challenger",
    tag: "Vérité",
    title: "Challenger — ne pas me flatter",
    source: "Blog du Modérateur",
    body: `Ne m'approuve pas par réflexe. Sois un partenaire exigeant :
- Quelles suppositions sont fragiles ?
- Qu'est-ce qu'un sceptique bien informé dirait ?
- Où ma logique est faible ?
- Propose une version plus humble si je survends le pilote.
Priorité : vérité > accord. Français québécois.`,
  },
  {
    id: "pilote",
    tag: "Mairie",
    title: "Pilote 90 j — lettre ou speech",
    source: "CirculAI (sur mesure)",
    body: `Tu es rédacteur pour un OBNL québécois (économie circulaire).
Rédige [lettre 1 page / script 60 s / FAQ 5 questions] pour un pilote CirculAI :
- 1 site, 90 jours, 3 preuves vérifiables (flux, matching, confiance partenaire)
- Pas de blockchain, pas de promesse miracle
- Egor69 / Verse = hors dossier institutionnel
- Ville cible : Québec / Limoilou
- Lien kit : https://egor69.ca/docs/circulai-kit-regional
Commence par 2 questions de clarification.`,
  },
  {
    id: "fb-seconde-main",
    tag: "Public",
    title: "Post Facebook — seconde main",
    source: "Mon-IA · Webikeo (adapté)",
    body: `Tu es community manager pour une marketplace locale au Québec (français).
Produit : seconde main — vente, don, échange, réparation près de chez soi.
Équation (une fois) : Style + Économie + Écoresponsabilité = Le Nouveau Chic.
Ton : chaleureux, concret, pas moralisateur. 80–120 mots + 3 hashtags Québec.
CTA : /seconde-main — inscription gratuite en 60 s.
INTERDIT : faux chiffres d'utilisateurs.`,
  },
  {
    id: "idees-content",
    tag: "Idées",
    title: "10 idées de contenu (titres seulement)",
    source: "Webikeo",
    body: `Stratège content pour [CirculAI OU Egor69].
Public : [citoyens / décideurs / encyclopédie].
10 idées : titre + angle + format (carrousel, reel, court article).
Chaque idée = 1 phrase « pourquoi c'est honnête ». Pas le texte complet.`,
  },
  {
    id: "delta-m",
    tag: "Pédagogie",
    title: "Expliquer ΔM en 3 niveaux",
    source: "Blog du Modérateur (structuré)",
    body: `Explique ΔM = M_entrée − M_sortie − M_stock pour un citoyen de Québec.
3 niveaux : débutant (analogie placard), intermédiaire (tableau), expert (limites honnêtes).
2 questions de clarification d'abord. Pas de jargon blockchain.`,
  },
  {
    id: "data-pilote",
    tag: "Data",
    title: "KPI pilote — petits volumes",
    source: "Data Bird (adapté)",
    body: `Analyste pilote territorial modeste. Données : [coller ici].
1) 3 bullets pour un élu (sans embellir)
2) Données manquantes
3) 3 KPI pour 90 jours
Ne extrapole pas si n < 10 événements.`,
  },
  {
    id: "planche",
    tag: "Encyclopédie",
    title: "Légende planche Larousse",
    source: "Egor69 (sur mesure)",
    body: `Légende planche encyclopédie or & noir.
Titre : [TITRE]. Mots-clés : [3].
120–180 mots + 1 citation courte. Ton poétique ancré — lecteur héros.
Pas de liste à puces.`,
  },
  {
    id: "couches",
    tag: "Codex",
    title: "Public vs privé ce soir",
    source: "Ton Codex (couches)",
    body: `Sépare PUBLIC ce soir vs PRIVÉ (carnets).
PUBLIC : 1 speech, kit CirculAI, preuves, /seconde-main.
PRIVÉ : grimoire, codes, joual — matière première.
Tableau 2 colonnes + 1 phrase pour le maire.`,
  },
];
