#!/usr/bin/env python3
"""Lance simulate_time_noise + écrit results/last_result.json (préparation pipeline Node)."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from simulate_time_noise import load_config, run_simulation


def main() -> None:
    cfg_path = Path(sys.argv[1] if len(sys.argv) > 1 else "config.example.json")
    out_path = Path("results/last_result.json")
    cfg = load_config(str(cfg_path))
    out = run_simulation(cfg)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(out_path)


if __name__ == "__main__":
    main()
