#!/usr/bin/env python3
"""Validate ../manifest.json parses as UTF-8 JSON. Exit 0 OK, 2 on failure."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = (ROOT.parent / "manifest.json").resolve()


def main() -> int:
    if not MANIFEST.is_file():
        print(f"ERROR: manifest not found: {MANIFEST}", file=sys.stderr)
        return 2
    try:
        raw = MANIFEST.read_text(encoding="utf-8")
    except UnicodeDecodeError as e:
        print(f"ERROR: not valid UTF-8: {e}", file=sys.stderr)
        return 2
    except OSError as e:
        print(f"ERROR: read failed: {e}", file=sys.stderr)
        return 2
    try:
        json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"ERROR: invalid JSON: {e}", file=sys.stderr)
        return 2
    print("OK:", MANIFEST)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
