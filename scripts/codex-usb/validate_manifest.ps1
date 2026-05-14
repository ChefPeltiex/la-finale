$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Windows.Forms
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifest = [System.IO.Path]::GetFullPath((Join-Path $ROOT '..\manifest.json'))
try {
    $raw = Get-Content -LiteralPath $manifest -Raw -Encoding utf8
} catch {
    [System.Windows.Forms.MessageBox]::Show(
        "Cannot read manifest:`n$manifest`n$($_.Exception.Message)",
        "Codex USB validation",
        "OK",
        "Error"
    ) | Out-Null
    exit 2
}
try {
    $null = $raw | ConvertFrom-Json
} catch {
    [System.Windows.Forms.MessageBox]::Show(
        "Invalid JSON:`n$manifest`n$($_.Exception.Message)",
        "Codex USB validation",
        "OK",
        "Error"
    ) | Out-Null
    exit 2
}
[System.Windows.Forms.MessageBox]::Show(
    "Manifest OK (UTF-8 JSON):`n$manifest",
    "Codex USB validation",
    "OK",
    "Information"
) | Out-Null
exit 0

