/**
 * Voix de HORA.
 *
 * Toutes les paroles adressées au joueur vivent ici, jamais éparpillées dans
 * les composants. Un seul endroit à relire, un seul endroit à tester.
 *
 * Ton : adulte, franc, parfois sec, mystérieux sans ésotérisme. HORA ne
 * console pas, ne félicite pas mécaniquement, ne prédit rien.
 */

export const FORMULES = {
  essence: 'Ta vie. Ton terrain de jeu.',
  arbitrage: 'L’IA propose. Le réel décide.',
  ville: 'Tu connais ta ville. Mais tu ne l’as jamais jouée.',
  portee: 'L’invisible se reconnaît par sa portée visible.',
  posture: 'Je suis ton bras structurant, pas ton oracle.',
  inventaire: 'La conclusion ne vaut que si elle a survécu à l’inventaire complet.',
  progression: 'Tu ne montes pas seulement de niveau. Tu élargis ton terrain.',
} as const

export const HORA = {
  accueilSansHistorique:
    'On ne s’est jamais croisés sur le terrain. Je vais commencer petit, et je ne te demanderai rien sur toi que le réel puisse me répondre à ta place.',
  accueilAvecHistorique: 'Tu es déjà sorti. Voyons ce que la journée permet.',

  pourquoiCeci:
    'Voici tout ce qui a influencé cette proposition. Rien d’autre. Si une source te dérange, coupe-la.',

  jeNeSaisPas:
    'Je ne sais pas. Aucune source branchée là-dessus, et je préfère un trou dans le tableau qu’un chiffre inventé.',

  avantSortie:
    'À partir d’ici je ne sers plus à grand-chose. Mets l’appareil dans ta poche.',
  pendantSortie: 'Je me tais. Reviens quand tu as quelque chose de réel à me dire.',
  retour: 'Raconte ce qui s’est produit, pas ce que tu espérais.',

  inventaireRefus:
    'Je ne te dirai pas si c’est la bonne. Donne-m’en une deuxième, même si tu y crois moins.',
  inventaireRetenue:
    'Retenue, pas confirmée. Elle reste une hypothèse jusqu’à ce que le terrain réponde.',

  echecSincere:
    'Tu n’as pas trouvé. Tu es quand même sorti, tu as quand même cherché, et ça, c’est arrivé pour vrai.',

  refusOperation:
    'Écartée. Aucune pénalité, aucune série brisée. Je ne te la remettrai pas devant les yeux.',
  abandon:
    'Abandonnée. Il n’y a rien à récupérer et rien à réparer : aucune série n’existe dans ce système.',

  registreIntro:
    'Voici ce que j’ai affirmé, ce que j’ai supposé, et ce que le réel en a fait. Corrige-moi si je me suis trompé.',

  terrainVide:
    'Ton terrain est encore sombre. Il s’éclaire seulement là où tu es réellement allé.',
} as const

export const NAVIGATION = [
  { id: 'aujourdhui', libelle: 'Aujourd’hui', chemin: '/aujourdhui' },
  { id: 'terrain', libelle: 'Terrain', chemin: '/terrain' },
  { id: 'missions', libelle: 'Missions', chemin: '/missions' },
  { id: 'parcours', libelle: 'Parcours', chemin: '/parcours' },
  { id: 'decouvrir', libelle: 'Découvrir', chemin: '/decouvrir' },
  { id: 'moi', libelle: 'Moi', chemin: '/moi' },
] as const
