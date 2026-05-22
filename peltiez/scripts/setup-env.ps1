<#
.SYNOPSIS
  Prépare .env (Vite) et .env.server (API) après réinstall Windows — sans écraser les clés déjà présentes.

.EXAMPLE
  cd peltiez
  .\scripts\setup-env.ps1
#>
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

function Merge-EnvFromExample {
  param(
    [string]$TargetName,
    [string]$ExampleName
  )
  $target = Join-Path $Root $TargetName
  $example = Join-Path $Root $ExampleName
  if (-not (Test-Path $example)) {
    Write-Warning "Manquant : $ExampleName"
    return
  }
  if (-not (Test-Path $target)) {
    Copy-Item $example $target
    Write-Host "Créé $TargetName depuis $ExampleName"
    return
  }
  $existing = Get-Content $target -Raw
  $added = 0
  foreach ($line in Get-Content $example) {
    if ($line -match '^\s*#' -or $line -match '^\s*$') { continue }
    if ($line -notmatch '^([A-Za-z_][A-Za-z0-9_]*)=') { continue }
    $key = $Matches[1]
    if ($existing -match "(?m)^\s*$([regex]::Escape($key))=") { continue }
    Add-Content -Path $target -Value $line -Encoding utf8
    $added++
  }
  if ($added -gt 0) {
    Write-Host "Ajouté $added clé(s) manquante(s) dans $TargetName"
  } else {
    Write-Host "$TargetName déjà à jour (aucune clé manquante depuis l'exemple)"
  }
}

Merge-EnvFromExample -TargetName ".env" -ExampleName ".env.example"
Merge-EnvFromExample -TargetName ".env.server" -ExampleName ".env.server.example"

Write-Host ""
Write-Host "=== À compléter à la main (Stripe Dashboard) ===" -ForegroundColor Cyan
Write-Host "  peltiez\.env.server  →  STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET"
Write-Host "  peltiez\.env          →  VITE_STRIPE_PUBLISHABLE_KEY (pk_test_...)"
Write-Host ""
Write-Host "Lancer l'app : npm run dev:stack" -ForegroundColor Green
