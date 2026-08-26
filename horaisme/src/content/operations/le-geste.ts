import type { Operation } from '../../engine/types'
import { plausible } from '../../engine/provenance'

/**
 * « Le geste » — transmission.
 *
 * Le joueur apprend un geste concret d'une personne : nouer un nœud,
 * plier quelque chose, tailler un crayon d'une certaine façon, tenir un
 * outil. Le savoir est noté, puis masqué jusqu'à ce que le joueur le
 * réécrive de mémoire après un intervalle.
 *
 * Le tiers reste anonyme par défaut. Aucune photo de son visage, aucun nom,
 * aucune position privée n'est conservée. Le savoir peut exister sans
 * identifier la personne.
 */

export const leGeste: Operation = {
  id: 'le-geste',
  famille: 'mission',
  thematique: 'savoir-incarne',
  titre: 'Le geste',
  kicker: 'Mission · Transmission · Savoir incarné',
  promesse:
    'Apprendre un geste utile d’une personne, le noter de ta main, et le vérifier de mémoire quelques jours plus tard.',

  intention:
    'Passer de « j’ai vu faire » à « je peux refaire de mémoire ». Un savoir que tu ne peux pas redire n’a pas été transmis : il a été consommé.',

  dixSecondes:
    'Personne ne décide spontanément d’aller demander à un inconnu de lui montrer un geste précis, de noter chaque étape dans ses propres mots, puis de revenir plusieurs jours plus tard pour le réécrire sans regarder ses notes. Le délai, la confrontation avec l’oubli, et le verdict humain sur l’écart ne s’improvisent pas.',

  declencheurs: [
    {
      type: 'lumiere-minimum',
      minutes: 30,
      raison: 'Le geste doit être observable dans la lumière du jour.',
    },
  ],

  dureeMinutes: [25, 55],
  distanceMetres: [0, 2000],
  niveauPhysique: 'marche-douce',
  accessibilite:
    'Se pratique dans un lieu public ou chez une personne de ton entourage. Aucun outil dangereux n’est requis : le geste doit être montrable avec les mains ou des objets du quotidien.',
  materiel: [
    'Les mains de la personne et les tiennes',
    'Un objet simple si le geste en demande un — corde, foulard, crayon, serviette',
    'L’appareil, uniquement après, pour noter le savoir',
  ],
  risques: [
    'N’accepte aucun geste impliquant un outil tranchant, une flamme ou une charge physique si tu n’es pas à l’aise.',
    'Si la personne te demande de l’argent ou un service en échange, refuse poliment et termine l’opération.',
    'Un geste appris chez toi avec un proche reste valable : le tiers n’est pas obligatoirement un inconnu.',
  ],
  conditionsAbandon: [
    'La personne refuse de montrer le geste.',
    'Le geste demande un matériel que tu n’as pas ou ne veux pas utiliser.',
    'Tu ne parviens pas à identifier une étape claire du geste.',
    'Tu n’as plus envie. Ça suffit comme raison.',
  ],
  preuveAttendue: 'observation',

  etapes: [
    {
      id: 'fragment',
      type: 'fragment',
      titre: 'Le geste à trouver',
      corps:
        'Il y a autour de toi des gestes que des personnes maîtrisent sans y penser. Nouer un nœud qui ne glisse pas. Plier une serviette en triangle stable. Tenir un couteau pour éplucher sans se couper. Enrouler une rallonge sans l’abîmer.\n\nChoisis-en un que tu aimerais pouvoir refaire toi-même. Puis trouve une personne qui accepte de te le montrer.',
      consigne: 'Le geste doit être montrable en moins de deux minutes et répétable seul.',
      saisie: {
        champ: 'observation',
        invite: 'Quel geste vas-tu demander à qui ?',
        valeurPreRemplie: null,
        exemples: [
          'Demander à mon voisin de me montrer le nœud qu’il utilise pour attacher ses plantes.',
          'Demander à une collègue comment elle plie ses serviettes en triangle.',
        ],
      },
    },
    {
      id: 'inventaire',
      type: 'inventaire',
      titre: 'L’inventaire',
      corps:
        'Avant d’y aller, note deux hypothèses sur ce qui pourrait rendre le geste difficile à retenir.\n\nL’ordre des étapes ? Le sens des mains ? Une tension à maintenir ? C’est souvent un détail invisible, pas l’ensemble, qui fait échouer la reproduction.',
      consigne: 'Deux obstacles possibles au minimum.',
      hypothesesMinimum: 2,
      saisie: {
        champ: 'souvenir',
        invite: 'Quels sont deux endroits où le geste risque de s’oublier ?',
        valeurPreRemplie: null,
        exemples: [
          'Je vais oublier dans quel sens tourner la boucle.',
          'Je vais oublier la tension à donner à la corde au moment de serrer.',
        ],
      },
    },
    {
      id: 'sortie',
      type: 'sortie',
      titre: 'La rencontre',
      corps:
        'Va voir la personne. Demande-lui poliment de te montrer le geste une fois, lentement. Regarde. Demande-lui ensuite de le refaire une deuxième fois en te disant à voix haute ce que ses mains font.\n\nNe filme pas. Ne prends pas de photo de la personne. Note le geste de mémoire dès que tu es seul.',
      consigne: 'Échange court, geste montré, mémoire écrite ensuite.',
      modePoche: true,
    },
    {
      id: 'constat',
      type: 'terrain',
      titre: 'Le constat',
      corps:
        'La personne a montré le geste, ou elle a refusé, ou tu n’as pas trouvé quelqu’un.\n\nSi elle a montré, écris maintenant ce que tu retiens du geste, dans tes mots. C’est cet écrit qui sera masqué pour le rappel.',
      consigne: 'Résume le geste étape par étape. Ce que tu écris ici reste masqué jusqu’au rappel.',
      saisie: {
        champ: 'savoir-recu',
        invite: 'Décris le geste, étape par étape, comme tu l’expliquerais à quelqu’un.',
        valeurPreRemplie: null,
        exemples: [
          'Première étape : former une boucle avec le fil court passant par-dessus le fil long...',
          'On tient le tissu par le coin, on le plie en deux vers soi, puis on rabat la pointe vers la base...',
        ],
      },
    },
    {
      id: 'ancrage',
      type: 'ancrage',
      titre: 'L’ancrage',
      corps:
        'Le savoir est enregistré. Il sera masqué pendant quelques jours.\n\nQuand tu reviendras, tu le réécriras de mémoire. Aucune note ne te sera montrée avant ta saisie. C’est toi qui jugeras ce qui a tenu et ce qui s’est perdu.',
      consigne: 'Le savoir appartient à ta mémoire, pas à l’appareil.',
    },
  ],

  bifurcations: [
    {
      id: 'transmission-reussie',
      constat: 'La personne a montré le geste et j’ai pu le noter étape par étape.',
      suite:
        'Tu as un savoir dans ta mémoire, écrit de ta main. Sa vraie valeur ne se révélera que dans quelques jours, quand tu essaieras de le redire sans regarder. D’ici là, il dort ici.',
      echecSincere: false,
      xp: 80,
    },
    {
      id: 'refus-du-tiers',
      constat: 'La personne a refusé de montrer le geste.',
      suite:
        'Le refus est un résultat complet. Tu as posé la question, la personne a choisi de ne pas répondre, et l’opération se termine proprement. Aucun savoir n’a été pris contre sa volonté.',
      echecSincere: true,
      xp: 40,
    },
    {
      id: 'geste-non-reproductible',
      constat: 'Le geste était trop complexe ou trop rapide pour être noté.',
      suite:
        'Tu as essayé de capter quelque chose qui demandait plus de temps. C’est une donnée utile : ce geste n’est pas encore à ta porte. Tu peux revenir avec une demande plus simple.',
      echecSincere: true,
      xp: 50,
    },
    {
      id: 'personne-absente',
      constat: 'Je n’ai pas trouvé de personne disponible pour me montrer un geste.',
      suite:
        'Tu es sorti avec une intention précise et tu n’as pas trouvé de cible. C’est une observation négative, pas un échec. Le savoir reste à trouver.',
      echecSincere: true,
      xp: 30,
    },
  ],

  suppositions: [
    plausible(
      'Il existe dans ton entourage ou ton quartier une personne prête à montrer un geste simple.',
      'Composition de l’opération',
      'Déduit de la densité sociale. En cas d’isolement complet, l’opération peut être reportée ou pratiquée avec une personne contactée en ligne au préalable.',
    ),
    plausible(
      'Le geste choisi est montrable en deux minutes.',
      'Composition de l’opération',
      'Si le geste demande plus de temps, l’opération doit être découpée ou abandonnée.',
    ),
  ],

  sourcesUtilisees: ['horloge', 'position', 'lumiere', 'mobilite'],

  propositions: [
    {
      id: 'geste-etapes-claires',
      enonce: 'Le geste peut se décomposer en étapes claires et nommables.',
      resultatAttendu:
        'Tu parviens à écrire une suite d’étapes qui te permettraient de tenter le geste seul plus tard.',
      confiance: 0.55,
      statutEpistemique: 'plausible',
    },
    {
      id: 'geste-retient-en-partie',
      enonce: 'Après quelques jours, tu retiendras une partie du geste et en oublieras une autre.',
      resultatAttendu:
        'Le rappel montre des étapes correctes et d’autres incomplètes ou inversées.',
      confiance: 0.6,
      statutEpistemique: 'plausible',
    },
  ],

  tiers: {
    anonymeParDefaut: true,
    donneesFacultatives: [],
    formuleDeConsentement:
      'Je voudrais apprendre ce geste. Je note seulement le geste, pas votre nom ni votre visage. Vous pouvez refuser, sans problème.',
    siRefus:
      'Si la personne refuse, remercie et repars. Aucune insistance, aucune photo, aucun enregistrement.',
  },

  savoir: {
    categorie: 'geste',
    fenetreMinimaleJours: 3,
    justificationFenetre:
      'Un geste moteur simple commence à se dégrader après quelques jours sans répétition. Redire le geste dans la foulée ne prouverait pas qu’il a été retenu.',
    formesDePreuve: ['reproduction-geste', 'reformulation', 'demonstration'],
  },

  indices: {
    localisation: [
      {
        cran: 'contextuel',
        texte:
          'Commence par quelqu’un de ton entourage proche ou un commerçant dont le geste est visible : un fleuriste qui attache ses bouquets, un vendeur qui plie ses sacs.',
      },
      {
        cran: 'sensoriel',
        texte:
          'Choisis un geste que tu pourras reproduire avec tes propres mains ou un objet que tu as chez toi.',
      },
      {
        cran: 'directionnel',
        texte:
          'Demande à la personne de le faire deux fois : une fois vite, une fois lentement en nommant chaque étape.',
      },
      {
        cran: 'zone',
        texte:
          'Le geste doit tenir en cinq étapes maximum. Au-delà, il devient une leçon, pas un échange.',
      },
    ],
    securite: [
      {
        categorie: 'interdit',
        texte:
          'Aucune photo, aucun enregistrement, aucune position du tiers n’est conservé sans son consentement explicite. Par défaut, le savoir est anonyme.',
      },
      {
        categorie: 'interdit',
        texte:
          'Ne filme pas la personne. Si tu veux une preuve visuelle du geste, demande-lui de le refaire devant toi sans l’appareil, puis reproduis-le toi-même plus tard.',
      },
    ],
  },

  consequences: {
    terrain:
      'Le geste appris entre dans ta mémoire de savoirs. S’il a été retenu, il devient une capacité que tu peux utiliser sans l’application.',
    registre:
      'J’ai supposé que le geste pouvait être décomposé et retenu. Le rappel de mémoire corrigera cette supposition.',
  },
}
