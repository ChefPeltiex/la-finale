# Recompresse les visuels de src/assets pour garder le bundle raisonnable sur mobile.
# Usage : powershell -NoProfile -ExecutionPolicy Bypass -File scripts/optimiser-images.ps1
Add-Type -AssemblyName System.Drawing

$racine = Split-Path -Parent $PSScriptRoot
$dossier = Join-Path $racine 'src/assets'
$largeurMax = 1400
$qualite = 82L

$encodeur = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $qualite)

Get-ChildItem -Path $dossier -Filter *.jpg | ForEach-Object {
  $chemin = $_.FullName
  $avant = $_.Length
  $src = [System.Drawing.Image]::FromFile($chemin)
  $ratio = [Math]::Min($largeurMax / $src.Width, $largeurMax / $src.Height)
  if ($ratio -gt 1) { $ratio = 1 }
  $w = [int]($src.Width * $ratio)
  $h = [int]($src.Height * $ratio)
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.SmoothingMode = 'HighQuality'
  $g.PixelOffsetMode = 'HighQuality'
  $g.DrawImage($src, 0, 0, $w, $h)
  $g.Dispose()
  $src.Dispose()
  $temp = "$chemin.tmp"
  $bmp.Save($temp, $encodeur, $params)
  $bmp.Dispose()
  Move-Item -Force $temp $chemin
  $apres = (Get-Item $chemin).Length
  Write-Output ("{0} : {1} Ko -> {2} Ko ({3}x{4})" -f $_.Name, [int]($avant / 1024), [int]($apres / 1024), $w, $h)
}
