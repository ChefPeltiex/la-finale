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

const VERIFIE_LE = '2026-08-24'
const VALIDITE_JOURS = 180

/**
 * Ail des bois — Allium tricoccum.
 *
 * Désigné vulnérable au Québec en 1995 en vertu de la Loi sur les espèces
 * menacées ou vulnérables. Récolte plafonnée à 50 bulbes par personne et par
 * an, pour consommation personnelle ; la vente est interdite.
 *
 * Le chiffre légal n'est pas le seuil écologique : une récolte annuelle de
 * 5 à 15 % des bulbes d'une colonie suffit à provoquer son déclin. Cinquante
 * bulbes peuvent donc être légaux et destructeurs en même temps. C'est
 * précisément l'écart que l'opération « La colonie » fait mesurer au joueur.
 */
export const ailDesBois: RegleCueillette = {
  espece: 'Allium tricoccum (ail des bois)',
  territoire: 'CA-QC',

  prelevementPermis: faitExterne({
    valeur: true,
    statut: 'fait',
    source: 'Loi sur les espèces menacées ou vulnérables (Québec)',
    url: 'https://www.environnement.gouv.qc.ca/biodiversite/especes/',
    territoire: 'CA-QC',
    publieLe: '1995-01-01',
    verifieLe: VERIFIE_LE,
    validiteJours: VALIDITE_JOURS,
    licence: 'Législation publique',
    identifiantRegle: 'RLRQ c. E-12.01 — désignation « vulnérable », 1995',
    texteOriginal:
      'Récolte permise à des fins de consommation personnelle uniquement, dans les limites prévues au règlement.',
    justification:
      'Le prélèvement reste permis, mais strictement encadré et sans aucune finalité commerciale.',
    repli:
      'Sans règle à jour, le prélèvement est verrouillé et l’opération bascule en observation seule.',
  }),

  quantiteMaxParAn: faitExterne({
    valeur: 50,
    statut: 'fait',
    source: 'Réglementation québécoise sur les espèces floristiques vulnérables',
    url: 'https://www.environnement.gouv.qc.ca/biodiversite/especes/',
    territoire: 'CA-QC',
    publieLe: null,
    verifieLe: VERIFIE_LE,
    validiteJours: VALIDITE_JOURS,
    licence: 'Législation publique',
    identifiantRegle: 'Limite de 50 bulbes par personne, par année',
    texteOriginal: 'Maximum de 50 bulbes par personne par année, pour consommation personnelle.',
    justification:
      'Plafond légal individuel. Il ne garantit pas la survie d’une colonie donnée : c’est un maximum, pas une recommandation.',
    repli: 'Quantité inconnue ⇒ aucun prélèvement autorisé.',
  }),

  statutConservation: faitExterne({
    valeur: 'Vulnérable au Québec depuis 1995',
    statut: 'fait',
    source: 'Ministère de l’Environnement du Québec — espèces floristiques vulnérables',
    url: 'https://www.environnement.gouv.qc.ca/biodiversite/especes/',
    territoire: 'CA-QC',
    publieLe: '1995-01-01',
    verifieLe: VERIFIE_LE,
    validiteJours: VALIDITE_JOURS,
    licence: 'Données gouvernementales publiques',
    identifiantRegle: null,
    texteOriginal: 'Ail des bois — Allium tricoccum Aiton — espèce floristique vulnérable.',
    justification:
      'Une des premières espèces désignées vulnérables après l’adoption de la Loi de 1989.',
    repli: 'Statut inconnu ⇒ traiter l’espèce comme sensible.',
  }),

  ventePermise: faitExterne({
    valeur: false,
    statut: 'fait',
    source: 'Réglementation québécoise sur les espèces floristiques vulnérables',
    url: 'https://www.environnement.gouv.qc.ca/biodiversite/especes/',
    territoire: 'CA-QC',
    publieLe: null,
    verifieLe: VERIFIE_LE,
    validiteJours: VALIDITE_JOURS,
    licence: 'Législation publique',
    identifiantRegle: 'Interdiction de vente',
    texteOriginal: 'La vente d’ail des bois est interdite au Québec.',
    justification: 'La récolte tolérée est personnelle et non commerciale.',
    repli: 'En cas de doute, considérer la vente comme interdite.',
  }),

  sanction: faitExterne({
    valeur: 'Amendes de 2 000 $ à 6 000 000 $ selon le contrevenant (barème en vigueur depuis 2022)',
    statut: 'fait',
    source: 'Régime de sanctions de la Loi sur les espèces menacées ou vulnérables',
    url: 'https://www.environnement.gouv.qc.ca/biodiversite/especes/',
    territoire: 'CA-QC',
    publieLe: '2022-01-01',
    verifieLe: VERIFIE_LE,
    validiteJours: VALIDITE_JOURS,
    licence: 'Législation publique',
    identifiantRegle: 'Barème de sanctions révisé en 2022',
    texteOriginal:
      'Depuis 2022, le coût des sanctions se situe entre 2 000 $ et 6 000 000 $.',
    justification: 'La fourchette dépend du statut du contrevenant et de la récidive.',
    repli: 'Montant inconnu ⇒ ne rien avancer.',
  }),
}

/**
 * Seuil écologique, distinct du seuil légal.
 *
 * Volontairement séparé de `ailDesBois` : ce n'est pas une règle de droit,
 * et le confondre avec la limite de 50 bulbes serait une erreur de statut.
 */
export const seuilDeclinAilDesBois = faitExterne({
  valeur: { minPourcent: 5, maxPourcent: 15 },
  statut: 'plausible' as const,
  source: 'Travaux d’Andrée Nault, biologiste, sur la dynamique des colonies',
  url: null,
  territoire: 'CA-QC',
  publieLe: null,
  verifieLe: VERIFIE_LE,
  validiteJours: 365,
  licence: 'Résultat de recherche cité en presse',
  identifiantRegle: null,
  texteOriginal:
    'Une cueillette annuelle de 5 à 15 % des bulbes d’une colonie suffit pour engendrer un déclin de l’espèce.',
  justification:
    'Résultat de recherche rapporté, non revérifié à la source primaire. Reste une fourchette, pas un seuil exact pour une colonie donnée.',
  repli: 'Sans ce repère, présenter uniquement la limite légale et signaler qu’elle ne protège pas une colonie.',
})

export const REGLES_CUEILLETTE: readonly RegleCueillette[] = [ailDesBois]
