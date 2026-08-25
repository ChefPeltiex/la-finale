# ============================================================
# Audit local du projet CirculAI / La Finale
# Lecture seulement. Ne modifie rien.
# ============================================================

$ErrorActionPreference = "Continue"

$Project = "C:\Users\CHEFP\OneDrive\Desktop\la finale"
Set-Location $Project

$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$LogDir = Join-Path $Project "logs"

if (!(Test-Path $LogDir)) {
  New-Item -ItemType Directory -Path $LogDir | Out-Null
}

$Report = Join-Path $LogDir "audit-projet-$Stamp.txt"

"=== AUDIT PROJET CIRCULAI / LA FINALE ===" | Out-File $Report -Encoding UTF8
"Date : $(Get-Date)" | Out-File $Report -Append -Encoding UTF8
"Projet : $Project" | Out-File $Report -Append -Encoding UTF8
"Machine : $env:COMPUTERNAME" | Out-File $Report -Append -Encoding UTF8

"`n=== GIT STATUS ===" | Out-File $Report -Append -Encoding UTF8
git status 2>&1 | Out-File $Report -Append -Encoding UTF8

"`n=== FICHIERS RACINE ===" | Out-File $Report -Append -Encoding UTF8
Get-ChildItem $Project -Force | Select-Object Mode, Length, Name | Format-Table | Out-String | Out-File $Report -Append -Encoding UTF8

"`n=== DOSSIERS PRINCIPAUX ===" | Out-File $Report -Append -Encoding UTF8
Get-ChildItem $Project -Directory -Force | Select-Object Name | Format-Table | Out-String | Out-File $Report -Append -Encoding UTF8

"`n=== PACKAGE.JSON ===" | Out-File $Report -Append -Encoding UTF8
if (Test-Path ".\package.json") {
  Get-Content ".\package.json" | Out-File $Report -Append -Encoding UTF8
} else {
  "Aucun package.json détecté." | Out-File $Report -Append -Encoding UTF8
}

"`n=== FICHIERS SENSIBLES À NE PAS TOUCHER ===" | Out-File $Report -Append -Encoding UTF8
Get-ChildItem $Project -Recurse -Force -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match "\.env|secret|token|key|credential|password" } |
  Select-Object FullName |
  Format-Table | Out-String | Out-File $Report -Append -Encoding UTF8

"`n=== FICHIERS MARKDOWN ===" | Out-File $Report -Append -Encoding UTF8
Get-ChildItem $Project -Recurse -File -Filter "*.md" -ErrorAction SilentlyContinue |
  Select-Object FullName |
  Format-Table | Out-String | Out-File $Report -Append -Encoding UTF8

"`n=== RAPPORT MACHINE ===" | Out-File $Report -Append -Encoding UTF8
Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer, Model, TotalPhysicalMemory | Format-List | Out-File $Report -Append -Encoding UTF8
Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed | Format-List | Out-File $Report -Append -Encoding UTF8
Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion | Format-List | Out-File $Report -Append -Encoding UTF8

Write-Host "Audit terminé : $Report"
notepad $Report
