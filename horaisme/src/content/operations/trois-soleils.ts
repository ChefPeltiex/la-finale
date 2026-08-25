import type { Operation } from '../../engine/types'
import { fait, plausible } from '../../engine/provenance'

/**
 * « Les trois soleils » — démystification contextuelle.
 *
 * Le joueur part d'une image forte : trois soleils dans le ciel d'hiver.
 * L'opération ne lui dit pas ce que c'est. Elle lui donne trois explications
 * incompatibles et un moyen de trancher lui-même, dehors, en une mesure.
 *
 * Le renversement qu'elle vise n'est pas « c'était un phénomène optique ».
 * C'est : le phénomène est fréquent, et son étrangeté ne venait pas du ciel
 * mais du fait que personne ne regarde. Le mystère était dans l'observateur.
 *
 * Tous les faits atmosphériques cités proviennent d'Atmospheric Optics
 * (Les Cowley) et du National Weather Service (NOAA). Le geste de mesure et
 * la consigne de sécurité sont repris littéralement d'Atmospheric Optics :
 * pouce tendu sur le soleil, main écartée, l'auriculaire tombe sur le halo.
 * Un seul geste qui protège les yeux, mesure l'angle et élimine l'artefact
 * d'objectif.
 */

export const troisSoleils: Operation = {
  id: 'trois-soleils',
  famille: 'mission',
  thematique: 'demystification',
  titre: 'Les trois soleils',
  kicker: 'Mission · Ciel d’hiver',
  promesse:
    'Trois soleils au-dessus de ta ville. Deux sont faux. Tu peux établir lequel est lequel avec ta seule main.',

  intention:
    'Remplacer « c’est bizarre » par « j’ai mesuré ». Un phénomène cesse d’être surnaturel quand on dispose d’un test capable de le contredire.',

  dixSecondes:
    'Personne ne décide seul d’aller mesurer un écart angulaire à main tendue entre un soleil et son double, ni de vérifier de quel côté se trouve le rouge, ni de tester si l’objet survit au fait de bouger de vingt mètres. Ces trois gestes sont ce qui sépare une observation d’une impression, et aucun ne s’improvise depuis un fauteuil.',

  declencheurs: [
    {
      type: 'saison',
      valeurs: ['hiver'],
      raison:
        'Les parhélies sont visibles toute l’année, mais l’hiver aux latitudes moyennes est la période où ils sont le plus fréquents et le soleil le plus bas.',
    },
    {
      type: 'lumiere-minimum',
      minutes: 40,
      raison: 'Le phénomène est solaire. Sans soleil au-dessus de l’horizon, il n’y a rien à voir.',
    },
    {
      type: 'meteo-exclue',
      valeurs: ['pluie', 'neige', 'orage', 'brouillard'],
      raison:
        'Il faut un ciel voilé de cirrus, pas un ciel bouché. Sous une averse, le phénomène est physiquement impossible.',
    },
  ],

  dureeMinutes: [20, 45],
  distanceMetres: [0, 600],
  niveauPhysique: 'marche-douce',
  accessibilite:
    'Se fait depuis n’importe quel endroit d’où l’on voit le ciel bas vers le soleil : une fenêtre dégagée, un balcon, un coin de rue. Aucune marche n’est imposée. Une seule contrainte réelle : un horizon libre du côté du soleil.',
  materiel: [
    'Ta main — c’est l’instrument de mesure',
    'Un poteau, un coin de bâtiment ou un arbre pour cacher le soleil',
    'L’appareil, uniquement à la fin',
  ],
  risques: [
    'Ne regarde jamais le soleil directement, même une seconde. Cache-le derrière un poteau ou un bord de bâtiment avant de chercher quoi que ce soit autour.',
    'Ne vise jamais le soleil à travers un viseur optique. Un viseur concentre la lumière : c’est plus dangereux que l’œil nu.',
    'L’hiver, on lève la tête et on oublie le sol. Regarde où tu marches entre deux observations.',
  ],
  conditionsAbandon: [
    'Le ciel est complètement couvert ou complètement dégagé : dans les deux cas, il n’y a pas de cristaux de glace à traverser.',
    'En cas de gêne visuelle, arrête immédiatement et n’y reviens pas aujourd’hui.',
    'Le soleil est déjà trop haut et rien ne se détache. Reviens plus tôt ou plus tard dans la journée.',
    'Tu n’as plus envie. Ça suffit comme raison.',
  ],
  preuveAttendue: 'observation',

  etapes: [
    {
      id: 'fragment',
      type: 'fragment',
      titre: 'Le fragment',
      corps:
        'Des gens photographient trois soleils au-dessus de la ville, l’hiver, en fin d’après-midi. Un vrai au centre, deux autres posés de chaque côté, à la même hauteur exacte.\n\nCertains y ont vu un présage. D’autres un reflet. D’autres un défaut d’appareil.\n\nJe ne te dirai pas laquelle de ces lectures tient. Je vais te donner de quoi trancher toi-même.',
      consigne:
        'Avant de continuer : décide ce que tu crois, maintenant. C’est cette idée-là que le ciel va confirmer ou démolir.',
    },
    {
      id: 'inventaire',
      type: 'inventaire',
      titre: 'L’inventaire',
      corps:
        'Quatre explications tiennent debout sur le papier. Elles ne peuvent pas être vraies en même temps.\n\nUn reflet sur une vitre d’immeuble. Un artefact dans l’objectif — la NASA elle-même a dû démentir un « arc-en-ciel martien » qui n’était qu’un reflet interne d’optique. Un reflet dans tes propres lunettes. Ou de la lumière traversant des cristaux de glace en suspension.\n\nÉcris-en au moins deux. Garde celle à laquelle tu crois le moins : c’est souvent elle qui décide.',
      consigne: 'Deux explications concurrentes au minimum. La mesure tranchera, pas moi.',
      hypothesesMinimum: 2,
    },
    {
      id: 'sortie',
      type: 'sortie',
      titre: 'La sortie',
      corps:
        'Trouve un endroit d’où tu vois le ciel bas du côté du soleil. Cache le soleil derrière un poteau, un coin de mur, un tronc. Ne l’enlève jamais de derrière son écran.\n\nBras tendu, doigts largement écartés : du pouce au bout de l’auriculaire, tu couvres à peu près vingt degrés. Pouce sur le soleil masqué, l’auriculaire tombe presque exactement là où le phénomène devrait être.\n\nTrois questions, dans cet ordre. À quelle distance angulaire ? À quelle hauteur par rapport au soleil ? De quel côté est le rouge ?\n\nPuis le test qui élimine tout le reste : déplace-toi de vingt pas sur le côté.',
      consigne: 'Sors. Mesure avec ta main. Je me tais.',
      modePoche: true,
    },
    {
      id: 'constat',
      type: 'terrain',
      titre: 'Le constat',
      corps:
        'Tu as regardé le ciel avec une question précise, ce qui est déjà rare.\n\nDis-moi ce que la mesure a donné, pas ce que tu espérais qu’elle donne.',
      consigne: 'Choisis ce qui correspond à ce que tu as réellement mesuré.',
    },
    {
      id: 'ancrage',
      type: 'ancrage',
      titre: 'L’ancrage',
      corps:
        'Le ciel a répondu, ou il n’a rien donné aujourd’hui. Les deux comptent.\n\nCe que j’avais avancé va se faire confronter à ce que tu as vu.',
      consigne: 'Ce que tu écris ici t’appartient et ne quitte pas cet appareil.',
    },
  ],

  bifurcations: [
    {
      id: 'signature-complete',
      constat:
        'Les trois critères y étaient : environ 22°, à la hauteur du soleil, rouge tourné vers lui.',
      suite:
        'Tu viens d’identifier un parhélie par la mesure, pas par la ressemblance. Aucun reflet de vitre, aucun artefact d’objectif ne réunit ces trois conditions à la fois : c’est la conjonction qui prouve, pas chaque critère isolé. Retiens le geste — il vaut pour tout phénomène de ciel que tu croiseras.',
      echecSincere: false,
      xp: 120,
    },
    {
      id: 'halo-seul',
      constat: 'Pas de faux soleils, mais un cercle complet autour du soleil.',
      suite:
        'Tu as trouvé le halo de 22°, l’autre membre de la famille. Regarde à l’intérieur : le ciel y est plus sombre qu’à l’extérieur. Ce n’est pas une illusion, c’est que la glace ne peut dévier aucun rayon d’un angle plus faible. Tu as sous les yeux un trou géométrique dans le ciel.',
      echecSincere: false,
      xp: 110,
    },
    {
      id: 'dementi-reflet',
      constat:
        'L’objet a bougé, disparu ou changé de place quand je me suis déplacé — ou il n’existait que dans l’écran.',
      suite:
        'Tu as éliminé le phénomène atmosphérique par un test, et c’est un résultat plus solide que de l’avoir confirmé par ressemblance. Un reflet reste accroché à la surface qui le produit ; un artefact reste accroché à l’objectif. Ce qui vient du ciel ne bouge pas quand tu bouges. Tu m’as contredite avec une preuve.',
      echecSincere: false,
      xp: 130,
    },
    {
      id: 'rien',
      constat: 'Rien dans le ciel aujourd’hui.',
      suite:
        'Tu es sorti, tu as cherché avec un protocole, et le ciel n’avait rien à montrer. Ce n’est pas un échec : c’est une observation négative, et elle a la même valeur que l’autre. La différence entre toi et hier, c’est que maintenant tu sais quoi chercher — et selon les observateurs de longue date, un halo est visible environ deux fois par semaine sous nos latitudes, à condition de regarder.',
      echecSincere: true,
      xp: 70,
    },
  ],

  suppositions: [
    plausible(
      'Le ciel au-dessus de toi porte des cirrus, donc des cristaux de glace.',
      'Composition de l’opération',
      'Déduit de la saison, pas d’une observation du ciel réel. Je ne vois pas par ta fenêtre.',
    ),
    plausible(
      'Le soleil est assez bas pour que le phénomène se détache.',
      'Composition de l’opération',
      'Déduit de l’heure et de la saison. Le relief et le bâti autour de toi peuvent tout changer.',
    ),
    fait(
      'Le rouge d’un parhélie est toujours du côté du soleil.',
      'National Weather Service (NOAA) et Atmospheric Optics',
      'La lumière rouge est moins déviée que la bleue par la glace. L’ordre des couleurs ne dépend donc pas du hasard : il est imposé par la réfraction.',
    ),
  ],

  sourcesUtilisees: ['horloge', 'lumiere', 'saison', 'meteo', 'position'],

  propositions: [
    {
      id: 'trois-soleils-vingt-deux-degres',
      enonce:
        'Si un faux soleil est présent, il se tient à environ 22° du soleil et exactement à sa hauteur.',
      resultatAttendu:
        'Pouce tendu sur le soleil masqué, main écartée : le phénomène tombe près du bout de l’auriculaire, et non plus haut ni plus bas que le soleil.',
      confiance: 0.7,
      statutEpistemique: 'fait',
    },
    {
      id: 'trois-soleils-rouge-vers-le-soleil',
      enonce: 'Le bord coloré en rouge est celui qui fait face au soleil.',
      resultatAttendu:
        'En regardant le faux soleil, tu vois le rouge du côté intérieur, puis l’orange, le jaune, et un bleu délavé vers l’extérieur.',
      confiance: 0.75,
      statutEpistemique: 'fait',
    },
    {
      id: 'trois-soleils-ne-bouge-pas',
      enonce:
        'Le phénomène ne se déplacera pas par rapport au soleil quand tu changeras de position.',
      resultatAttendu:
        'Après vingt pas de côté, le phénomène est toujours à la même distance angulaire et à la même hauteur qu’avant.',
      confiance: 0.65,
      statutEpistemique: 'fait',
    },
    {
      id: 'trois-soleils-frequent',
      enonce:
        'Ce phénomène est fréquent au-dessus de ta ville. Ce n’est pas lui qui est rare, c’est le fait de le chercher.',
      resultatAttendu:
        'En reprenant l’habitude de regarder le ciel bas quand il est voilé, tu en croises un dans les semaines qui suivent.',
      confiance: 0.5,
      statutEpistemique: 'plausible',
    },
  ],

  indices: {
    localisation: [
      {
        cran: 'contextuel',
        texte:
          'Le phénomène ne vit pas dans un ciel bleu ni dans un ciel bouché. Il lui faut un voile blanc, laiteux, à travers lequel le soleil reste visible mais adouci.',
      },
      {
        cran: 'sensoriel',
        texte:
          'Cherche à la hauteur exacte du soleil, jamais au-dessus ni en dessous. C’est un alignement horizontal, et l’œil a tendance à chercher trop haut.',
      },
      {
        cran: 'directionnel',
        texte:
          'Une traînée blanche sans couleur peut s’étirer horizontalement à partir du phénomène, vers l’extérieur. Ce n’est pas un nuage : c’est de la lumière réfléchie sur les flancs verticaux des cristaux.',
      },
      {
        cran: 'zone',
        texte:
          'Les meilleures fenêtres sont les deux heures après le lever et les deux heures avant le coucher. Le phénomène s’écarte du soleil et pâlit à mesure que celui-ci monte, et devient difficile à distinguer bien au-dessus de 40° de hauteur.',
      },
    ],
    securite: [
      {
        categorie: 'interdit',
        texte:
          'Ne regarde jamais le soleil directement, même brièvement. Cache-le derrière un poteau ou un coin de bâtiment avant de chercher autour. La lésion rétinienne causée par le soleil est indolore sur le moment et peut n’apparaître que des heures plus tard.',
      },
      {
        categorie: 'interdit',
        texte:
          'Ne vise jamais le soleil à travers un viseur optique ou des jumelles. L’optique concentre la lumière et la brûlure est immédiate.',
      },
      {
        categorie: 'discrimination',
        texte:
          'Les trois critères d’un vrai parhélie : environ 22° du soleil, à sa hauteur exacte, rouge tourné vers lui. C’est leur réunion qui identifie, jamais un seul d’entre eux.',
      },
      {
        categorie: 'sosie',
        texte:
          'Un reflet de vitre glisse ou disparaît quand tu te déplaces. Un artefact d’objectif bouge quand tu tournes ou recadres l’appareil, et n’existe pas à l’œil nu. Un reflet de lunettes suit ta tête. Aucun des trois ne survit à la fois au déplacement latéral et à l’observation sans appareil.',
      },
    ],
  },

  consequences: {
    terrain:
      'Ton point d’observation devient un poste de ciel sur ton Terrain : un endroit dont tu sais qu’il offre un horizon dégagé du bon côté. Il resservira.',
    registre:
      'J’avance quatre choses mesurables sur ce phénomène : sa distance angulaire, sa hauteur, l’orientation de ses couleurs et sa fréquence. Les quatre partent au Registre et attendent ta mesure. Si le ciel me contredit, c’est toi qui gagnes.',
  },
}
