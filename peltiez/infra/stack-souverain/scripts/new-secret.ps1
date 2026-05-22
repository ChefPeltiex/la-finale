# Génère WEBUI_SECRET_KEY et écrit/met à jour .env
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")

$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = [BitConverter]::ToString($bytes).Replace("-", "").ToLowerInvariant()

$envPath = Join-Path $PWD ".env"
$example = Join-Path $PWD ".env.example"

if (-not (Test-Path $envPath)) {
  if (Test-Path $example) {
    Copy-Item $example $envPath
  } else {
    Set-Content $envPath "WEBUI_SECRET_KEY=$secret`n"
    Write-Host "Créé .env avec WEBUI_SECRET_KEY"
    exit 0
  }
}

$content = Get-Content $envPath -Raw
if ($content -match "(?m)^WEBUI_SECRET_KEY=.*$") {
  $content = $content -replace "(?m)^WEBUI_SECRET_KEY=.*$", "WEBUI_SECRET_KEY=$secret"
} else {
  $content = "WEBUI_SECRET_KEY=$secret`n" + $content
}
Set-Content -Path $envPath -Value ($content.TrimEnd() + [Environment]::NewLine) -NoNewline
Write-Host "WEBUI_SECRET_KEY mis à jour dans .env"
