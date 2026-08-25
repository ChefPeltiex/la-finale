# ============================================================
# Snapshot local prudent du projet
# Copie le projet dans backups sans supprimer.
# Exclut node_modules, .git, .next, dist, build.
# ============================================================

$ErrorActionPreference = "Stop"

$Project = "C:\Users\CHEFP\OneDrive\Desktop\la finale"
Set-Location $Project

$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupRoot = Join-Path $Project "backups"
$Dest = Join-Path $BackupRoot "snapshot-$Stamp"

if (!(Test-Path $BackupRoot)) {
  New-Item -ItemType Directory -Path $BackupRoot | Out-Null
}

$ExcludeDirs = @("node_modules", ".git", "backups", ".next", "dist", "build")

New-Item -ItemType Directory -Path $Dest | Out-Null

Get-ChildItem $Project -Force | Where-Object {
  $ExcludeDirs -notcontains $_.Name
} | ForEach-Object {
  $Target = Join-Path $Dest $_.Name
  if ($_.PSIsContainer) {
    robocopy $_.FullName $Target /E /R:1 /W:1 | Out-Null
  } else {
    Copy-Item $_.FullName $Target -Force
  }
}

Write-Host "Snapshot terminé : $Dest"
