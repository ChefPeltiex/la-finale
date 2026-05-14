# CirculAI φ — rapport d’expérimentation (exemple simulé)

**Document de travail** — illustration « type PDF » à partir d’un scénario chiffré fictif ; ne constitue pas des résultats réels de production.

---

## 1. Synthèse exécutive

Après **48 h** de canary, les taux de conversion observés vont dans le sens attendu pour la variante φ, mais l’écart **n’est pas statistiquement significatif** au seuil α = 5 % (test des proportions **p ≈ 0,12**). **Recommandation** : **poursuivre la collecte** jusqu’à atteindre la taille d’échantillon issue du calcul de puissance (environ **8 jours** de calendrier dans l’hypothèse de trafic ci-dessous).

---

## 2. Hypothèses de conception

| Paramètre | Valeur retenue |
|-----------|-----------------|
| Trafic moyen | **3 000** visiteurs **uniques** par jour |
| Taux de conversion contrôle attendu | **p_control = 12 %** |
| Effet minimal à détecter (lift **relatif**) | **+10 %** → taux φ cible **p_φ = 0,12 × 1,10 = 0,132** |
| Répartition trafic (canary) | Fortement déséquilibrée (voir §4) |

---

## 3. Puissance statistique (rappel)

| Indicateur | Valeur indicative |
|------------|-------------------|
| **p_φ** (alternative) | **0,132** |
| Taille d’échantillon **par groupe** (exemple de dimensionnement) | **n ≈ 12 000** affectations par bras |
| Durée indicative pour accumuler **n** côté variante φ | Si environ **1 500** affectations φ **par jour** → **12 000 / 1 500 ≈ 8 jours** |

*Remarque* : la formule exacte dépend du design (50/50 vs canary), des corrélations et de la métrique ; le tableau ci-dessus fixe les **chiffres demandés** pour l’exemple pédagogique.

---

## 4. Données observées — fenêtre canary 48 h

### 4.1 Volume et conversions

| Variante | Assignations | Conversions | Taux observé |
|----------|-------------:|------------:|-------------:|
| **Contrôle** | **28 500** | **3 420** | **12,00 %** |
| **φ** | **1 500** | **195** | **13,00 %** |

### 4.2 Lift et test des proportions

| Mesure | Valeur |
|--------|--------|
| Lift **relatif** du taux (φ vs contrôle) | **(0,13 − 0,12) / 0,12 ≈ +8,3 %** |
| **p** (test **z** des deux proportions, approximation) | **≈ 0,12** |

---

## 5. Interprétation

- Le **sens** de l’effet est **cohérent** avec l’hypothèse (+10 % relatif en conception), mais l’**incertitude** reste grande : **p > 0,05**.
- La volumétrie φ (**1 500** affectations) est **inférieure** au **n ≈ 12 000** par groupe visé au plan de puissance : il est **attendu** que le test ne soit pas encore concluant.
- **Décision** : **continuer la collecte** (pas d’arrêt pour succès ni pour échec à ce stade), en surveillant garde-fous techniques et métriques secondaires (voir [`playbook-canary.md`](playbook-canary.md)).

---

## 6. Historique documentaire

| Version | Date | Commentaire |
|---------|------|-------------|
| 0.1 | (exemple) | Rapport simulé pour formation / revue de design expérimental |
