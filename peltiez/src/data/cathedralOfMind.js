/**
 * Cadre narratif et culturel (métaphore architecturale) — pas un dispositif clinique.
 */

export const CATHEDRALE_ESPRIT = {
  tagline: 'Une cathédrale intérieure en chantier permanent : voûtes de questions, vitraux de nuances.',
  structureMetaphor: 'Gothique numérique — arcs-boutants de mémoire, nef de récit, sans prétendre à une pierre dressée dans la ville réelle.',
  axioms: [
    'Vérité : préférer la nuance documentée au slogan confortable.',
    'Souveraineté : choisir où l’on signe, où l’on circule, où l’on s’arrête.',
    'Amour : traiter la communauté comme un vivier fragile, pas comme une audience.',
    'Transparence : algorithmes et chaînes aussi lisibles que les vitraux — avec leurs zones d’ombre assumées.',
    'Circularité : ce qui entre peut repartir utilement ; le gaspillage n’est pas une décoration.',
    'Hospitalité intellectuelle : inviter la contradiction sans la domestiquer.',
  ],
  idioms: [
    'Tel cordonnier mal chaussé, le philosophe amateur oublie parfois ses propres lacets.',
    'Confondre carte et territoire, c’est être taxidermiste de concepts : tout paraît vivant, mais rien ne respire.',
    'Mieux vaut une lanterne vacillante qu’un projecteur qui aveugle sans éclairer.',
  ],
  apologia:
    'Ceci est une boussole littéraire et une fiction utile, pas un dogme ni un manuel de vie. La pensée se mesure à la longueur d’attention qu’on lui accorde. Nous préférons l’humilité du chantier à la vanité du panache.',
};

export const DISCLAIMER =
  'Contenu à visée éducative et culturelle uniquement ; il ne constitue pas un conseil en santé mentale ni un substitut à une consultation professionnelle.';

export const HUMAN_SOUL_ENGINE = {
  eras: {
    stoicism: {
      title: 'Antiquité tardive — stoïcisme (référence historique)',
      blurb:
        'Marc Aurèle et ses contemporains comme lecture classique sur la mesure et la responsabilité ; présenté ici comme patrimoine textuel, sans prescription morale.',
    },
    augustine: {
      title: 'Augustinisme — mémoire et désir',
      blurb:
        'Une lentille narrative sur l’intérieur fragmenté : confession comme genre littéraire, non comme verdict sur autrui.',
    },
    lumieres: {
      title: 'Siècle des Lumières — critique et public',
      blurb:
        'L’audace de publier, contredire, réviser ; la circulaire des idées comme préfiguration d’une économie ouverte à la refonte.',
    },
    depthPsychology: {
      title: 'Freud / Jung — archétypes dans la culture',
      blurb:
        'Figures et récits du XXᵉ siècle traités comme folklore intellectuel et histoire des représentations, sans diagnostic.',
    },
    existentialism: {
      title: 'Sartre — existence avant essence (cadrage littéraire)',
      blurb:
        'La scène existentielle comme fiction philosophique : liberté narrée, angoisse stylisée, engagement comme choix de récit plus que comme verdict.',
    },
  },
};

function hintFingerprint(actionHint) {
  const s = String(actionHint ?? '');
  let hash = s.length;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const FILTER_STATUSES = [
  'Voûte en équilibre précaire',
  'Nef ouverte aux courants',
  'Chapelle latérale silencieuse',
  'Arc-boutant bien tendu',
  'Rosace encore au crayon',
];

const FILTER_GUIDANCES = [
  'Ajoutez une pierre de contexte avant de crier au miracle.',
  'Tournez la phrase comme un vitrail : la lumière passe par les angles.',
  'Si le récit serre trop, élargissez la marge à la page suivante.',
  'Recoller sans mentir : la transparence aime les joints visibles.',
  'Circulez l’idée : qu’elle parte et revienne plus lisible.',
];

/**
 * Pure fantasy / literary cue derived only from `actionHint` (length + simple hash).
 * @param {string} actionHint
 * @returns {{ status: string, guidance: string }}
 */
export function psychologicalFilter(actionHint) {
  const fp = hintFingerprint(actionHint);
  const status = FILTER_STATUSES[fp % FILTER_STATUSES.length];
  const guidance = FILTER_GUIDANCES[(fp + actionHint.length) % FILTER_GUIDANCES.length];
  return { status, guidance };
}

/**
 * Texte compact pour la page À propos (markdown léger, plat).
 */
export function describeSoulEngineForAbout() {
  const blocks = [];
  blocks.push(`### Cathédrale de l’esprit`);
  blocks.push(CATHEDRALE_ESPRIT.tagline);
  blocks.push('');
  blocks.push(`**${CATHEDRALE_ESPRIT.structureMetaphor}**`);
  blocks.push('');
  blocks.push('#### Axes (aphorismes)');
  CATHEDRALE_ESPRIT.axioms.forEach((a) => blocks.push(`- ${a}`));
  blocks.push('');
  blocks.push('#### Formules du vestibule');
  CATHEDRALE_ESPRIT.idioms.forEach((id) => blocks.push(`- _${id}_`));
  blocks.push('');
  blocks.push(`> ${CATHEDRALE_ESPRIT.apologia}`);
  blocks.push('');
  blocks.push('### Moteur des siècles (carte culturelle)');
  Object.values(HUMAN_SOUL_ENGINE.eras).forEach((era) => {
    blocks.push(`- **${era.title}** — ${era.blurb}`);
  });
  blocks.push('');
  blocks.push(`_${DISCLAIMER}_`);
  blocks.push('');
  const echo = psychologicalFilter('architecte-des-mysteres');
  blocks.push(
    `**Écho mécanique (jeu de style)** — statut : « ${echo.status} » ; conseil : « ${echo.guidance} »`,
  );
  return blocks.join('\n').trim();
}
