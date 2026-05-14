#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$ROOT/dist"
cd "$ROOT/lambda"
zip -q -r "$ROOT/dist/lambda-ab.zip" ab-lambda.js package.json
echo "Wrote $ROOT/dist/lambda-ab.zip"
if [ "${1:-}" != "" ] && [ "${2:-}" != "" ]; then
  aws s3 cp "$ROOT/dist/lambda-ab.zip" "s3://${1%/}/${2#/}"
  echo "Uploaded s3://${1%/}/${2#/}"
fi
