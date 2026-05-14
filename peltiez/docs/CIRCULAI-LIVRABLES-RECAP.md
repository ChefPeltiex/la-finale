# CirculAI φ — État final et récapitulatif des livrables

Synthèse opérationnelle (inventaire, commandes, garde-fous) alignée sur le dépôt **peltiez** au moment de la rédaction. Les chemins ci-dessous ont été **vérifiés** dans l’arborescence versionnée ; les entrées manquantes sont signalées explicitement.

---

## 1. Inventaire des livrables (chemins réels)

| Zone | Chemin(s) | Statut |
|------|-----------|--------|
| **Bundle prototype φ** | `public/circulai-phi/index.html`, `design-tokens.css`, `golden_search.py`, `ab_experiment.js`, `deploy-checklist.md`, `README.md`, `power_analysis.py` | Présent |
| **Réexport tokens racine** | `public/design-tokens.css` | Présent (référencé dans `PHI-DESIGN-SYSTEM-AND-ROADMAP.md`) |
| **Landing alias** | `public/prototype-phi-landing.html` | Présent (référencé dans la doc technique) |
| **A/B démo Express** | `server/ab-server.js` | Présent |
| **A/B Lambda** | `lambda/ab-lambda.js` | Présent |
| **IaC** | `terraform/main.tf`, `variables.tf`, `versions.tf`, `outputs.tf`, `terraform.tfvars.example`, `README.md`, `.gitignore` | Présent |
| **Packaging Lambda (shell)** | `scripts/package_lambda.sh`, `scripts/package_and_deploy.sh` | Présent |
| **Python optimisation** | `scripts/golden_search.py`, `scripts/golden_section_search.py`, `scripts/circulai_power_analysis.py` | Présent |
| **Notebook puissance** | `docs/circulai-power-analysis.ipynb` | Présent |
| **Playbook canary (FR)** | `docs/playbook-canary.md` | Présent |
| **Plan prélancement J−7 → J+7 (CirculAI φ)** | [`docs/PRELAUNCH-7D-MASTER.md`](PRELAUNCH-7D-MASTER.md) | Présent |
| **Rapport simulé (exemple chiffré)** | [`docs/CIRCULAI-RAPPORT-SIMULE-EXEMPLE.md`](CIRCULAI-RAPPORT-SIMULE-EXEMPLE.md) | Présent |
| **Design system & roadmap détaillée** | `docs/PHI-DESIGN-SYSTEM-AND-ROADMAP.md` | Présent |
| **Contexte φ** | `docs/Nombre d'or.txt` | Présent |
| **Serverless** | `serverless.yml` (service `circulai-phi`, handler documenté) | Présent |
| **CI GitHub Actions** | `.github/workflows/deploy_and_terraform.yml` (canonique), `ci_deploy_full.yml`, `deploy.yml` (stub déprécié), `deploy-circulai-phi.yml` / `deploy-phi-prototype.yml` (dispatch hérité) | Présent |

### Chemins souvent cités mais absents ou non versionnés ici

| Référence attendue | Statut |
|-------------------|--------|
| `scripts/bootstrap_phi.sh` | **À ajouter / non versionné** — aucun fichier correspondant dans `scripts/`. |
| `docs/CIRCULAI-CANARY-ROADMAP.md` | **À ajouter / non versionné** — le contenu canary opérationnel est porté par `docs/playbook-canary.md`. |

---

## 2. Commandes de production / vérification (ordre suggéré)

À exécuter depuis la racine **`peltiez/`** (le `package.json` déclare `packageManager: pnpm@9.0.0` ; les workflows CI utilisent `npm ci` — rester cohérent avec l’outil choisi localement).

1. **Installer les dépendances** : `pnpm install` ou `npm ci` (comme en CI).
2. **Qualité + build applicatif** : `npm run verify` — enchaîne `lint`, `typecheck`, `build` (`vite build`).
3. **Contrôle renforcé (optionnel)** : `npm run verify:deep` — ajoute audit npm modéré et `guardian.js`.
4. **Démo A/B locale** : `npm run ab:server-demo` (serveur de démo, non monté par défaut sur `server/index.js`).
5. **Scripts Python** (exemples) : `python scripts/golden_search.py` ; `python scripts/circulai_power_analysis.py` selon besoin.
6. **Lambda (packaging + déploiement)** : `scripts/package_lambda.sh` ; enchaînement packaging + `terraform apply` : `scripts/package_and_deploy.sh` (voir `terraform/README.md`).
7. **Terraform** : depuis `terraform/` — `terraform init` puis `terraform plan` (variables : voir `terraform.tfvars.example` et `terraform/README.md`).
8. **Déploiement** : pipeline canonique `.github/workflows/deploy_and_terraform.yml` sur `main` / `master` (chemins filtrés) ou `workflow_dispatch` ; les anciens `deploy*.yml` restent en dispatch minimal pour éviter les doubles déploiements.

---

## 3. Garde-fous (rappel)

Résumé aligné sur la **§6** de `docs/PHI-DESIGN-SYSTEM-AND-ROADMAP.md` et les règles projet :

- **Accessibilité** : tailles lisibles, contraste AA, `:focus-visible` visible.
- **Performance** : privilégier `transform` / `opacity` ; lazy load des assets lourds ; éviter le JS bloquant au-dessus de la ligne de flottaison.
- **A/B & stats** : métrique primaire définie ; plan d’analyse et taille d’échantillon **avant** lancement ; seuils (ex. α) documentés.
- **Motion & fallback** : `prefers-reduced-motion` ; variante statique si besoin.
- **Sécurité** : pas d’affaiblissement TLS pour « faire passer » un build ; entrées sanitizées ; CSP adaptée.
- **Ops** : logs structurés, alertes KPI, **plan de rollback** documenté (cf. checklist `public/circulai-phi/deploy-checklist.md`).

---

## 4. Artefacts optionnels / prochaines étapes

- Ajouter **`scripts/bootstrap_phi.sh`** si un bootstrap d’environnement φ est requis par l’équipe.
- Créer **`docs/CIRCULAI-CANARY-ROADMAP.md`** ou renommer/alias vers `playbook-canary.md` pour homogénéiser la nomenclature « roadmap canary ».
- Exemple de rapport chiffré (formation) : [`docs/CIRCULAI-RAPPORT-SIMULE-EXEMPLE.md`](CIRCULAI-RAPPORT-SIMULE-EXEMPLE.md).
- PDF / dossiers : scripts `npm run docs:dossier-pdf`, `npm run docs:synthese-complete-pdf` si les livrables documentaires doivent être régénérés.

---

## 5. Pointeurs doc

- **Détail technique φ, design system, § livraison** : [`PHI-DESIGN-SYSTEM-AND-ROADMAP.md`](PHI-DESIGN-SYSTEM-AND-ROADMAP.md)
- **Polynômes cyclotomiques (φ(n) Euler vs φ doré)** : [`Polynome-cyclotomique.txt`](Polynome-cyclotomique.txt)
- **Canary (FR)** : [`playbook-canary.md`](playbook-canary.md)
- **Rapport simulé (exemple)** : [`CIRCULAI-RAPPORT-SIMULE-EXEMPLE.md`](CIRCULAI-RAPPORT-SIMULE-EXEMPLE.md)
- **CI déploiement canonique (3 assets statiques + Lambda S3 + Terraform + sync + invalidation)** : [`.github/workflows/deploy_and_terraform.yml`](../.github/workflows/deploy_and_terraform.yml)
- **CI déploiement complet (build, zip Lambda → S3, Terraform)** : [`.github/workflows/ci_deploy_full.yml`](../.github/workflows/ci_deploy_full.yml)
