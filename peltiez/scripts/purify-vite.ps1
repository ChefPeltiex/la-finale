# Purification Vite/React — Windows (PowerShell)
# Équivalent de scripts/purify-vite.sh : caches, dist, npm ci, npm run dev
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "Purification du projet en cours..."

# 1. Tenter de libérer le port 5173 (Vite par défaut)
try {
  Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
} catch {
  Write-Host "(Info) Impossible de sonder le port 5173 — arrêtez Vite à la main si besoin."
}

# 2. Caches & build
foreach ($p in @("node_modules\.vite-temp", "node_modules\.vite", ".vite", "dist")) {
  if (Test-Path $p) {
    Remove-Item $p -Recurse -Force
  }
}

Write-Host "Reinstallation des dependances (npm ci)..."
npm ci

Write-Host "Demarrage du serveur Vite..."
npm run dev

Write-Host "Purification terminee."
