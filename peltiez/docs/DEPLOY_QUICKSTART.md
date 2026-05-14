# Déploiement rapide — CirculAI φ (peltiez)

## Branche et secrets

- Travailler sur `main` (ou la branche déclenchée dans `.github/workflows/deploy*.yml`).
- Renseigner les secrets listés dans `docs/GITHUB_SECRETS_TEMPLATE.md`.

## En local

```bash
npm ci
```

- **Site / API en dev** : lancer le serveur Node prévu par le projet (ex. `npm run dev` ou la commande documentée dans `package.json`) pour valider `public/circulai-phi/` et les appels API.

## Lambda (zip pour S3 / Terraform)

```bash
./package_lambda.sh
# équivalent : scripts/package_lambda.sh
```

Uploader le zip vers le bucket / clé attendus par `lambda_s3_bucket` / `lambda_s3_key` (variables Terraform).

## Terraform

```bash
cd terraform
terraform init
terraform plan -var="project=..." -var="lambda_s3_bucket=..." -var="lambda_s3_key=..."
terraform apply
```

Consulter les sorties : bucket frontend, domaine CloudFront, URL Lambda (`api_endpoint`).

## Canary

- Suivre `docs/playbook-canary.md` (paliers de trafic, surveillance, rollback via build précédent ou `ASSIGN_PROB_CONTROL`).

## Pipeline données / lift

- Chemin cible pour analyses : `python analysis/compute_lift.py` (à créer ou adapter selon votre jeu de données).
