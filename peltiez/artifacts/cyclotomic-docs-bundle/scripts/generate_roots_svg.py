#!/usr/bin/env python3
"""Génère un SVG des racines n-ièmes de l'unité (toutes en gris, primitives par-dessus en orange)."""

from __future__ import annotations

import argparse
from math import cos, gcd, pi, sin
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUT_DIR = ROOT / "docs" / "assets"

CX = CY = 180.0
R_RING = 120.0
PRIM_R = 5.0


def _gray_radius(n: int) -> float:
    """Rayon des points non primitifs : plus petit si beaucoup de racines (évite l'encombrement)."""
    if n >= 40:
        return 2.0
    if n >= 25:
        return 2.5
    return 3.0


def generate_svg(n: int, out_path: Path) -> None:
    if n < 1:
        raise ValueError("n doit être >= 1")
    gray_r = _gray_radius(n)
    aria = f"Racines {n}-ièmes de l'unité"
    title = f"Racines {n}-ièmes de l'unité : primitives (orange) vs autres (gris)"
    desc = (
        f"{n} points sur un cercle de rayon {int(R_RING)} centré en ({int(CX)},{int(CY)}). "
        f"Position k : ({int(CX)}+{int(R_RING)}cos(2πk/{n}), {int(CY)}−{int(R_RING)}sin(2πk/{n})). "
        f"Primitives : indices k avec pgcd(k,{n})=1."
    )
    lines: list[str] = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" width="360" height="360" role="img" '
        f'aria-label="{aria}">',
        f"  <title>{title}</title>",
        f"  <desc>{desc}</desc>",
        "  <defs>",
        '    <style type="text/css"><![CDATA[',
        "      .guide { fill: none; stroke: #d5d8dc; stroke-width: 1.5; }",
        "      .axis { fill: none; stroke: #aeb6bf; stroke-width: 1; stroke-dasharray: 4 4; }",
        "      .center-dot { fill: #2c3e50; stroke: none; }",
        "      .pt-nonprim { fill: #7f8c8d; stroke: #566573; stroke-width: 1; }",
        "      .pt-prim { fill: #e67e22; stroke: #a04000; stroke-width: 1; }",
        "    ]]></style>",
        "  </defs>",
        f'  <circle class="guide" cx="{CX}" cy="{CY}" r="{R_RING}"/>',
        f'  <line class="axis" x1="{CX - R_RING}" y1="{CY}" x2="{CX + R_RING}" y2="{CY}"/>',
        f'  <line class="axis" x1="{CX}" y1="{CY - R_RING}" x2="{CX}" y2="{CY + R_RING}"/>',
        f'  <circle class="center-dot" cx="{CX}" cy="{CY}" r="2"/>',
        "  <!-- racines non primitives (dessinées en premier) -->",
    ]

    def xy(k: int) -> tuple[float, float]:
        theta = 2 * pi * k / n
        x = CX + R_RING * cos(theta)
        y = CY - R_RING * sin(theta)
        return x, y

    for k in range(n):
        if gcd(k, n) == 1:
            continue
        x, y = xy(k)
        lines.append(f'  <circle class="pt-nonprim" cx="{x:.6f}" cy="{y:.6f}" r="{gray_r}"/>')

    lines.append("  <!-- racines primitives (par-dessus) -->")
    for k in range(n):
        if gcd(k, n) != 1:
            continue
        x, y = xy(k)
        lines.append(f'  <circle class="pt-prim" cx="{x:.6f}" cy="{y:.6f}" r="{PRIM_R}"/>')

    lines.append("</svg>")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def main() -> None:
    p = argparse.ArgumentParser(
        description="SVG des racines n-ièmes (primitives = pgcd(k,n)==1, k parcourant 0..n-1)."
    )
    p.add_argument("n", type=int, help="Ordre n (>= 1).")
    p.add_argument(
        "out_path",
        nargs="?",
        type=Path,
        default=None,
        help="Fichier SVG (défaut : docs/assets/roots_n{n}.svg à la racine du dépôt).",
    )
    args = p.parse_args()
    out = args.out_path if args.out_path is not None else DEFAULT_OUT_DIR / f"roots_n{args.n}.svg"
    generate_svg(args.n, out)
    print(out)


if __name__ == "__main__":
    main()
