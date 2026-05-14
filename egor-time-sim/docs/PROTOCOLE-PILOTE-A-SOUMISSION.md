# Protocole expérimental — Pilote A (soumission / cahier des charges)

## Objectif

Réaliser une **expérience pilote** (Protocole **A**) visant à **contraindre** un bruit temporel additionnel compatible avec des scénarios de type **DP/CSL**, en utilisant **deux horloges optiques** et des **mesures corrélées** (intrication / interrogation quantique selon architecture retenue).

## Équipement requis

1. Deux **horloges optiques** de référence (stabilité maximale disponible sur site ou en partenariat).  
2. Systèmes d’**intrication quantique** ou interrogation type **Ramsey** améliorée (équivalent validé par l’équipe métrologie).  
3. **Isolation thermique** active ; **table anti-vibration** ; chambre à vide si nécessaire selon design optique.  
4. **Lasers** ultra-stables ; fibres stabilisées ; distribution de fréquence commune traçable.  
5. **Acquisition** temps réel haute résolution ; stockage synchronisé ; horodatage **TAI/UTC** traçable.  
6. **Capteurs environnementaux** : température, vibration, champs magnétiques, alimentations (métadonnées synchrones).

## Méthodologie détaillée

### Phase 1 — Simulation et exigences (0–6 mois)

- Utiliser le simulateur `egor-time-sim` pour traduire des scénarios en **objectifs** sur \(\sigma_y(\tau)\) et en **durées d’intégration**.  
- Définir **critères d’acceptation** instrumentaux et procédures de **calibration** (before/after).  
- **Pré-enregistrer** les tests statistiques et critères d’arrêt (**blind analysis**).

### Phase 2 — Installation et calibration (6–12 mois)

- Installation des horloges et chaînes d’intrication / interrogation.  
- Mesure du **bruit technique baseline** ; modélisation des sources (thermique, laser, vibration).  
- Procédures de **correction** documentées ; schéma de métadonnées figé.

### Phase 3 — Mesures pilotes (12–24 mois)

- Séries longues (**heures → jours**) ; répétitions sur plusieurs configurations.  
- Variation des paramètres d’intrication et des durées d’intégration.  
- Collecte systématique des **métadonnées** environnementales synchrones.

### Phase 4 — Analyse et publication (24–36 mois)

- Allan deviation, **PSD**, **cross-correlation** entre canaux ; **bootstrap** pour intervalles.  
- Inversion bayésienne / limites supérieures sur paramètres **effectifs** (mapping explicite modèle toy ↔ paramètres DP/CSL : à contractualiser avec théoriciens).  
- Publication : méthodes, **limites nulles**, interprétation prudente.

## Contrôle du bruit

| Voie | Action |
|------|--------|
| Thermique | enceinte ±mK (selon budget) ; gradients cartographiés |
| Vibration | tables + corrélation capteurs / canaux |
| Laser | stabilisation amplitude/fréquence ; références croisées |
| Artefacts locaux | horloge témoin / redondance géographique si possible |

## Plan de gestion des données

- Stockage **brut** immuable + checksums ; métadonnées synchrones.  
- Pipeline versionné (**Git**) ; notebooks **reproductibles** ; publication **open data** si politique institutionnelle le permet.

## Budget indicatif (pilote)

| Poste | Fourchette |
|-------|-------------|
| Horloges et lasers | **1–3 M€** |
| Infrastructure (isolation, cryo, tables) | **0,3–0,8 M€** |
| Personnel (2–3 ans, 3–5 FTE) | **0,6–1,2 M€** |
| **Total** | **≈ 2–5 M€** |

## Risques et atténuations

| Risque | Atténuation |
|--------|-------------|
| Bruit technique masque le signal | isolation, redondance, design différentiel |
| Artefacts locaux | canaux témoins, réplication |
| Sur-interprétation théorique | collaboration théoriciens + limites explicites |

## Livrables de soumission

1. Ce protocole + **checklist** opérationnelle (calibration, blind, métadonnées).  
2. **DMP** (plan de gestion des données) et politique de publication.  
3. Budget et calendrier détaillés signés direction / partenaires.

---

Checklist détaillée : [CHECKLIST-SOUMISSION.md](./CHECKLIST-SOUMISSION.md).
