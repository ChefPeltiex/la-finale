#!/usr/bin/env bash
# Egor — validation config réseau + rappels Linux / Docker (opérateur).
# Le fichier egor-network.json décrit des paramètres type libp2p ; ils ne s'appliquent
# qu'après branchement dans votre nœud (Kubo, go-libp2p, etc.), pas automatiquement à cette SPA.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CFG="${ROOT}/egor-network.json"

if [[ ! -f "${CFG}" ]]; then
  echo "Fichier manquant: ${CFG}" >&2
  exit 1
fi

if command -v jq >/dev/null 2>&1; then
  jq empty "${CFG}"
  echo "OK: JSON valide (${CFG})"
else
  echo "Avertissement: installez 'jq' pour valider le JSON. Fichier présent: ${CFG}"
fi

echo ""
echo "Rappels opérateur (high_watermark 1000 connexions) :"
echo "  - ulimit fichiers ouverts : ulimit -n  (visez >= 65535 si le nœud accepte beaucoup de pairs)"
echo "  - Pare-feu / security groups : ouvrir TCP 4001 et UDP 4001 (QUIC) uniquement si vous exposez un nœud public"
echo ""
echo "Exemple Docker (à adapter à votre image de nœud) :"
echo "  docker run --rm -p 4001:4001/tcp -p 4001:4001/udp \\"
echo "    -v \"${CFG}:/config/egor-network.json:ro\" <image> ..."
echo ""
echo "Limites de débit (bytes/s) : voir clés bandwidth.* dans ${CFG}."
