# Prélancement — plan opérationnel (J−7 → J+7) — CirculAI φ / dépôt peltiez

## Références internes (dépôt)

- [Playbook canary](playbook-canary.md)
- [Déploiement — démarrage rapide](DEPLOY_QUICKSTART.md)
- [Récapitulatif des livrables CirculAI](CIRCULAI-LIVRABLES-RECAP.md)
- [Design system φ et feuille de route](PHI-DESIGN-SYSTEM-AND-ROADMAP.md)
- Workflow CI/CD : [`.github/workflows/deploy_and_terraform.yml`](../.github/workflows/deploy_and_terraform.yml)
- Workflow CI/CD : [`.github/workflows/ci_deploy_full.yml`](../.github/workflows/ci_deploy_full.yml)

---

## 1. Objectif et périmètre

**Objectif.** Sécuriser la mise en production de CirculAI φ sur la fenêtre **J−7 → J+7** : préparation, déploiement progressif, surveillance, décisions Go / No-Go, stabilisation et apprentissage post-lancement.

**Périmètre.** Prototype / produit φ tel que versionné dans le dépôt **peltiez** (front, API associées, Lambda, Terraform, Serverless, CDN), dans la limite des environnements et branches couverts par les workflows listés ci-dessus.

**Paramètres à fixer avant exécution**

| Placeholder | Description |
|-------------|-------------|
| `[DATE J0]` | Date et heure cibles du lancement (fenêtre de bascule). |
| `[FUSEAU]` | Fuseau horaire de référence pour les comptes-rendus et les alertes. |
| `[VERSION]` | Identifiant d’artefact / tag / build déployé en production pour J0. |

Hors périmètre : tout composant non versionné ici ou non couvert par le pipeline actuel — à traiter dans un addendum une fois l’inventaire à jour.

---

## 2. Calendrier J−7 → J0

Alignement opérationnel (sans dépendance narrative externe). Ajuster les dates réelles à partir de `[DATE J0]`.

| Jour | Focus principal | Livrables / contrôles |
|------|------------------|------------------------|
| **J−7** | Gel du périmètre fonctionnel pour J0 ; liste des risques résiduels ; confirmation des owners (produit, tech, astreinte). | Backlog J0 figé ; réunion d’alignement 30 min. |
| **J−6** | Vérification secrets, buckets, noms de stack, branches de déploiement. | Lecture de `DEPLOY_QUICKSTART.md` + parcours manuel staging. |
| **J−5** | Instrumentation : métriques techniques et événements métier ; tableaux de bord prêts. | Requêtes / panneaux nommés ; test d’alerte « dry-run » si possible. |
| **J−4** | Charge et perf : scénarios de charge ciblés ou replay ; budgets p95 documentés. | Rapport court (baseline p95, erreurs, saturation). |
| **J−3** | Dry-run de rollback (sans exécution destructive si environnement l’interdit) : relecture du runbook §5. | Cases à cocher runbook complétées sur papier / ticket. |
| **J−2** | Communication interne : fenêtre de maintenance, canal incident, critères Go / No-Go partagés. | Message unique validé par le sponsor. |
| **J−1** | Build candidat `[VERSION]` ; smoke complet sur l’environnement miroir ; go final intermédiaire. | Artefact immuable ; tag ; note de déploiement. |
| **J0** | Exécution du déploiement et des paliers canary (§3) ; war room légère (T0 → T0+2 h minimum). | Journal horodaté des actions et décisions. |

Liste condensée (même contenu) :

1. **J−7** — Périmètre et risques ; owners.
2. **J−6** — Secrets / infra / staging.
3. **J−5** — Monitoring et alertes.
4. **J−4** — Perf / baseline.
5. **J−3** — Runbook rollback relu.
6. **J−2** — Communication interne.
7. **J−1** — Build candidat + smoke + gel code.
8. **J0** — Déploiement + canary + décisions.

---

## 3. Déploiement : canary, feature flags, smoke

**Paliers de trafic (variante φ)** : **5 % → 25 % → 50 % → 100 %** (ajuster si le volume journalier impose des paliers plus prudents ; le [playbook canary](playbook-canary.md) propose des ordres de grandeur alternatifs à réconcilier avec la réalité du trafic).

À chaque palier :

1. Vérifier les **feature flags** (état attendu, pas de fuite sur les cohortes non concernées).
2. Exécuter la **liste de smoke** (§7) sur un échantillon représentatif (utilisateur test + trafic réel faible au premier palier).
3. Attendre une **fenêtre d’observation** convenue (ex. 30–120 min au premier palier, plus long aux paliers suivants si le volume le permet).
4. Valider les **seuils** (§4) : si OK, promouvoir ; sinon stopper et appliquer §5.

Documenter pour chaque palier : heure, pourcentage, décision (promotion / pause / rollback), lien vers captures ou tableaux de bord.

---

## 4. Seuils : SLO cible vs déclencheurs de rollback

### 4.1 SLO cible (engagement de service sur 24 h glissantes, post-stabilisation)

Exemples indicatifs à adapter à la baseline mesurée avant J0 :

| Indicateur | SLO cible (exemple) |
|------------|---------------------|
| Taux d’erreurs HTTP **5xx** | **&lt; 0,1 %** sur 24 h (après stabilisation du trafic à 100 %). |
| Latence **p95** (routes critiques listées dans le runbook produit) | **≤ 1,2 × baseline** mesurée en J−4 / J−1 (remplacer par la valeur chiffrée une fois la baseline fixée). |
| Erreurs métier (taux sur actions clés) | **≤ seuil métier** défini avec le produit (placeholder : documenter le KPI et la requête). |

Les SLO cibles servent la **dette de confiance** vis-à-vis des utilisateurs et parties prenantes ; ils ne doivent pas être confondus avec les seuils d’alarme immédiate.

### 4.2 Déclencheurs de rollback (courts délais, action immédiate)

En cas de dépassement **cumulé** ou **confirmé** sur une courte fenêtre, considérer un rollback ou une mise en pause du palier (selon gravité) :

| Déclencheur | Exemple de seuil (à caler sur la baseline) |
|-------------|--------------------------------------------|
| **5xx** | **&gt; 0,5 %** sur **5 minutes** glissantes (ou N erreurs absolues si le trafic est faible — documenter N). |
| **Latence p95** | **&gt; 2 × baseline** sur les mêmes routes critiques, sur **10–15 minutes** après exclusion des causes externes (CDN, dépendance tierce). |
| **Erreurs métier** | Taux **&gt; [seuil]** sur la période T0 → T0+2 h, avec corrélation temporelle au déploiement. |
| **Intégrité des données** | Toute anomalie d’écriture / incohérence de périmètre identifiée comme **P0**. |

La décision finale (rollback total vs retour palier précédent vs désactivation d’un flag) relève du **cadre crise** (§10) et doit être tracée.

---

## 5. Runbook rollback (étapes numérotées)

**Principe.** Ne pas inventer de commandes spécifiques tant que le pipeline n’est pas figé sur l’environnement cible. **Documenter la commande exacte une fois le pipeline figé** (copier-coller depuis le CI, le README Terraform ou le script validé en staging).

1. **Stopper la promotion** : figer le trafic au dernier palier sain (ex. revenir à 100 % contrôle / version précédente via le mécanisme de flags ou de routage documenté dans le playbook canary).
2. **Terraform (infra)** : identifier le révisionnement / state cible ; exécuter **`terraform apply`** (ou équivalent approuvé) vers la **révision précédente connue stable** — *noter la commande exacte après validation sur un environnement non prod*.
3. **Artefact Lambda (S3)** : si le déploiement repose sur un zip versionné, **rétablir l’objet S3** de la version précédente ou relancer le job de déploiement pointant sur le tag stable — *documenter le nom de bucket, préfixe et clé une fois le pipeline figé*.
4. **CloudFront** : après tout changement d’origine ou d’objet statique, déclencher l’**invalidation** des chemins impactés — *documenter la distribution ID et le pattern d’invalidation validé*.
5. **Serverless Framework** : si utilisé pour certaines fonctions, **re-déployer** la stack en ciblant la version d’artefact ou le stage de rollback — *documenter `serverless deploy` ou la variante utilisée en interne, avec stage et région*.
6. **Vérification post-rollback** : exécuter la liste de smoke (§7) ; surveiller 30–60 min ; communiquer l’état « rollback terminé » sur le canal incident.
7. **Post-mortem léger** : dans les 48 h, causes racines, actions correctives, mise à jour des seuils si nécessaire.

---

## 6. Monitoring (technique, métier, alertes)

**Technique**

- Taux 4xx / 5xx par service et par route critique.
- Latences p50 / p95 / p99 ; saturation CPU / mémoire / concurrence Lambda si applicable.
- Logs structurés corrélables (request id, utilisateur anonymisé).

**Métier**

- Entonnoir des actions clés (assignation expérimentation, conversion, abandons).
- Comparaison contrôle vs variante sur les KPI primaires et garde-fous (voir playbook canary).

**Alertes**

- Canaux distincts : *warning* (investigation) vs *critical* (astreinte + décision rollback).
- Chaque alerte a un **runbook de première réponse** (lien vers dashboard + étape 1 de diagnostic).

---

## 7. Smoke tests (liste)

À exécuter à **chaque palier** canary et après tout rollback :

1. **Santé** : endpoint de health / page d’accueil prototype φ se charge sans erreur console bloquante.
2. **Auth / session** (si applicable) : parcours connexion minimal ou accès anonyme attendu selon le produit.
3. **Parcours critique métier** : action principale « happy path » documentée par le produit (une fois par palier, compte test dédié).
4. **Expérimentation** : vérification que l’assignation φ / contrôle respecte le pourcentage cible (échantillon ou log côté serveur).
5. **API** : appel aux routes documentées dans `docs/ARCHITECTURE-ROUTES-API.md` (ou équivalent) avec codes 2xx attendus.
6. **Static / CDN** : chargement des assets versionnés (cache / hash) ; pas de 404 sur les ressources critiques.
7. **Mobile / viewport** (échantillon) : rendu correct sur une largeur mobile standard.
8. **Collecte d’événements** : au moins un événement test visible dans la chaîne d’analytics / entrepôt dans un délai SLA interne convenu.

Compléter avec les cas spécifiques du périmètre `[VERSION]`.

---

## 8. Critères Go / No-Go

**Go (promotion au palier suivant ou à 100 %)**

- Smoke §7 **vert** sur le palier courant.
- Métriques **sous les déclencheurs de rollback** §4.2 pendant la fenêtre d’observation.
- Pas d’incident P0 ouvert ; pas de divergence majeure des KPI garde-fou vs contrôle (selon règles statistiques / MDE définies en amont).

**No-Go (pause ou rollback)**

- Déclencheur §4.2 atteint ou smoke rouge persistant après tentative de correction rapide.
- Dépendance externe dégradée rendant l’interprétation des métriques impossible (dans ce cas : **pause** plutôt que promotion jusqu’à clarification).
- Décision explicite du sponsor produit en présence d’un risque métier non couvert par les seuils.

---

## 9. Post-lancement J+1 → J+7

| Jour | Actions |
|------|---------|
| **J+1** | Revue des incidents mineurs ; ajustement alertes bruyantes ; confirmation stabilité 5xx / p95 sur 24 h. |
| **J+2** | Point métier : premiers effets sur KPI ; décision sur correctifs non bloquants. |
| **J+3** | Revue capacité / coûts (Lambda, transfert, logs). |
| **J+4** | Documentation à jour : commandes réelles de déploiement / rollback insérées dans ce document ou dans `DEPLOY_QUICKSTART.md`. |
| **J+5** | Bilan canary (lecture conjointe avec `playbook-canary.md`) : cohortes, biais, anomalies. |
| **J+6** | Préparation rétrospective courte ; backlog des dettes techniques observées. |
| **J+7** | **Clôture de phase** : rapport une page (objectifs, écarts, décisions, indicateurs de succès §11) ; archivage des liens dashboards. |

---

## 10. Cadre crise (court)

- **Rôles** : incident commander (tech), porte-parole (produit / com), scribe (timeline).
- **Communication** : mises à jour time-boxées (ex. toutes les 30 min) tant que l’incident est majeur.
- **Décision** : en cas de doute sur la gravité, privilégier **rollback / réduction de risque** puis analyse.
- **Sortie de crise** : critères de stabilité atteints + communication de fin d’incident + date de post-mortem.

---

## 11. Indicateurs de succès

- Déploiement **J0** réalisé sans rollback **P0** non maîtrisé (un rollback contrôlé documenté peut rester un succès partiel).
- **SLO** §4.1 tenus sur les 24–72 h suivant la montée à 100 % (ajuster la fenêtre selon le produit).
- **KPI métier** : pas de régression majeure vs baseline ; si objectif de lift, vérification par rapport au MDE défini en amont.
- **Dette opérationnelle** : runbooks et commandes réelles **complétés** au plus tard **J+4**.
- **Satisfaction interne** : équipe capable de reproduire le déploiement sans dépendance à une seule personne.

---

## Annexe — Note d’alignement d’équipe (optionnelle)

L’intention est une mise en ligne **calme, prévisible et vérifiable** : chacun sait quoi observer et à quel moment intervenir. La précision prime sur la vélocité apparente ; les chiffres et seuils sont des conventions explicites, non des interprétations tacites. En cas de tension, la procédure écrite fait foi jusqu’à sa mise à jour formelle. Nous tenons le cap par des décisions documentées plutôt que par l’improvisation. Le respect mutuel des rôles et des fenêtres d’astreinte sécurise l’ensemble du dispositif.
