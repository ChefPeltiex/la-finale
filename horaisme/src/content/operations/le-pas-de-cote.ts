import type { Operation } from '../../engine/types'
import { plausible } from '../../engine/provenance'

/**
 * « Le pas de côté » — Boss ordinaire, social.
 *
 * Le joueur nomme lui-même son objectif dans Moi. Cette opération propose
 * un premier palier pré-écrit, réversible, qu'il peut confirmer au moment
 * de l'exécuter ou refuser sans pénalité.
 *
 * Le défi n'est pas « parler à un inconnu n'importe comment ». Il est :
 * entrer dans un lieu public, adresser la parole à une personne qui y
 * travaille, poser une question précise liée à son savoir-faire, et
 * écouter la réponse. C'est un contact justifié, limité, et réversible.
 */

export const lePasDeCote: Operation = {
  id: 'le-pas-de-cote',
  famille: 'boss',
  thematique: 'boss',
  titre: 'Le pas de côté',
  kicker: 'Boss · Défi ordinaire · Contact social',
  promesse:
    'Entrer dans un lieu public et poser une question vraie à quelqu’un qui y travaille. Pas pour performer. Pour constater que la parole peut être courte.',

  intention:
    'Séparer « parler à un inconnu » de « demander quelque chose de concret à quelqu’un dans son rôle ». Le contact devient un moyen, pas une épreuve de courage.',

  dixSecondes:
    'Personne ne décide spontanément d’entrer dans un lieu précis, de formuler une question qui ne peut pas se résoudre en dix secondes sur Internet, et de noter ce qu’on a entendu différemment de ce qu’on espérait. Le fait de devoir sortir, d’avoir une question en tête, et de rapporter ce qui s’est passé rend l’opération impossible à simuler assis.',

  declencheurs: [
    {
      type: 'lumiere-minimum',
      minutes: 30,
      raison: 'Le défi se fait de jour, quand les lieux publics sont ouverts et fréquentés normalement.',
    },
    {
      type: 'meteo-exclue',
      valeurs: ['tempete', 'verglas'],
      raison: 'Ni la tempête ni le verglas ne rendent une sortie piétonne raisonnable.',
    },
  ],

  dureeMinutes: [15, 40],
  distanceMetres: [0, 1200],
  niveauPhysique: 'marche-douce',
  accessibilite:
    'Trottoirs urbains et lieux publics de plain-pied. Aucune interaction forcée avec des personnes en situation de vulnérabilité : on s’adresse à des personnes dans leur rôle professionnel ou associatif.',
  materiel: [
    'Rien d’autre que ta voix',
    'L’appareil, uniquement pour noter ensuite — pas pendant l’échange',
  ],
  risques: [
    'Ne pose pas de question intime, politique ou financière. Reste dans le cadre du lieu et du rôle.',
    'Si la personne est occupée ou semble pressée, attends ou choisis un autre moment.',
    'N’entre pas dans un espace réservé au personnel. Reste dans la partie publique.',
  ],
  conditionsAbandon: [
    'Le lieu est fermé ou la personne concernée n’est pas là.',
    'Tu te sens mal à l’aise avant, pendant ou après. Arrête.',
    'La question que tu t’es posée ne tient plus debout.',
    'Tu n’as plus envie. Ça suffit comme raison.',
  ],
  preuveAttendue: 'observation',

  etapes: [
    {
      id: 'fragment',
      type: 'fragment',
      titre: 'Le seuil',
      corps:
        'Il y a dans ton quartier un lieu où quelqu’un sait faire quelque chose que tu ne sais pas. Une boulangerie, une quincaillerie, une bibliothèque, un atelier, une librairie, un club.\n\nTu vas entrer. Tu ne vas rien acheter de force. Tu vas poser une question liée à ce que la personne fait — pas une question banale, une question à laquelle tu n’as pas trouvé réponse seul.',
      consigne:
        'Choisis le lieu maintenant. Écris-le. Ce n’est pas un engagement définitif, mais il faut un point de départ.',
      saisie: {
        champ: 'observation',
        invite: 'Quel lieu as-tu choisi, et quelle question vas-tu poser ?',
        valeurPreRemplie: null,
        exemples: [
          'La librairie du coin. Je vais demander comment ils choisissent les livres mis en vitrine.',
          'La boulangerie près de chez moi. Je vais demander pourquoi certaines baguettes ont des entailles sur le dessus.',
        ],
      },
    },
    {
      id: 'inventaire',
      type: 'inventaire',
      titre: 'L’inventaire',
      corps:
        'Avant de franchir la porte, note deux hypothèses sur ce qui va se passer.\n\nPas sur la réponse — tu ne peux pas la deviner. Sur ta propre réaction : tu vas poser la question, tu vas hésiter et repartir, ou la personne va être occupée et tu devras attendre.',
      consigne: 'Deux scénarios possibles au minimum. Le terrain tranchera.',
      hypothesesMinimum: 2,
      saisie: {
        champ: 'souvenir',
        invite: 'Quelles sont deux issues possibles de cet échange ?',
        valeurPreRemplie: null,
        exemples: [
          'La personne répond avec plaisir et j’apprends quelque chose de précis.',
          'La personne est occupée et je repars avec une réponse courte ou sans réponse.',
        ],
      },
    },
    {
      id: 'sortie',
      type: 'sortie',
      titre: 'La sortie',
      corps:
        'Mets l’appareil dans ta poche avant d’entrer.\n\nEntre. Attends ton tour si nécessaire. Pose ta question. Écoute. Si la personne te renvoie vers quelqu’un d’autre, suis la direction ou remercie.\n\nNe prends pas de notes pendant l’échange. Tu vas rapporter de mémoire.',
      consigne: 'Sors. L’échange doit tenir en moins de cinq minutes.',
      modePoche: true,
    },
    {
      id: 'constat',
      type: 'terrain',
      titre: 'Le constat',
      corps:
        'Tu es ressorti. Ce qui s’est passé est ce qui s’est passé.\n\nDis-moi si tu as posé la question, si tu as hésité, si la personne a refusé, ou si tu es reparti sans rien dire. Chacun de ces quatre cas est un résultat.',
      consigne: 'Choisis ce qui correspond exactement à ce qui s’est produit.',
    },
    {
      id: 'ancrage',
      type: 'ancrage',
      titre: 'L’ancrage',
      corps:
        'Ce que tu as entendu, ou ce que tu n’as pas osé, appartient à ta mémoire.\n\nÉcris ce que tu retiens — pas ce que tu aurais voulu retenir.',
      consigne: 'Ce que tu écris ici reste sur cet appareil.',
      saisie: {
        champ: 'souvenir',
        invite: 'Que retiens-tu de cet échange, ou de cette hésitation ?',
        valeurPreRemplie: null,
      },
    },
  ],

  bifurcations: [
    {
      id: 'echange-reussi',
      constat: 'J’ai posé la question et j’ai reçu une réponse.',
      suite:
        'Tu as franchi le seuil avec une question précise, et tu repars avec quelque chose que tu ne savais pas. Ce n’est pas une performance sociale : c’est une preuve qu’un échange utile peut tenir en quelques minutes, avec quelqu’un que tu ne connaissais pas.',
      echecSincere: false,
      xp: 90,
    },
    {
      id: 'echange-partiel',
      constat: 'J’ai posé la question, mais la réponse était courte, évasive ou incomplète.',
      suite:
        'Tu as posé la question. La qualité de la réponse ne dépend pas de toi. Le contact a eu lieu, et c’est le seul objectif de ce palier.',
      echecSincere: false,
      xp: 80,
    },
    {
      id: 'personne-non-disponible',
      constat: 'La personne était occupée, absente ou le lieu était fermé.',
      suite:
        'Tu es allé jusqu’au seuil. Le reste n’avait pas lieu d’être forcé. Une opération qui se termine proprement parce que les conditions n’étaient pas là reste une action réelle.',
      echecSincere: true,
      xp: 50,
    },
    {
      id: 'hesitation-honnete',
      constat: 'Je n’ai pas posé la question. Je suis reparti sans échanger.',
      suite:
        'Tu as choisi le lieu, tu t’es déplacé, et tu es revenu avec une observation honnête : aujourd’hui, le pas n’a pas eu lieu. Ce n’est pas un échec à cacher. C’est une donnée sur toi, et elle vaut autant qu’un échange réussi.',
      echecSincere: true,
      xp: 60,
    },
  ],

  suppositions: [
    plausible(
      'Il existe dans ton rayon un lieu public où une personne peut répondre à une question liée à son savoir-faire.',
      'Composition de l’opération',
      'Déduit de la densité urbaine moyenne. En zone rurale très éloignée, ce défi peut ne pas avoir de cible naturelle.',
    ),
    plausible(
      'La personne abordée sera au moins polie.',
      'Composition de l’opération',
      'C’est une hypothèse, pas une garantie. Une personne occupée ou de mauvaise humeur reste possible.',
    ),
  ],

  sourcesUtilisees: ['horloge', 'position', 'lumiere', 'meteo', 'mobilite'],

  propositions: [
    {
      id: 'pas-de-cote-contact-a-lieu',
      enonce: 'Tu poseras la question à une personne dans le lieu choisi.',
      resultatAttendu:
        'Tu entres, tu t’adresses à quelqu’un identifiable par son rôle, et tu poses la question que tu t’étais fixée.',
      confiance: 0.5,
      statutEpistemique: 'plausible',
    },
    {
      id: 'pas-de-cote-reponse-utile',
      enonce: 'La réponse te donnera une information que tu n’avais pas.',
      resultatAttendu:
        'Tu repars avec au moins un détail, une nuance ou une orientation que tu ne connaissais pas avant d’entrer.',
      confiance: 0.45,
      statutEpistemique: 'plausible',
    },
  ],

  enjeu: {
    classe: 'defi-ordinaire',
    difficulte: { physique: 0, social: 1, emotionnel: 1 },
    arretImmediat:
      'Arrête immédiatement si tu te sens en danger, si la personne te refuse clairement la parole, ou si le lieu te met mal à l’aise. Tu n’as rien à prouver.',
    nonPrise:
      'Cette opération n’est pas un traitement de la timidité ni une thérapie d’exposition. C’est un défi ordinaire : poser une question dans un lieu public.',
  },

  tiers: {
    anonymeParDefaut: true,
    donneesFacultatives: [],
    formuleDeConsentement:
      'Je note ce que vous m’avez appris sans votre nom ni votre visage. Vous pouvez refuser, ça ne change rien pour moi.',
    siRefus:
      'Si la personne préfère ne pas répondre, remercie et repars. Aucune question, aucune insistance.',
  },

  indices: {
    localisation: [
      {
        cran: 'contextuel',
        texte:
          'Choisis un lieu où les questions sont attendues : un commerce de spécialité, une bibliothèque, un office de tourisme, un atelier ouvert. Évite les guichets sous pression.',
      },
      {
        cran: 'sensoriel',
        texte:
          'Avant d’entrer, remarque une chose concrète que tu peux mentionner : une vitrine, un outil, une affiche. Ça donne un point d’accroche à ta question.',
      },
      {
        cran: 'directionnel',
        texte:
          'Préfère un moment calme de la journée — milieu de matinée ou début d’après-midi — où la personne a plus de disponibilité qu’aux heures de pointe.',
      },
      {
        cran: 'zone',
        texte:
          'L’échange doit tenir debout : une question qui se pose en deux phrases et qui se répond en deux phrases.',
      },
    ],
    securite: [
      {
        categorie: 'interdit',
        texte:
          'Ne suis personne dans un espace privé. Ne donne aucune information personnelle. Ne demande rien d’intime, ni contact, ni rendez-vous.',
      },
      {
        categorie: 'discrimination',
        texte:
          'La question doit être liée au rôle de la personne ou au lieu. Une question sur le travail du boulanger est justifiée ; une question sur sa vie privée ne l’est pas.',
      },
    ],
  },

  consequences: {
    terrain:
      'Le lieu devient un point connu sur ton Terrain, quel que soit le résultat. Tu sais maintenant que tu peux y entrer.',
    registre:
      'J’ai supposé qu’un lieu public dans ton rayon permettrait ce contact. Ton constat corrigera cette supposition.',
  },
}
