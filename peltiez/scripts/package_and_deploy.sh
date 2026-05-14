#!/usr/bin/env bash
# Syntax check: bash -n scripts/package_and_deploy.sh
#
# Prérequis : AWS CLI (aws), Terraform (terraform), identifiants AWS avec droits S3 / Lambda / CloudFront / API Gateway selon le module.
#
# Variables d'environnement :
#   LAMBDA_S3_BUCKET  (requis sauf si passé en 1er argument)
#   LAMBDA_S3_KEY     (optionnel ; défaut : <branche-git>/lambda.zip, ou manual/lambda.zip hors git)
#   SKIP_TERRAFORM=1  (optionnel) — n'exécute que le packaging + upload S3
#   TF_VAR_PROJECT    (optionnel ; défaut : circulai) — préfixe Terraform `project`
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "Prérequis : AWS CLI (aws), Terraform (terraform), identifiants AWS valides pour le compte cible."
echo "Répertoire dépôt : $REPO_ROOT"

if [[ -n "${1:-}" ]]; then LAMBDA_S3_BUCKET="$1"; fi
if [[ -n "${2:-}" ]]; then LAMBDA_S3_KEY="$2"; fi

: "${LAMBDA_S3_BUCKET:?Définir LAMBDA_S3_BUCKET (variable d'environnement ou 1er argument)}"
DEFAULT_KEY="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo manual)/lambda.zip"
LAMBDA_S3_KEY="${LAMBDA_S3_KEY:-$DEFAULT_KEY}"

bash "$REPO_ROOT/scripts/package_lambda.sh" "$LAMBDA_S3_BUCKET" "$LAMBDA_S3_KEY"

export TF_VAR_project="${TF_VAR_PROJECT:-circulai}"
export TF_VAR_lambda_s3_bucket="$LAMBDA_S3_BUCKET"
export TF_VAR_lambda_s3_key="$LAMBDA_S3_KEY"

if [[ "${SKIP_TERRAFORM:-0}" == "1" ]]; then
  echo "SKIP_TERRAFORM=1 — arrêt après upload Lambda."
  exit 0
fi

cd "$REPO_ROOT/terraform"
terraform init -input=false
terraform apply -input=false -auto-approve
