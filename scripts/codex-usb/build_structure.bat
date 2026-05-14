@echo off
setlocal EnableExtensions
rem PACKROOT = parent of the "scripts" directory (this file: <PACKROOT>\scripts\codex-usb\build_structure.bat)
for %%I in ("%~dp0..\..") do set "PACKROOT=%%~fI"

mkdir "%PACKROOT%\assets" 2>nul
mkdir "%PACKROOT%\audio" 2>nul
mkdir "%PACKROOT%\design" 2>nul
mkdir "%PACKROOT%\docs" 2>nul
mkdir "%PACKROOT%\deliverables" 2>nul

for %%S in (
  9A_Codex_Closed
  9B_Reliquat_Flottant
  9C_Filament_Traversant
  9D_Miroir_Fragmented
  9E_Page_Detachee
  9F_Sceau_Parchemin
  9G_Totem_Anime
  9H_Cartographie_Negative
  9I_Voile_Translucide
  9J_Silhouette_Temoin
  9K_Anneaux_Reverberants
  9L_Silence_Sculpte
  9M_Echos_Transformes
  9N_Sablier_Fractal
  9O_Partition_Lumineuse
  9P_Colonne_Onde
  9Q_Onde_Reverberante
  9R_Vides_Sculptes
  9S_Pacte_Rituel
  9T_Serment_Gardiens
  9U_Veillee_Manuscrits
  9V_Voile_Revelateur
  9W_Reliquat_Lumineux
  9X_Constellation_Lecteurs
  9Y_Clef_Portes
  9Z_Apotheose_Codex
) do mkdir "%PACKROOT%\assets\%%S" 2>nul

echo PACKROOT=%PACKROOT%
exit /b 0
