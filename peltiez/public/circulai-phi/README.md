# CirculAI φ Prototype

## But

Prototype d’une landing page et d’un kit d’optimisation basés sur le **nombre d’or (φ)** pour harmoniser design, priorisation produit et optimisation algorithmique.

## Bootstrap (`scripts/bootstrap_phi.sh`)

Depuis la **racine du monorepo** `peltiez/` (Git Bash, WSL ou macOS/Linux) :

- **`./scripts/bootstrap_phi.sh bundle`** — régénère **uniquement** ce dossier `public/circulai-phi/` (`index.html`, tokens, A/B, `golden_search.py`, `power_analysis.py`, `power_analysis.ipynb`, `playbook-canary.md`, `deploy-checklist.md`). Ne modifie pas le `package.json` racine, ni `index.html` racine, ni les workflows `.github/`. Par défaut, **ne touche pas** à `server/` ni `lambda/` ; ajouter **`--sync-server`** pour écraser `server/ab-server.js` avec le gabarit embarqué (requêtes analytics en `fetch` + `AbortSignal.timeout`).
- **`./scripts/bootstrap_phi.sh standalone /chemin/vers/dossier`** — écrit un mini-dépôt autonome (bundle sous `public/circulai-phi/`, `server/`, `lambda/`, `serverless.yml`, `package.json`, `.github/workflows/deploy.yml`, `index.html` à la racine du dossier cible).

Vérification syntaxe : `bash -n scripts/bootstrap_phi.sh`.

## Contenu du dépôt

| Fichier | Description |
|---------|-------------|
| `index.html` | Prototype landing responsive avec hero animé (spirale dorée SVG). |
| `design-tokens.css` | Variables CSS et tokens basés sur φ. |
| `golden_search.py` | Module Python **réutilisable** : recherche par **section dorée** (golden-section search) pour l’**optimisation 1D unimodale** sur un intervalle \([a,b]\). Équivalent JS : `goldenSectionSearch` dans [`src/lib/goldenRatio.js`](../../src/lib/goldenRatio.js) (monorepo). |
| `README.md` | Ce fichier. |
| `ab_experiment.js` | Snippet JS pour A/B (localStorage, `data-experiment-phi`, classes `phi-variant` / `control-variant`, `window.__circulai_phi`). |
| `power_analysis.py` | Taille d’échantillon / puissance (statsmodels) — aligné sur `scripts/circulai_power_analysis.py`. |
| `power_analysis.ipynb` | Carnet Jupyter : courbe de puissance illustrative (deux proportions, **circulai_phi_v1**). |
| `playbook-canary.md` | **Playbook canary** (FR/EN) : gates de trafic, critères de promotion, rollback. |
| `../../docs/circulai-power-analysis.ipynb` | Copie / variante dans `docs/` (référence monorepo). |
| `../../docs/playbook-canary.md` | Variante dans `docs/` si présente (sinon utiliser `playbook-canary.md` dans ce dossier). |
| `../../server/ab-server.js` | Démo **A/B côté serveur** (Express, cookies `circulai_user_id` + expérience `circulai_phi_v1`, `GET /api/experiment`, `POST /api/experiment/convert`) — `npm run ab:server-demo` depuis la racine. |
| `../../lambda/ab-lambda.js` | Assignation A/B **AWS Lambda / API Gateway** (HTTP API v2), alignée sur les mêmes endpoints ; `EVENT_COLLECTOR_URL`, `EXPERIMENT_ID` (défaut `circulai_phi_v1`). |
| `../../terraform/` | Déploiement **Terraform** (S3 privé + CloudFront, Lambda zip S3, HTTP API v2) — `../../terraform/README.md`. |
| `../../analysis/compute_lift.py` | Z-test deux proportions / lift sur CSV (`pip install statsmodels`) ; ex. `python ../../analysis/compute_lift.py mon_export.csv`. |
| `../../serverless.yml` | Déploiement **Serverless Framework v3** à la racine du monorepo (`handler: lambda/ab-lambda.handler`, package léger). |
| `../../circulai-serverless/package.json` | Scripts `start` → `node ../server/ab-server.js`, `deploy` → `cd .. && npx serverless deploy --stage staging`. |
| `../../.github/workflows/deploy.yml` | CI : copie des assets `public/circulai-phi/` vers `dist/`, credentials AWS v4, `serverless deploy`. |
| `deploy-checklist.md` | **Deploy Checklist** (sections 1–11, français). |

## Installation locale rapide

1. **Cloner** le dépôt contenant ce dossier, puis se placer dans **`public/circulai-phi/`** (à la racine du clone du monorepo, chemin typique : `…/peltiez/public/circulai-phi/`).  
   *Si vous distribuez ce dossier seul comme ZIP, ouvrez-le directement comme racine du site statique.*

2. Ouvrir **`index.html`** dans un navigateur moderne (Chrome / Edge / Firefox).

3. Pour l’optimisation Python : depuis **ce dossier**  
   `python3 golden_search.py`  
   *ou*, depuis la racine **`peltiez/`** du monorepo :  
   `python3 scripts/golden_search.py`

## Design tokens

- **`--phi`** : `1.6180339887`
- **`--base`** : `16px`
- **`--scale-0` … `--scale-2`** : `base × φ^n` (en CSS : produits `calc(var(--base) * var(--phi) * …)` ; il n’y a pas d’opérateur `^` natif).

Voir `design-tokens.css` pour `--phi`, `--base`, `--scale-0`…`--scale-2`, `--gutter`, `--accent`, `--bg` (noyau minimal) ; layout et styles de page dans le `<style>` de `index.html`.

## Optimisation

- Utiliser **`golden_search.py`** pour un hyperparamètre **unimodal** sur un intervalle (seuils, pondérations).
- Pour **maximiser** une métrique : minimiser l’opposé (`lambda x: -metric(x)`) puis réinterpréter le résultat (voir docstring du module).

## A/B testing plan

- **Variants** : `control` vs `phi` (prototype).
- **KPI primaire** : taux de conversion sur la landing.
- **KPI secondaires** : temps pour terminer l’onboarding, CTR sur le CTA.
- **Power** : 80 % power, α = 0,05 — calculer la taille d’échantillon **avant** lancement (`docs/circulai-power-analysis.ipynb`).
- **Rollout** : canary 5 % → 20 % → 50 % → 100 % selon les KPI (`docs/playbook-canary.md`).

Instrumentation : charger **`ab_experiment.js`** (`defer` dans `index.html`) ; exposition `window.__circulai_phi.variant`, attribut `data-experiment-phi` sur `<html>`, classes `phi-variant` / `control-variant` sur `body`. **GTM / `dataLayer`** : `experiment_assign` (une fois par nouvelle assignation lorsque `localStorage` était vide ou invalide puis première écriture réussie, clé `circulai_phi_variant`) avec `experiment: 'circulai_phi_v1'` ; CTA dans `index.html` : **`experiment_conversion`** avec les mêmes champs. **Universal Analytics** : si `window.ga` (legacy) est présent, événements miroir. **Attribution finale** : journaliser côté serveur ; le snippet client sert au routage et aux hooks analytics.

## Checklist de déploiement

Voir **`deploy-checklist.md`**. Démo attribution serveur : `../../lambda/ab-lambda.js` ; `../../serverless.yml` ; `../../terraform/` ; `../../analysis/compute_lift.py` ; `../../server/ab-server.js` (`npm run ab:server-demo`).

## Notes

- Valider les changements par **A/B** et **tests utilisateurs** lorsque le prototype devient produit.
- Ne pas sacraliser φ : c’est un **outil** de cohérence et d’optimisation, pas une règle absolue.

## Références (monorepo IGOR)

- Roadmap, design system détaillé, checklist étendue : `../../docs/PHI-DESIGN-SYSTEM-AND-ROADMAP.md`
- Contexte mathématique : `../../docs/Nombre d'or.txt`
- Spirale / recherche côté app : `../../src/lib/goldenRatio.js`
- `../../lambda/ab-lambda.js` — assignation A/B côté **AWS Lambda / API Gateway** ; `../../server/ab-server.js` — démo **Express** locale.
