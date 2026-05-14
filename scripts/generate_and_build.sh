#!/usr/bin/env bash
set -euo pipefail
# Lance la génération complète du pack puis build_pack.sh (inclus dans generate_codex_pack.sh).
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$HERE/generate_codex_pack.sh"
