/**
 * Principes canoniques, sous forme de données.
 *
 * Cette liste alimente l'onglet Découvrir et sert de référence aux tests
 * philosophiques : chaque principe qui peut être vérifié par le code l'est.
 */

export interface Principe {
  readonly id: string
  readonly enonce: string
  readonly consequenceTechnique: string
  /** Nom du test qui garantit ce principe, ou `null` s'il relève du contenu. */
  readonly test: string | null
}

export const PRINCIPE_CENTRAL =
  'L’invisible n’est pas nié, mais il n’est jamais déclaré vrai par simple ressenti. Une intention devient significative lorsqu’elle produit une portée visible, observable ou vérifiable.'

export const PRINCIPES: readonly Principe[] = [
  {
    id: 'conviction-confrontable',
    enonce: 'Une conviction doit pouvoir affronter la réalité.',
    consequenceTechnique:
      'Toute supposition de HORA est inscrite au Registre, puis confrontée à ce que le joueur a réellement constaté.',
    test: 'le Registre conserve le statut initial et le verdict réel',
  },
  {
    id: 'hypothese-reste-hypothese',
    enonce: 'Une hypothèse doit rester une hypothèse tant qu’elle n’a pas rencontré de preuve.',
    consequenceTechnique:
      'Retenir une hypothèse ne la transforme jamais en fait. L’interface n’offre aucun bouton « confirmer ».',
    test: 'retenir une hypothèse ne change pas son statut',
  },
  {
    id: 'inventaire-complet',
    enonce: 'Une conclusion n’a de valeur que si elle a survécu à l’examen de plusieurs possibilités.',
    consequenceTechnique:
      'Une étape d’inventaire ne se franchit pas avec une seule lecture. Deux minimum, imposées par le moteur.',
    test: 'une étape d’inventaire exige au moins deux hypothèses',
  },
  {
    id: 'architecte-de-sa-vie',
    enonce: 'L’être humain demeure l’architecte de sa propre vie, pas l’architecte du cosmos.',
    consequenceTechnique:
      'Aucun énoncé prédictif ni interprétation du sens de la vie. Filtré dans le code.',
    test: 'aucun contenu ne contient de formulation prédictive',
  },
  {
    id: 'technologie-qui-s-efface',
    enonce: 'La technologie doit renforcer l’autonomie humaine, puis s’effacer autant que possible.',
    consequenceTechnique:
      'Le mode poche éteint l’interface pendant l’action. Aucune opération ne se termine devant l’écran.',
    test: 'toute opération comporte une étape de sortie',
  },
  {
    id: 'xp-vecu',
    enonce: 'Les XP sont accordés pour une action réellement vécue, jamais pour du temps d’écran.',
    consequenceTechnique:
      'Une attribution sans preuve est rejetée par le moteur. Aucun compteur de temps passé n’existe dans le modèle de données.',
    test: 'aucun XP ne peut être attribué sans preuve',
  },
  {
    id: 'positif-veritable',
    enonce:
      'Le positif véritable n’est pas le déni du négatif, mais la capacité de le regarder et de le transformer.',
    consequenceTechnique:
      'Toute opération doit prévoir une issue d’échec sincère, récompensée comme une action réelle.',
    test: 'toute opération prévoit un échec sincère',
  },
  {
    id: 'souverainete',
    enonce: 'L’utilisateur reste le maître de ses décisions, de son rythme et de ses interprétations.',
    consequenceTechnique:
      'Sources coupables une à une, refus sans pénalité, abandon sans série brisée, effacement total possible.',
    test: 'refuser ou abandonner ne retire aucun XP',
  },
] as const

export const NE_PAS_CONFONDRE: readonly string[] = [
  'une application de productivité',
  'un coach motivationnel',
  'une plateforme de méditation',
  'une religion ou une doctrine spirituelle',
  'un oracle',
  'un réseau social',
  'une simple liste de défis',
  'une application qui dit seulement d’aller vivre',
]

export const ROLES_HORA = {
  est: ['maître de jeu', 'miroir', 'mémoire', 'bras structurant', 'garde-fou', 'compagnon de discernement'],
  nEstPas: ['gourou', 'prophète', 'juge', 'thérapeute', 'autorité morale', 'oracle'],
} as const

export const BOUCLE_HORA = [
  {
    nom: 'Observer',
    corps: 'Regarder honnêtement la situation, le contexte et ce qui est réellement accessible.',
  },
  {
    nom: 'Lier',
    corps: 'Mettre en relation les observations, l’expérience passée et plusieurs hypothèses possibles.',
  },
  { nom: 'Agir', corps: 'Choisir une action concrète dans le monde réel.' },
  {
    nom: 'Observer le résultat',
    corps: 'Constater ce qui s’est produit, sans réécrire l’expérience pour protéger une croyance.',
  },
  { nom: 'Ajuster', corps: 'Modifier sa compréhension ou sa direction en fonction du réel.' },
] as const

export const FAMILLES = [
  {
    id: 'quete',
    nom: 'Quête',
    corps: 'Unité générale d’action réelle. Une intention, une sortie, un retour.',
  },
  {
    id: 'mission',
    nom: 'Mission',
    corps: 'Action plus structurée, avec plusieurs conditions à réunir.',
  },
  {
    id: 'operation',
    nom: 'Opération',
    corps: 'Expérience immersive, contextuelle et scénarisée, qui bifurque selon le réel.',
  },
  {
    id: 'boss',
    nom: 'Boss',
    corps: 'Difficulté importante ou personnelle, affrontée progressivement, jamais d’un coup.',
  },
] as const
