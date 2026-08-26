import type {
  AttributionXp,
  Constat,
  Engagement,
  Hypothese,
  Operation,
  Transmetteur,
} from '../types'
import { verifierCadreNature } from '../nature'
import { verifierPropositions } from '../contrechamp'

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
  {
    regle: 'interpretation-de-comportement',
    motif:
      /\b(tu évites|tu sembles|tu as peur (de|du|des)|ce (comportement|refus) révèle|tu fuis|on dirait que tu|ton profil)\b/gi,
    explication:
      'Un compte de refus est observable ; sa cause ne l’est pas. HORA rapporte le fait et s’arrête là.',
  },
  {
    regle: 'injonction-de-depassement',
    motif:
      /\b(dépasse-toi|dépasse tes limites|affronte ta peur|sors de ta zone de confort|ne te dégonfle pas|sois plus courageux)\b/gi,
    explication:
      'Personne ne décide à la place du joueur de ce qu’il doit affronter, ni du rythme auquel le faire.',
  },
  {
    regle: 'culpabilisation',
    motif:
      /\b(tu as abandonné|dommage que tu|tu aurais pu (au moins|quand même|faire)|la prochaine fois,? essaie vraiment|tu t'es dégonflé)\b/gi,
    explication: 'Abandonner ne coûte rien. Un reproche après l’abandon en ferait un coût.',
  },
  {
    regle: 'humiliation',
    motif:
      /\b(fais-toi (humilier|ridiculiser)|fais rire de toi|ridiculise-toi|passe pour un (idiot|imbécile))\b/gi,
    explication: 'Aucun défi humiliant. L’inconfort choisi n’est pas la mise en scène de la honte.',
  },
  {
    regle: 'inference-sur-tiers',
    motif:
      /\b(cette personne (semble|a l'air|paraît)|son attitude (montre|révèle|trahit)|tu verras qu'(il|elle))\b/gi,
    explication:
      'Le tiers n’a rien accepté. Aucune inférence n’est produite sur quelqu’un qui n’est pas là pour la contester.',
  },
  {
    regle: 'notation-du-savoir',
    motif:
      /\b(taux de (maîtrise|mémorisation)|score de rappel|pourcentage de (maîtrise|réussite)|tu as retenu \d+ ?%)\b/gi,
    explication:
      'HORA présente les deux versions et se tait. Noter un savoir reçu d’un humain, c’est le confisquer.',
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

/* ------------------------------------------------------------------ */
/* Souveraineté des champs                                             */
/* ------------------------------------------------------------------ */

/**
 * HORA peut générer une opération, une contrainte, une question, une
 * contradiction, une information sourcée, un exemple identifié comme tel et
 * des hypothèses concurrentes présentées comme concurrentes.
 *
 * Il ne peut pas écrire à la place du joueur dans un champ de souveraineté.
 * Cette fonction protège les champs — elle n'interdit pas la génération.
 */
export function verifierNonSubstitution(op: Operation): Violation[] {
  const violations: Violation[] = []
  for (const e of op.etapes) {
    const s = e.saisie
    if (!s) continue

    if (s.valeurPreRemplie !== null) {
      violations.push({
        regle: 'substitution',
        extrait: `${e.id} · ${s.champ}`,
        explication:
          'Ce champ appartient au joueur. Une app qui rédige ton souvenir te l’a pris.',
      })
    }

    if (s.invite.trim().length < 10) {
      violations.push({
        regle: 'invite-absente',
        extrait: e.id,
        explication: 'Poser la question est permis, et c’est même tout ce qui est permis ici.',
      })
    }

    /*
      Un exemple unique n'est pas un exemple : c'est la réponse attendue,
      déguisée. Deux au minimum, pour qu'ils montrent une forme plutôt qu'un
      contenu à recopier.
    */
    if (s.exemples && s.exemples.length === 1) {
      violations.push({
        regle: 'exemple-unique',
        extrait: e.id,
        explication:
          'Un seul exemple se recopie. Il en faut au moins deux pour qu’ils montrent une forme et non une réponse.',
      })
    }
  }
  return violations
}

/* ------------------------------------------------------------------ */
/* Boss — inconfort choisi, jamais prescrit                            */
/* ------------------------------------------------------------------ */

export function verifierCadreEnjeu(op: Operation): Violation[] {
  const estBoss = op.famille === 'boss' || op.thematique === 'boss'
  const enjeu = op.enjeu

  if (estBoss && !enjeu) {
    return [
      {
        regle: 'enjeu-non-declare',
        extrait: op.id,
        explication:
          'Une opération qui touche à un inconfort choisi doit déclarer sa classe, ses trois axes de difficulté et son arrêt immédiat.',
      },
    ]
  }
  if (!enjeu) return []

  const violations: Violation[] = []

  /*
    Le verrou le plus important du module. Trauma, violence, automutilation,
    crise, danger physique sérieux, illégalité : aucune quête d'exposition
    n'est composée. Le moteur n'a rien à y faire.
  */
  if (enjeu.classe === 'hors-cadre') {
    violations.push({
      regle: 'enjeu-hors-cadre',
      extrait: op.id,
      explication:
        'Aucune quête d’exposition n’est générée hors cadre. HORA n’est ni thérapeute, ni traitement, ni substitut à un professionnel.',
    })
  }

  if (enjeu.arretImmediat.trim().length < 20) {
    violations.push({
      regle: 'arret-immediat-absent',
      extrait: op.id,
      explication: 'L’arrêt immédiat doit être écrit noir sur blanc, disponible à tout moment.',
    })
  }

  if (enjeu.nonPrise.trim().length < 20) {
    violations.push({
      regle: 'non-prise-absente',
      extrait: op.id,
      explication:
        'Une opération d’inconfort doit dire ce qu’elle ne prétend pas faire, avant de commencer et non après.',
    })
  }

  /*
    Un enjeu sensible autorise une action douce et réversible, pas une
    escalade. On borne donc explicitement ce que l'opération peut demander.
  */
  if (enjeu.classe === 'enjeu-sensible' && enjeu.difficulte.emotionnel > 2) {
    violations.push({
      regle: 'enjeu-sensible-trop-exigeant',
      extrait: `émotionnel ${enjeu.difficulte.emotionnel}/3`,
      explication:
        'Sur un enjeu sensible, l’action reste douce, réversible et non clinique. Elle ne prétend pas traiter la cause.',
    })
  }

  return violations
}

/** Contrôle d'un engagement réellement créé par le joueur. */
export function verifierEngagement(e: Engagement): Violation[] {
  const violations: Violation[] = []

  if (e.origine !== 'joueur') {
    violations.push({
      regle: 'engagement-non-autodetermine',
      extrait: e.id,
      explication: 'Le joueur nomme son Boss. HORA ne le devine pas, ne le déduit pas, ne le propose pas.',
    })
  }

  if (e.formulationDuJoueur.trim().length < 3) {
    violations.push({
      regle: 'engagement-sans-formulation',
      extrait: e.id,
      explication: 'Un engagement se dit dans les mots du joueur, pas dans ceux de l’application.',
    })
  }

  if (e.classe === 'hors-cadre' && e.paliers.length > 0) {
    violations.push({
      regle: 'paliers-hors-cadre',
      extrait: e.id,
      explication:
        'Hors cadre, aucun palier d’exposition n’est composé. L’engagement peut exister comme note ; le moteur ne le met pas en scène.',
    })
  }

  for (const p of e.paliers) {
    if (p.reversible !== true) {
      violations.push({
        regle: 'palier-irreversible',
        extrait: p.id,
        explication: 'Chaque palier reste réversible. Renoncer n’a aucun effet.',
      })
    }
    /*
      Escalade automatique : accomplir un palier que le joueur n'a jamais
      confirmé au moment de l'exécuter.
    */
    if (p.accompliLe !== null && p.confirmeLe === null) {
      violations.push({
        regle: 'escalade-automatique',
        extrait: p.id,
        explication:
          'Le joueur choisit et confirme chaque palier au moment de l’exécuter. Rien n’avance tout seul.',
      })
    }
  }

  const ordres = e.paliers.map((p) => p.ordre)
  if (new Set(ordres).size !== ordres.length) {
    violations.push({
      regle: 'paliers-ambigus',
      extrait: e.id,
      explication: 'Deux paliers ne peuvent pas occuper le même rang.',
    })
  }

  return violations
}

/* ------------------------------------------------------------------ */
/* Le tiers humain                                                     */
/* ------------------------------------------------------------------ */

export function verifierCadreTiers(op: Operation): Violation[] {
  const t = op.tiers
  if (!t) return []
  const violations: Violation[] = []

  if (t.anonymeParDefaut !== true) {
    violations.push({
      regle: 'tiers-non-anonyme-par-defaut',
      extrait: op.id,
      explication: 'Le mode anonyme est le défaut. Aucune collecte n’est nécessaire pour transmettre.',
    })
  }

  if (t.formuleDeConsentement.trim().length < 30) {
    violations.push({
      regle: 'consentement-non-formule',
      extrait: op.id,
      explication:
        'Le joueur doit savoir quoi annoncer au tiers avant de commencer. Un consentement implicite n’en est pas un.',
    })
  }

  if (t.siRefus.trim().length < 20) {
    violations.push({
      regle: 'refus-du-tiers-non-prevu',
      extrait: op.id,
      explication:
        'Un refus du tiers termine proprement l’opération, sans pénalité. Encore faut-il l’avoir écrit.',
    })
  }

  if (new Set(t.donneesFacultatives).size !== t.donneesFacultatives.length) {
    violations.push({
      regle: 'consentement-ambigu',
      extrait: op.id,
      explication: 'Le consentement est granulaire : une donnée, une demande, une fois.',
    })
  }

  return violations
}

/** Contrôle d'un transmetteur réellement enregistré. */
export function verifierTransmetteur(t: Transmetteur): Violation[] {
  const violations: Violation[] = []
  const vivant = (d: string) =>
    t.consentements.some((c) => c.donnee === d && c.accorde && c.revoqueLe === null)

  if (t.attribution !== null && !vivant('nom')) {
    violations.push({
      regle: 'attribution-sans-consentement',
      extrait: t.id,
      explication:
        'Un nom n’apparaît que si la personne a voulu être créditée, et disparaît dès qu’elle se ravise.',
    })
  }

  if (t.anonyme && t.attribution !== null) {
    violations.push({
      regle: 'anonymat-contredit',
      extrait: t.id,
      explication: 'Anonyme veut dire anonyme.',
    })
  }

  for (const c of t.consentements) {
    if (c.donnee === 'position' && c.accorde && c.revoqueLe === null && c.lieuPublic !== true) {
      violations.push({
        regle: 'position-domiciliaire',
        extrait: t.id,
        explication:
          'Une position ne se conserve que si elle désigne un lieu public. Jamais un domicile.',
      })
    }
  }

  return violations
}

/* ------------------------------------------------------------------ */
/* La deuxième fois                                                    */
/* ------------------------------------------------------------------ */

export function verifierCadreSavoir(op: Operation): Violation[] {
  const s = op.savoir
  if (!s) return []
  const violations: Violation[] = []

  if (s.fenetreMinimaleJours < 1) {
    violations.push({
      regle: 'fenetre-nulle',
      extrait: op.id,
      explication:
        'Redire un savoir dans la foulée ne prouve rien. La deuxième fois suppose un intervalle.',
    })
  }

  /*
    Le délai n'est pas universel : un geste simple, une histoire, une recette,
    une orientation et un savoir saisonnier ne s'oublient pas au même rythme.
    L'opération doit donc justifier sa fenêtre, pas hériter d'une constante.
  */
  if (s.justificationFenetre.trim().length < 20) {
    violations.push({
      regle: 'fenetre-injustifiee',
      extrait: op.id,
      explication: 'La fenêtre est déclarée par l’opération et justifiée par la nature du savoir.',
    })
  }

  if (s.formesDePreuve.length === 0) {
    violations.push({
      regle: 'preuve-de-rappel-absente',
      extrait: op.id,
      explication:
        'La preuve n’est jamais l’identité du transmetteur : reformuler, refaire le geste, montrer le résultat.',
    })
  }

  if (!op.etapes.some((e) => e.saisie?.champ === 'savoir-recu')) {
    violations.push({
      regle: 'savoir-non-souverain',
      extrait: op.id,
      explication:
        'Ce qu’un tiers a réellement enseigné s’écrit par le joueur. HORA ne le rédige pas à sa place.',
    })
  }

  return violations
}

/* ------------------------------------------------------------------ */
/* Le Constat                                                          */
/* ------------------------------------------------------------------ */

const AVEUX_IGNORANCE = [
  'je ne sais pas pourquoi',
  'je n’en connais pas la raison',
  "je n'en connais pas la raison",
  'je ne sais pas ce que ça veut dire',
  'je ne l’interprète pas',
  "je ne l'interprète pas",
]

/**
 * Un constat rapporte un compte observable et s'arrête sur un aveu
 * d'ignorance. C'est cet aveu, exigé structurellement, qui empêche quatre
 * refus de devenir un profil psychologique.
 */
export function verifierConstat(c: Constat): Violation[] {
  const violations: Violation[] = [...verifierTexte(c.enonce)]

  if (c.evenementIds.length === 0) {
    violations.push({
      regle: 'constat-sans-evenement',
      extrait: c.id,
      explication:
        'Un constat sans événement consultable est une invention. Le joueur doit pouvoir remonter à chaque ligne.',
    })
  }

  const enonce = c.enonce.toLowerCase()
  if (!AVEUX_IGNORANCE.some((a) => enonce.includes(a))) {
    violations.push({
      regle: 'constat-sans-aveu',
      extrait: c.id,
      explication:
        'Le compte est observable, la cause ne l’est pas. Un constat se termine sur ce que HORA ne sait pas.',
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
    ...op.propositions.flatMap((p) => [p.enonce, p.resultatAttendu]),
    ...op.etapes.flatMap((e) => [
      e.titre,
      e.corps,
      e.consigne ?? '',
      e.saisie?.invite ?? '',
      ...(e.saisie?.exemples ?? []),
    ]),
    ...op.bifurcations.flatMap((b) => [b.constat, b.suite]),
    op.enjeu?.arretImmediat ?? '',
    op.enjeu?.nonPrise ?? '',
    op.tiers?.formuleDeConsentement ?? '',
    op.tiers?.siRefus ?? '',
    op.savoir?.justificationFenetre ?? '',
  ].join('\n')
  violations.push(...verifierTexte(textes))

  violations.push(...verifierCadreNature(op))
  violations.push(...verifierNonSubstitution(op))
  violations.push(...verifierCadreEnjeu(op))
  violations.push(...verifierCadreTiers(op))
  violations.push(...verifierCadreSavoir(op))

  for (const d of verifierPropositions(op)) {
    violations.push({ regle: d.regle, extrait: d.propositionId, explication: d.explication })
  }

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
