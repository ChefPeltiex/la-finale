#!/usr/bin/env python3
"""
Build a short A/B report from a local NDJSON event file (see data_ingestion.py).
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from compute_lift import aggregate, compute_stats, read_events, z_test


def main() -> int:
    ap = argparse.ArgumentParser(description="A/B summary from NDJSON events.")
    ap.add_argument("events_file", type=Path, help="NDJSON file (experiment_assign / experiment_convert)")
    ap.add_argument("--control", default="control", help="Control variant name")
    ap.add_argument("--treatment", default="phi", help="Treatment variant name")
    args = ap.parse_args()

    events = read_events(str(args.events_file))
    stats = aggregate(events)
    summary = compute_stats(stats)

    ctrl = stats.get(args.control)
    treat = stats.get(args.treatment)
    if ctrl is None or treat is None:
        print(json.dumps({"error": "missing_variant", "stats": summary}, indent=2))
        return 2

    z, p = z_test(ctrl, treat)
    out = {
        "variants": summary,
        "z_statistic": z,
        "p_value_two_sided": p,
        "lift_absolute": treat.rate - ctrl.rate,
    }
    print(json.dumps(out, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
