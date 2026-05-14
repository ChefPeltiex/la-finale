#!/usr/bin/env bash
# Purification Vite/React — caches, dist, réinstall propre, relance du dev.
# Auteur : Doum Peltiez — The Master of the Multiverse
# Usage : depuis n’importe où → bash scripts/purify-vite.sh  (ou ./scripts/purify-vite.sh)
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "✨ Purification du projet en cours..."

# 1. Arrêter le serveur s'il tourne (Linux / macOS / Git Bash avec procps)
pkill -f "vite" 2>/dev/null || true

# 2. Suppression des caches et modules temporaires
rm -rf node_modules/.vite-temp
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist

# 3. Réinstallation propre
echo "🔄 Réinstallation des dépendances..."
npm ci

# 4. Relance du serveur
echo "🚀 Démarrage du serveur Vite..."
npm run dev

echo "🌈 Purification terminée. Le multivers est stable."
