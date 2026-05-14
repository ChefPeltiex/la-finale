<#
.SYNOPSIS
  Gardien du multivers React/Vite : versions exactes, rapport HTML, mode daemon optionnel.

.PARAMETER Daemon
  Surveille les fichiers clés (mtime) et rescanne ; optionnellement redémarre Vite si anomalie.

.PARAMETER AutoRestartDev
  Avec -Daemon : arrête node/vite puis relance `npm run dev` lorsqu’une anomalie critique est détectée.

.PARAMETER HtmlReportPath
  Chemin du rapport HTML (défaut : reports/guardian-scan.html).

.PARAMETER VitePort
  Port pour la sonde HTTP du dev server (défaut : 5173).

.PARAMETER ApiPort
  Port API pour /api/health (défaut : env PORT / IGOR_API_PORT / 8787).

.EXAMPLE
  .\scripts\guardian.ps1
  .\scripts\guardian.ps1 -Daemon -AutoRestartDev
#>
param(
  [switch]$Daemon,
  [switch]$AutoRestartDev,
  [string]$HtmlReportPath = "",
  [int]$PollSeconds = 2,
  [int]$SettleMs = 1800,
  [int]$VitePort = 5173,
  [int]$ApiPort = 0
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

if (-not $HtmlReportPath) {
  $HtmlReportPath = Join-Path $Root "reports\guardian-scan.html"
}
if ($ApiPort -le 0) {
  $tmp = 0
  if ($env:PORT -and [int]::TryParse($env:PORT, [ref]$tmp)) { $ApiPort = $tmp }
  elseif ($env:IGOR_API_PORT -and [int]::TryParse($env:IGOR_API_PORT, [ref]$tmp)) { $ApiPort = $tmp }
  else { $ApiPort = 8787 }
}

function Read-JsonFile([string]$path) {
  if (-not (Test-Path -LiteralPath $path)) { return $null }
  $raw = Get-Content -LiteralPath $path -Raw -Encoding UTF8
  return ($raw | ConvertFrom-Json)
}

function Get-HtmlEncoded([string]$text) {
  if ($null -eq $text) { return "" }
  return [System.Net.WebUtility]::HtmlEncode($text)
}

function Get-DeclaredDependencyVersion($pkgJson, [string]$name) {
  if (-not $pkgJson) { return $null }
  foreach ($section in @("dependencies", "devDependencies", "peerDependencies", "optionalDependencies")) {
    $sec = $pkgJson.$section
    if ($null -eq $sec) { continue }
    $prop = $sec.PSObject.Properties[$name]
    if ($null -ne $prop) { return [string]$prop.Value }
  }
  return $null
}

function Get-InstalledPackageMeta([string]$packageDirName) {
  $pj = Join-Path $Root ("node_modules\{0}\package.json" -f $packageDirName)
  if (-not (Test-Path -LiteralPath $pj)) {
    return @{ Ok = $false; Path = $pj; Version = $null; Name = $packageDirName }
  }
  try {
    $j = Read-JsonFile $pj
    return @{
      Ok      = $true
      Path    = $pj
      Version = [string]$j.version
      Name    = [string]$j.name
    }
  } catch {
    return @{ Ok = $false; Path = $pj; Version = $null; Name = $packageDirName; Error = $_.Exception.Message }
  }
}

function Find-ReactPackageJsonPaths {
  $uniq = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
  $nm = Join-Path $Root "node_modules"
  if (-not (Test-Path -LiteralPath $nm)) { return [string[]]@() }
  Get-ChildItem -LiteralPath $nm -Recurse -Depth 10 -Filter "package.json" -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -match '[\\/]node_modules[\\/]react[\\/]package\.json$' } |
    ForEach-Object { [void]$uniq.Add($_.FullName) }
  return @($uniq)
}

function Test-HttpOk([string]$url, [int]$timeoutSec = 3) {
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec $timeoutSec -ErrorAction Stop
    return @{ Ok = $true; Status = [int]$r.StatusCode }
  } catch {
    return @{ Ok = $false; Status = 0; Error = $_.Exception.Message }
  }
}

function Get-WatchPaths {
  $list = [System.Collections.Generic.List[string]]::new()
  foreach ($n in @("package.json", "package-lock.json")) {
    $p = Join-Path $Root $n
    if (Test-Path -LiteralPath $p) { [void]$list.Add($p) }
  }
  Get-ChildItem -LiteralPath $Root -Filter "vite.config.*" -File -ErrorAction SilentlyContinue |
    ForEach-Object { [void]$list.Add($_.FullName) }
  return $list
}

function Wait-WatchSettled([string[]]$paths, [int]$quietMs) {
  while ($true) {
    $snap = @{}
    foreach ($p in $paths) {
      if (Test-Path -LiteralPath $p) {
        $snap[$p] = (Get-Item -LiteralPath $p).LastWriteTimeUtc
      }
    }
    Start-Sleep -Milliseconds $quietMs
    $stable = $true
    foreach ($kv in $snap.GetEnumerator()) {
      if (-not (Test-Path -LiteralPath $kv.Key)) { $stable = $false; break }
      if ((Get-Item -LiteralPath $kv.Key).LastWriteTimeUtc -ne $kv.Value) { $stable = $false; break }
    }
    if ($stable) { break }
  }
}

function Stop-DevProcesses {
  Get-Process -Name "node", "vite" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
  Start-Sleep -Milliseconds 700
}

function Start-DevServerDetached {
  $cmd = Get-Command npm -ErrorAction SilentlyContinue
  if (-not $cmd) { throw "npm introuvable dans le PATH." }
  Start-Process -FilePath $cmd.Source -ArgumentList @("run", "dev") -WorkingDirectory $Root -WindowStyle Normal | Out-Null
}

function Invoke-GuardianScan {
  $pkgPath = Join-Path $Root "package.json"
  $rootPkg = Read-JsonFile $pkgPath

  $reactDeclared = Get-DeclaredDependencyVersion $rootPkg "react"
  $reactDomDeclared = Get-DeclaredDependencyVersion $rootPkg "react-dom"
  $viteDeclared = Get-DeclaredDependencyVersion $rootPkg "vite"

  $reactPaths = @(Find-ReactPackageJsonPaths)
  $reactInstalls = @()
  foreach ($rp in $reactPaths) {
    $j = Read-JsonFile $rp
    if ($j) {
      $reactInstalls += [pscustomobject]@{
        Path    = $rp.Substring($Root.Length + 1)
        Name    = [string]$j.name
        Version = [string]$j.version
      }
    }
  }

  $reactMeta = Get-InstalledPackageMeta "react"
  $reactDomMeta = Get-InstalledPackageMeta "react-dom"
  $viteMeta = Get-InstalledPackageMeta "vite"

  $viteBin = (Test-Path (Join-Path $Root "node_modules\.bin\vite.cmd")) -or (Test-Path (Join-Path $Root "node_modules\.bin\vite"))

  $apiUrl = "http://127.0.0.1:{0}/api/health" -f $ApiPort
  $viteUrl = "http://127.0.0.1:{0}/" -f $VitePort
  $apiPing = Test-HttpOk $apiUrl
  $vitePing = Test-HttpOk $viteUrl

  $issues = [System.Collections.Generic.List[string]]::new()
  $warnings = [System.Collections.Generic.List[string]]::new()

  if (-not $reactMeta.Ok) { [void]$issues.Add("react absent de node_modules (lance npm ci / npm install).") }
  if (-not $viteMeta.Ok) { [void]$issues.Add("vite absent de node_modules.") }
  if (-not $viteBin) { [void]$warnings.Add("CLI .bin/vite introuvable (souvent corrigé après npm ci).") }
  if ($reactPaths.Count -gt 1) {
    [void]$warnings.Add("Plusieurs arborescences react/ détectées ($($reactPaths.Count)) — risque de double React.")
  }
  if (-not $apiPing.Ok) {
    [void]$warnings.Add("API injoignable ($apiUrl) — ECONNREFUSED / timeout si l’API n’est pas démarrée.")
  }

  $critical = ($issues.Count -gt 0)

  return [pscustomobject]@{
    TimestampUtc     = [DateTime]::UtcNow.ToString("o")
    Root             = $Root
    ReactDeclared    = $reactDeclared
    ReactDomDeclared = $reactDomDeclared
    ViteDeclared     = $viteDeclared
    ReactInstalled   = $reactMeta
    ReactDomInstalled = $reactDomMeta
    ViteInstalled    = $viteMeta
    ViteCliPresent   = $viteBin
    ReactTreeCount   = $reactPaths.Count
    ReactInstalls    = $reactInstalls
    ApiUrl           = $apiUrl
    ApiOk            = $apiPing.Ok
    ApiStatus        = $apiPing.Status
    ViteUrl          = $viteUrl
    ViteOk           = $vitePing.Ok
    ViteStatus       = $vitePing.Status
    Issues           = $issues
    Warnings         = $warnings
    Critical         = $critical
  }
}

function Export-GuardianHtmlReport {
  param(
    [Parameter(Mandatory)][object]$Scan,
    [Parameter(Mandatory)][string]$OutPath
  )

  $rowsReact = ""
  foreach ($x in $Scan.ReactInstalls) {
    $rowsReact += "<tr><td>{0}</td><td>{1}</td><td><code>{2}</code></td></tr>" -f `
      (Get-HtmlEncoded $x.Path), (Get-HtmlEncoded $x.Name), (Get-HtmlEncoded $x.Version)
  }
  if (-not $rowsReact) { $rowsReact = "<tr><td colspan=`"3`">Aucune installation react détectée.</td></tr>" }

  $issueList = ""
  foreach ($i in $Scan.Issues) { $issueList += "<li class=`"err`">{0}</li>" -f (Get-HtmlEncoded $i) }
  foreach ($w in $Scan.Warnings) { $issueList += "<li class=`"warn`">{0}</li>" -f (Get-HtmlEncoded $w) }
  if (-not $issueList) { $issueList = "<li class=`"ok`">Aucun problème signalé par les heuristiques du gardien.</li>" }

  $statusClass = if ($Scan.Critical) { "bad" } elseif ($Scan.Warnings.Count) { "warn" } else { "good" }
  $summary = if ($Scan.Critical) { "État critique — corriger avant dev." } elseif ($Scan.Warnings.Count) { "Avertissements — vérifier la stack." } else { "Stack cohérente (selon ce scan)." }

  $html = @"
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gardien du Multivers — rapport</title>
  <style>
    :root { font-family: system-ui, Segoe UI, sans-serif; }
    body { margin: 24px; background: #0f1115; color: #e8eaed; }
    h1 { font-size: 1.25rem; }
    table { border-collapse: collapse; width: 100%; max-width: 960px; margin: 16px 0; }
    th, td { border: 1px solid #333; padding: 8px 10px; text-align: left; vertical-align: top; }
    th { background: #1a1d24; }
    code { background: #1a1d24; padding: 2px 6px; border-radius: 4px; }
    .pill { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 0.85rem; }
    .good { background: #14532d; color: #bbf7d0; }
    .warn { background: #713f12; color: #fde68a; }
    .bad { background: #7f1d1d; color: #fecaca; }
    ul { max-width: 960px; }
    li.err { color: #fecaca; }
    li.warn { color: #fde68a; }
    li.ok { color: #bbf7d0; }
    .muted { color: #9aa0a6; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>Gardien du Multivers React / Vite</h1>
  <p class="muted">UTC $(Get-HtmlEncoded $Scan.TimestampUtc) — racine <code>$(Get-HtmlEncoded $Scan.Root)</code></p>
  <p><span class="pill $statusClass">$(Get-HtmlEncoded $summary)</span></p>

  <h2>Versions déclarées (<code>package.json</code>)</h2>
  <table>
    <tr><th>Paquet</th><th>Plage / version déclarée</th></tr>
    <tr><td>react</td><td><code>$(Get-HtmlEncoded $Scan.ReactDeclared)</code></td></tr>
    <tr><td>react-dom</td><td><code>$(Get-HtmlEncoded $Scan.ReactDomDeclared)</code></td></tr>
    <tr><td>vite</td><td><code>$(Get-HtmlEncoded $Scan.ViteDeclared)</code></td></tr>
  </table>

  <h2>Versions installées (<code>node_modules</code>)</h2>
  <table>
    <tr><th>Paquet</th><th>Chemin package.json</th><th>Version exacte</th></tr>
    <tr><td>react</td><td><code>$(Get-HtmlEncoded $Scan.ReactInstalled.Path)</code></td><td><code>$(Get-HtmlEncoded $Scan.ReactInstalled.Version)</code></td></tr>
    <tr><td>react-dom</td><td><code>$(Get-HtmlEncoded $Scan.ReactDomInstalled.Path)</code></td><td><code>$(Get-HtmlEncoded $Scan.ReactDomInstalled.Version)</code></td></tr>
    <tr><td>vite</td><td><code>$(Get-HtmlEncoded $Scan.ViteInstalled.Path)</code></td><td><code>$(Get-HtmlEncoded $Scan.ViteInstalled.Version)</code></td></tr>
  </table>

  <h2>Arborescences <code>react</code> (chemins physiques)</h2>
  <table>
    <tr><th>Relatif</th><th>name</th><th>version</th></tr>
    $rowsReact
  </table>

  <h2>Sondes réseau</h2>
  <table>
    <tr><th>Cible</th><th>URL</th><th>OK</th><th>HTTP</th></tr>
    <tr><td>API</td><td><code>$(Get-HtmlEncoded $Scan.ApiUrl)</code></td><td>$(Get-HtmlEncoded ([string]$Scan.ApiOk))</td><td>$(Get-HtmlEncoded ([string]$Scan.ApiStatus))</td></tr>
    <tr><td>Vite dev</td><td><code>$(Get-HtmlEncoded $Scan.ViteUrl)</code></td><td>$(Get-HtmlEncoded ([string]$Scan.ViteOk))</td><td>$(Get-HtmlEncoded ([string]$Scan.ViteStatus))</td></tr>
  </table>

  <h2>CLI &amp; anomalies</h2>
  <p>vite dans <code>.bin</code> : <strong>$(Get-HtmlEncoded ([string]$Scan.ViteCliPresent))</strong></p>
  <ul>$issueList</ul>
</body>
</html>
"@

  $dir = Split-Path -Parent $OutPath
  if (-not (Test-Path -LiteralPath $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
  }
  $html | Set-Content -LiteralPath $OutPath -Encoding utf8
}

function Write-ScanConsole([object]$scan) {
  Write-Host "`n=== Gardien du Multivers (PowerShell) ===" -ForegroundColor Cyan
  Write-Host ("Racine : {0}" -f $scan.Root)
  Write-Host "`nDéclaré (package.json) :" -ForegroundColor Yellow
  Write-Host ("  react      -> {0}" -f $scan.ReactDeclared)
  Write-Host ("  react-dom  -> {0}" -f $scan.ReactDomDeclared)
  Write-Host ("  vite       -> {0}" -f $scan.ViteDeclared)
  Write-Host "`nInstallé (exact) :" -ForegroundColor Yellow
  Write-Host ("  react      -> {0}" -f $scan.ReactInstalled.Version)
  Write-Host ("  react-dom  -> {0}" -f $scan.ReactDomInstalled.Version)
  Write-Host ("  vite       -> {0}" -f $scan.ViteInstalled.Version)
  Write-Host ("  .bin/vite  -> {0}" -f $scan.ViteCliPresent)
  Write-Host ("`nArborescences react : {0}" -f $scan.ReactTreeCount)
  foreach ($x in $scan.ReactInstalls) {
    Write-Host ("  - {0}  ({1})" -f $x.Path, $x.Version)
  }
  Write-Host "`nSondes :" -ForegroundColor Yellow
  Write-Host ("  API  {0} -> OK={1} HTTP={2}" -f $scan.ApiUrl, $scan.ApiOk, $scan.ApiStatus)
  Write-Host ("  Vite {0} -> OK={1} HTTP={2}" -f $scan.ViteUrl, $scan.ViteOk, $scan.ViteStatus)
  foreach ($i in $scan.Issues) { Write-Host ("  [CRIT] {0}" -f $i) -ForegroundColor Red }
  foreach ($w in $scan.Warnings) { Write-Host ("  [WARN] {0}" -f $w) -ForegroundColor DarkYellow }
  Write-Host "`nRapport HTML : $HtmlReportPath" -ForegroundColor Green
}

# --- Exécution ---
$watchPaths = @(Get-WatchPaths)
$mtimeMap = @{}
foreach ($p in $watchPaths) {
  if (Test-Path -LiteralPath $p) { $mtimeMap[$p] = (Get-Item -LiteralPath $p).LastWriteTimeUtc }
}

function Test-WatchChanged {
  $changed = $false
  foreach ($p in $watchPaths) {
    if (-not (Test-Path -LiteralPath $p)) { continue }
    $t = (Get-Item -LiteralPath $p).LastWriteTimeUtc
    if (-not $mtimeMap.ContainsKey($p)) { $mtimeMap[$p] = $t; $changed = $true; continue }
    if ($t -ne $mtimeMap[$p]) { $mtimeMap[$p] = $t; $changed = $true }
  }
  return $changed
}

$scan = Invoke-GuardianScan
Export-GuardianHtmlReport -Scan $scan -OutPath $HtmlReportPath
Write-ScanConsole $scan

if (-not $Daemon) {
  if ($scan.Critical) { exit 1 }
  exit 0
}

Write-Host "`n[Daemon] Surveillance active (Ctrl+C pour arrêter). Période : ${PollSeconds}s ; stabilisation : ${SettleMs}ms." -ForegroundColor Magenta
if ($AutoRestartDev) {
  Write-Host "[Daemon] -AutoRestartDev : redémarrage npm sur anomalies critiques ou Vite injoignable avec avertissements." -ForegroundColor Magenta
}

while ($true) {
  Start-Sleep -Seconds $PollSeconds
  if (-not (Test-WatchChanged)) { continue }

  Wait-WatchSettled -paths $watchPaths -quietMs $SettleMs

  $scan = Invoke-GuardianScan
  Export-GuardianHtmlReport -Scan $scan -OutPath $HtmlReportPath
  Write-ScanConsole $scan

  $shouldRestart = $false
  if ($AutoRestartDev -and $scan.Critical) { $shouldRestart = $true }
  if ($AutoRestartDev -and -not $scan.ViteOk -and ($scan.Warnings.Count -gt 0 -or $scan.Critical)) { $shouldRestart = $true }

  if ($shouldRestart) {
    Write-Host "[Daemon] Redémarrage du serveur de dev…" -ForegroundColor Yellow
    Stop-DevProcesses
    try {
      Start-DevServerDetached
      Write-Host "[Daemon] npm run dev relancé dans une nouvelle fenêtre console." -ForegroundColor Green
    } catch {
      Write-Host ("[Daemon] Échec relance : {0}" -f $_.Exception.Message) -ForegroundColor Red
    }
  }
}
