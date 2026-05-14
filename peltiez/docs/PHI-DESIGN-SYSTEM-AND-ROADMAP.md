# CirculAI — design system φ, roadmap produit, déploiement

## Documentation technique concise

**Récap livrables (chemins vérifiés)** : [`docs/CIRCULAI-LIVRABLES-RECAP.md`](CIRCULAI-LIVRABLES-RECAP.md) · **Canary** : [`docs/playbook-canary.md`](playbook-canary.md) — le fichier `docs/CIRCULAI-CANARY-ROADMAP.md` n’est pas présent dans ce dépôt.

Instructions d’intégration et de pilotage du **prototype CirculAI φ** (fichiers, exécution, A/B, optimisation).

| Élément | Détail |
|--------|--------|
| **Bundle** | Dossier [`public/circulai-phi/`](../public/circulai-phi/) : `index.html`, `design-tokens.css`, `golden_search.py`, `power_analysis.py`, `ab_experiment.js`, `deploy-checklist.md`, [`README.md`](../public/circulai-phi/README.md). CI : [`.github/workflows/deploy-circulai-phi.yml`](../.github/workflows/deploy-circulai-phi.yml), [`.github/workflows/deploy-phi-prototype.yml`](../.github/workflows/deploy-phi-prototype.yml). Lambda : [`lambda/ab-lambda.js`](../lambda/ab-lambda.js) + [`serverless.yml`](../serverless.yml) + option [`terraform/`](../terraform/). Playbook : [`playbook-canary.md`](playbook-canary.md). Notebook : [`circulai-power-analysis.ipynb`](circulai-power-analysis.ipynb). Script : [`scripts/circulai_power_analysis.py`](../scripts/circulai_power_analysis.py). |
| **Frontend** | Ouvrir `index.html` en local (`file://`) ou servir `public/` ; Vite : `/circulai-phi/index.html`. Alias : `/prototype-phi-landing.html`. |
| **Tokens CSS** | Source : `public/circulai-phi/design-tokens.css` ; URL racine : `/design-tokens.css` (réimport). |
| **Python** | `python scripts/golden_search.py` depuis `peltiez/` ; copie bundle : `circulai-phi/golden_search.py`. Puissance A/B : `python scripts/circulai_power_analysis.py` ou `python public/circulai-phi/power_analysis.py` (voir aussi `docs/circulai-power-analysis.ipynb`). |
| **A/B analytics** | `ab_experiment.js` : `window.__circulai_phi`, `window.circulaiAB`, `data-experiment-phi`, classes `phi-variant` / `control-variant` ; `dataLayer` (`experiment_assign` sur nouvelle affectation, `circulai_ab`, `experiment_conversion` sur le CTA dans `index.html`) ; `window.ga` (UA legacy) si présent ; **`?ab=control` \| `?ab=phi`** ; **attribution** : logs serveur sur actions clés. |
| **A/B serveur (démo)** | [`server/ab-server.js`](../server/ab-server.js) : Express ESM, `cookie-parser`, cookies `circulai_user_id` + clé d’expérience, `VARIANTS` / `ASSIGN_PROB`, `GET /api/experiment`, `POST /api/experiment/convert` ; `sendEvent` (axios) **uniquement** sur **nouvelle** assignation (branche qui pose le cookie d’expérience). Exécution : `npm run ab:server-demo` — non branché à `server/index.js` par défaut. |
| **A/B serveur (Lambda)** | [`lambda/ab-lambda.js`](../lambda/ab-lambda.js) : même contrat d’endpoints / cookies que la démo Express ; API Gateway HTTP API v2 (`rawPath`, `requestContext.http.method`), réponse `cookies[]`, `EVENT_COLLECTOR_URL` + `fetch` avec `AbortSignal.timeout(8000)`, `export async function handler`. Infra : [`serverless.yml`](../serverless.yml) ; option **Terraform** : [`terraform/`](../terraform/) + [`terraform/README.md`](../terraform/README.md). |
| **Analyse lift (CSV)** | [`analysis/compute_lift.py`](../analysis/compute_lift.py) : z-test deux proportions (`statsmodels` ; `pip install statsmodels`). Ex. `python analysis/compute_lift.py export.csv`. |
| **App React** | Spirale / recherche : `src/lib/goldenRatio.js` ; spacing φ : `src/index.css`, `tailwind.config.js`. |

KPI, plan A/B (puissance, α), roadmap, checklist déploiement, succès §8–9 : sections **5 à 9** ci-dessous. Contexte mathématique φ : fichier `Nombre d'or.txt` dans ce même répertoire `docs/` ; confusion de notation **φ(n) Euler** vs **φ doré** : voir aussi [`Polynome-cyclotomique.txt`](Polynome-cyclotomique.txt).

- **Puissance / taille d’échantillon** : [`scripts/circulai_power_analysis.py`](../scripts/circulai_power_analysis.py), carnet [`docs/circulai-power-analysis.ipynb`](circulai-power-analysis.ipynb)
- **Playbook canary (FR)** : [`docs/playbook-canary.md`](playbook-canary.md)
- **Déploiement** : [`.github/workflows/deploy-phi-prototype.yml`](../.github/workflows/deploy-phi-prototype.yml), [`.github/workflows/deploy_and_terraform.yml`](../.github/workflows/deploy_and_terraform.yml), [`serverless.yml`](../serverless.yml) (service `circulai-phi`, handler `lambda/ab-lambda.handler`), [`terraform/`](../terraform/) (S3 privé + CloudFront + Lambda zip + HTTP API v2)

---

## 4. Design system minimal (extraits et règles)

### Variables centrales (bundle)

- Dans [`public/circulai-phi/design-tokens.css`](../public/circulai-phi/design-tokens.css) **uniquement** : `--phi`, `--base`, `--scale-0` … `--scale-2`, `--gutter`, `--accent`, `--bg` (fichier volontairement minimal pour copie / staging).
- Réexport racine : [`public/design-tokens.css`](../public/design-tokens.css) (`/design-tokens.css`) — `@import` du fichier ci-dessus.

### Typographie

- Corps : `--scale-0` (= `16px`).
- Sous-titre / lead : `--scale-1` (= `base·φ`).
- `h1` : `--scale-2` (= `base·φ²`).

### Espacement

- Gouttière : `8px × φ` (`--gutter`). Marges supplémentaires : `rem` ou multiples de `var(--gutter)` dans les feuilles de page ou l’app.

### Composants et utilitaires étendus

- Rayons, paddings dérivés, classes utilitaires (ex. cartes / boutons) : plutôt dans l’app — [`src/index.css`](../src/index.css) (et Tailwind) — pas dans le fichier tokens du bundle.

### Layout

- Grille φ (≈ 61,8 % / 38,2 %) : définir **en inline** sur les pages statiques (ex. `grid-template-columns: 1fr minmax(0, calc(100% / (var(--phi) * var(--phi))));` dans `public/circulai-phi/index.html` et `public/prototype-phi-landing.html`).
- Visuels narratifs : spirale, réf. `public/prototype-phi-landing.html`, `src/lib/goldenRatio.js`.

### Naming

- Tokens bundle : `--scale-n` = `base × φ^n` pour `n ∈ {0,1,2}`.

### App React (Tailwind)

- Déjà relié dans `src/index.css` : `--phi`, `--space-phi-*`, clés `phi-sm` … `phi-xl` dans `tailwind.config.js`. Les tokens `public/design-tokens.css` servent surtout aux pages statiques et au staging HTML.

---

## 5. Plan d’intégration produit et roadmap

| Phase | Durée indic. | Priorités |
|-------|----------------|-----------|
| **0 — Audit** | 1–2 j | Pages fort trafic, composants réutilisables ; métriques actuelles (CTR, conversion, temps de tâche). |
| **1 — Prototype visuel** | 3–5 j | Prototype HTML sur staging ; variables φ sur header, hero, cards ; test qualitatif (5–8 pers.). |
| **2 — Optimisation algorithmique** | 1–2 sem. | 1–2 hyperparamètres critiques ; `golden_section_search` (JS ou Python) ; mesure backend + A/B. |
| **3 — Génération procédurale & onboarding** | 1–2 sem. | Spirale / animations guidage attention ; A/B φ vs neutre. |
| **4 — Rollout** | 2–4 sem. | Canary 5 % → 20 % → 50 % → 100 % selon KPI ; perf, erreurs, a11y. |
| **5 — Itération** | continu | Feedback, tests visuels automatisés, patterns φ documentés dans le design system. |

---

## 6. Checklist déploiement et garde-fous

- **Accessibilité** : tailles min 14px où pertinent ; contraste WCAG AA ; états `:focus-visible` visibles.
- **Performance** : animations privilégiant GPU (`transform` / `opacity`) ; lazy load SVG lourds ; pas de JS bloquant au-dessus de la ligne de flottaison.
- **A/B** : métrique primaire + secondaires (conversion, temps de tâche, etc.).
- **Stats** : plan d’analyse pré-enregistré ; seuils (ex. p < 0.05) ; taille d’échantillon calculée avant lancement.
- **Fallback** : `prefers-reduced-motion` (ex. bloc inline dans `public/circulai-phi/index.html` pour la spirale ; autres pages statiques au besoin) ; variante statique si animations désactivées.
- **Sécurité** : sanitization des entrées ; CSP adaptée (inline, SVG, scripts).
- **Monitoring** : logs structurés, alertes KPI, plan de rollback documenté.

---

## 7. Fichiers techniques (repo)

| Fichier | Rôle |
|---------|------|
| `public/circulai-phi/` | Bundle : `index.html`, `design-tokens.css`, `golden_search.py`, `power_analysis.py`, `ab_experiment.js`, `deploy-checklist.md`, `README.md`. URL : `/circulai-phi/index.html`. |
| `public/circulai-phi/deploy-checklist.md` | Checklist déploiement **complète** (§1–11) : objectif, préparation, sécurité, a11y, perf, observabilité, A/B stats, QA, rollout, ops, pré-commit & post-déploiement. |
| `server/ab-server.js` | Démo A/B serveur (cookies, endpoints `/api/experiment`, conversion) — `npm run ab:server-demo`. |
| `public/circulai-phi/ab_experiment.js` | A/B `control` \| `phi` : `localStorage` (`circulai_phi_variant`), `sessionStorage` (`circulai_phi_exposed` pour expose), `?ab=` ; **`experiment_assign`** sur **nouvelle** affectation ; **`experiment_conversion`** poussé depuis **`index.html`** (CTA) ; `expose` / `track` → `circulai_ab` ; `window.ga` (UA legacy) si chargé ; `window.__circulai_phi`, `window.circulaiAB`, `data-ab-variant`, `data-experiment-phi`, classes `phi-variant` / `control-variant` sur `body`. |
| `public/prototype-phi-landing.html` | Alias landing (tokens via `/design-tokens.css`). |
| `public/design-tokens.css` | Réexporte `./circulai-phi/design-tokens.css`. |
| `scripts/golden_search.py` | Recherche section dorée (Python, canonique). |
| `scripts/circulai_power_analysis.py` | Taille d’échantillon A/B (proportions, `NormalIndPower.solve_power`) ; miroir logique du bundle `public/circulai-phi/power_analysis.py`. |
| `lambda/ab-lambda.js` | Assignation A/B (API Gateway HTTP API v2) : cookies `circulai_user_id` + `circulai_phi_ab`, `GET /api/experiment`, `POST /api/experiment/convert` ; réponse `cookies[]` ; `EVENT_COLLECTOR_URL` via `fetch` + `AbortSignal.timeout(8000)` ; `ASSIGN_PROB_CONTROL` (défaut 0,95). |
| `terraform/` | Infra as code (AWS provider ~5) : bucket statique **privé** + CloudFront **OAI** + `cache_policy_id` CachingOptimized, Lambda depuis S3, route **`$default`**. Voir `terraform/README.md`. |
| `analysis/compute_lift.py` | Lift relatif + z-test deux proportions sur CSV (`variant` / `converted` par défaut) ; dépendance `statsmodels`. |
| `serverless.yml` | Service `circulai-phi` (Node 18), fonction `ab` → `lambda/ab-lambda.handler`, routes HTTP API `/`, `GET /api/experiment`, `POST /api/experiment/convert`. |
| `.github/workflows/deploy-circulai-phi.yml` | CI : `dist/` + tar + `serverless deploy` + `aws s3 sync`. |
| `.github/workflows/deploy-phi-prototype.yml` | Pipeline : `public/circulai-phi/` → `dist/`, sync S3, invalidation CloudFront, `serverless deploy`. |
| `docs/playbook-canary.md` | Runbook canary (pré-conditions, T0, surveillance, alertes, promotion). |
| `docs/circulai-power-analysis.ipynb` | Notebook exploration puissance (statsmodels). |
| `scripts/golden_section_search.py` | Réexport vers `golden_search` (compat). |
| `src/lib/goldenRatio.js` | `PHI`, `goldenSectionSearch`, spirale SVG côté app. |
| `src/index.css` + `tailwind.config.js` | Intégration existante `--phi` / spacing Tailwind. |

---

## 8. Mesures de succès et indicateurs

- **Court terme** : amélioration visuelle perçue ; engagement (cartes de chaleur / heatmaps sur hero et CTA).
- **Moyen terme** : gain de conversion **+X %** avec objectif initial typique **+8 % à +15 %** (à calibrer sur la baseline et le MDE).
- **Long terme** : modularité du design system ; baisse du temps de design ; composants plus scalables (moins d’exceptions, plus de tokens φ).

---

## 9. Livraison immédiate (contenu repo)

- **ZIP / fichiers** : dossier `public/circulai-phi/` (`index.html`, `design-tokens.css`, `golden_search.py`, `power_analysis.py`, `ab_experiment.js`, `deploy-checklist.md`, `README.md`).
- **README** : `public/circulai-phi/README.md` décrit le prototype (but, install, tokens, A/B) ; ce document (§4–9) complète roadmap, design system détaillé et checklist étendue.
- **Script A/B** : `ab_experiment.js` — GTM : `experiment_assign` (nouvelle affectation), `circulai_ab` (expose / track), `experiment_conversion` (**handler CTA** dans `index.html`) ; `window.circulaiAB`, `window.__circulai_phi`, attributs `data-experiment-phi` / `data-ab-variant` ; **attribution** : logs serveur.
- **Démo A/B serveur** : `server/ab-server.js` (`npm run ab:server-demo`) — assignation par cookies, endpoints JSON ; non monté dans `server/index.js` par défaut.

---

## Extrait README (à coller dans `README.md` si besoin)

```markdown
## Prototype CirculAI (φ) et optimisation

- **Bundle** : `public/circulai-phi/` — `index.html`, `design-tokens.css`, `golden_search.py`, `power_analysis.py`, `ab_experiment.js`, `deploy-checklist.md`, `README.md`. Dev : `/circulai-phi/index.html`.
- **README bundle** : `public/circulai-phi/README.md` (README autonome du prototype) ; détail roadmap, design system, KPI, succès : **`docs/PHI-DESIGN-SYSTEM-AND-ROADMAP.md`** (§4–9).
- **Tokens** : `/design-tokens.css` (réimporte `circulai-phi/design-tokens.css`).
- **Python** : `python scripts/golden_search.py` ; `python scripts/circulai_power_analysis.py` ; **JS** : `src/lib/goldenRatio.js` ; **A/B** : `circulai-phi/ab_experiment.js` + CTA `index.html` (`window.circulaiAB`, `dataLayer` : `experiment_assign`, `circulai_ab`, `experiment_conversion` ; logs serveur pour l’attribution).
- **Roadmap / checklist / succès (§8–9)** : `docs/PHI-DESIGN-SYSTEM-AND-ROADMAP.md`.

**Intégration staging** : servir `public/` ; métriques A/B (conversion primaire, temps onboarding secondaire ; puissance 80 %, α = 0,05) avant canary.
```
