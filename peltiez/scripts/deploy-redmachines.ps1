<#
.SYNOPSIS
  Build IGOR (peltiez) et déploie vers serveur Redmachines — front (dist) + rappel API Node.

.DESCRIPTION
  Adapte les variables $Remote* à ton serveur. Ce script ne remplace pas ta config nginx/PM2
  sur Redmachines : il build, vérifie, et envoie les fichiers (scp). Redémarre l’API si
  $RestartApi = $true et que ssh fonctionne.

.PARAMETER SkipVerify
  Passe npm run verify (déconseillé avant go-live).

.EXAMPLE
  cd peltiez
  .\scripts\deploy-redmachines.ps1

.EXAMPLE
  # Planifier jeudi 21 mai 2026, 8 h (Québec) — une fois le script validé à la main :
  $action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument '-NoProfile -ExecutionPolicy Bypass -File "C:\Users\CHEFP\OneDrive\Desktop\la finale\peltiez\scripts\deploy-redmachines.ps1"'
  $trigger = New-ScheduledTaskTrigger -Once -At "2026-05-21T08:00:00"
  Register-ScheduledTask -TaskName "IGOR-Deploy-Redmachines-20260521" -Action $action -Trigger $trigger
#>
param(
  [switch]$SkipVerify,
  [switch]$RestartApi,
  [string]$RemoteUser = "DEPLOY_USER",
  [string]$RemoteHost = "DEPLOY_HOST.redmachines.example",
  [string]$RemoteWebRoot = "/var/www/egor69",
  [string]$RemoteAppRoot = "/var/www/egor69-api",
  [string]$SshKeyPath = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

function Write-Step([string]$msg) {
  Write-Host ""
  Write-Host "==> $msg" -ForegroundColor Cyan
}

Write-Step "Racine peltiez : $Root"

if (-not $SkipVerify) {
  Write-Step "npm run verify"
  npm run verify
}

Write-Step "npm run build"
npm run build

$dist = Join-Path $Root "dist"
if (-not (Test-Path $dist)) {
  throw "dist/ introuvable après build."
}

if ($RemoteHost -match "DEPLOY_" -or $RemoteUser -match "DEPLOY_") {
  Write-Host ""
  Write-Host "CONFIG : édite deploy-redmachines.ps1 ou passe -RemoteHost / -RemoteUser." -ForegroundColor Yellow
  Write-Host "Build local OK — dist pret : $dist"
  Write-Host "Sur Redmachines : servir dist/ + API (node server/index.js, port 8787) + proxy /api"
  exit 0
}

$sshArgs = @()
if ($SshKeyPath) { $sshArgs += @("-i", $SshKeyPath) }
$target = "${RemoteUser}@${RemoteHost}"

Write-Step "Envoi dist/ -> ${target}:${RemoteWebRoot}/"
& scp @sshArgs -r "$dist\*" "${target}:${RemoteWebRoot}/"

Write-Step "Envoi package API (sans node_modules) — optionnel si tu deploies via git sur le serveur"
$apiStaging = Join-Path $env:TEMP "igor-api-staging"
if (Test-Path $apiStaging) { Remove-Item $apiStaging -Recurse -Force }
New-Item -ItemType Directory -Path $apiStaging | Out-Null
foreach ($item in @("server", "package.json", "package-lock.json")) {
  $src = Join-Path $Root $item
  if (Test-Path $src) {
    Copy-Item $src $apiStaging -Recurse -Force
  }
}
& scp @sshArgs -r "$apiStaging\*" "${target}:${RemoteAppRoot}/"

if ($RestartApi) {
  Write-Step "Redémarrage API (PM2 exemple — adapte la commande sur ton serveur)"
  $remoteCmd = "cd $RemoteAppRoot && npm ci --legacy-peer-deps --omit=dev && pm2 restart igor-api || pm2 start server/index.js --name igor-api"
  & ssh @sshArgs $target $remoteCmd
}

Write-Host ""
Write-Host "Deploy termine. Verifier :" -ForegroundColor Green
Write-Host "  https://egor69.ca/"
Write-Host "  https://egor69.ca/api/health"
Write-Host "  https://egor69.ca/docs/circulai-kit-regional"
Write-Host ""
Write-Host "Go symbolique code : 21 mai 2026, 8 h Quebec (deployLaunch.js)" -ForegroundColor DarkGray
