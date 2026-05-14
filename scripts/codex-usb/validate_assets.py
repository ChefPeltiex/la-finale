#!/usr/bin/env python3
"""Resolve asset paths from manifest relative to pack_root (manifest directory). Exit 0/2."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = (ROOT.parent / "manifest.json").resolve()
PACK_ROOT = MANIFEST.parent

# Keys that commonly hold file paths in pack manifests
PATH_KEYS = frozenset(
    {
        "path",
        "src",
        "file",
        "href",
        "url",
        "asset",
        "audio",
        "image",
        "icon",
        "background",
        "poster",
    }
)
EXT_RE = re.compile(r"\.(png|jpe?g|gif|webp|svg|mp3|wav|ogg|m4a|aac|pdf|json|html|css|js|md|txt|zip|glb|gltf)$", re.I)


def _walk(obj, out: list[str]) -> None:
    if isinstance(obj, dict):
        for k, v in obj.items():
            lk = str(k).lower()
            if isinstance(v, str) and (lk in PATH_KEYS or "/" in v or "\\" in v):
                s = v.strip()
                if s and not s.startswith(("http://", "https://", "data:")):
                    out.append(s)
            _walk(v, out)
    elif isinstance(obj, list):
        for item in obj:
            _walk(item, out)


def _candidate_paths(s: str) -> list[Path]:
    s = s.strip().strip('"').strip("'")
    if not s or s.startswith("#"):
        return []
    # Heuristic: treat as asset if looks path-like or has media extension
    if "/" not in s and "\\" not in s and not EXT_RE.search(s):
        return []
    p = Path(s)
    if p.is_absolute():
        return [p]
    return [(PACK_ROOT / p).resolve()]


def main() -> int:
    if not MANIFEST.is_file():
        print(f"ERROR: manifest not found: {MANIFEST}", file=sys.stderr)
        return 2
    try:
        data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as e:
        print(f"ERROR: cannot load manifest: {e}", file=sys.stderr)
        return 2

    refs: list[str] = []
    _walk(data, refs)
    missing: list[str] = []
    seen: set[str] = set()
    for s in refs:
        if s in seen:
            continue
        seen.add(s)
        for cp in _candidate_paths(s):
            if cp.is_file():
                break
        else:
            if _candidate_paths(s):
                missing.append(s)

    if missing:
        print("ERROR: missing asset paths (relative to pack root):", file=sys.stderr)
        for m in missing:
            print(f"  - {m}", file=sys.stderr)
        return 2
    print("OK: assets resolved under", PACK_ROOT)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
