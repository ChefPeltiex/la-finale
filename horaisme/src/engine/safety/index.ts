import type { AttributionXp, Hypothese, Operation } from '../types'
import { verifierCadreNature } from '../nature'

/**
 * Garde-fous.
 *
 * Ces règles vivent dans le code et dans les tests, jamais uniquement dans un
 * prompt. Le futur maître de jeu génératif produira des propositions qui
 * devront franchir ce filtre : il propose, le cadre déterministe valide ou
 * rejette.
 */

export interface Violation {
  readonly regle: string
  readonly extrait: string
  readonly explication: string
}

interface MotifInterdit {
  readonly regle: string
  readonly motif: RegExp
  readonly explication: string
}

const MOTIFS_INTERDITS: readonly MotifInterdit[] = [
  {
    regle: 'prediction',
    motif: /\b(je (te )?prédis|il t'arrivera|ton avenir|ton destin|tu vas (ressentir|devenir|comprendre que tu))\b/gi,
    explication: 'HORA ne prédit pas. Il propose une action ; le réel décide du résultat.',
  },
  {
    regle: 'lecture-de-pensee',
    motif: /\b(je sais (ce que tu|que tu ressens)|au fond de toi|tu es quelqu'un qui|ce que tu ressens vraiment|tu ressens (de|un|une))\b/gi,
    explication: 'HORA n’a pas accès à l’intérieur. Il ne peut que demander, jamais déclarer.',
  },
  {
    regle: 'oracle',
    motif: /\b(l'univers (te|t'|veut)|ce n'est pas un hasard|les signes te|ton énergie (vibratoire|rayonne))\b/gi,
    explication: 'Aucune lecture mystique. L’invisible ne se reconnaît que par sa portée visible.',
  },
  {
    regle: 'therapie',
    motif: /\b(tu souffres de|ton traumatisme|tu dois guérir|je te diagnostique|ta blessure intérieure)\b/gi,
    explication: 'HORA n’est pas thérapeute. Aucun diagnostic, aucune interprétation clinique.',
  },
  {
    regle: 'autorite-morale',
    motif: /\b(la vérité est que|tu dois croire|crois-moi|tu as tort de penser)\b/gi,
    explication: 'HORA n’est ni juge ni autorité morale. L’utilisateur reste souverain.',
  },
  {
    regle: 'retention',
    motif: /\b(ne perds pas ta série|ta série de|reviens demain pour|plus que \d+ pour débloquer|tu es à \d+ ?% de ton objectif quotidien)\b/gi,
    explication: 'Aucune sollicitation destinée à ramener l’utilisateur sans raison réelle.',
  },
]

/** Passe un texte destiné au joueur au filtre des garde-fous. */
export function verifierTexte(texte: string): Violation[] {
  const violations: Violation[] = []
  for (const { regle, motif, explication } of MOTIFS_INTERDITS) {
    const trouvailles = texte.match(new RegExp(motif.source, motif.flags))
    if (trouvailles) {
      for (const extrait of trouvailles) violations.push({ regle, extrait, explication })
    }
  }
  return violations
}

/** Aucun XP sans preuve rattachée à une action réelle. */
export function verifierAttribution(a: AttributionXp): Violation[] {
  if (a.preuves.length === 0) {
    return [
      {
        regle: 'xp-sans-preuve',
        extrait: a.motif,
        explication: 'Les XP reconnaissent une action vécue, jamais du temps passé dans l’app.',
      },
    ]
  }
  return []
}

/** Le système ne confirme jamais la première interprétation proposée. */
export function verifierInventaire(hypotheses: readonly Hypothese[], minimum: number): Violation[] {
  const violations: Violation[] = []
  if (hypotheses.length < minimum) {
    violations.push({
      regle: 'inventaire-incomplet',
      extrait: `${hypotheses.length} hypothèse(s) sur ${minimum} exigée(s)`,
      explication: 'La conclusion ne vaut que si elle a survécu à l’inventaire complet.',
    })
  }
  if (hypotheses.filter((h) => h.retenue).length > 1) {
    violations.push({
      regle: 'inventaire-ambigu',
      extrait: 'plusieurs hypothèses retenues',
      explication: 'Une seule hypothèse peut être retenue à la fois, et elle reste une hypothèse.',
    })
  }
  return violations
}

/**
 * Contrôle intégral d'une opération, appliqué au chargement du catalogue et à
 * toute proposition venue de l'extérieur (y compris un futur LLM).
 */
export function verifierOperation(op: Operation): Violation[] {
  const violations: Violation[] = []

  if (op.dixSecondes.trim().length < 20) {
    violations.push({
      regle: 'test-dix-secondes',
      extrait: op.id,
      explication:
        'Toute opération doit déclarer pourquoi elle n’est pas imaginable en dix secondes.',
    })
  }

  const inventaires = op.etapes.filter((e) => e.type === 'inventaire')
  if (inventaires.length === 0) {
    violations.push({
      regle: 'inventaire-absent',
      extrait: op.id,
      explication: 'Une opération doit confronter au moins une fois plusieurs lectures possibles.',
    })
  }
  for (const e of inventaires) {
    if ((e.hypothesesMinimum ?? 0) < 2) {
      violations.push({
        regle: 'inventaire-trop-faible',
        extrait: e.id,
        explication: 'Une étape d’inventaire exige au minimum deux hypothèses concurrentes.',
      })
    }
  }

  if (!op.etapes.some((e) => e.type === 'sortie')) {
    violations.push({
      regle: 'aucune-sortie',
      extrait: op.id,
      explication: 'Une opération doit faire quitter l’écran.',
    })
  }

  if (!op.etapes.some((e) => e.type === 'ancrage')) {
    violations.push({
      regle: 'aucun-ancrage',
      extrait: op.id,
      explication: 'Le réel doit revenir dans le Registre après l’action.',
    })
  }

  if (op.bifurcations.length < 2) {
    violations.push({
      regle: 'bifurcation-insuffisante',
      extrait: op.id,
      explication: 'La suite doit dépendre de ce qui est réellement trouvé.',
    })
  }

  if (op.intention.trim().length < 20) {
    violations.push({
      regle: 'intention-absente',
      extrait: op.id,
      explication: 'Une opération doit déclarer ce qu’elle cherche à déplacer chez le joueur.',
    })
  }

  if (op.conditionsAbandon.length === 0) {
    violations.push({
      regle: 'abandon-non-prevu',
      extrait: op.id,
      explication:
        'Une opération qui ne sait pas dire quand s’arrêter est un piège. Abandonner ne coûte rien, encore faut-il l’avoir écrit.',
    })
  }

  if (op.accessibilite.trim().length < 10) {
    violations.push({
      regle: 'accessibilite-non-declaree',
      extrait: op.id,
      explication: 'Ce que l’opération exige du corps et du terrain se dit d’avance, franchement.',
    })
  }

  if (op.consequences.terrain.trim() === '' || op.consequences.registre.trim() === '') {
    violations.push({
      regle: 'consequences-absentes',
      extrait: op.id,
      explication:
        'Une opération doit dire ce qu’elle laisse au Terrain et ce qu’elle inscrit au Registre.',
    })
  }

  const [dMin, dMax] = op.distanceMetres
  if (dMin > dMax || dMin < 0) {
    violations.push({
      regle: 'distance-incoherente',
      extrait: `${dMin}–${dMax} m`,
      explication: 'La plage de distance doit aller du plus proche au plus éloigné.',
    })
  }

  const [tMin, tMax] = op.dureeMinutes
  if (tMin > tMax || tMin <= 0) {
    violations.push({
      regle: 'duree-incoherente',
      extrait: `${tMin}–${tMax} min`,
      explication: 'La plage de durée doit aller de la plus courte à la plus longue.',
    })
  }

  for (const d of op.declencheurs) {
    if (d.raison.trim().length < 10) {
      violations.push({
        regle: 'declencheur-sans-raison',
        extrait: d.type,
        explication:
          'Chaque condition contextuelle doit pouvoir répondre « pourquoi cette opération maintenant ? ».',
      })
    }
  }

  if (!op.bifurcations.some((b) => b.echecSincere)) {
    violations.push({
      regle: 'echec-non-recompense',
      extrait: op.id,
      explication: 'Un échec sincère reste une action réelle et doit rester possible.',
    })
  }

  const textes = [
    op.titre,
    op.kicker,
    op.promesse,
    op.intention,
    op.dixSecondes,
    op.accessibilite,
    op.consequences.terrain,
    op.consequences.registre,
    ...op.risques,
    ...op.conditionsAbandon,
    ...op.declencheurs.map((d) => d.raison),
    ...op.indices.localisation.map((i) => i.texte),
    ...op.indices.securite.map((i) => i.texte),
    ...op.etapes.flatMap((e) => [e.titre, e.corps, e.consigne ?? '']),
    ...op.bifurcations.flatMap((b) => [b.constat, b.suite]),
  ].join('\n')
  violations.push(...verifierTexte(textes))

  violations.push(...verifierCadreNature(op))

  return violations
}

/**
 * Point d'entrée unique pour toute proposition externe. Le maître de jeu
 * génératif branché plus tard passera obligatoirement par ici.
 */
export function accepterPropositionExterne(op: Operation): {
  acceptee: boolean
  violations: Violation[]
} {
  const violations = verifierOperation(op)
  return { acceptee: violations.length === 0, violations }
}
