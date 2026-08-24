# Découpe un médaillon carré centré sur l'œil de hora-emblem.jpg.
# Usage : powershell -NoProfile -ExecutionPolicy Bypass -File scripts/decouper-oeil.ps1 [-Cx 742] [-Cy 470] [-Cote 340] [-Sortie 512]
param(
  [int]$Cx = 742,
  [int]$Cy = 470,
  [int]$Cote = 340,
  [int]$Sortie = 512,
  [long]$Qualite = 86
)

Add-Type -AssemblyName System.Drawing

$racine = Split-Path -Parent $PSScriptRoot
$source = Join-Path $racine 'src/assets/hora-emblem.jpg'
$cible = Join-Path $racine 'src/assets/hora-oeil.jpg'

$src = [System.Drawing.Image]::FromFile($source)
Write-Output ("source : {0} x {1}" -f $src.Width, $src.Height)

$x = [Math]::Max(0, $Cx - [int]($Cote / 2))
$y = [Math]::Max(0, $Cy - [int]($Cote / 2))
$w = [Math]::Min($Cote, $src.Width - $x)
$h = [Math]::Min($Cote, $src.Height - $y)

$bmp = New-Object System.Drawing.Bitmap($Sortie, $Sortie)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = 'HighQualityBicubic'
$g.SmoothingMode = 'HighQuality'
$g.PixelOffsetMode = 'HighQuality'
$rectSrc = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
$rectDst = New-Object System.Drawing.Rectangle(0, 0, $Sortie, $Sortie)
$g.DrawImage($src, $rectDst, $rectSrc, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()
$src.Dispose()

$encodeur = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Qualite)
$bmp.Save($cible, $encodeur, $params)
$bmp.Dispose()

Write-Output ("decoupe : x={0} y={1} {2}x{3} -> {4}px" -f $x, $y, $w, $h, $Sortie)
Write-Output ("ecrit   : {0} ({1} Ko)" -f $cible, [int]((Get-Item $cible).Length / 1024))
