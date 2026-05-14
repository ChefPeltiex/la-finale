#!/usr/bin/env bash
# Syntax check: bash -n scripts/generate_codex_pack.sh
#
# --- README (extrait) — arborescence pack « Codex Ultime Doré » -----------------
# Production root (corrigé depuis un typo type D:\D:\Codex) : disque D:, dossier Codex.
# Arborescence pack par défaut :
#   • Windows (chemins natifs)     : D:\Codex\Codex_Ultime_Dore
#   • Git Bash (MSYS)              : /d/Codex/Codex_Ultime_Dore
#   • WSL                          : /mnt/d/Codex/Codex_Ultime_Dore
#
# Variable d’environnement : CODEX_PACK_ROOT — répertoire racine du pack (défaut Git Bash ci-dessous).
# Ce script est un générateur minimal : il recopie docs/codex-souverain/ vers
#   $BASE/codex-souverain/
# Étendre ici (zip, PDF, manifest) si un pipeline complet est défini ailleurs.
# ---------------------------------------------------------------------------------
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Défaut adapté à Git Bash ; sur WSL ou autre shell, surcharger CODEX_PACK_ROOT.
BASE="${CODEX_PACK_ROOT:-/d/Codex/Codex_Ultime_Dore}"
SRC="$REPO_ROOT/docs/codex-souverain"
DEST="$BASE/codex-souverain"

if [[ ! -d "$SRC" ]]; then
  echo "Erreur : source introuvable : $SRC" >&2
  exit 1
fi

mkdir -p "$BASE"
rm -rf "$DEST"
cp -a "$SRC" "$DEST"

echo "Pack Codex (minimal) écrit sous : $DEST"
echo "Racine pack (CODEX_PACK_ROOT / défaut) : $BASE"

