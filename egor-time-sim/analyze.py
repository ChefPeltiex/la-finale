#!/usr/bin/env python3
"""
Analyse post-simulation : Allan depuis résultat JSON ou recalcul rapide,
export CSV, figures optionnelles (matplotlib si disponible).
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

try:
    import matplotlib.pyplot as plt

    HAS_MPL = True
except Exception:
    HAS_MPL = False


def load_allan_from_result(path: Path) -> dict[float, float]:
    with path.open(encoding="utf-8") as f:
        data = json.load(f)
    return {float(k): float(v) for k, v in data.get("allan_deviation", {}).items()}


def export_csv(ad: dict[float, float], out_csv: Path) -> None:
    with out_csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["tau_s", "sigma_y"])
        for tau in sorted(ad.keys()):
            w.writerow([tau, ad[tau]])


def plot_allan(ad: dict[float, float], out_png: Path) -> None:
    if not HAS_MPL:
        print("matplotlib absent — skip figure", file=sys.stderr)
        return
    taus = sorted(ad.keys())
    ys = [ad[t] for t in taus]
    plt.figure(figsize=(6, 4))
    plt.loglog(taus, ys, marker="o")
    plt.xlabel(r"$\tau$ (s)")
    plt.ylabel(r"Allan deviation $\sigma_y(\tau)$")
    plt.title("Courbe Allan (série simulée)")
    plt.grid(True, which="both", ls="--", alpha=0.4)
    plt.tight_layout()
    plt.savefig(out_png, dpi=150)
    plt.close()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--result", default="results/last_result.json", help="JSON produit par run_batch ou manuel")
    ap.add_argument("--csv", default="results/allan_curve.csv")
    ap.add_argument("--png", default="results/allan_curve.png")
    args = ap.parse_args()

    res_path = Path(args.result)
    if not res_path.exists():
        print(f"Fichier introuvable: {res_path}", file=sys.stderr)
        sys.exit(1)

    ad = load_allan_from_result(res_path)
    out_dir = Path(args.csv).parent
    out_dir.mkdir(parents=True, exist_ok=True)
    export_csv(ad, Path(args.csv))
    plot_allan(ad, Path(args.png))
    print(f"CSV: {args.csv}")
    if HAS_MPL:
        print(f"PNG: {args.png}")


if __name__ == "__main__":
    main()
