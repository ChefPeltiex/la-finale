<#
.SYNOPSIS
  Windows: purge caches Vite, npm ci avec retry EPERM, verifie React/Vite, sonde API, rapport Markdown.

.PARAMETER NoDev
  Ne lance pas npm run dev a la fin.

.PARAMETER SkipCi
  Ne lance pas npm ci (verifications sur node_modules existant).

.PARAMETER ReportPath
  Chemin du rapport Markdown (defaut: reports/dev-universal-last-run.md).

.EXAMPLE
  cd peltiez
  .\scripts\dev-universal.ps1
#>
param(
  [switch]$NoDev,
  [switch]$SkipCi,
  [string]$ReportPath = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
if (-not $ReportPath) {
  $ReportPath = Join-Path $Root "reports\dev-universal-last-run.md"
}
Set-Location $Root

$report = [System.Collections.Generic.List[string]]::new()
function Add-R([string]$line) { [void]$report.Add($line) }

Add-R '# Rapport `dev-universal.ps1`'
Add-R ""
Add-R "- **Horodatage (UTC)** : $([DateTime]::UtcNow.ToString('o'))"
Add-R ('- **Racine** : `' + $Root + '`')
Add-R ""

function Get-ApiPort {
  $t = 0
  if ($env:PORT -and [int]::TryParse($env:PORT, [ref]$t)) { return $t }
  if ($env:IGOR_API_PORT -and [int]::TryParse($env:IGOR_API_PORT, [ref]$t)) { return $t }
  return 8787
}

function Stop-NodeFamily {
  Add-R "## Arret des processus Node / Vite"
  $nodes = Get-Process -Name "node" -ErrorAction SilentlyContinue
  if ($nodes) {
    $nodes | Stop-Process -Force -ErrorAction SilentlyContinue
    Add-R "- Processus **node** arretes : $($nodes.Count)."
  } else {
    Add-R "- Aucun processus **node** actif."
  }
  $vite = Get-Process -Name "vite" -ErrorAction SilentlyContinue
  if ($vite) {
    $vite | Stop-Process -Force -ErrorAction SilentlyContinue
    Add-R "- Processus **vite** arretes."
  }
  Start-Sleep -Milliseconds 800
}

function Clear-ViteCaches {
  Add-R "## Purge des caches Vite / build"
  $purge = Join-Path $Root "scripts\purge-vite-caches.mjs"
  if (Test-Path $purge) {
    & node $purge 2>&1 | ForEach-Object { Add-R ("    " + $_) }
    Add-R "- Script **purge-vite-caches.mjs** execute."
  } else {
    foreach ($rel in @(".vite", "dist", "node_modules\.vite", "node_modules\.vite-temp")) {
      $p = Join-Path $Root $rel
      if (Test-Path $p) {
        Remove-Item $p -Recurse -Force -ErrorAction SilentlyContinue
        Add-R ('- Supprime : `' + $rel + '`')
      }
    }
  }
}

function Unlock-EsbuildBinaries {
  Add-R "## Deverrouillage binaires @esbuild (mitigation EPERM)"
  $esbuildRoot = Join-Path $Root "node_modules\@esbuild"
  if (-not (Test-Path $esbuildRoot)) {
    Add-R '- Dossier `@esbuild` absent (normal avant `npm ci`).'
    return
  }
  Get-ChildItem -Path $esbuildRoot -Recurse -Filter "esbuild.exe" -ErrorAction SilentlyContinue | ForEach-Object {
    try {
      Remove-Item $_.FullName -Force -ErrorAction Stop
      $rel = $_.FullName.Substring($Root.Length + 1)
      Add-R ('- Supprime : `' + $rel + '`')
    } catch {
      Add-R ('- Impossible de supprimer `' + $_.Name + '` : ' + $_.Exception.Message)
    }
  }
}

function Test-ToolchainPresent {
  param([bool]$strict)
  Add-R "## Verification React + Vite"
  $reactPkg = Join-Path $Root "node_modules\react\package.json"
  $vitePkg = Join-Path $Root "node_modules\vite\package.json"
  $viteCmd = Join-Path $Root "node_modules\.bin\vite.cmd"
  $viteBin = Join-Path $Root "node_modules\.bin\vite"
  $ok = $true
  if (Test-Path $reactPkg) {
    Add-R '- **react** : OK (`node_modules/react/package.json`).'
  } else {
    Add-R "- **react** : **MANQUANT**."
    $ok = $false
  }
  if (Test-Path $vitePkg) {
    Add-R '- **vite** (paquet) : OK (`node_modules/vite/package.json`).'
  } else {
    Add-R "- **vite** (paquet) : **MANQUANT**."
    $ok = $false
  }
  if ((Test-Path $viteCmd) -or (Test-Path $viteBin)) {
    Add-R '- **CLI vite** : OK (`.bin/vite`).'
  } else {
    Add-R '- **CLI vite** : **MANQUANT** (attendu apres `npm ci`).'
    $ok = $false
  }
  if ($strict -and -not $ok) {
    throw "Toolchain incomplete : execute `npm ci` ou `npm install` depuis la racine du projet."
  }
  return $ok
}

function Invoke-NpmCiWithRetry {
  Add-R '## `npm ci`'
  $lock = Join-Path $Root "package-lock.json"
  if (-not (Test-Path $lock)) {
    Add-R '- **Erreur** : `package-lock.json` introuvable - `npm ci` impossible. Utilise `npm install` ou regenere le lockfile.'
    throw "package-lock.json manquant"
  }
  $out = & npm ci 2>&1
  $code = $LASTEXITCODE
  $out | ForEach-Object { Add-R ("    " + $_) }
  if ($code -eq 0) {
    Add-R "- **npm ci** : succes."
    return
  }
  $joined = $out -join [Environment]::NewLine
  if ($joined -match "EPERM|ENOENT|unlink") {
    Add-R "- **npm ci** a echoue (souvent **EPERM** sur un binaire natif). Nouvelle tentative apres deverrouillage..."
    Stop-NodeFamily | Out-Null
    Unlock-EsbuildBinaries
    Start-Sleep -Milliseconds 500
    $out2 = & npm ci 2>&1
    $code2 = $LASTEXITCODE
    $out2 | ForEach-Object { Add-R ("    " + $_) }
    if ($code2 -ne 0) {
      throw "npm ci a echoue apres retry. Voir docs/DEV-EPERM-ECONNREFUSED.md si present."
    }
    Add-R "- **npm ci** : succes apres retry."
  } else {
    throw "npm ci a echoue (code $code)."
  }
}

function Test-ApiHealth {
  Add-R "## Sonde API (ECONNREFUSED / disponibilite)"
  $port = Get-ApiPort
  $uri = "http://127.0.0.1:$port/api/health"
  Add-R ('- URL testee : `' + $uri + '`')
  try {
    $res = Invoke-WebRequest -Uri $uri -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
    Add-R "- **Resultat** : HTTP $($res.StatusCode) - backend joignable."
  } catch {
    Add-R "- **Resultat** : **injoignable** ($($_.Exception.Message))."
    Add-R "- **Interpretation** : rien n'ecoute sur le port **$port**, ou pare-feu. Ce n'est **pas** une erreur Vite : lance ``npm run dev:api`` ou ``npm run dev:stack``."
  }
}

try {
  Stop-NodeFamily
  Clear-ViteCaches

  if (-not $SkipCi) {
    Invoke-NpmCiWithRetry
  } else {
    Add-R '## `npm ci`'
    Add-R "- **SkipCi** : installation non modifiee."
  }

  Test-ToolchainPresent -strict $true | Out-Null
  Test-ApiHealth

  Add-R ""
  Add-R "## Prochaines commandes"
  Add-R "- Front seul : ``npm run dev``"
  Add-R "- API seule : ``npm run dev:api``"
  Add-R "- Front + API : ``npm run dev:stack``"
  Add-R "- Garde-fou hooks / React : ``node guardian.js``"

  $repDir = Split-Path -Parent $ReportPath
  if (-not (Test-Path $repDir)) {
    New-Item -ItemType Directory -Force -Path $repDir | Out-Null
  }
  $report -join [Environment]::NewLine | Set-Content -LiteralPath $ReportPath -Encoding utf8
  Write-Host ('Rapport ecrit : ' + $ReportPath) -ForegroundColor Cyan

  if (-not $NoDev) {
    Write-Host "Demarrage Vite (Ctrl+C pour arreter)..." -ForegroundColor Green
    npm run dev
  } else {
    Write-Host "NoDev : Vite non demarre. Lance manuellement : npm run dev" -ForegroundColor Yellow
  }
} catch {
  Add-R ""
  Add-R "## ERREUR"
  Add-R '```text'
  Add-R $_.Exception.Message
  Add-R '```'
  $repDir = Split-Path -Parent $ReportPath
  if (-not (Test-Path $repDir)) { New-Item -ItemType Directory -Force -Path $repDir | Out-Null }
  $report -join [Environment]::NewLine | Set-Content -LiteralPath $ReportPath -Encoding utf8
  Write-Host ('Echec - voir ' + $ReportPath) -ForegroundColor Red
  exit 1
}
