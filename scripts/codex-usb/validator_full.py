#!/usr/bin/env python3
"""Run JSON then asset validators. Exit: 2 JSON failure, 1 assets failure, 0 all OK."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def main() -> int:
    r = subprocess.run([sys.executable, str(ROOT / "validate_json.py")], cwd=str(ROOT))
    if r.returncode != 0:
        return 2
    r = subprocess.run([sys.executable, str(ROOT / "validate_assets.py")], cwd=str(ROOT))
    if r.returncode != 0:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
