#!/usr/bin/env python3
"""Write cyclotomic_update.patch (standard unified diff) at repo root.

Run from repo root:
  python scripts/_emit_cyclotomic_patch.py
"""

from __future__ import annotations

import difflib
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

OLD_GENERATE_ROOTS_SVG = r'''#!/usr/bin/env python3
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
'''

OLD_COMPUTE_SHIM = r'''#!/usr/bin/env python3
"""Délègue à scripts/compute_cyclotomic.py (interface officielle : n, --verify, --factor, --out)."""

from __future__ import annotations

import runpy
import sys
from pathlib import Path

if __name__ == "__main__":
    target = Path(__file__).resolve().parent / "scripts" / "compute_cyclotomic.py"
    sys.argv[0] = str(target)
    runpy.run_path(str(target), run_name="__main__")
'''


def _git_header(path: str) -> str:
    return f"diff --git a/{path} b/{path}\n"


def _hunks(path: str, old_lines: list[str], new_lines: list[str]) -> str:
    diff_lines = list(
        difflib.unified_diff(
            old_lines,
            new_lines,
            fromfile=f"a/{path}",
            tofile=f"b/{path}",
            lineterm="\n",
        )
    )
    if not diff_lines:
        return ""
    while diff_lines and (diff_lines[0].startswith("---") or diff_lines[0].startswith("+++")):
        diff_lines.pop(0)
    out = [_git_header(path), f"--- a/{path}\n", f"+++ b/{path}\n"]
    out.extend(diff_lines)
    return "".join(out)


def _new_file(path: str, new_text: str) -> str:
    new_lines = new_text.splitlines(keepends=True)
    diff_lines = list(difflib.unified_diff([], new_lines, lineterm="\n"))
    while diff_lines and (diff_lines[0].startswith("---") or diff_lines[0].startswith("+++")):
        diff_lines.pop(0)
    out = [_git_header(path), "new file mode 100644\n", f"--- /dev/null\n+++ b/{path}\n"]
    out.extend(diff_lines)
    return "".join(out)


def _read(p: Path) -> list[str]:
    return p.read_text(encoding="utf-8").splitlines(keepends=True)


def _notebook_inverse_baseline(new_text: str) -> str:
    return (
        new_text.replace("import math\n", "from math import gcd\n", 1)
        .replace("math.gcd(k, n) == 1", "gcd(k, n) == 1", 1)
        .replace("math.gcd(k, n) != 1", "gcd(k, n) != 1", 1)
    )


def _svg_old_via_tmp(n: int) -> list[str]:
    with tempfile.TemporaryDirectory() as td:
        fake_root = Path(td)
        scripts_dir = fake_root / "scripts"
        scripts_dir.mkdir(parents=True)
        (scripts_dir / "generate_roots_svg.py").write_text(OLD_GENERATE_ROOTS_SVG, encoding="utf-8")
        out_svg = fake_root / f"old_roots_n{n}.svg"
        subprocess.run(
            [sys.executable, str(scripts_dir / "generate_roots_svg.py"), str(n), str(out_svg)],
            check=True,
            cwd=fake_root,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        return out_svg.read_text(encoding="utf-8").splitlines(keepends=True)


def main() -> None:
    chunks: list[str] = []

    chunks.append(_hunks("compute_cyclotomic.py", OLD_COMPUTE_SHIM.splitlines(keepends=True), _read(ROOT / "compute_cyclotomic.py")))
    chunks.append(_new_file("generate_roots_svg.py", (ROOT / "generate_roots_svg.py").read_text(encoding="utf-8")))
    chunks.append(
        _hunks(
            "scripts/generate_roots_svg.py",
            OLD_GENERATE_ROOTS_SVG.splitlines(keepends=True),
            _read(ROOT / "scripts" / "generate_roots_svg.py"),
        )
    )

    nb_path = ROOT / "docs" / "cyclotomic_analysis.ipynb"
    nb_new = nb_path.read_text(encoding="utf-8")
    chunks.append(
        _hunks(
            "docs/cyclotomic_analysis.ipynb",
            _notebook_inverse_baseline(nb_new).splitlines(keepends=True),
            nb_new.splitlines(keepends=True),
        )
    )

    bundle = ROOT / "artifacts" / "cyclotomic-docs-bundle"
    for rel, bundle_rel in (
        ("CYCL0_PATCH_README.md", "CYCL0_PATCH_README.md"),
        ("docs/PR-CYCLOTOMIC-template.md", "docs/PR-CYCLOTOMIC-template.md"),
    ):
        new_p = ROOT / rel
        if not new_p.exists():
            continue
        b = bundle / bundle_rel
        if not b.exists():
            continue
        h = _hunks(rel, _read(b), _read(new_p))
        if h:
            chunks.append(h)

    for rel in ("Polynôme cyclotomique.txt", "docs/Polynome-cyclotomique.txt"):
        p = ROOT / rel
        if not p.exists():
            continue
        new_t = p.read_text(encoding="utf-8")
        old_t = (
            new_t.replace(
                "script Python (SymPy) : `scripts/compute_cyclotomic.py` (copie identique `compute_cyclotomic.py` à la racine).\n\n"
                "Références visuelles (racines n-ièmes sur le cercle, indices \\( k=0,\\ldots,n-1 \\) ; primitives si \\( \\gcd(k,n)=1 \\)) :\n\n"
                "  `docs/assets/roots_n7.svg`, `docs/assets/roots_n12.svg`, … générés par `generate_roots_svg.py` ou `scripts/generate_roots_svg.py` (défaut `docs/assets/roots_n{n}.svg`).\n"
                "  Anciennes figures : `docs/assets/cyclotomic-roots-n7.svg`, `docs/assets/cyclotomic-roots-n12.svg`.",
                "script Python (SymPy) : `scripts/compute_cyclotomic.py`.\n\n"
                "Références visuelles (racines n-ièmes sur le cercle unité, indices k) :\n\n"
                "  `docs/assets/cyclotomic-roots-n7.svg`\n"
                "  `docs/assets/cyclotomic-roots-n12.svg`",
            )
            .replace(
                "  compute_cyclotomic.py ; scripts/compute_cyclotomic.py\n"
                "  generate_roots_svg.py ; scripts/generate_roots_svg.py\n"
                "  docs/assets/roots_n7.svg, docs/assets/roots_n12.svg, …",
                "  scripts/compute_cyclotomic.py\n"
                "  docs/assets/cyclotomic-roots-n7.svg\n"
                "  docs/assets/cyclotomic-roots-n12.svg",
            )
        )
        h = _hunks(rel, old_t.splitlines(keepends=True), new_t.splitlines(keepends=True))
        if h:
            chunks.append(h)

    man_old = """# PELTIEZ — chemins liés aux polynômes cyclotomiques et racines n-ièmes (relatif à la racine du dépôt)
# Généré / maintenu pour le bundle artifacts/cyclotomic-docs-bundle.zip

CYCL0_PATCH_README.md
Polynôme cyclotomique.txt
cyclotomic_update.patch
compute_cyclotomic.py
generate_roots_svg.py
docs/Polynome-cyclotomique.txt
docs/PR-CYCLOTOMIC-template.md
docs/cyclotomic_analysis.ipynb
docs/assets/cyclotomic-roots-n12.svg
docs/assets/cyclotomic-roots-n7.svg
docs/assets/roots_n105.svg
docs/assets/roots_n12.svg
docs/assets/roots_n17.svg
docs/assets/roots_n19.svg
docs/assets/roots_n23.svg
docs/assets/roots_n31.svg
docs/assets/roots_n7.svg
scripts/_emit_cyclotomic_patch.py
scripts/compute_cyclotomic.py
scripts/generate_roots_svg.py
artifacts/MANIFEST-cyclotomic.txt
artifacts/cyclotomic-docs-bundle.zip
"""
    man_new = (ROOT / "artifacts" / "MANIFEST-cyclotomic.txt").read_text(encoding="utf-8")
    chunks.append(_hunks("artifacts/MANIFEST-cyclotomic.txt", man_old.splitlines(keepends=True), man_new.splitlines(keepends=True)))

    for n in (7, 12, 17, 19, 23, 31, 105):
        rel = f"docs/assets/roots_n{n}.svg"
        old_svg = _svg_old_via_tmp(n)
        new_svg = _read(ROOT / rel)
        h = _hunks(rel, old_svg, new_svg)
        if h:
            chunks.append(h)

    out = "".join(c for c in chunks if c)
    (ROOT / "cyclotomic_update.patch").write_text(out, encoding="utf-8")
    print(f"Wrote {ROOT / 'cyclotomic_update.patch'} ({len(out)} bytes)")


if __name__ == "__main__":
    main()
