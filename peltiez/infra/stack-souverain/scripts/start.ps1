# Démarre la stack souveraine (Docker requis)
$ErrorActionPreference = "Stop"
$stackDir = Split-Path $PSScriptRoot -Parent
Set-Location $stackDir

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Error "Docker Desktop n'est pas installé ou pas dans le PATH."
}

if (-not (Test-Path ".env")) {
  Write-Host "Création de .env depuis .env.example + secret…"
  & (Join-Path $PSScriptRoot "new-secret.ps1")
}

Write-Host "Démarrage Ollama + Open WebUI + Qdrant…"
docker compose up -d

Write-Host ""
Write-Host "Open WebUI : http://localhost:3000"
Write-Host "Ollama API : http://localhost:11434"
Write-Host "Qdrant     : http://localhost:6333/dashboard"
Write-Host ""
Write-Host "Après le premier démarrage :  .\scripts\pull-models.ps1"
Write-Host "Premier compte WebUI = administrateur."
