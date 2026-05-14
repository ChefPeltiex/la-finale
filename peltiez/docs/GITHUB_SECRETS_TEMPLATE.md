# GitHub Actions — secrets and variables (template)

Configure these in the repository **Settings → Secrets and variables → Actions**.

## Secrets (repository)

- `AWS_ACCESS_KEY_ID` — IAM user or role key for AWS deploys.
- `AWS_SECRET_ACCESS_KEY` — matching secret key.
- `CIRCULAI_PHI_S3_BUCKET` — target S3 bucket for syncing the CirculAI φ static bundle (see `.github/workflows/deploy-circulai-phi.yml`).

## Variables (repository, optional)

- `AWS_REGION` — defaults to `eu-west-3` in `.github/workflows/deploy.yml` when unset (`${{ vars.AWS_REGION || 'eu-west-3' }}`).

## Terraform / future `deploy_and_terraform.yml`

If you add a workflow such as `.github/workflows/deploy_and_terraform.yml` (or extend the existing phi workflows) to run Terraform from `terraform/`, also supply:

- `TF_VAR_project` (or a single `TF_VARS` / env file pattern your workflow expects).
- `TF_VAR_lambda_s3_bucket` / `TF_VAR_lambda_s3_key` after uploading the zip produced by `./package_lambda.sh` (wrapper) or `scripts/package_lambda.sh`.
- `TF_VAR_event_collector_url` / `TF_VAR_assign_prob_control` as needed.
- `TF_VAR_certificate_arn` when you attach a custom ACM certificate to CloudFront (requires matching `aliases` in Terraform).

**Optional:** `CLOUDFRONT_DISTRIBUTION_ID` as a secret or variable if a workflow invalidates CloudFront after static uploads (not required by the current `deploy.yml` / `deploy-circulai-phi.yml` jobs).

## Workflow references

- `.github/workflows/deploy.yml` — Serverless deploy on `main`/`master` (paths under `public/circulai-phi/`, `lambda/`, `serverless.yml`).
- `.github/workflows/deploy-circulai-phi.yml` — artifact build, Serverless prod deploy, and `aws s3 sync` for static files.
