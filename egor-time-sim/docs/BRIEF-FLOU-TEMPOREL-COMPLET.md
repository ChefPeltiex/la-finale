# Brief technique complet (≈ 2 pages) — Flou temporel induit par les modèles d’effondrement objectif (Diósi–Penrose & CSL)

## Résumé exécutif

Les modèles d’**effondrement objectif** proposent que la **réduction de la fonction d’onde** soit un **processus physique spontané**. Dans les variantes où le couplage dépend de la **masse** (**Diósi–Penrose**, DP) ou d’un **bruit de localisation stochastique** (**CSL**), la superposition de **distributions de masse** génère une **fluctuation effective** du potentiel gravitationnel newtonien. Pour des **oscillateurs quantiques** très stables — en pratique les **horloges optiques** — ces fluctuations se traduisent schématiquement par un **bruit de phase** additionnel, donc par une **incertitude intrinsèque** de l’écoulement du **temps opérationnel** (ce que mesure une horloge), distincte des questions métaphysiques sur le « temps absolu ».

Avec la **technologie actuelle**, l’effet prédit pour des configurations « microscopiques » usuelles est en général **bien en dessous du bruit technique**. Néanmoins, des **protocoles ciblés** et une **simulation logicielle** dédiée permettent : (i) d’**explorer** des plages de paramètres encore ouvertes, (ii) de **définir les exigences instrumentales** pour un pilote, (iii) de publier des **limites nulles** scientifiquement utiles.

---

## Contexte physique et équations clés

### Diósi–Penrose (DP)

L’échelle temporelle caractéristique du collapse est souvent estimée par

\[
\tau_{\mathrm{DP}} \sim \frac{\hbar}{E_G},
\]

où \(E_G\) est une **énergie gravitationnelle** associée à la superposition de distributions de masse. \(E_G\) croît avec la **masse** et la **séparation spatiale** (forme précise dépend de la géométrie et de la version du modèle).

### CSL (Continuous Spontaneous Localization)

Un terme **stochastique** non linéaire est caractérisé par un taux \(\lambda\) et une longueur de corrélation \(r_C\). La **décohérence effective** dépend de ces paramètres et de la **masse** / de la **taille** du système.

### Impact sur une horloge

Une variance de phase additionnelle \(\Delta\phi^2\) se relie de façon **heuristique** à une variance de fréquence fractionnaire par

\[
\sigma_y^2 \sim \frac{\Delta\phi^2}{(2\pi\nu)^2\,\tau^2},
\]

où \(\nu\) est la fréquence porteuse et \(\tau\) le temps d’intégration. Cette relation sert à **dimensionner** la sensibilité requise en \(\sigma_y\) pour contraindre un paramètre effectif (mapping explicite vers \(\lambda, r_C\) ou vers les paramètres DP : à contractualiser avec des théoriciens du modèle utilisé).

---

## Ordres de grandeur et faisabilité

- Les horloges optiques d’avant-garde atteignent typiquement \(\sigma_y(\tau) \sim 10^{-18}\)–\(10^{-19}\) sur des fenêtres d’intégration optimales.  
- Les contributions DP/CSL « minimalistes » pour systèmes microscopiques usuels sont en général **nettement inférieures** à ces niveaux.  
- Pour une sensibilité **pertinente** : viser soit un gain instrumental **×10–×100** (souvent plus réaliste en **métrique différentielle** qu’en stabilité absolue seule), soit une **amplification** (masse effective, corrélations quantiques, temps d’intégration, réjection de bruit common-mode).

---

## Protocoles expérimentaux recommandés (détaillés et priorisés)

### Protocole A — Horloges optiques intriquées (**priorité pilote**)

| | |
|---|---|
| **But** | Détecter une composante de **bruit temporel corrélée** non expliquée par les sources techniques connues. |
| **Configuration** | Deux horloges optiques **séparées spatialement**, état intriqué de **phase** (ou interrogation quantique équivalente validée par métrologie) ; acquisition **synchronisée** ; sessions **longues** (heures → jours). |
| **Mesures** | Densité spectrale de bruit, **Allan deviation** (plusieurs \(\tau\)), **cross-correlation** ; métadonnées environnementales synchrones (température, vibrations, champs). |
| **Exigences** | Lasers ultra-stables, interrogation quantique (objectif interne **×5–×10** sur observable choisie), isolation thermique active, contrôle vibrationnel, fibres stabilisées. |
| **Critères de succès** | Excès de bruit **corrélé** incompatible avec le modèle nul technique ; sinon **limites supérieures** sur paramètres (publication utile). |

### Protocole B — États comprimés massifs (**amplification**)

| | |
|---|---|
| **But** | Amplifier la signature DP/CSL via une **masse effective** en superposition plus grande. |
| **Configuration** | Oscillateurs mécaniques **levités** (piège optique / Paul) ou masses couplées à **cavités** ; états **comprimés** ou superpositions contrôlées. |
| **Mesures** | Visibilité d’interférence, taux de décohérence vs masse et séparation. |
| **Exigences** | Cryogénie, ultra-vide, contrôle thermique, détection à faible bruit de lecture. |

### Protocole C — Tests de couplage masse–bruit (**contrôle systématique**)

| | |
|---|---|
| **But** | Vérifier une dépendance **systématique** du bruit temporel à une **configuration de masse** contrôlée. |
| **Configuration** | Horloge de référence près d’une **masse mobile** ; variation de position / masse. |
| **Mesures** | Corrélation configuration → variance de fréquence ; robustesse (répétitions, permutations). |

---

## Prototype logiciel de simulation — architecture et métriques

**Objectif.** Simuler des séries \(y(t)=\delta\nu/\nu\) avec bruit **technique** + bruit **paramétrique** (amplitude \(\epsilon\) toy), produire une courbe \(\sigma_y(\tau)\) par estimateur **Allan overlapping**, et préparer l’extension **PSD / bootstrap / inversion bayésienne** (hors cœur MVP).

**Composants (cible).**

1. Générateur de signaux (blanc + **1/f** sur \(y\), normalisation).  
2. Module « gain quantique » (facteur sur la variance **corrélée** — placeholder paramétrique).  
3. Scénarios **A / B / C** (jeux de paramètres).  
4. Analyse : Allan, corrélation (v2), bootstrap (v2).  
5. **API JSON** entrée/sortie.

**Métriques livrées (MVP).** \(\sigma_y(\tau)\) sur une grille ; \(\Delta\phi^2\) (RMS phase) ; sensibilité à \(\epsilon\) à 95 % CL via Monte Carlo (**feuille de route**).

**Implémentation dans ce dépôt.** Voir `simulate_time_noise.py`, `run_batch.py`, `analyze.py`, `node_pipeline/analyze.js`, `docs/README.md`.

---

## Risques, limites et recommandations

| Risque / limite | Action |
|-----------------|--------|
| Bruit **technique** domine | Isolation thermique, vibrations, **redondance**, calibration croisée |
| Modèles **non relativistes** | Prudence sur interprétations « cosmologiques » directes |
| Sur-interprétation | **Limites nulles** + méthodologie complète ; couplage **bayésien** avec théorie |

---

## Plan 24–36 mois et budget indicatif

| Phase | Durée | Contenu |
|-------|-------|-----------|
| **1** | 0–6 mois | Simulation, exigences instrumentales, preregistration |
| **2** | 6–18 mois | Banc pilote **A**, calibration, baseline |
| **3** | 18–36 mois | Mesures longues, analyses, extension **B/C** si marge, publication |

**Budget pilote indicatif : 2–5 M€** (horloges, lasers, infrastructure, personnel), fortement variable selon équipement existant et partenariats.

---

## Protocole expérimental — version « soumission » (rappel exécutable)

**Titre (proposé).** *Expérience pilote pour contraindre un bruit temporel additionnel compatible avec des scénarios de type DP/CSL via horloges optiques intriquées.*

**Contenu minimal du dossier :** objectifs mesurables, méthodes (section A détaillée), équipement, calendrier, budget, **DMP**, critères d’acceptation, plan de publication, éthique si requis.

**Checklist** : voir [CHECKLIST-SOUMISSION.md](./CHECKLIST-SOUMISSION.md).

---

*Document technique à usage projet / laboratoire — ne constitue pas un avis de conformité réglementaire.*
