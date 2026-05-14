#!/usr/bin/env bash
# Racine du projet — délègue au script principal
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/scripts/purify-vite.sh" "$@"
