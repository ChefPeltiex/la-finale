# Playbook — déploiement canary CirculAI φ (prototype)

Document d’ingénierie : conditions préalables, déroulé minute par minute, surveillance, alertes, escalade, promotion et clôture post-déploiement.

---

## 1. Pré-conditions

- **Baseline** : taux de conversion contrôle (`p_control`) et métriques secondaires (CTR, temps de tâche) mesurés sur au moins une fenêtre représentative (pas de campagne marketing majeure en cours).
- **Taille d’échantillon** : calcul de puissance effectué (voir `scripts/circulai_power_analysis.py` et `docs/circulai-power-analysis.ipynb`) ; MDE (lift minimum) et α fixés avant le jour J.
- **Feature flags / routage** : mécanisme de trafic (CDN, edge, ou assignation serveur) capable de cibler **≤ 5 %** puis paliers suivants sans redéploiement d’urgence.
- **Instrumentation** : `experiment_assign`, `experiment_conversion` (ou équivalent serveur) branchés ; tableaux de bord ou requêtes prêtes ; identifiant utilisateur stable côté serveur pour l’attribution.
- **Rollback** : procédure documentée (revenir au build précédent, désactiver le flag, ou basculer `ASSIGN_PROB_CONTROL` → 1.0 / 100 % contrôle).
- **Équipe** : owner produit + owner tech + personne « break-glass » joignable pendant la fenêtre T0–T0+2 h.

---

## 2. Plan résumé

| Phase | Trafic variante φ | Durée indicative | Critère principal |
|-------|-------------------|------------------|-------------------|
| Canary initial | 5 % | 24–48 h | Pas d’erreur majeure, métriques dans les bandes attendues |
| Élargissement 1 | 20 % | 24–48 h | KPI primaire non dégradé vs contrôle (ou gain significatif si MDE atteint) |
| Élargissement 2 | 50 % | 48–72 h | Stabilité perf / erreurs / plaintes |
| Plein trafic | 100 % | — | Décision go/no-go documentée |

Les pourcentages sont indicatifs ; ajuster selon volume quotidien et résultats du calcul de puissance.

---

## 3. Chronologie minute par minute (T0 = activation canary 5 %)

| Heure | Action |
|-------|--------|
| **T0 − 60 min** | Gel des déploiements non liés ; vérifier secrets, buckets S3, invalidation CloudFront, URL collecteur d’événements. |
| **T0 − 30 min** | Smoke test sur staging : `GET /api/experiment`, `POST /api/experiment/convert`, chargement `index.html` + `ab_experiment.js`. |
| **T0 − 15 min** | Brief équipe : canal incident, seuils d’alerte, qui décide du rollback. |
| **T0** | Activer canary 5 % (flag / probabilité d’assignation / `ASSIGN_PROB_CONTROL` ≈ 0.95 si modèle contrôle/φ). |
| **T0 + 5 min** | Vérifier logs applicatifs et taux d’erreur HTTP ; échantillon manuel navigateur (2 navigateurs, desktop + mobile). |
| **T0 + 15 min** | Premier point : volumétrie assignations, latence p95, taux d’erreur. |
| **T0 + 30 min** | Comparer conversion partielle (avec prudence statistique sur petit n). |
| **T0 + 60 min** | Décision intermédiaire : maintenir, élargir légèrement, ou rollback si seuil critique franchi. |

---

## 4. Surveillance (toutes les 15 minutes pendant les 2 premières heures)

À chaque pas de 15 minutes, consigner :

- **Disponibilité** : erreurs 5xx, timeouts, saturation Lambda / API.
- **Assignation** : ratio observé contrôle / φ proche de la cible (écarts expliqués par cache client ou bots).
- **Conversion** : évolution du KPI primaire (pas de conclusion hâtive si n faible).
- **Performance** : p95 latence page, p95 API ; Core Web Vitals si disponibles.
- **Sécurité / coût** : pics anormaux de requêtes, facturation AWS.

Puis **toutes les heures** jusqu’à stabilisation du palier, puis **2× par jour** sur 48–72 h.

---

## 5. Alertes (exemples de seuils)

| Alerte | Condition | Action |
|--------|-----------|--------|
| Erreurs API | Taux 5xx > 1 % sur 5 min | Investiguer ; rollback si cause = déploiement φ |
| Latence | p95 > baseline + 50 % | Vérifier CDN, bundle, cold starts Lambda |
| Conversion | baisse > X points vs baseline *et* n suffisant | Pause promotion ; analyse stat + produit |
| Assignation | écart > ±10 pts vs cible sur gros volume | Vérifier cookies, cache, double chargement script |

Les valeurs de X doivent être calées sur la variance historique (ne pas réagir au bruit sur n < taille calculée).

---

## 6. Escalade

1. **Niveau 1 (on-call dev)** : logs, métriques, reproduction ; correctif ou rollback technique.
2. **Niveau 2 (lead / PM)** : arbitrage produit (pause canary, message utilisateurs, communication interne).
3. **Niveau 3 (direction)** : impact business majeur, communication externe, gel des releases.

Canal recommandé : fil Slack dédié + ticket incident numéroté.

---

## 7. Promotion (palier suivant)

Checklist avant d’augmenter le pourcentage :

- [ ] Fenêtre de surveillance du palier actuel respectée (durée minimale + volume minimal).
- [ ] Aucune alerte rouge ouverte non expliquée.
- [ ] Métriques secondaires (a11y, erreurs JS) dans les tolérances.
- [ ] Décision **écrite** (message ou ticket) : « Go palier Y % ».

Ordre type : **5 % → 20 % → 50 % → 100 %**, avec possibilité de rester plus longtemps sur un palier si le trafic est faible.

---

## 8. Seuils statistiques (rappel)

- Ne pas « piger » le gagnant avant la taille d’échantillon prévue (voir analyse de puissance).
- Pré-enregistrer : KPI primaire, tests (one-sided / two-sided), corrections pour métriques multiples si plusieurs KPI testés.
- En cas d’effet négatif clair **et** grande taille d’échantillon : stopper la variante φ avant la fin planifiée.

---

## 9. Post-déploiement

- **Rétrospective** : ce qui a bien fonctionné, incidents, écarts vs hypothèses.
- **Documentation** : mettre à jour `public/circulai-phi/deploy-checklist.md` et liens vers ce playbook.
- **Nettoyage** : retirer flags temporaires, branches mortes, secrets de test.
- **Archivage** : exporter résultats bruts (CSV / entrepôt) pour audit futur.

---

## 10. Références repo

- Analyse de puissance : `scripts/circulai_power_analysis.py`, `docs/circulai-power-analysis.ipynb`
- Déploiement automatisé : `.github/workflows/deploy_and_terraform.yml` (canonique), `serverless.yml` (legacy éventuel)
- Exemple de rapport synthétique (scénario chiffré) : [`docs/CIRCULAI-RAPPORT-SIMULE-EXEMPLE.md`](CIRCULAI-RAPPORT-SIMULE-EXEMPLE.md)
- Bundle statique : `public/circulai-phi/`
- Démonstration API locale : `server/ab-server.js`
