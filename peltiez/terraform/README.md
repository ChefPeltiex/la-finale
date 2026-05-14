# Terraform — S3 (private) + CloudFront + Lambda + HTTP API

AWS provider **~> 5.x**. This stack creates:

- Un bucket S3 **privé** pour le frontend (**versioning**, **SSE-S3 AES256**, blocage d’accès public, **ObjectOwnership** `BucketOwnerEnforced`, politique **CloudFront OAC** uniquement) et **journalisation d’accès S3** vers un **second bucket** dédié (chiffré, non public). **CloudFront** : politique de cache managée **CachingOptimized** via `cache_policy_id` (pas de `forwarded_values` déprécié).
- **Lambda** chargée depuis un zip dans S3 (`lambda_s3_bucket` / `lambda_s3_key`) avec `source_code_hash` basé sur l’ETag de l’objet.
- **API Gateway HTTP API** avec route **`$default`** vers la Lambda (`AWS_PROXY`, format 2.0 ; pas de `integration_method`). `aws_lambda_permission` utilise `execution_arn/*/*`.

## Prerequisites

- Terraform ≥ 1.5, AWS credentials.
- Lambda zip **already present** in S3 before `apply` (used for `source_code_hash` / etag).
- Custom **TLS on CloudFront**: ACM certificate in **us-east-1** only; set `domain` + `certificate_arn` together.

## Quick start

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — set project, lambda_s3_bucket, lambda_s3_key, etc.
terraform init
terraform plan
terraform apply
```

Do not commit secrets in `terraform.tfvars`.

## Required / optional variables

| Variable | Required | Notes |
|----------|----------|--------|
| `project` | yes | Name prefix. |
| `lambda_s3_bucket` | yes | Artifacts bucket for the zip. |
| `lambda_s3_key` | yes | Object key for the zip. |
| `aws_region` | no | Default `eu-west-3`. |
| `domain` | no | Custom hostname; pair with `certificate_arn`. |
| `certificate_arn` | no | ACM in **us-east-1**; empty → default CloudFront cert. |
| `event_collector_url` | no | → `EVENT_COLLECTOR_URL` on Lambda. |
| `assign_prob_control` | no | Chaîne décimale, ex. `"0.5"` → `ASSIGN_PROB_CONTROL` sur la Lambda (défaut `0.5`). |

## Package the Lambda zip

From repo root (`peltiez/`):

```bash
bash scripts/package_lambda.sh
```

Upload `dist/lambda-ab.zip` to your artifacts bucket at the key configured in `lambda_s3_key`, or pass bucket and key to upload in one step:

```bash
bash scripts/package_lambda.sh "$LAMBDA_S3_BUCKET" "${BRANCH_NAME}/lambda.zip"
```

## Publish static files

After apply, sync assets to the bucket from the `frontend_bucket` output, for example:

```bash
aws s3 sync public/circulai-phi/ "s3://$(terraform output -raw frontend_bucket)/" --delete
```

### Post-apply (CI / manuel)

1. **Synchronisation** : aligner le secret GitHub `STAGING_S3_BUCKET` (ou équivalent) sur la valeur de `frontend_bucket` après le premier `apply`, puis lancer le workflow `deploy_and_terraform.yml` / `ci_deploy_full.yml` ou `aws s3 sync` comme ci-dessus.
2. **Invalidation CloudFront** : `aws cloudfront create-invalidation --distribution-id "$(terraform output -raw cloudfront_distribution_id)" --paths "/*"` (ou via le secret `CLOUDFRONT_ID` en CI).
3. **Lambda** : vérifier que l’objet S3 `lambda_s3_key` existe **avant** chaque `apply` (Terraform lit l’ETag).
4. **Logs S3** : consulter la sortie `site_access_logs_bucket` pour les journaux d’accès du bucket frontend (préfixe `s3-access/`).

### Travail futur (hors périmètre actuel)

- **AWS WAF** sur la distribution CloudFront (règles OWASP, rate limiting, géo) : à planifier après stabilisation DNS/TLS ; non créé par ce module pour limiter coût et complexité.

## Cache policy

`default_cache_behavior` sets `cache_policy_id` from the data source `Managed-CachingOptimized` (même politique que l’ID global documenté `658327ea-f89d-4fab-a63d-7e88639e58f6`).
