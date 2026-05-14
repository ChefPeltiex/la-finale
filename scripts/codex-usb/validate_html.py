#!/usr/bin/env python3
"""Try JSON validation first; write pack_root/validation_report.html (html.escape). Exit 0/2."""
from __future__ import annotations

import html
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = (ROOT.parent / "manifest.json").resolve()
PACK_ROOT = MANIFEST.parent
REPORT = PACK_ROOT / "validation_report.html"


def try_json() -> tuple[bool, str]:
    if not MANIFEST.is_file():
        return False, f"manifest not found: {MANIFEST}"
    try:
        raw = MANIFEST.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as e:
        return False, str(e)
    try:
        json.loads(raw)
    except json.JSONDecodeError as e:
        return False, str(e)
    return True, "JSON OK"


def main() -> int:
    ok, msg = try_json()
    esc_msg = html.escape(msg, quote=True)
    esc_path = html.escape(str(REPORT), quote=True)
    esc_manifest = html.escape(str(MANIFEST), quote=True)
    status = "PASS" if ok else "FAIL"
    body = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><title>Pack validation</title></head>
<body>
  <h1>Pack validation report</h1>
  <p><strong>Time:</strong> {html.escape(datetime.now(timezone.utc).isoformat())}</p>
  <p><strong>Manifest:</strong> {esc_manifest}</p>
  <p><strong>JSON:</strong> {html.escape(status)} — {esc_msg}</p>
  <p>Report path: {esc_path}</p>
</body></html>
"""
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(body, encoding="utf-8")
    print("Report:", REPORT)
    return 0 if ok else 2


if __name__ == "__main__":
    raise SystemExit(main())
