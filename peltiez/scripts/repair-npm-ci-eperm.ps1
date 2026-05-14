# Repair npm ci EPERM on Windows (esbuild.exe verrouille)
# Usage (PowerShell, depuis la racine peltiez) : .\scripts\repair-npm-ci-eperm.ps1
#
# NE PAS inclure taskkill sur code.exe / Cursor.exe : tu fermerais ton IDE.

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "Arret des processus Node (Vite tourne en general sous node.exe)..."
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
# Si un binaire vite.exe existe seul (rare sous Windows)
Get-Process -Name "vite" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$esbuild = Join-Path $Root "node_modules\@esbuild\win32-x64\esbuild.exe"
if (Test-Path $esbuild) {
  Write-Host "Suppression de $esbuild ..."
  Remove-Item -LiteralPath $esbuild -Force -ErrorAction SilentlyContinue
}

Write-Host "npm ci..."
npm ci

Write-Host "Termine. Lance ensuite : npm run dev"
