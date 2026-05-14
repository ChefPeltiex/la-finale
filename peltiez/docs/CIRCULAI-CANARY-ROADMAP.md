# Roadmap CirculAI — canary φ (10 étapes : préparation → itération)

Ce document adapte la feuille de route **dix étapes** (préparation → itération) au monorepo **peltiez**. Toutes les commandes s’exécutent depuis la racine du dépôt : `peltiez/` (sauf mention explicite du dossier `terraform/`).

---

## 1. Préparation — secrets et garde-fous

- Recenser les secrets GitHub / AWS nécessaires au déploiement et au Terraform ; ne jamais committer de clés en clair.
- Modèle et liste de variables : **`docs/GITHUB_SECRETS_TEMPLATE.md`** (à compléter ou à créer si le fichier n’est pas encore présent dans le dépôt).

---

## 2. Configuration Terraform — `terraform.tfvars`

- Fichier attendu : **`terraform/terraform.tfvars`** (non versionné en général).
- Point de départ versionné : **`terraform/terraform.tfvars.example`** — copier vers `terraform/terraform.tfvars` puis renseigner les valeurs réelles (région, projet, buckets, etc.).

---

## 3. Dépendances Node.js

- À la racine **`peltiez/`** :

```bash
npm ci
```

---

## 4. Bootstrap PHI (bundle)

- Commande cible (depuis la racine **`peltiez/`**) :

```bash
./scripts/bootstrap_phi.sh bundle
```

- Ne pas supposer un wrapper **`./bootstrap_phi.sh`** à la racine du dépôt sauf si un tel fichier existe explicitement dans votre branche.
- Si le script **`scripts/bootstrap_phi.sh`** est absent, vérifier la documentation interne ou ouvrir une tâche pour l’aligner sur la chaîne de build φ.

---

## 5. Environnement Python et scripts analytiques

- Installation typique des bibliothèques utiles (adapter à votre gestionnaire d’environnement : venv, conda, etc.) :

```bash
pip install statsmodels numpy scipy matplotlib boto3 requests
```

- **Recherche « golden »** — deux emplacements possibles dans ce dépôt ; utiliser celui qui correspond à votre branche :

  - `python3 public/circulai-phi/golden_search.py`
  - `python3 scripts/golden_search.py`

- **Analyse de puissance** — le fichier **`public/circulai-phi/power_analysis.py`** est présent dans le dépôt ; exécution :

```bash
python3 public/circulai-phi/power_analysis.py
```

  Alternative (script dédié côté `scripts/`) :

```bash
python3 scripts/circulai_power_analysis.py
```

- Pour le déroulé opérationnel du canary (phases de trafic, surveillance, rollback), se reporter aussi à **`docs/playbook-canary.md`**.

---

## 6. Canary — mise en production progressive

- Suivre le playbook canary (paliers de trafic, critères d’arrêt, escalade) : **`docs/playbook-canary.md`**.
- S’assurer que la baseline, le calcul de puissance et l’instrumentation (`experiment_assign` / `experiment_conversion` ou équivalent) sont en place **avant** d’augmenter la part de trafic φ.

---

## 7. Ingestion des données

- Chaîne attendue dans le monorepo : **`analysis/data_ingestion.py`** (préparer / normaliser les flux vers les jeux utilisés par l’analyse d’expérience).
- Si ce fichier n’existe pas encore sur votre branche, le créer ou l’aligner sur la convention du dossier **`analysis/`**.

---

## 8. Analyse post-ingestion

- Scripts de référence : **`analysis/compute_lift.py`** et **`analysis/auto_report.py`** (lift, synthèse, rapports automatisés).
- Vérifier la cohérence des métriques avec les définitions du prototype φ et les sorties des scripts Python de l’étape 5.

---

## 9. Sécurité et automatisation (CI / CD)

**Sécurité (rappels)**

- Moindre privilège sur les rôles IAM ; rotation des secrets ; pas de `terraform.tfvars` ou d’artefacts sensibles dans Git.
- Valider les URLs de collecte et les politiques de buckets avant d’élargir le canary.

**CI**

- Workflow présent dans ce dépôt : **`.github/workflows/deploy_and_terraform.yml`** (déploiement, empaquetage Lambda, Terraform). S’y référer pour l’ordre des jobs et les secrets attendus.
- Si ce fichier venait à disparaître ou diverger, considérer aussi les workflows liés à φ (par ex. **`deploy-circulai-phi.yml`**, **`deploy-phi-prototype.yml`**, **`deploy.yml`**) selon la branche active.

**Chaîne locale complémentaire (hors canary métier des étapes 6–8)**

- Serveur A/B local (racine **`peltiez/`**) :

```bash
node server/ab-server.js
```

- Empaquetage Lambda : si un script **`./package_lambda.sh`** existe à la racine, l’utiliser ; sinon (cas actuel du dépôt) :

```bash
./scripts/package_lambda.sh
```

- Application Terraform (après `terraform.tfvars` renseigné) :

```bash
cd terraform && terraform init && terraform apply -var-file=terraform.tfvars -auto-approve
```

  Variante acceptable : utiliser un fichier **`*.auto.tfvars`** reconnu automatiquement par Terraform à la place de `-var-file=terraform.tfvars`, selon votre convention d’équipe.

---

## 10. Itération — demandes optionnelles à l’équipe / à l’agent

Remplacer la liste « ce que je peux faire maintenant » par des **demandes explicites**, sans présumer d’exécution automatique tant qu’elles ne sont pas demandées :

- **YAML CI** : ajuster ou faire réviser **`.github/workflows/deploy_and_terraform.yml`** (ou les workflows φ) selon les contraintes du projet.
- **`terraform.tfvars`** : produire ou valider un fichier avec **valeurs réelles** (hors dépôt), aligné sur les secrets GitHub.
- **ZIP Lambda** : préparer ou vérifier l’artefact attendu par le pipeline (bucket, préfixe de clé, nom du zip).
- **Rapport simulé** : générer ou relire un rapport d’expérience / canary de démonstration à des fins de revue (données fictives ou masquées).

Aucune de ces actions n’est engagée par la seule lecture de ce document : **demander** clairement à l’équipe ou à l’agent ce qui doit être fait.
