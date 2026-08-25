import type { Operation } from '../../engine/types'
import { fait, inconnu, plausible } from '../../engine/provenance'
import { ailDesBois, seuilDeclinAilDesBois } from '../nature/regles-quebec'

/**
 * « Le sosie » — nature, sans prélèvement.
 *
 * L'opération fait passer le joueur de « je reconnais » à « je peux prouver
 * que ce n'est pas l'autre ». La différence est exactement celle qui sépare
 * un cueilleur prudent d'un cueilleur chanceux.
 *
 * Trois décisions de conception valent d'être expliquées.
 *
 * 1. Aucun prélèvement, et l'odeur n'est pas le critère central. Froisser une
 *    feuille est le test le plus cité, mais il est piégeux : une fois les
 *    doigts imprégnés d'ail, tout sent l'ail. Un test qui se contamine
 *    lui-même ne peut pas fonder une identification. On lui préfère des
 *    caractères visuels, photographiables, qu'un tiers peut vérifier.
 *
 * 2. Le sosie mortel n'est pas celui qu'on croit. Le muguet est le sosie
 *    célèbre, mais le vérâtre vert pousse dans les mêmes sous-bois humides,
 *    à la même saison, et il tue. Le canal de sécurité nomme les deux.
 *
 * 3. Aucune position n'est publiée. `especeSensible` est vrai, l'espèce est
 *    désignée vulnérable au Québec depuis 1995, et une colonie divulguée est
 *    une colonie exposée. L'écran de fin l'affiche comme une décision, pas
 *    comme une donnée manquante.
 */

export const leSosie: Operation = {
  id: 'le-sosie',
  famille: 'operation',
  thematique: 'nature',
  titre: 'Le sosie',
  kicker: 'Opération · Sous-bois de printemps',
  promesse:
    'Deux plantes se ressemblent. L’une est protégée, l’autre peut tuer. Tu vas apprendre à les séparer sans rien toucher.',

  intention:
    'Passer de « je reconnais » à « je peux prouver que ce n’est pas l’autre ». Une identification qui ne repose que sur la ressemblance n’est pas une identification : c’est un pari.',

  dixSecondes:
    'Personne ne devine seul quels caractères séparent réellement deux plantes voisines, ni lesquels sont des faux amis. La nervation parallèle, que presque tout le monde cite, ne discrimine rien du tout : les deux plantes l’ont. Il faut savoir quoi regarder avant de sortir, puis vérifier sur du vivant, sur place, que les caractères se recoupent.',

  declencheurs: [
    {
      type: 'saison',
      valeurs: ['printemps'],
      raison:
        'Le feuillage n’existe qu’entre la fonte des neiges et la fermeture de la canopée. Hors de cette fenêtre, il n’y a rien à observer.',
    },
    {
      type: 'lumiere-minimum',
      minutes: 90,
      raison:
        'L’identification repose sur la couleur d’une base de tige et sur la texture d’une feuille. En lumière déclinante, sous couvert forestier, les deux disparaissent.',
    },
    {
      type: 'meteo-exclue',
      valeurs: ['orage'],
      raison: 'Pas de sous-bois par temps d’orage.',
    },
  ],

  dureeMinutes: [40, 75],
  distanceMetres: [300, 1200],
  niveauPhysique: 'marche-douce',
  accessibilite:
    'Se pratique en lisière ou en bordure de sentier : il n’est jamais nécessaire de quitter un chemin. Un terrain plat de sous-bois humide suffit. Aucune escalade, aucun hors-piste. Si le sol est détrempé ou instable, l’opération se fait depuis le sentier, à distance.',
  materiel: [
    'Un appareil photo — c’est le seul outil du jour',
    'Des chaussures qui tolèrent l’humidité',
    'Rien pour couper, rien pour creuser, rien pour transporter',
  ],
  risques: [
    'Le vérâtre vert est violemment toxique. Toute la plante l’est, et il pousse dans les mêmes sous-bois humides à la même saison.',
    'Le muguet est toxique pour le cœur, feuilles et baies comprises.',
    'Piétiner une colonie l’endommage autant qu’en emporter une partie. Reste sur le sentier ou sur la roche.',
    'Tiques en sous-bois au printemps : vérifie-toi en rentrant.',
  ],
  conditionsAbandon: [
    'Terrain privé, ou site où la récolte et la circulation sont encadrées — un parc, une aire protégée, un refuge faunique.',
    'Le doute d’identification persiste : c’est une réponse valide, et l’opération se ferme sur « je ne sais pas ».',
    'Tu es seul et le terrain devient accidenté ou détrempé.',
    'La colonie est petite ou piétinée. Recule et laisse-la.',
  ],
  preuveAttendue: 'photo',

  etapes: [
    {
      id: 'fragment',
      type: 'fragment',
      titre: 'Le fragment',
      corps:
        'Trois plantes partagent le même sous-bois au printemps : des feuilles vertes, larges, aux nervures bien parallèles, sortant du sol par petits groupes.\n\nLa première est protégée par la loi depuis 1995. La deuxième arrête le cœur. La troisième est parmi les plus toxiques de nos forêts.\n\nLa nervation parallèle, que presque tout le monde cite comme critère, appartient aux trois. Elle ne sépare rien.',
      consigne:
        'Avant de continuer : combien de caractères crois-tu nécessaires pour être sûr ? Retiens ton chiffre.',
    },
    {
      id: 'inventaire',
      type: 'inventaire',
      titre: 'L’inventaire',
      corps:
        'Devant une colonie, quatre lectures restent possibles, et elles n’ont pas les mêmes conséquences.\n\nC’est l’ail des bois. C’est le muguet. C’est le vérâtre vert. Ou : deux de ces plantes poussent côte à côte, ce qui est le cas de figure le plus dangereux — et le plus courant.\n\nÉcris au moins deux hypothèses. Celle que tu écartes trop vite est celle qui mérite la photo.',
      consigne: 'Deux hypothèses minimum. La photo tranchera, pas ton impression.',
      hypothesesMinimum: 2,
    },
    {
      id: 'sortie',
      type: 'sortie',
      titre: 'La sortie',
      corps:
        'Sous-bois feuillu, sol riche et frais, souvent un versant nord ou un bas de pente. Reste sur le sentier.\n\nQuand tu trouves un groupe de feuilles, ne le touche pas. Accroupis-toi et photographie trois choses, dans cet ordre.\n\nLa base, là où les feuilles entrent dans le sol : les feuilles sortent-elles séparément, chacune avec sa propre tige, ou sont-elles emboîtées dans une gaine commune ? Y a-t-il une teinte rouge à la base ?\n\nLa surface de la feuille : lisse, ou plissée en accordéon dans le sens des nervures ?\n\nL’ensemble : un groupe de deux ou trois feuilles au ras du sol, ou une tige feuillée qui monte ?\n\nTrois photos. Aucun contact.',
      consigne: 'Sors. Trois photos, trois caractères. Rien ne rentre à la maison.',
      modePoche: true,
    },
    {
      id: 'constat',
      type: 'terrain',
      titre: 'Le constat',
      corps:
        'Tu as regardé une plante avec une méthode plutôt qu’avec une intuition.\n\nDis-moi ce que les trois caractères ont donné. Si deux se contredisent, dis-le aussi : c’est un résultat.',
      consigne: 'Choisis ce que tes photos établissent réellement.',
    },
    {
      id: 'ancrage',
      type: 'ancrage',
      titre: 'L’ancrage',
      corps:
        'La colonie reste où elle est. Toi, tu repars avec quelque chose que tu n’avais pas ce matin.\n\nCe que j’avais avancé va être confronté à ce que tu as vu.',
      consigne: 'Ce que tu écris ici reste sur cet appareil.',
    },
  ],

  bifurcations: [
    {
      id: 'identification-etablie',
      constat:
        'Les trois caractères concordent : feuilles séparées à leur base, surface lisse, port bas au ras du sol.',
      suite:
        'Tu as établi une identification par recoupement, et non par ressemblance. C’est la seule forme qui vaille quelque chose. Une observation de plus : la loi permettrait à une personne de prélever jusqu’à 50 bulbes par an ici, alors qu’une récolte annuelle de 10 à 15 % suffit à faire décliner une colonie — 5 % lors d’une mauvaise saison. Regarde la colonie devant toi et demande-toi ce que 50 bulbes y représenteraient. Le chiffre que tu obtiens est la vraie récompense de la journée.',
      echecSincere: false,
      xp: 150,
    },
    {
      id: 'sosie-trouve',
      constat:
        'Les caractères pointent ailleurs : feuilles emboîtées dans une gaine commune, ou surface franchement plissée.',
      suite:
        'Tu as identifié un sosie, et c’est un meilleur résultat que d’avoir confirmé ce que tu cherchais. Des feuilles emboîtées à la base désignent le muguet ; une surface plissée en accordéon sur une tige qui monte désigne le vérâtre vert, la plus toxique des trois. Tu viens d’apprendre à reconnaître ce qu’il ne faut jamais confondre — et tu l’as appris sans que ça te coûte quoi que ce soit.',
      echecSincere: false,
      xp: 160,
    },
    {
      id: 'doute-persistant',
      constat: 'Les caractères se contredisent, ou je n’arrive pas à trancher.',
      suite:
        'Alors la réponse est « je ne sais pas », et c’est une réponse complète. Elle se distingue d’une erreur : tu as regardé, tu as photographié, et les indices n’ont pas convergé. Le doute est le comportement correct devant une plante qui a un sosie mortel. Le prélèvement reste verrouillé, et tes photos gardent leur valeur — un botaniste peut les lire, ou tu peux revenir.',
      echecSincere: true,
      xp: 110,
    },
    {
      id: 'rien-trouve',
      constat: 'Aucune colonie trouvée aujourd’hui.',
      suite:
        'Tu es sorti avec un protocole et le sous-bois n’avait rien à te montrer là où tu as cherché. Ce n’est pas un échec, c’est une observation négative sur une zone précise, et elle vaut mieux qu’une supposition. La fenêtre est courte — quelques semaines avant que la canopée se referme. Tu sais maintenant quoi regarder.',
      echecSincere: true,
      xp: 80,
    },
  ],

  suppositions: [
    plausible(
      'L’espèce est présente dans un sous-bois près de toi.',
      'Composition de l’opération',
      'Déduit de l’habitat général et de la saison, jamais d’une observation confirmée à ta position. Une présence passée ne garantit aucune présence actuelle.',
    ),
    fait(
      'L’ail des bois est désigné vulnérable au Québec depuis 1995.',
      ailDesBois.statutConservation?.source ?? 'Ministère de l’Environnement du Québec',
      'Une des premières espèces désignées après l’adoption de la Loi sur les espèces menacées ou vulnérables.',
    ),
    fait(
      'Une récolte annuelle de 10 à 15 % d’une colonie suffit à la faire décliner ; 5 % lors d’une saison défavorable.',
      seuilDeclinAilDesBois.source,
      'Résultat publié dans Journal of Ecology. Ce n’est pas une règle de droit : la loi encadre la personne, l’étude décrit la colonie.',
    ),
    inconnu(
      'Le statut de propriété du terrain où tu vas chercher',
      'Aucune source de cadastre n’est branchée. Je ne sais pas si ce sous-bois est public, privé, ou situé dans une aire où la circulation est encadrée. C’est à toi de le vérifier avant d’entrer.',
    ),
  ],

  sourcesUtilisees: ['horloge', 'position', 'lumiere', 'saison', 'mobilite'],

  propositions: [
    {
      id: 'sosie-base-separee',
      enonce:
        'Chez l’ail des bois, chaque feuille sort du sol séparément, avec sa propre tige. Chez le muguet, deux ou trois feuilles sont emboîtées dans une gaine commune.',
      resultatAttendu:
        'La photo de la base montre soit des tiges distinctes qui se séparent au niveau du sol, soit des feuilles enroulées les unes dans les autres.',
      confiance: 0.7,
      statutEpistemique: 'fait',
    },
    {
      id: 'sosie-feuille-plissee',
      enonce:
        'Une feuille fortement plissée en accordéon dans le sens des nervures désigne le vérâtre vert, jamais l’ail des bois.',
      resultatAttendu:
        'La photo de surface montre soit une feuille lisse et souple, soit un plissé profond et régulier impossible à confondre une fois vu.',
      confiance: 0.75,
      statutEpistemique: 'fait',
    },
    {
      id: 'sosie-nervation-inutile',
      enonce:
        'La nervation parallèle ne permet de distinguer aucune des trois plantes. C’est un faux critère.',
      resultatAttendu:
        'Sur tes photos, les nervures sont parallèles quelle que soit l’espèce que tu as trouvée.',
      confiance: 0.85,
      statutEpistemique: 'fait',
    },
    {
      id: 'sosie-teinte-rouge-insuffisante',
      enonce:
        'La teinte rouge à la base est un indice utile, mais elle ne suffit pas seule : certaines populations d’ail des bois ont une base pâle.',
      resultatAttendu:
        'Tu trouves soit une base rouge, soit une base pâle, sans que cela permette à soi seul de conclure.',
      confiance: 0.6,
      statutEpistemique: 'plausible',
    },
  ],

  nature: {
    prelevementAutorise: false,
    ingestionAutorisee: false,
    especeSensible: true,
    sosiesDangereux: [
      'Veratrum viride — vérâtre vert, faux ellébore. Violemment toxique, mêmes sous-bois humides, même saison.',
      'Convallaria majalis — muguet. Toxique pour le cœur, feuilles et baies comprises.',
      'Arisaema triphyllum — arisème petit-prêcheur. Feuille jeune parfois confondue, cristaux irritants.',
    ],
    gestesAutorises: ['observer', 'photographier', 'mesurer', 'dessiner'],
    regle: ailDesBois,
  },

  indices: {
    localisation: [
      {
        cran: 'contextuel',
        texte:
          'Sous-bois feuillu, sol riche et frais, souvent un bas de pente ou un versant nord. La plante disparaît là où la forêt est trop sèche ou trop jeune.',
      },
      {
        cran: 'sensoriel',
        texte:
          'Cherche des taches vertes larges et lisses posées au ras du sol, avant que les arbres aient leurs feuilles. C’est le seul moment de l’année où le sous-bois est plus vert que la canopée.',
      },
      {
        cran: 'directionnel',
        texte:
          'Les colonies suivent souvent une ligne d’humidité — le bas d’un talus, la bordure d’un ruisseau intermittent, le pied d’un versant.',
      },
      {
        cran: 'zone',
        texte:
          'La fenêtre est de quelques semaines, entre la fonte et la fermeture de la canopée. Passé ce moment, les feuilles jaunissent et disparaissent complètement jusqu’au printemps suivant.',
      },
    ],
    securite: [
      {
        categorie: 'interdit',
        texte:
          'Cette opération se fait en observation seule. Rien n’est prélevé, rien n’est goûté, rien n’est rapporté. Une identification par image, la mienne comme la tienne, ne remplace jamais l’avis d’une personne compétente.',
      },
      {
        categorie: 'legal',
        texte:
          'L’ail des bois est une espèce vulnérable au Québec depuis 1995. La loi tolère une exception pour consommation personnelle — 200 g, ou 50 bulbes, ou 50 plants par personne et par an — mais elle ne s’applique ni dans un parc, ni dans une aire protégée, ni dans un refuge faunique, et la vente reste interdite en tout lieu.',
      },
      {
        categorie: 'discrimination',
        texte:
          'Caractère 1 — la base. Chez l’ail des bois, les feuilles sortent du sol séparément, chacune sur sa propre tige. Chez le muguet, elles sont emboîtées les unes dans les autres dans une gaine commune. C’est le caractère le plus fiable en photo.',
      },
      {
        categorie: 'discrimination',
        texte:
          'Caractère 2 — la surface. L’ail des bois a une feuille lisse et souple. Le vérâtre vert a une feuille profondément plissée en accordéon, sur une tige épaisse qui monte au lieu de rester au sol. Une fois vu, ce plissé ne se confond plus.',
      },
      {
        categorie: 'discrimination',
        texte:
          'Caractère 3 — la teinte de la base. Souvent rouge ou bourgogne chez l’ail des bois, pâle chez ses sosies. Utile, mais insuffisant seul : certaines populations ont une base blanche. Un caractère qui a des exceptions ne conclut jamais à lui seul.',
      },
      {
        categorie: 'sosie',
        texte:
          'Le sosie mortel n’est pas le plus célèbre. Le muguet est connu, mais c’est le vérâtre vert qui partage vraiment l’habitat, la saison et la silhouette au premier coup d’œil, et il est violemment toxique dans toutes ses parties. L’arisème petit-prêcheur complète le trio des confusions possibles.',
      },
      {
        categorie: 'discrimination',
        texte:
          'Le faux critère à désapprendre : la nervation parallèle. Les trois plantes l’ont. Presque tout le monde la cite, et elle ne discrimine rien. Un critère partagé par le sosie n’est pas un critère.',
      },
      {
        categorie: 'interdit',
        texte:
          'Ne publie jamais la position exacte d’une colonie, ici ou ailleurs. Une colonie divulguée est une colonie visitée. Cette opération n’enregistre aucune coordonnée précise, par construction.',
      },
    ],
  },

  consequences: {
    terrain:
      'Le secteur est marqué sur ton Terrain à une maille volontairement large, sans coordonnée exacte. Tu sauras y revenir ; personne d’autre ne pourra s’en servir pour trouver la colonie.',
    registre:
      'J’avance quatre affirmations sur ce que tes photos vont montrer, dont une que je crois fragile. Elles partent toutes au Registre. Si le sous-bois me contredit, c’est toi qui as raison, et l’opération le reconnaîtra.',
  },
}
