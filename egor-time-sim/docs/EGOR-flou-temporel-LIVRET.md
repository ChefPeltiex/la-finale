---
title: "EGOR — Flou temporel, effondrement objectif (DP & CSL)"
subtitle: "Livret technique (brief, protocole, checklist, guide logiciel)"
date: "2026-05-12"
lang: fr-FR
documentclass: article
geometry: margin=2.2cm
fontsize: 11pt
header-includes:
  - \usepackage{microtype}
  - \usepackage{unicode-math}
  - \setmainfont{Latin Modern Roman}
---

\newpage

# Brief technique complet — Flou temporel induit par les modèles d'effondrement objectif (Diósi–Penrose & CSL)

## Résumé exécutif

Les modèles d'**effondrement objectif** proposent que la **réduction de la fonction d'onde** soit un **processus physique spontané**. Dans les variantes où le couplage dépend de la **masse** (**Diósi–Penrose**, DP) ou d'un **bruit de localisation stochastique** (**CSL**), la superposition de **distributions de masse** génère une **fluctuation effective** du potentiel gravitationnel newtonien. Pour des **oscillateurs quantiques** très stables — en pratique les **horloges optiques** — ces fluctuations se traduisent schématiquement par un **bruit de phase** additionnel, donc par une **incertitude intrinsèque** de l'écoulement du **temps opérationnel** (ce que mesure une horloge), distincte des questions métaphysiques sur le « temps absolu ».

Avec la **technologie actuelle**, l'effet prédit pour des configurations « microscopiques » usuelles est en général **bien en dessous du bruit technique**. Néanmoins, des **protocoles ciblés** et une **simulation logicielle** dédiée permettent : (i) d'**explorer** des plages de paramètres encore ouvertes, (ii) de **définir les exigences instrumentales** pour un pilote, (iii) de publier des **limites nulles** scientifiquement utiles.

## Contexte physique et équations clés

### Diósi–Penrose (DP)

L'échelle temporelle caractéristique du collapse est souvent estimée par $\tau_{\mathrm{DP}} \sim \hbar / E_G$, où $E_G$ est une **énergie gravitationnelle** associée à la superposition de distributions de masse. $E_G$ croît avec la **masse** et la **séparation spatiale** (forme précise dépend de la géométrie et de la version du modèle).

### CSL (Continuous Spontaneous Localization)

Un terme **stochastique** non linéaire est caractérisé par un taux $\lambda$ et une longueur de corrélation $r_C$. La **décohérence effective** dépend de ces paramètres et de la **masse** / de la **taille** du système.

### Impact sur une horloge

Une variance de phase additionnelle $\Delta\phi^2$ se relie de façon **heuristique** à une variance de fréquence fractionnaire par $\sigma_y^2 \sim \Delta\phi^2 / ((2\pi\nu)^2 \tau^2)$, où $\nu$ est la fréquence porteuse et $\tau$ le temps d'intégration. Cette relation sert à **dimensionner** la sensibilité requise en $\sigma_y$ pour contraindre un paramètre effectif (mapping explicite vers $\lambda, r_C$ ou vers les paramètres DP : à contractualiser avec des théoriciens du modèle utilisé).

## Ordres de grandeur et faisabilité

- Les horloges optiques d'avant-garde atteignent typiquement $\sigma_y(\tau) \sim 10^{-18}$--$10^{-19}$ sur des fenêtres d'intégration optimales.
- Les contributions DP/CSL « minimalistes » pour systèmes microscopiques usuels sont en général **nettement inférieures** à ces niveaux.
- Pour une sensibilité **pertinente** : viser soit un gain instrumental **×10--×100** (souvent plus réaliste en **métrique différentielle** qu'en stabilité absolue seule), soit une **amplification** (masse effective, corrélations quantiques, temps d'intégration, réjection de bruit common-mode).

## Protocoles expérimentaux recommandés (détaillés et priorisés)

### Protocole A — Horloges optiques intriquées (priorité pilote)

- **But :** détecter une composante de **bruit temporel corrélée** non expliquée par les sources techniques connues.
- **Configuration :** deux horloges optiques **séparées spatialement**, état intriqué de **phase** (ou interrogation quantique équivalente validée par métrologie) ; acquisition **synchronisée** ; sessions **longues** (heures → jours).
- **Mesures :** densité spectrale de bruit, **Allan deviation** (plusieurs $\tau$), **cross-correlation** ; métadonnées environnementales synchrones (température, vibrations, champs).
- **Exigences :** lasers ultra-stables, interrogation quantique (objectif interne **×5--×10** sur observable choisie), isolation thermique active, contrôle vibrationnel, fibres stabilisées.
- **Critères de succès :** excès de bruit **corrélé** incompatible avec le modèle nul technique ; sinon **limites supérieures** sur paramètres (publication utile).

### Protocole B — États comprimés massifs (amplification)

- **But :** amplifier la signature DP/CSL via une **masse effective** en superposition plus grande.
- **Configuration :** oscillateurs mécaniques **levités** (piège optique / Paul) ou masses couplées à **cavités** ; états **comprimés** ou superpositions contrôlées.
- **Mesures :** visibilité d'interférence, taux de décohérence vs masse et séparation.
- **Exigences :** cryogénie, ultra-vide, contrôle thermique, détection à faible bruit de lecture.

### Protocole C — Tests de couplage masse--bruit (contrôle systématique)

- **But :** vérifier une dépendance **systématique** du bruit temporel à une **configuration de masse** contrôlée.
- **Configuration :** horloge de référence près d'une **masse mobile** ; variation de position / masse.
- **Mesures :** corrélation configuration → variance de fréquence ; robustesse (répétitions, permutations).

## Prototype logiciel — architecture et métriques

**Objectif.** Simuler des séries $y(t)=\delta\nu/\nu$ avec bruit **technique** + bruit **paramétrique** (amplitude $\epsilon$ toy), produire une courbe $\sigma_y(\tau)$ par estimateur **Allan overlapping**, et préparer l'extension **PSD / bootstrap / inversion bayésienne** (hors cœur MVP).

**Composants (cible) :** (1) générateur de signaux ; (2) module « gain quantique » (placeholder) ; (3) scénarios A/B/C ; (4) analyse Allan / corrélation / bootstrap (v2) ; (5) API JSON.

**Métriques livrées (MVP) :** $\sigma_y(\tau)$ sur une grille ; $\Delta\phi^2$ (RMS phase) ; sensibilité à $\epsilon$ à 95 % CL via Monte Carlo (feuille de route).

**Implémentation :** dépôt `egor-time-sim` (`simulate_time_noise.py`, `run_batch.py`, `analyze.py`, `node_pipeline/analyze.js`).

## Risques, limites et recommandations

| Risque / limite | Action |
|-----------------|--------|
| Bruit **technique** domine | Isolation thermique, vibrations, **redondance**, calibration croisée |
| Modèles **non relativistes** | Prudence sur interprétations « cosmologiques » directes |
| Sur-interprétation | **Limites nulles** + méthodologie complète ; couplage **bayésien** avec théorie |

## Plan 24--36 mois et budget indicatif

| Phase | Durée | Contenu |
|-------|-------|---------|
| **1** | 0--6 mois | Simulation, exigences instrumentales, preregistration |
| **2** | 6--18 mois | Banc pilote **A**, calibration, baseline |
| **3** | 18--36 mois | Mesures longues, analyses, extension **B/C** si marge, publication |

**Budget pilote indicatif : 2--5 M€** (horloges, lasers, infrastructure, personnel), fortement variable selon équipement existant et partenariats.

## Protocole expérimental — version « soumission » (rappel)

**Titre (proposé).** *Expérience pilote pour contraindre un bruit temporel additionnel compatible avec des scénarios de type DP/CSL via horloges optiques intriquées.*

**Contenu minimal du dossier :** objectifs mesurables, méthodes (section A détaillée), équipement, calendrier, budget, **DMP**, critères d'acceptation, plan de publication, éthique si requis.

*Document technique à usage projet / laboratoire — ne constitue pas un avis de conformité réglementaire.*

\newpage

# Protocole expérimental — Pilote A (soumission / cahier des charges)

## Objectif

Réaliser une **expérience pilote** (Protocole **A**) visant à **contraindre** un bruit temporel additionnel compatible avec des scénarios de type **DP/CSL**, en utilisant **deux horloges optiques** et des **mesures corrélées** (intrication / interrogation quantique selon architecture retenue).

## Équipement requis

1. Deux **horloges optiques** de référence (stabilité maximale disponible sur site ou en partenariat).
2. Systèmes d'**intrication quantique** ou interrogation type **Ramsey** améliorée (équivalent validé par l'équipe métrologie).
3. **Isolation thermique** active ; **table anti-vibration** ; chambre à vide si nécessaire selon design optique.
4. **Lasers** ultra-stables ; fibres stabilisées ; distribution de fréquence commune traçable.
5. **Acquisition** temps réel haute résolution ; stockage synchronisé ; horodatage **TAI/UTC** traçable.
6. **Capteurs environnementaux** : température, vibration, champs magnétiques, alimentations (métadonnées synchrones).

## Méthodologie détaillée

### Phase 1 — Simulation et exigences (0--6 mois)

- Utiliser le simulateur `egor-time-sim` pour traduire des scénarios en **objectifs** sur $\sigma_y(\tau)$ et en **durées d'intégration**.
- Définir **critères d'acceptation** instrumentaux et procédures de **calibration** (before/after).
- **Pré-enregistrer** les tests statistiques et critères d'arrêt (**blind analysis**).

### Phase 2 — Installation et calibration (6--12 mois)

- Installation des horloges et chaînes d'intrication / interrogation.
- Mesure du **bruit technique baseline** ; modélisation des sources (thermique, laser, vibration).
- Procédures de **correction** documentées ; schéma de métadonnées figé.

### Phase 3 — Mesures pilotes (12--24 mois)

- Séries longues (**heures → jours**) ; répétitions sur plusieurs configurations.
- Variation des paramètres d'intrication et des durées d'intégration.
- Collecte systématique des **métadonnées** environnementales synchrones.

### Phase 4 — Analyse et publication (24--36 mois)

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
|-------|------------|
| Horloges et lasers | **1--3 M€** |
| Infrastructure (isolation, cryo, tables) | **0,3--0,8 M€** |
| Personnel (2--3 ans, 3--5 FTE) | **0,6--1,2 M€** |
| **Total** | **≈ 2--5 M€** |

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

\newpage

# Checklist — soumission / appel à projets (pilote A)

## Document principal

- [ ] Synthèse exécutive (objectif, originalité, impact)
- [ ] Méthodes (Protocole A détaillé, critères d'acceptation)
- [ ] Timeline 0--6 / 6--18 / 18--36 mois
- [ ] Budget indicatif et cofinancements
- [ ] Équipe, rôles, gouvernance

## Annexes

- [ ] Formulaire **métadonnées** (capteurs env., horodatage, versions logicielles)
- [ ] Protocole de **calibration** et journal de bord
- [ ] **DMP** (plan de gestion des données) + politique de publication (open data si applicable)
- [ ] Scripts d'analyse versionnés (`egor-time-sim` + notebooks / pipeline CI)
- [ ] Formulaire **éthique** / conformité (données personnelles si traces humaines dans logs opérationnels)

## Partenaires

- [ ] Laboratoires nationaux / métrologie du temps--fréquence
- [ ] Groupes **horloges optiques** / réseaux de comparaison
- [ ] Théoriciens **DP/CSL** (cadre d'interprétation des limites)

## Qualité scientifique

- [ ] **Pré-enregistrement** des tests statistiques (blind analysis si pertinent)
- [ ] Jeux de données **synthétiques** (simulateur) + jeux **réels** séparés
- [ ] Liste des **systématiques** documentées (thermique, vibration, laser, EM)

## Livrables logiciels

- [ ] Tag Git + archive ZIP reproductible
- [ ] `README` + `requirements.txt` testés sur machine vierge

\newpage

# EGOR Time Simulation — guide logiciel (extrait)

## But

Simuler l'impact d'un **bruit temporel** paramétrique (toy **DP/CSL-like**) sur des séries de fréquence fractionnaire d'« horloge », produire une **courbe d'Allan deviation** (overlapping), des statistiques de phase, et estimer des **sensibilités relatives** pour cadrer des protocoles expérimentaux.

**Note :** le dépôt implémente un estimateur **Allan overlapping** (moyennes glissantes), **pas** la quantité naïve `sqrt(0.5*mean(diff(y)²))` qui ne correspond pas à $\sigma_y(\tau)$.

## Installation (résumé)

Créer un environnement Python, activer le venv, puis `pip install -r requirements.txt` (optionnel : `matplotlib`, `scipy` pour figures).

## Exécution (résumé)

Depuis la racine `egor-time-sim/` :

- `python simulate_time_noise.py --config config.example.json`
- `python simulate_time_noise.py --config config.example.json --out results/last_result.json`
- `node node_pipeline/analyze.js config.example.json`

## Fichiers de configuration

- `config.example.json` — clé `nu` (Hz) acceptée comme alias de `nu_hz`.
- `config.extended.example.json` — grille Allan (`allan_*`) personnalisable.

## Résultats

- `results/last_result.json` — courbe $\sigma_y(\tau)$, stats, copie de la config utilisée.

## Archive

Produire une archive ZIP du dépôt en excluant `venv/` et les gros fichiers `results/*.json` si nécessaire.
