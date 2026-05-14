#!/usr/bin/env bash
# Générateur Codex Ultime Doré — pack texte + méta + archive
# CODEX_PACK_ROOT: ex. Git Bash export CODEX_PACK_ROOT="/d/Prod/Codex/Codex_Ultime_Dore"
#                     sous WSL souvent: /mnt/d/Prod/Codex/Codex_Ultime_Dore
set -euo pipefail
BASE="${CODEX_PACK_ROOT:-$(pwd)/Codex_Ultime_Dore}"
mkdir -p "$BASE"/{assets,audio,design,docs,deliverables}

# --- manifest.json (relatif, contenu utilisateur) ---
cat > "$BASE/manifest.json" <<'JSON'
{
  "project_title": "Codex_Ultime_Dore",
  "version": "1.0",
  "author": "Equipe Codex",
  "date_created": "2026-05-13",
  "base_path": "./",
  "scenes": [
    {
      "id": "9A",
      "title": "Codex Closed",
      "duration_seconds": 8,
      "focal_percentage_width": 50,
      "focal_percentage_height": 45,
      "key_color": "#C89A3A",
      "priority": "high",
      "assets": [
        "assets/9A_Codex_Closed/9A_bg.png",
        "assets/9A_Codex_Closed/9A_mg.png",
        "assets/9A_Codex_Closed/9A_fg.png",
        "assets/9A_Codex_Closed/9A_particles.exr",
        "assets/9A_Codex_Closed/9A_meta.json"
      ]
    },
    {
      "id": "9B",
      "title": "Reliquat Flottant",
      "duration_seconds": 7,
      "focal_percentage_width": 52,
      "focal_percentage_height": 40,
      "key_color": "#D9A24A",
      "priority": "medium",
      "assets": [
        "assets/9B_Reliquat_Flottant/9B_bg.png",
        "assets/9B_Reliquat_Flottant/9B_mg.png",
        "assets/9B_Reliquat_Flottant/9B_fg.png",
        "assets/9B_Reliquat_Flottant/9B_particles.exr",
        "assets/9B_Reliquat_Flottant/9B_meta.json"
      ]
    },
    {
      "id": "9C",
      "title": "Filament Traversant",
      "duration_seconds": 10,
      "focal_percentage_width": 50,
      "focal_percentage_height": 42,
      "key_color": "#0F2340",
      "priority": "high",
      "assets": [
        "assets/9C_Filament_Traversant/9C_bg.png",
        "assets/9C_Filament_Traversant/9C_mg.png",
        "assets/9C_Filament_Traversant/9C_fg.png",
        "assets/9C_Filament_Traversant/9C_particles.exr",
        "assets/9C_Filament_Traversant/9C_meta.json"
      ]
    },
    {
      "id": "9D",
      "title": "Miroir Fragmenté",
      "duration_seconds": 8,
      "focal_percentage_width": 50,
      "focal_percentage_height": 45,
      "key_color": "#7FD1D9",
      "priority": "medium",
      "assets": [
        "assets/9D_Miroir_Fragmented/9D_bg.png",
        "assets/9D_Miroir_Fragmented/9D_mg.png",
        "assets/9D_Miroir_Fragmented/9D_fg.png",
        "assets/9D_Miroir_Fragmented/9D_particles.exr",
        "assets/9D_Miroir_Fragmented/9D_meta.json"
      ]
    },
    {
      "id": "9E",
      "title": "Page Détachée",
      "duration_seconds": 6,
      "focal_percentage_width": 48,
      "focal_percentage_height": 46,
      "key_color": "#7A4B2A",
      "priority": "medium",
      "assets": [
        "assets/9E_Page_Detachee/9E_bg.png",
        "assets/9E_Page_Detachee/9E_mg.png",
        "assets/9E_Page_Detachee/9E_fg.png",
        "assets/9E_Page_Detachee/9E_particles.exr",
        "assets/9E_Page_Detachee/9E_meta.json"
      ]
    },
    {
      "id": "9F",
      "title": "Sceau sur Parchemin",
      "duration_seconds": 6,
      "focal_percentage_width": 50,
      "focal_percentage_height": 44,
      "key_color": "#0A0A0A",
      "priority": "high",
      "assets": [
        "assets/9F_Sceau_Parchemin/9F_bg.png",
        "assets/9F_Sceau_Parchemin/9F_mg.png",
        "assets/9F_Sceau_Parchemin/9F_fg.png",
        "assets/9F_Sceau_Parchemin/9F_particles.exr",
        "assets/9F_Sceau_Parchemin/9F_meta.json"
      ]
    },
    {
      "id": "9G",
      "title": "Totem Animé",
      "duration_seconds": 7,
      "focal_percentage_width": 48,
      "focal_percentage_height": 50,
      "key_color": "#6E4B2B",
      "priority": "medium",
      "assets": [
        "assets/9G_Totem_Anime/9G_bg.png",
        "assets/9G_Totem_Anime/9G_mg.png",
        "assets/9G_Totem_Anime/9G_fg.png",
        "assets/9G_Totem_Anime/9G_particles.exr",
        "assets/9G_Totem_Anime/9G_meta.json"
      ]
    },
    {
      "id": "9H",
      "title": "Cartographie Négative",
      "duration_seconds": 8,
      "focal_percentage_width": 50,
      "focal_percentage_height": 45,
      "key_color": "#EDEFF3",
      "priority": "low",
      "assets": [
        "assets/9H_Cartographie_Negative/9H_bg.png",
        "assets/9H_Cartographie_Negative/9H_mg.png",
        "assets/9H_Cartographie_Negative/9H_fg.png",
        "assets/9H_Cartographie_Negative/9H_particles.exr",
        "assets/9H_Cartographie_Negative/9H_meta.json"
      ]
    },
    {
      "id": "9I",
      "title": "Voile Translucide",
      "duration_seconds": 9,
      "focal_percentage_width": 50,
      "focal_percentage_height": 40,
      "key_color": "#EDEFF3",
      "priority": "high",
      "assets": [
        "assets/9I_Voile_Translucide/9I_bg.png",
        "assets/9I_Voile_Translucide/9I_mg.png",
        "assets/9I_Voile_Translucide/9I_fg.png",
        "assets/9I_Voile_Translucide/9I_particles.exr",
        "assets/9I_Voile_Translucide/9I_meta.json"
      ]
    },
    {
      "id": "9J",
      "title": "Silhouette Témoin",
      "duration_seconds": 6,
      "focal_percentage_width": 48,
      "focal_percentage_height": 50,
      "key_color": "#0B2A44",
      "priority": "low",
      "assets": [
        "assets/9J_Silhouette_Temoin/9J_bg.png",
        "assets/9J_Silhouette_Temoin/9J_mg.png",
        "assets/9J_Silhouette_Temoin/9J_fg.png",
        "assets/9J_Silhouette_Temoin/9J_particles.exr",
        "assets/9J_Silhouette_Temoin/9J_meta.json"
      ]
    },
    {
      "id": "9K",
      "title": "Anneaux Réverbérants",
      "duration_seconds": 8,
      "focal_percentage_width": 50,
      "focal_percentage_height": 45,
      "key_color": "#C89A3A",
      "priority": "medium",
      "assets": [
        "assets/9K_Anneaux_Reverberants/9K_bg.png",
        "assets/9K_Anneaux_Reverberants/9K_mg.png",
        "assets/9K_Anneaux_Reverberants/9K_fg.png",
        "assets/9K_Anneaux_Reverberants/9K_particles.exr",
        "assets/9K_Anneaux_Reverberants/9K_meta.json"
      ]
    },
    {
      "id": "9L",
      "title": "Silence Sculpté",
      "duration_seconds": 10,
      "focal_percentage_width": 52,
      "focal_percentage_height": 42,
      "key_color": "#EDEFF3",
      "priority": "high",
      "assets": [
        "assets/9L_Silence_Sculpte/9L_bg.png",
        "assets/9L_Silence_Sculpte/9L_mg.png",
        "assets/9L_Silence_Sculpte/9L_fg.png",
        "assets/9L_Silence_Sculpte/9L_particles.exr",
        "assets/9L_Silence_Sculpte/9L_meta.json"
      ]
    },
    {
      "id": "9M",
      "title": "Échos Transformés",
      "duration_seconds": 9,
      "focal_percentage_width": 50,
      "focal_percentage_height": 44,
      "key_color": "#D9A24A",
      "priority": "medium",
      "assets": [
        "assets/9M_Echos_Transformes/9M_bg.png",
        "assets/9M_Echos_Transformes/9M_mg.png",
        "assets/9M_Echos_Transformes/9M_fg.png",
        "assets/9M_Echos_Transformes/9M_particles.exr",
        "assets/9M_Echos_Transformes/9M_meta.json"
      ]
    },
    {
      "id": "9N",
      "title": "Sablier Fractal",
      "duration_seconds": 8,
      "focal_percentage_width": 50,
      "focal_percentage_height": 45,
      "key_color": "#0F2340",
      "priority": "medium",
      "assets": [
        "assets/9N_Sablier_Fractal/9N_bg.png",
        "assets/9N_Sablier_Fractal/9N_mg.png",
        "assets/9N_Sablier_Fractal/9N_fg.png",
        "assets/9N_Sablier_Fractal/9N_particles.exr",
        "assets/9N_Sablier_Fractal/9N_meta.json"
      ]
    },
    {
      "id": "9O",
      "title": "Partition Lumineuse",
      "duration_seconds": 7,
      "focal_percentage_width": 50,
      "focal_percentage_height": 40,
      "key_color": "#BFD7E3",
      "priority": "medium",
      "assets": [
        "assets/9O_Partition_Lumineuse/9O_bg.png",
        "assets/9O_Partition_Lumineuse/9O_mg.png",
        "assets/9O_Partition_Lumineuse/9O_fg.png",
        "assets/9O_Partition_Lumineuse/9O_particles.exr",
        "assets/9O_Partition_Lumineuse/9O_meta.json"
      ]
    },
    {
      "id": "9P",
      "title": "Colonne d'Onde",
      "duration_seconds": 8,
      "focal_percentage_width": 50,
      "focal_percentage_height": 42,
      "key_color": "#C89A3A",
      "priority": "high",
      "assets": [
        "assets/9P_Colonne_Onde/9P_bg.png",
        "assets/9P_Colonne_Onde/9P_mg.png",
        "assets/9P_Colonne_Onde/9P_fg.png",
        "assets/9P_Colonne_Onde/9P_particles.exr",
        "assets/9P_Colonne_Onde/9P_meta.json"
      ]
    },
    {
      "id": "9Q",
      "title": "Onde Réverbérante",
      "duration_seconds": 9,
      "focal_percentage_width": 50,
      "focal_percentage_height": 44,
      "key_color": "#C89A3A",
      "priority": "high",
      "assets": [
        "assets/9Q_Onde_Reverberante/9Q_bg.png",
        "assets/9Q_Onde_Reverberante/9Q_mg.png",
        "assets/9Q_Onde_Reverberante/9Q_fg.png",
        "assets/9Q_Onde_Reverberante/9Q_particles.exr",
        "assets/9Q_Onde_Reverberante/9Q_meta.json"
      ]
    },
    {
      "id": "9R",
      "title": "Vides Sculptés",
      "duration_seconds": 8,
      "focal_percentage_width": 50,
      "focal_percentage_height": 45,
      "key_color": "#EDEFF3",
      "priority": "medium",
      "assets": [
        "assets/9R_Vides_Sculptes/9R_bg.png",
        "assets/9R_Vides_Sculptes/9R_mg.png",
        "assets/9R_Vides_Sculptes/9R_fg.png",
        "assets/9R_Vides_Sculptes/9R_particles.exr",
        "assets/9R_Vides_Sculptes/9R_meta.json"
      ]
    },
    {
      "id": "9S",
      "title": "Pacte Rituel",
      "duration_seconds": 10,
      "focal_percentage_width": 50,
      "focal_percentage_height": 46,
      "key_color": "#0A0A0A",
      "priority": "high",
      "assets": [
        "assets/9S_Pacte_Rituel/9S_bg.png",
        "assets/9S_Pacte_Rituel/9S_mg.png",
        "assets/9S_Pacte_Rituel/9S_fg.png",
        "assets/9S_Pacte_Rituel/9S_particles.exr",
        "assets/9S_Pacte_Rituel/9S_meta.json"
      ]
    },
    {
      "id": "9T",
      "title": "Serment des Gardiens",
      "duration_seconds": 10,
      "focal_percentage_width": 50,
      "focal_percentage_height": 45,
      "key_color": "#0B2A44",
      "priority": "high",
      "assets": [
        "assets/9T_Serment_Gardiens/9T_bg.png",
        "assets/9T_Serment_Gardiens/9T_mg.png",
        "assets/9T_Serment_Gardiens/9T_fg.png",
        "assets/9T_Serment_Gardiens/9T_particles.exr",
        "assets/9T_Serment_Gardiens/9T_meta.json"
      ]
    },
    {
      "id": "9U",
      "title": "Veillée des Manuscrits",
      "duration_seconds": 9,
      "focal_percentage_width": 50,
      "focal_percentage_height": 45,
      "key_color": "#D9A24A",
      "priority": "medium",
      "assets": [
        "assets/9U_Veillee_Manuscrits/9U_bg.png",
        "assets/9U_Veillee_Manuscrits/9U_mg.png",
        "assets/9U_Veillee_Manuscrits/9U_fg.png",
        "assets/9U_Veillee_Manuscrits/9U_particles.exr",
        "assets/9U_Veillee_Manuscrits/9U_meta.json"
      ]
    },
    {
      "id": "9V",
      "title": "Voile Révélateur",
      "duration_seconds": 9,
      "focal_percentage_width": 50,
      "focal_percentage_height": 40,
      "key_color": "#EDEFF3",
      "priority": "high",
      "assets": [
        "assets/9V_Voile_Revelateur/9V_bg.png",
        "assets/9V_Voile_Revelateur/9V_mg.png",
        "assets/9V_Voile_Revelateur/9V_fg.png",
        "assets/9V_Voile_Revelateur/9V_particles.exr",
        "assets/9V_Voile_Revelateur/9V_meta.json"
      ]
    },
    {
      "id": "9W",
      "title": "Reliquat Lumineux",
      "duration_seconds": 8,
      "focal_percentage_width": 52,
      "focal_percentage_height": 38,
      "key_color": "#7FD1D9",
      "priority": "medium",
      "assets": [
        "assets/9W_Reliquat_Lumineux/9W_bg.png",
        "assets/9W_Reliquat_Lumineux/9W_mg.png",
        "assets/9W_Reliquat_Lumineux/9W_fg.png",
        "assets/9W_Reliquat_Lumineux/9W_particles.exr",
        "assets/9W_Reliquat_Lumineux/9W_meta.json"
      ]
    },
    {
      "id": "9X",
      "title": "Constellation des Lecteurs",
      "duration_seconds": 10,
      "focal_percentage_width": 50,
      "focal_percentage_height": 30,
      "key_color": "#0B2A44",
      "priority": "high",
      "assets": [
        "assets/9X_Constellation_Lecteurs/9X_bg.png",
        "assets/9X_Constellation_Lecteurs/9X_mg.png",
        "assets/9X_Constellation_Lecteurs/9X_fg.png",
        "assets/9X_Constellation_Lecteurs/9X_particles.exr",
        "assets/9X_Constellation_Lecteurs/9X_meta.json"
      ]
    },
    {
      "id": "9Y",
      "title": "Clef et Portes",
      "duration_seconds": 9,
      "focal_percentage_width": 48,
      "focal_percentage_height": 42,
      "key_color": "#C89A3A",
      "priority": "high",
      "assets": [
        "assets/9Y_Clef_Portes/9Y_bg.png",
        "assets/9Y_Clef_Portes/9Y_mg.png",
        "assets/9Y_Clef_Portes/9Y_fg.png",
        "assets/9Y_Clef_Portes/9Y_particles.exr",
        "assets/9Y_Clef_Portes/9Y_meta.json"
      ]
    },
    {
      "id": "9Z",
      "title": "Apothéose Codex",
      "duration_seconds": 15,
      "focal_percentage_width": 50,
      "focal_percentage_height": 30,
      "key_color": "#C89A3A",
      "priority": "very_high",
      "assets": [
        "assets/9Z_Apotheose_Codex/9Z_bg.png",
        "assets/9Z_Apotheose_Codex/9Z_mg.png",
        "assets/9Z_Apotheose_Codex/9Z_fg.png",
        "assets/9Z_Apotheose_Codex/9Z_particles.exr",
        "assets/9Z_Apotheose_Codex/9Z_meta.json"
      ]
    }
  ],
  "palette": {
    "or_crepusculaire": "#C89A3A",
    "ambre_chaud": "#D9A24A",
    "indigo_profond": "#0F2340",
    "bleu_nuit": "#0B2A44",
    "nacre_pale": "#EDEFF3",
    "cyan_delave": "#7FD1D9",
    "opale_argent": "#BFD7E3",
    "brun_sepia": "#7A4B2A",
    "noir_encre": "#0A0A0A",
    "bronze_mat": "#6E4B2B"
  },
  "audio": {
    "voice_file": "audio/mon_histoire_voix.wav",
    "music_stems": [
      "audio/music_stem_ambient.wav",
      "audio/music_stem_pads.wav",
      "audio/music_stem_perc.wav"
    ],
    "sfx": [
      "audio/sfx_tintement_01.wav",
      "audio/sfx_frottement_01.wav",
      "audio/sfx_bourdonnement_01.wav"
    ]
  },
  "export_settings": {
    "image_resolution_px": "3000x2000",
    "image_bit_depth": "16-bit",
    "framerate": "24",
    "audio_sample_rate": "44.1kHz",
    "audio_bit_depth": "24-bit"
  },
  "deliverables": [
    "assets per scene (bg/mg/fg/particles)",
    "planche_index_9A-9Z.png",
    "nuancier.ase",
    "nuancier.aco",
    "palette_hex.txt",
    "script_timecoded.txt",
    "animation_fiches.pdf",
    "guide_sonore.pdf",
    "manifest.json",
    "README.txt"
  ]
}
JSON

# --- palette_hex.txt (racine + design/) ---
cat > "$BASE/palette_hex.txt" <<'TXT'
Or_crepusculaire #C89A3A
Ambre_chaud      #D9A24A
Indigo_profond   #0F2340
Bleu_nuit        #0B2A44
Nacre_pale       #EDEFF3
Cyan_delave      #7FD1D9
Opale_argent     #BFD7E3
Brun_sepia       #7A4B2A
Noir_encre       #0A0A0A
Bronze_mat       #6E4B2B
TXT
cp -f "$BASE/palette_hex.txt" "$BASE/design/palette_hex.txt"

# --- README.txt ---
cat > "$BASE/README.txt" <<'READMEEOF'
Codex_Ultime_Dore_Pack_v1.0 - README
Structure du pack
  /assets/SCENE_ID/ -> 9A_bg.png, 9A_mg.png, 9A_fg.png, 9A_particles.exr, 9A_meta.json
  /audio/ -> mon_histoire_voix.wav, music_stem_*.wav, sfx_*.wav
  /design/ -> nuancier.ase, nuancier.aco, planche_index_9A-9Z.png
  /docs/ -> script_timecoded.txt, animation_fiches.pdf, guide_sonore.pdf, checklist_production.pdf
  manifest.json
  README.txt
Import palette
  - Photoshop/Illustrator: ouvrir nuancier.ase ou nuancier.aco
  - Figma/Sketch: coller hex depuis palette_hex.txt
  - Règles: centres = Or_crepusculaire + Ambre_chaud; périphéries = Indigo_profond + Bleu_nuit; accents = Opale_argent + Cyan_delave
Nommage et métadonnées
  - Respecter le schéma: SCENEID_type.ext (ex: 9A_bg.png)
  - Inclure dans chaque dossier scène un fichier JSON minimal (_meta.json) avec focales, couleur clé, durée et liste d'assets
  - Exemple meta: {"scene":"9A","focal_percentage_width":50,"focal_percentage_height":45,"key_color":"#C89A3A","duration_seconds":8}
Export et rendu
  - Images: PNG 3000x2000 px, 16-bit, sRGB
  - Particles: EXR multilayer ou séquence PNG avec alpha
  - Audio: voix WAV 44.1kHz 24-bit; stems WAV 44.1kHz 24-bit; SFX WAV 48kHz 24-bit
  - Animation: 24 fps; DOF passes et z-depth fournis pour compositing
Livraison finale
  - Nom du ZIP: Codex_Ultime_Dore_Pack_v1.0.zip
  - Inclure manifest.json et README.txt à la racine du ZIP
  - Fournir export test H.264 1080p 24fps pour validation
Checklist rapide
  - [ ] Assets visuels par scène (bg/mg/fg/particles)
  - [ ] Metadata JSON par scène
  - [ ] Nuancier .ase/.aco + palette_hex.txt
  - [ ] Script voix off time-coded + fichier WAV
  - [ ] Music stems + SFX
  - [ ] Planche d’index 9A-9Z PNG
  - [ ] Animation fiches PDF + guide sonore PDF
  - [ ] README.txt et manifest.json
READMEEOF

# --- planche_index_9A-9Z.txt ---
cat > "$BASE/design/planche_index_9A-9Z.txt" <<'PLANCHEEOF'
9A Codex Closed
  Focale: plan rapproché sur reliure
  Couleur clé: #C89A3A (Or crépusculaire)
  Mouvement: léger tremblement de couverture
  Cadrage: serré, texture cuir, DOF serré
9B Reliquat Flottant
  Focale: fragment central flottant
  Couleur clé: #D9A24A (Ambre chaud)
  Mouvement: rotation lente
  Cadrage: halo latéral, ombre douce
9C Filament Traversant
  Focale: trajectoire diagonale ascendante
  Couleur clé: #0F2340 (Indigo profond)
  Mouvement: traînée lumineuse, easing
  Cadrage: salle en perspective, filament traverse cadre
9D Miroir Fragmenté
  Focale: plans multiples en split
  Couleur clé: #7FD1D9 (Cyan délavé)
  Mouvement: reflets qui se décalent
  Cadrage: fragments miroir, reflets asynchrones
9E Page Détachée
  Focale: gros plan bord de page
  Couleur clé: #7A4B2A (Brun sépia)
  Mouvement: flottement descendant
  Cadrage: grain papier, bord effiloché
9F Sceau sur Parchemin
  Focale: focus sur goutte d'encre
  Couleur clé: #0A0A0A (Noir d'encre)
  Mouvement: pulsation au contact
  Cadrage: main, plume, texture parchemin
9G Totem Animé
  Focale: contre-plongée légère
  Couleur clé: #6E4B2B (Bronze mat)
  Mouvement: pulsation synchrone
  Cadrage: verticalité, reflets métalliques
9H Cartographie Négative
  Focale: superposition calques
  Couleur clé: #EDEFF3 (Nacre pâle)
  Mouvement: balayage latéral
  Cadrage: calques transparents, annotations
9I Voile Translucide
  Focale: plans successifs
  Couleur clé: #EDEFF3 (Nacre pâle)
  Mouvement: ondulation lente
  Cadrage: profondeur, voile en premier plan
9J Silhouette Témoin
  Focale: contre-jour silhouette nette
  Couleur clé: #0B2A44 (Bleu nuit)
  Mouvement: inclinaison de tête
  Cadrage: isolement, rim lighting
9K Anneaux Réverbérants
  Focale: centre radial
  Couleur clé: #C89A3A (Or crépusculaire)
  Mouvement: expansion concentrique
  Cadrage: rythme régulier, symétrie
9L Silence Sculpté
  Focale: cavité lumineuse
  Couleur clé: #EDEFF3 (Nacre pâle)
  Mouvement: pulsation douce
  Cadrage: atmosphère, quasi-silence
9M Échos Transformés
  Focale: morphing d'objets
  Couleur clé: #D9A24A (Ambre chaud)
  Mouvement: transitions morphologiques subtiles
  Cadrage: focus sur textures
9N Sablier Fractal
  Focale: boucle fractale courte
  Couleur clé: #0F2340 (Indigo profond)
  Mouvement: grains qui se recomposent
  Cadrage: répétition, micro-mouvements
9O Partition Lumineuse
  Focale: séquençage rythmique
  Couleur clé: #BFD7E3 (Opale argent)
  Mouvement: notes qui s'allument
  Cadrage: lignes musicales visuelles
9P Colonne d'Onde
  Focale: verticalité syncro son
  Couleur clé: #C89A3A (Or crépusculaire)
  Mouvement: montée en crête
  Cadrage: colonne centrale, pulsation
9Q Onde Réverbérante
  Focale: propagation radiale
  Couleur clé: #C89A3A (Or crépusculaire)
  Mouvement: anneaux successifs
  Cadrage: espace ouvert, réverbération
9R Vides Sculptés
  Focale: motifs circulaires en tissage
  Couleur clé: #EDEFF3 (Nacre pâle)
  Mouvement: sutures qui se tissent
  Cadrage: rosace, jeu d'ombres
9S Pacte Rituel
  Focale: plan moyen mains et sceaux
  Couleur clé: #0A0A0A (Noir d'encre)
  Mouvement: encre qui coule
  Cadrage: table rituelle, textures humides
9T Serment des Gardiens
  Focale: cercle humain
  Couleur clé: #0B2A44 (Bleu nuit)
  Mouvement: parchemin circulant
  Cadrage: synchronie des gestes
9U Veillée des Manuscrits
  Focale: plans rapprochés reliures
  Couleur clé: #D9A24A (Ambre chaud)
  Mouvement: flammes intérieures qui respirent
  Cadrage: chaleur intime, lueurs internes
9V Voile Révélateur
  Focale: couches successives
  Couleur clé: #EDEFF3 (Nacre pâle)
  Mouvement: soulèvement ondulant
  Cadrage: révélations progressives
9W Reliquat Lumineux
  Focale: nuée ascendante
  Couleur clé: #7FD1D9 (Cyan délavé)
  Mouvement: dérive ascendante
  Cadrage: dynamique ascendante légère
9X Constellation des Lecteurs
  Focale: voûte en haut, livres en bas
  Couleur clé: #0B2A44 (Bleu nuit)
  Mouvement: trajectoires stellaires
  Cadrage: radial, lignes de lecture
9Y Clef et Portes
  Focale: cercle symétrique
  Couleur clé: #C89A3A (Or crépusculaire)
  Mouvement: clef pulse, portes s'ouvrent séquentiellement
  Cadrage: architecture circulaire
9Z Apothéose Codex
  Focale: plan large vertical
  Couleur clé: #C89A3A (Or crépusculaire)
  Mouvement: ascension spirale
  Cadrage: halo central, spirale de lecteurs
PLANCHEEOF

# --- build_pack.sh ---
cat > "$BASE/build_pack.sh" <<'SH'
#!/usr/bin/env bash
set -euo pipefail
if ! command -v zip >/dev/null 2>&1; then
  echo "Erreur: la commande zip est introuvable. Installez zip (ex. pacman -S zip, apt install zip, ou ajoutez zip au PATH Git Bash)." >&2
  exit 1
fi
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"
OUTDIR="$ROOT/deliverables"
ZIPNAME="Codex_Ultime_Dore_Pack_v1.0.zip"
mkdir -p "$OUTDIR"
for d in assets audio design docs; do
  if [[ ! -d "$d" ]]; then
    echo "Erreur: dossier manquant: $d" >&2
    exit 1
  fi
done
if [[ -f manifest.json ]]; then cp -f manifest.json "$OUTDIR/manifest.json"; fi
if [[ -f README.txt ]]; then cp -f README.txt "$OUTDIR/README.txt"; fi
zip -r "$OUTDIR/$ZIPNAME" assets audio design docs manifest.json README.txt
echo "Pack généré: $OUTDIR/$ZIPNAME"
SH
chmod +x "$BASE/build_pack.sh"

write_scene_meta() {
  local id slug title fw fh key dur pr notes focal_w focal_h
  id=$1 slug=$2 title=$3 fw=$4 fh=$5 key=$6 dur=$7 pr=$8 notes=$9
  focal_w=50; focal_h=45
  if command -v jq >/dev/null 2>&1 && [[ -f "$BASE/manifest.json" ]]; then
    focal_w=$(jq -r --arg id "$id" '.scenes[] | select(.id==$id) | .focal_percentage_width // 50' "$BASE/manifest.json")
    focal_h=$(jq -r --arg id "$id" '.scenes[] | select(.id==$id) | .focal_percentage_height // 45' "$BASE/manifest.json")
  fi
  local dir="$BASE/assets/$slug"
  mkdir -p "$dir"
  local out="$dir/${id}_meta.json"
  if command -v jq >/dev/null 2>&1; then
jq -n \
  --arg scene "$id" \
  --arg slug "$slug" \
  --arg title "$title" \
  --argjson cw "$fw" \
  --argjson ch "$fh" \
  --arg key_color "$key" \
  --argjson dur "$dur" \
  --arg priority "$pr" \
  --arg notes "$notes" \
  --argjson focal_w "$focal_w" \
  --argjson focal_h "$focal_h" \
  --arg bg "${id}_bg.png" \
  --arg mg "${id}_mg.png" \
  --arg fg "${id}_fg.png" \
  --arg particles "${id}_particles.exr" \
  '{
    scene: $scene,
    slug: $slug,
    title: $title,
    focal_percentage_width: $focal_w,
    focal_percentage_height: $focal_h,
    key_color: $key,
    duration_seconds: $dur,
    priority: $priority,
    canvas: {width_px: $cw, height_px: $ch, color_space: "sRGB", bit_depth: 16},
    assets: {bg: $bg, mg: $mg, fg: $fg, particles: $particles},
    notes: $notes
  }' >"$out"
  elif command -v python3 >/dev/null 2>&1; then
    META_ID="$id" META_SLUG="$slug" META_TITLE="$title" META_FW="$fw" META_FH="$fh" \
    META_KEY="$key" META_DUR="$dur" META_PR="$pr" META_NOTES="$notes" META_FWPC="$focal_w" META_FHPC="$focal_h" \
    python3 - <<'PY' >"$out"
import json, os
id_ = os.environ["META_ID"]
slug = os.environ["META_SLUG"]
title = os.environ["META_TITLE"]
fw = int(os.environ["META_FW"])
fh = int(os.environ["META_FH"])
key = os.environ["META_KEY"]
dur = int(os.environ["META_DUR"])
pr = os.environ["META_PR"]
notes = os.environ["META_NOTES"]
focal_w = int(os.environ["META_FWPC"])
focal_h = int(os.environ["META_FHPC"])
obj = {
    "scene": id_,
    "slug": slug,
    "title": title,
    "focal_percentage_width": focal_w,
    "focal_percentage_height": focal_h,
    "key_color": key,
    "duration_seconds": dur,
    "priority": pr,
    "canvas": {"width_px": fw, "height_px": fh, "color_space": "sRGB", "bit_depth": 16},
    "assets": {
        "bg": f"{id_}_bg.png",
        "mg": f"{id_}_mg.png",
        "fg": f"{id_}_fg.png",
        "particles": f"{id_}_particles.exr",
    },
    "notes": notes,
}
print(json.dumps(obj, ensure_ascii=False, indent=2))
PY
  else
    local ns="${notes//\"/}"
    ns="${ns//$'\n'/ }"
    cat >"$out" <<METAEOF
{
  "scene": "${id}",
  "slug": "${slug}",
  "title": "${title}",
  "focal_percentage_width": ${focal_w},
  "focal_percentage_height": ${focal_h},
  "key_color": "${key}",
  "duration_seconds": ${dur},
  "priority": "${pr}",
  "canvas": {"width_px": ${fw}, "height_px": ${fh}, "color_space": "sRGB", "bit_depth": 16},
  "assets": {
    "bg": "${id}_bg.png",
    "mg": "${id}_mg.png",
    "fg": "${id}_fg.png",
    "particles": "${id}_particles.exr"
  },
  "notes": "${ns}"
}
METAEOF
  fi
}

# Scènes: id|slug|title|fw|fh|key|dur|pr|notes (slug = dossier manifest)
while IFS='|' read -r id slug title fw fh key dur pr notes; do
  [[ -z "${id:-}" ]] && continue
  write_scene_meta "$id" "$slug" "$title" "$fw" "$fh" "$key" "$dur" "$pr" "$notes"
done <<'ROWS'
9A|9A_Codex_Closed|Codex Closed|3000|2000|#C89A3A|8|high|Plan rapproché reliure; DOF serré; tremblement de couverture
9B|9B_Reliquat_Flottant|Reliquat Flottant|3000|2000|#D9A24A|7|medium|Fragment central flottant; halo latéral; rotation lente
9C|9C_Filament_Traversant|Filament Traversant|3000|2000|#0F2340|10|high|Diagonale ascendante; traînée lumineuse; perspective
9D|9D_Miroir_Fragmented|Miroir Fragmenté|3000|2000|#7FD1D9|8|medium|Split plans; reflets asynchrones
9E|9E_Page_Detachee|Page Détachée|3000|2000|#7A4B2A|6|medium|Gros plan bord de page; grain papier
9F|9F_Sceau_Parchemin|Sceau sur Parchemin|3000|2000|#0A0A0A|6|high|Goutte d'encre; pulsation au contact
9G|9G_Totem_Anime|Totem Animé|3000|2000|#6E4B2B|7|medium|Contre-plongée; pulsation synchrone; métal
9H|9H_Cartographie_Negative|Cartographie Négative|3000|2000|#EDEFF3|8|low|Superposition calques; balayage latéral
9I|9I_Voile_Translucide|Voile Translucide|3000|2000|#EDEFF3|9|high|Plans successifs; ondulation lente
9J|9J_Silhouette_Temoin|Silhouette Témoin|3000|2000|#0B2A44|6|low|Contre-jour; inclinaison; rim lighting
9K|9K_Anneaux_Reverberants|Anneaux Réverbérants|3000|2000|#C89A3A|8|medium|Centre radial; expansion concentrique
9L|9L_Silence_Sculpte|Silence Sculpté|3000|2000|#EDEFF3|10|high|Cavité lumineuse; pulsation douce
9M|9M_Echos_Transformes|Échos Transformés|3000|2000|#D9A24A|9|medium|Morphing subtil; textures
9N|9N_Sablier_Fractal|Sablier Fractal|3000|2000|#0F2340|8|medium|Boucle fractale; grains recompose
9O|9O_Partition_Lumineuse|Partition Lumineuse|3000|2000|#BFD7E3|7|medium|Séquençage rythmique; lignes musicales
9P|9P_Colonne_Onde|Colonne d'Onde|3000|2000|#C89A3A|8|high|Verticalité; montée en crête; pulsation
9Q|9Q_Onde_Reverberante|Onde Réverbérante|3000|2000|#C89A3A|9|high|Propagation radiale; anneaux successifs
9R|9R_Vides_Sculptes|Vides Sculptés|3000|2000|#EDEFF3|8|medium|Motifs circulaires; sutures; rosace
9S|9S_Pacte_Rituel|Pacte Rituel|3000|2000|#0A0A0A|10|high|Mains et sceaux; encre qui coule
9T|9T_Serment_Gardiens|Serment des Gardiens|3000|2000|#0B2A44|10|high|Cercle humain; parchemin circulant
9U|9U_Veillee_Manuscrits|Veillée des Manuscrits|3000|2000|#D9A24A|9|medium|Reliures rapprochées; flammes intérieures
9V|9V_Voile_Revelateur|Voile Révélateur|3000|2000|#EDEFF3|9|high|Couches successives; soulèvement ondulant
9W|9W_Reliquat_Lumineux|Reliquat Lumineux|3000|2000|#7FD1D9|8|medium|Nuée ascendante; dérive ascendante
9X|9X_Constellation_Lecteurs|Constellation des Lecteurs|3000|2000|#0B2A44|10|high|Voûte et livres; trajectoires stellaires
9Y|9Y_Clef_Portes|Clef et Portes|3000|2000|#C89A3A|9|high|Clef pulse; portes séquentielles; symétrie
9Z|9Z_Apotheose_Codex|Apothéose Codex|3000|2000|#C89A3A|15|very_high|Plan large vertical; ascension spirale; halo
ROWS

touch "$BASE/audio/.gitkeep" "$BASE/docs/.gitkeep"

cd "$BASE" && ./build_pack.sh
echo "BASE=$BASE"
echo "ZIP=$BASE/deliverables/Codex_Ultime_Dore_Pack_v1.0.zip"
echo "build_pack=$BASE/build_pack.sh"
