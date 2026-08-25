import type { RegleCueillette } from '../../engine/types'
import { faitExterne } from '../../engine/facts'

/**
 * Règles de cueillette vérifiées, datées et situées.
 *
 * Ces valeurs ne sont pas des constantes de programme : ce sont des faits du
 * monde, qui portent leur date de vérification et leur durée de validité.
 * Passé l'échéance, `evaluerFait` les dégrade en `inconnu` et le prélèvement
 * se verrouille automatiquement. Personne n'a à s'en souvenir.
 *
 * Pour prolonger une règle : la revérifier à la source, puis mettre `verifieLe`
 * à jour. Repousser la date sans revérifier serait exactement le geste que
 * cette application reproche aux autres.
 */

const VERIFIE_LE = '2026-08-25'
const VALIDITE_JOURS = 180

/**
 * Ail des bois — Allium tricoccum Aiton.
 *
 * Désigné vulnérable au Québec en 1995 en vertu de la Loi sur les espèces
 * menacées ou vulnérables (RLRQ c. E-12.01). La récolte à des fins de
 * consommation personnelle est plafonnée à 200 g, ou 50 bulbes, ou 50 plants
 * par personne et par an ; la vente est interdite.
 *
 * Le chiffre légal n'est pas le seuil écologique. Voir `seuilDeclinAilDesBois` :
 * cinquante bulbes peuvent être parfaitement légaux et détruire une petite
 * colonie. C'est exactement l'écart que l'opération « La colonie » fait
 * mesurer au joueur.
 */
export const ailDesBois: RegleCueillette = {
  espece: 'Allium tricoccum (ail des bois)',
  territoire: 'CA-QC',

  prelevementPermis: faitExterne({
    valeur: true,
    statut: 'fait',
    source:
      'Règlement sur les espèces floristiques menacées ou vulnérables et leurs habitats (Québec)',
    url: 'https://www.legisquebec.gouv.qc.ca/fr/document/rc/E-12.01,%20r.%203',
    territoire: 'CA-QC',
    publieLe: null,
    verifieLe: VERIFIE_LE,
    validiteJours: VALIDITE_JOURS,
    licence: 'Législation publique — Éditeur officiel du Québec',
    identifiantRegle: 'RLRQ c. E-12.01, r. 3, art. 4',
    texteOriginal:
      'Malgré les interdictions prévues à l’article 16 de la Loi, une personne peut posséder hors de son milieu naturel ou récolter à des fins de consommation personnelle une quantité n’excédant pas annuellement 200 g de toute partie d’ail des bois (Allium tricoccum Aiton) ou un maximum de 50 bulbes ou de 50 plants, à la condition que ces activités ne s’exercent pas à l’intérieur d’un parc au sens de la Loi sur les parcs, d’un milieu naturel désigné en vertu de la Loi sur la conservation du patrimoine naturel, d’un refuge faunique, d’un parc régional ni des grands parcs de Montréal énumérés.',
    justification:
      'C’est une exception à une interdiction, pas une permission générale. Elle ne vaut ni dans un parc, ni dans une aire protégée, ni pour la vente.',
    repli:
      'Sans règle à jour, le prélèvement est verrouillé et l’opération bascule en observation seule.',
  }),

  quantiteMaxParAn: faitExterne({
    valeur: 50,
    statut: 'fait',
    source:
      'Règlement sur les espèces floristiques menacées ou vulnérables et leurs habitats (Québec)',
    url: 'https://www.legisquebec.gouv.qc.ca/fr/document/rc/E-12.01,%20r.%203',
    territoire: 'CA-QC',
    publieLe: null,
    verifieLe: VERIFIE_LE,
    validiteJours: VALIDITE_JOURS,
    licence: 'Législation publique — Éditeur officiel du Québec',
    identifiantRegle: 'RLRQ c. E-12.01, r. 3, art. 4',
    texteOriginal:
      '200 g de toute partie, ou un maximum de 50 bulbes ou de 50 plants, annuellement, par personne, à des fins de consommation personnelle.',
    justification:
      'Plafond légal individuel, et non recommandation. Il ne dit rien de ce qu’une colonie donnée peut supporter.',
    repli: 'Quantité inconnue ⇒ aucun prélèvement autorisé.',
  }),

  statutConservation: faitExterne({
    valeur: 'Vulnérable au Québec depuis 1995 — rang de précarité S3',
    statut: 'fait',
    source: 'Ministère de l’Environnement du Québec — fiche « Ail des bois »',
    url: 'https://www.quebec.ca/agriculture-environnement-et-ressources-naturelles/flore/fiches-especes-floristiques/ail-bois',
    territoire: 'CA-QC',
    publieLe: '1995-01-01',
    verifieLe: VERIFIE_LE,
    validiteJours: VALIDITE_JOURS,
    licence: 'Données gouvernementales publiques',
    identifiantRegle: 'Loi sur les espèces menacées ou vulnérables, RLRQ c. E-12.01',
    texteOriginal: 'Ail des bois — Allium tricoccum Aiton — espèce floristique vulnérable.',
    justification:
      'Une des premières espèces désignées vulnérables après l’adoption de la Loi de 1989.',
    repli: 'Statut inconnu ⇒ traiter l’espèce comme sensible.',
  }),

  ventePermise: faitExterne({
    valeur: false,
    statut: 'fait',
    source: 'Loi sur les espèces menacées ou vulnérables, art. 16, et règlement d’application',
    url: 'https://www.legisquebec.gouv.qc.ca/fr/document/lc/E-12.01',
    territoire: 'CA-QC',
    publieLe: null,
    verifieLe: VERIFIE_LE,
    validiteJours: VALIDITE_JOURS,
    licence: 'Législation publique — Éditeur officiel du Québec',
    identifiantRegle: 'RLRQ c. E-12.01, art. 16',
    texteOriginal:
      'L’article 16 interdit notamment de céder ou d’offrir de céder un spécimen d’une espèce désignée. L’exception réglementaire ne couvre que la consommation personnelle.',
    justification:
      'L’interdiction de vente n’est pas une règle distincte : c’est l’interdiction générale qui subsiste là où l’exception ne s’applique pas.',
    repli: 'En cas de doute, considérer la vente comme interdite.',
  }),

  sanction: faitExterne({
    valeur:
      'Activité interdite (art. 43) : 10 000 $ à 1 000 000 $ pour une personne physique, 30 000 $ à 6 000 000 $ pour une personne morale. Sanction administrative pécuniaire (art. 39.4) : 2 000 $ pour une personne physique, 10 000 $ pour une personne morale.',
    statut: 'fait',
    source: 'Loi sur les espèces menacées ou vulnérables — régime de sanctions',
    url: 'https://www.legisquebec.gouv.qc.ca/fr/document/lc/E-12.01',
    territoire: 'CA-QC',
    publieLe: '2022-01-01',
    verifieLe: VERIFIE_LE,
    validiteJours: VALIDITE_JOURS,
    licence: 'Législation publique — Éditeur officiel du Québec',
    identifiantRegle: 'RLRQ c. E-12.01, art. 39.4 et 43 — montants relevés par 2022, c. 8, a. 31',
    texteOriginal:
      'Art. 43 : amende de 10 000 $ à 1 000 000 $ dans le cas d’une personne physique et de 30 000 $ à 6 000 000 $ dans les autres cas.',
    justification:
      'Deux régimes distincts, souvent fusionnés à tort en « de 2 000 $ à 6 000 000 $ » : 2 000 $ est le montant d’une sanction administrative visant une personne physique, 6 000 000 $ le plafond pénal visant une personne morale. Les deux bornes n’appartiennent pas à la même échelle et ne s’appliquent jamais au même contrevenant.',
    repli: 'Montant inconnu ⇒ ne rien avancer.',
  }),
}

/**
 * Seuil écologique, distinct du seuil légal.
 *
 * Volontairement séparé de `ailDesBois` : ce n'est pas une règle de droit, et
 * le confondre avec la limite de 50 bulbes serait une erreur de statut.
 *
 * La fourchette « 5 à 15 % » qui circule dans la presse écrase deux résultats
 * distincts : 10 à 15 % en conditions normales, mais 5 % suffisent lors d'une
 * saison défavorable. Ce n'est pas un intervalle, ce sont deux régimes.
 */
export const seuilDeclinAilDesBois = faitExterne({
  valeur: { normalPourcent: 10, defavorablePourcent: 5, hautPourcent: 15 },
  statut: 'fait' as const,
  source:
    'Nault, A. et Gagnon, D. (1993), « Ramet demography of Allium tricoccum, a spring ephemeral perennial forest herb », Journal of Ecology 81(1), p. 101-119',
  url: 'https://www.jstor.org/stable/2261228',
  territoire: 'CA-QC',
  publieLe: '1993-01-01',
  verifieLe: VERIFIE_LE,
  validiteJours: 365,
  licence: 'Article scientifique évalué par les pairs',
  identifiantRegle: null,
  texteOriginal:
    'Harvest rates between 10 and 15% resulted in population declines in A. tricoccum, and as little as a 5% harvest would be deleterious during unproductive seasons.',
  justification:
    'Résultat de recherche, pas règle de droit. Il porte sur la colonie, alors que la loi porte sur la personne : les deux plafonds ne mesurent pas la même chose et peuvent diverger largement.',
  repli:
    'Sans ce repère, présenter uniquement la limite légale et signaler explicitement qu’elle ne protège pas une colonie donnée.',
})

export const REGLES_CUEILLETTE: readonly RegleCueillette[] = [ailDesBois]
