/**
 * Archétypes de combat narratifs 100 % originaux — hommage au genre *fighting* sans
 * emprunter noms, costumes ou l’histoire de personnages tiers (ex. franchise Mortal Kombat).
 * Deux voies : Ordre (protecteurs) / Chaos (antagonistes ludiques), miroir satirique.
 */

export const CAMP_ORDER = "order";
export const CAMP_CHAOS = "chaos";

export const ARENA_ARCHETYPES = [
  {
    id: "shield-monk",
    camp: CAMP_ORDER,
    title: "Moine du bouclier vivant",
    vibe: "Distance · absorption · riposte calme",
    hook: "Convertit l’agression ennemie en chaleur récupérable pour l’équipe.",
  },
  {
    id: "glass-strategist",
    camp: CAMP_ORDER,
    title: "Stratège du verre trempé",
    vibe: "Lecture de grille · feintes honnêtes",
    hook: "Expose les patterns adverses ; bonus si les coéquipiers suivent ses pings.",
  },
  {
    id: "ember-emissary",
    camp: CAMP_ORDER,
    title: "Émissaire des braises diplomatiques",
    vibe: "Zones de vérité · débuff mensonge",
    hook: "Réduit les buffs « faux hero » côté Chaos pendant qu’un allié engage.",
  },
  {
    id: "root-warden",
    camp: CAMP_ORDER,
    title: "Gardienne des racines urbaines",
    vibe: "Ancrage · anti-dash",
    hook: "Immobilise brièvement les assaillants trop mobiles ; synergy avec tanks légers.",
  },
  {
    id: "signal-paladin",
    camp: CAMP_ORDER,
    title: "Paladin du signal clair",
    vibe: "Burst lumineux · aveuglement court",
    hook: "Marque une cible pour focus équipe sans violence descriptive.",
  },
  {
    id: "archive-knight",
    camp: CAMP_ORDER,
    title: "Chevalier du registre ouvert",
    vibe: "Contrôle · journalisation friendly",
    hook: "Chaque kill virtuel alimente un journal hilarant pour le clan (opt-in).",
  },
  {
    id: "mirror-medic",
    camp: CAMP_ORDER,
    title: "Miroir-soignant",
    vibe: "Soins réflexes · renvoi partiel",
    hook: "Duplique une partie des soins vers un second coéquipier blessé.",
  },
  {
    id: "circuit-judge",
    camp: CAMP_ORDER,
    title: "Juge des circuits équitables",
    vibe: "Sentence · reset cooldown équitable",
    hook: "Une fois par match, égalise les ressources entre deux joueurs volontaires.",
  },
  {
    id: "aurora-ranger",
    camp: CAMP_ORDER,
    title: "Rôdeur aurore",
    vibe: "Mobilité · pièges lumineux",
    hook: "Cartographie les embuscades fictives pour le raid coop.",
  },
  {
    id: "oath-binder",
    camp: CAMP_ORDER,
    title: "Lieuse de serments ludiques",
    vibe: "Buffs conditionnels · pactes",
    hook: "Si trois joueurs chantent la même phrase absurde, buff défense de groupe.",
  },
  {
    id: "quiet-architect",
    camp: CAMP_ORDER,
    title: "Architecte du silence utile",
    vibe: "Mur sonore · réduction spam",
    hook: "Coupe les effets « bruit » ennemis ; favorise la comms vocale clean.",
  },
  {
    id: "tide-oracle",
    camp: CAMP_ORDER,
    title: "Oracle des marées douces",
    vibe: "Prédiction · repositionnement",
    hook: "Indique la prochaine vague d’ennemis scriptés (PvE) pour rire planifié.",
  },

  {
    id: "ember-trickster",
    camp: CAMP_CHAOS,
    title: "Tricheuse des braises",
    vibe: "Feintes brûlantes · chaos contrôlé",
    hook: "Échange sa place avec un ennemi IA pour memes de raid.",
  },
  {
    id: "void-jester",
    camp: CAMP_CHAOS,
    title: "Jongleur du vide comique",
    vibe: "Knockback narratif · punchlines",
    hook: "Bonus si le chat envoie un gag PG ; sinon malus auto-infligé.",
  },
  {
    id: "paper-tyrant",
    camp: CAMP_CHAOS,
    title: "Tyran du papier millimétré",
    vibe: "Zones administratives · slow",
    hook: "Immobilise avec des piles de formulaires fictifs — satire bureaucratique.",
  },
  {
    id: "glitch-duelist",
    camp: CAMP_CHAOS,
    title: "Duelliste du glitch aimable",
    vibe: "RNG rigged · chaos graphique",
    hook: "Petits bugs visuels consentis ; jamais de crash, toujours un revert.",
  },
  {
    id: "midnight-auctioneer",
    camp: CAMP_CHAOS,
    title: "Encanteur de minuit",
    vibe: "Enchères de dégâts · surenchère friends",
    hook: "Les dégâts virtuels sont « vendus » aux enchères coop ; profits en points banane.",
  },
  {
    id: "shadow-influencer",
    camp: CAMP_CHAOS,
    title: "Influenceuse de l’ombre douce",
    vibe: "Charm · trends toxiques parodiés",
    hook: "Retourne les buffs « hype » contre les bots satiriques.",
  },
  {
    id: "rust-collector",
    camp: CAMP_CHAOS,
    title: "Collectionneuse de rouille noble",
    vibe: "DoT moral · corrosion d’armure",
    hook: "Accumule des stacks « sarcasme » convertibles en rires forcés.",
  },
  {
    id: "storm-notary",
    camp: CAMP_CHAOS,
    title: "Notaire de la tempête",
    vibe: "Signatures électriques · stun légal",
    hook: "Force un ennemi IA à « signer » un contrat de paix factice comique.",
  },
  {
    id: "mirror-breaker",
    camp: CAMP_CHAOS,
    title: "Briseuse de miroirs polis",
    vibe: "Brut · burst risqué",
    hook: "Dommages élevés mais chance de se prendre son propre reflet.",
  },
  {
    id: "noise-barrel",
    camp: CAMP_CHAOS,
    title: "Canon à bruit digeste",
    vibe: "AoE sonore · confusion light",
    hook: "Remplit la jauge « Chaos » globale pour déclencher un événement boss rigolo.",
  },
  {
    id: "vine-vandal",
    camp: CAMP_CHAOS,
    title: "Vandale des vignes pixel",
    vibe: "Entraves · croissance nocive",
    hook: "Plantes fictives bloquent les lanes ; feu allié les dégage.",
  },
  {
    id: "clock-thief",
    camp: CAMP_CHAOS,
    title: "Voleuse d’horloges",
    vibe: "Vol de temps-cooldown · risque",
    hook: "Vole 2 s à un allié consentant pour burst ; à utiliser avec humour.",
  },
  {
    id: "cordial-paradox",
    camp: CAMP_CHAOS,
    title: "Avatar du paradoxe cordial",
    vibe: "Swap moral · inversion buff",
    hook: "Inverse Order/Chaos visuellement sans changer les stats — pur spectacle.",
  },
];

export function archetypesByCamp(camp) {
  return ARENA_ARCHETYPES.filter((a) => a.camp === camp);
}