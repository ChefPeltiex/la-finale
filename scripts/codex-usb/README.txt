Codex USB validation pack (standalone)
======================================

Placement
---------
**Option A (recommended for USB):** copy the **contents** of this folder (the files inside ``codex-usb``, not the folder name as a nested deploy) into ``<PACKROOT>/scripts/`` so that ``validate_json.py`` and the other scripts sit there with ``../manifest.json`` as the pack manifest (sibling of ``scripts/``). If you instead copy the whole ``codex-usb`` folder as ``<PACKROOT>/scripts/codex-usb/``, you must use Option B paths; **the current scripts do not support Option B** (they assume one ``..`` from the script directory to the pack root).

Example layout on a USB drive (Option A):

  E:\Codex\
    manifest.json
    assets\
    audio\
    design\
    docs\
    deliverables\
    ... (scene folders, etc.)
    scripts\
      validate_json.py
      validate_assets.py
      ...

Paths under the pack root use the same drive letter, for example ``E:\Codex\design\...`` next to ``E:\Codex\manifest.json``.

In the Git repo this directory is stored as ``scripts/codex-usb``; for real checks against a generated pack, deploy as in Option A (scripts under ``<PACKROOT>/scripts/`` with ``manifest.json`` one level above ``scripts/``).

Files
-----
- ``validate_json.py`` - Parse ``manifest.json`` (exit 0 = OK, 2 = error).
- ``validate_assets.py`` - Check files referenced in the manifest exist under pack root (0 / 1 / 2).
- ``validate_html.py`` - Write ``validation_report.html`` at pack root (0 / 1 / 2).
- ``validator_full.py`` - JSON then assets (0 / 1 / 2).
- ``validate_manifest.bat`` - Runs ``validate_json.py`` (console).
- ``validate_manifest.ps1`` - GUI JSON check (PowerShell).
- ``validate_all.bat`` - JSON, then assets, then HTML report (**double-click** for a full pass).
- ``build_structure.bat`` - Creates ``assets``, ``audio``, ``design``, ``docs``, ``deliverables``, and 26 scene folders (expects repo layout ``.../scripts/codex-usb/`` so pack root is two levels up).
- ``BUILD_PACK_SNIPPET.txt`` - Comment lines to optionally paste into ``build_pack.sh`` (documentation only; not an executable script).

Usage
-----
Requires Python 3 on PATH. From this folder, run ``validate_all.bat`` or ``python validator_full.py``. UTF-8 manifest recommended.
