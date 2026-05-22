# Colle une image base64 (ou un fichier .jpg) puis decode vers page-NN.jpeg
$ErrorActionPreference = 'Stop'
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $dir

$arg = $args[0]
if ($arg -and (Test-Path $arg)) {
  node decode-stdin.cjs $arg
  exit $LASTEXITCODE
}

$clip = Get-Clipboard -Raw
if (-not $clip) {
  Write-Host 'Usage: .\paste-and-decode.ps1 [chemin.jpg|.b64]'
  Write-Host 'Ou copie le base64 / data:image... dans le presse-papiers puis relance sans argument.'
  exit 1
}

$path = Join-Path $dir '_clipboard.b64'
Set-Content -Path $path -Value $clip -NoNewline -Encoding utf8
node decode-stdin.cjs $path
