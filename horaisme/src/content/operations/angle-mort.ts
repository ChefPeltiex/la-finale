import type { Operation } from '../../engine/types'
import { plausible, simule } from '../../engine/provenance'

/**
 * « L'angle mort » — opération fondatrice.
 *
 * Elle démontre en une seule expérience : contexte local, énigme visuelle,
 * proximité réelle, hypothèses concurrentes, sortie de l'écran, validation
 * terrain, bifurcation selon le résultat, confrontation du plausible à
 * l'observable, ancrage final.
 */

export const angleMort: Operation = {
  id: 'angle-mort',
  famille: 'operation',
  thematique: 'perception',
  titre: 'L’angle mort',
  kicker: 'Opération · Terrain proche',
  promesse:
    'Un détail que tu croises chaque semaine et que tu serais incapable de dessiner de mémoire.',

  intention:
    'Faire apparaître l’écart entre « connaître un lieu » et « l’avoir réellement regardé ». Le familier est ce qu’on cesse de voir.',

  dixSecondes:
    'Personne ne décide spontanément d’aller défendre deux hypothèses concurrentes sur l’emplacement d’un détail de façade recadré au point d’être méconnaissable, puis de trancher sur place. L’énigme visuelle, la contrainte de proximité et la suite qui change selon l’état réel du lieu ne s’improvisent pas en dix secondes.',

  declencheurs: [
    {
      type: 'lumiere-minimum',
      minutes: 45,
      raison: 'Reconnaître un détail de façade demande d’y voir clair.',
    },
  ],

  dureeMinutes: [25, 60],
  distanceMetres: [200, 900],
  niveauPhysique: 'marche-douce',
  accessibilite:
    'Trottoirs urbains, aucun dénivelé imposé. Le détail se regarde depuis la voie publique : rien n’oblige à entrer nulle part ni à s’approcher de près.',
  materiel: ['Rien d’autre que tes yeux', 'L’appareil, qui restera dans ta poche'],
  risques: [
    'Chercher un détail en levant les yeux fait oublier la circulation. Regarde la rue avant les façades.',
    'Ne franchis aucune clôture, aucune cour, aucun terrain privé. Le détail est visible depuis la rue ou il ne compte pas.',
  ],
  conditionsAbandon: [
    'La nuit tombe avant que tu aies trouvé.',
    'Le seul point de vue possible se trouve sur une propriété privée.',
    'Tu n’as plus envie. Ça suffit comme raison.',
  ],
  preuveAttendue: 'observation',

  etapes: [
    {
      id: 'fragment',
      type: 'fragment',
      titre: 'Le fragment',
      corps:
        'Ce détail existe à moins de neuf cents mètres d’ici. Tu passes devant régulièrement. Tu ne pourrais pas le décrire.\n\nJe te donne l’image. Pas l’adresse.',
      consigne:
        'Regarde-le une minute pleine avant de continuer. Pas trente secondes : une minute.',
    },
    {
      id: 'inventaire',
      type: 'inventaire',
      titre: 'L’inventaire',
      corps:
        'Tu as déjà une idée. Je ne te dirai pas si elle est bonne — ce n’est pas mon rôle et je n’en sais rien.\n\nÉcris-la. Puis écris-en une seconde, à laquelle tu crois moins. Les deux partent avec toi.',
      consigne: 'Deux emplacements possibles au minimum. Le terrain tranchera, pas moi.',
      hypothesesMinimum: 2,
    },
    {
      id: 'sortie',
      type: 'sortie',
      titre: 'La sortie',
      corps:
        'À partir d’ici je ne sers plus à grand-chose. Mets l’appareil dans ta poche.\n\nJe me tais jusqu’à ton retour.',
      consigne: 'Sors. Va vérifier de tes yeux.',
      modePoche: true,
    },
    {
      id: 'constat',
      type: 'terrain',
      titre: 'Le constat',
      corps:
        'Tu y es allé, ou tu as cherché sans aboutir. Les deux sont arrivés pour vrai.\n\nDis-moi ce que tu as trouvé, pas ce que tu espérais trouver.',
      consigne: 'Choisis ce qui correspond exactement à ce que tu as sous les yeux.',
    },
    {
      id: 'ancrage',
      type: 'ancrage',
      titre: 'L’ancrage',
      corps:
        'Une observation, un ajustement. Rien de plus.\n\nCe que j’avais supposé va aller se faire confronter au Registre.',
      consigne: 'Ce que tu écris ici t’appartient et ne quitte pas cet appareil.',
    },
  ],

  bifurcations: [
    {
      id: 'intact',
      constat: 'Le détail est là, exactement comme sur le fragment.',
      suite:
        'Tu viens de prouver que tu peux reconnaître un lieu à partir d’un morceau isolé de sa surface. Ce que tu croyais familier était surtout mémorisé de loin.',
      echecSincere: false,
      xp: 90,
    },
    {
      id: 'altere',
      constat: 'Il est là, mais quelque chose a changé.',
      suite:
        'Le fragment date d’un autre moment que le tien. Note l’écart : c’est la seule trace que tu auras que ce lieu bouge.',
      echecSincere: false,
      xp: 110,
    },
    {
      id: 'disparu',
      constat: 'L’endroit existe. Le détail, non.',
      suite:
        'Tu as trouvé un lieu et une absence. C’est un résultat plus rare que le premier, et il vaut plus cher.',
      echecSincere: false,
      xp: 110,
    },
    {
      id: 'introuvable',
      constat: 'Je n’ai pas trouvé.',
      suite:
        'Tu es sorti, tu as cherché, tu as éliminé des possibilités. Rien de tout ça n’est annulé par le fait de ne pas avoir abouti. Le fragment reste ouvert : tu pourras y revenir.',
      echecSincere: true,
      xp: 60,
    },
  ],

  suppositions: [
    plausible(
      'Le détail est encore en place aujourd’hui.',
      'Composition de l’opération',
      'Rien ne me confirme l’état actuel de la façade. C’est une supposition, pas un fait.',
    ),
    plausible(
      'Tu passes devant ce détail au moins une fois par semaine.',
      'Composition de l’opération',
      'Déduit d’un rayon de proximité, pas de tes déplacements réels, que je ne suis pas.',
    ),
    simule(
      'Le fragment provient du Vieux-Québec.',
      'Contenu de démonstration',
      'Image de démonstration. Dans une version reliée à Street View, le fragment serait extrait de ton propre voisinage.',
    ),
  ],

  sourcesUtilisees: ['horloge', 'position', 'lumiere', 'saison', 'mobilite'],

  indices: {
    localisation: [
      {
        cran: 'contextuel',
        texte:
          'Ce genre de détail survit surtout là où les façades n’ont pas été refaites. Cherche du côté du bâti le plus ancien de ton rayon.',
      },
      {
        cran: 'sensoriel',
        texte:
          'La lumière du fragment vient de biais et rase la surface. Ce mur n’est donc pas orienté plein sud.',
      },
      {
        cran: 'directionnel',
        texte:
          'Le détail se trouve à hauteur d’œil ou juste au-dessus, sur une rue que tu empruntes plutôt que sur une place où tu t’arrêtes.',
      },
      {
        cran: 'zone',
        texte: 'Tu es à moins de quatre cents mètres. Trois rues, pas davantage.',
      },
    ],
    securite: [
      {
        categorie: 'interdit',
        texte:
          'Le détail est visible depuis la voie publique. Si tu dois entrer quelque part pour le voir, ce n’est pas le bon.',
      },
    ],
  },

  consequences: {
    terrain:
      'Le lieu du fragment devient un point révélé de ton Terrain, quel que soit le résultat de ta recherche.',
    registre:
      'J’ai supposé que ce détail est encore en place et que tu passes devant chaque semaine. Ces deux suppositions partent au Registre et attendent ton constat.',
  },
}
