"""Write cyclotomic_update.patch, MANIFEST, and ZIP bundle."""
from __future__ import annotations

import difflib
import os
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "artifacts"
ENC = "utf-8"
ERR = "surrogateescape"

PATCH_RELS = [
    "docs/Polynome-cyclotomique.txt",
    "compute_cyclotomic.py",
    "roots_n7.svg",
    "roots_n12.svg",
    "CYCL0_PATCH_README.md",
]

PATCH_MARKERS = {
    "docs/Polynome-cyclotomique.txt": (
        "\n\nAnnexe livrable (CYCL0)\n------------------------\n"
        "Le fichier ``cyclotomic_update.patch`` a la racine du depot est un unified diff ; "
        "verification : ``git apply --check cyclotomic_update.patch``. "
        "Les figures ``roots_n7.svg`` et ``roots_n12.svg`` a la racine completent ``docs/assets/``.\n"
    ),
    "compute_cyclotomic.py": (
        "\n# CYCL0: cyclotomic_update.patch a la racine - git apply --check\n"
    ),
    "roots_n7.svg": "  <!-- CYCL0: cyclotomic_update.patch (racine) -->\n",
    "roots_n12.svg": "  <!-- CYCL0: cyclotomic_update.patch (racine) -->\n",
    "CYCL0_PATCH_README.md": (
        "\n- ``cyclotomic_update.patch`` (racine) : unified diff pour les artefacts CYCL0 ; "
        "``git apply --check cyclotomic_update.patch``.\n"
        "- ``roots_n7.svg``, ``roots_n12.svg`` (racine) : complement aux figures sous ``docs/assets/``.\n"
    ),
}


def _nl_split(text: str) -> list[str]:
    return text.splitlines(keepends=True)


def _patch_transform(rel: str, old: str) -> str:
    m = PATCH_MARKERS[rel]
    if m in old or (rel.endswith(".svg") and m.strip() in old):
        return old
    if rel.endswith(".svg"):
        if "</svg>" not in old:
            raise ValueError(f"missing </svg> in {rel}")
        return old.replace("</svg>", m + "</svg>", 1)
    new = old.rstrip("\n") + m
    if not new.endswith("\n"):
        new += "\n"
    return new


def write_cyclotomic_patch() -> Path:
    out_parts: list[str] = []
    for rel in PATCH_RELS:
        path = ROOT / rel
        old = path.read_text(encoding=ENC, errors=ERR)
        new = _patch_transform(rel, old)
        old_lines = _nl_split(old)
        new_lines = _nl_split(new)
        ud = list(
            difflib.unified_diff(
                old_lines, new_lines, fromfile=f"a/{rel}", tofile=f"b/{rel}", n=3
            )
        )
        ud = [ln.rstrip("\r\n") for ln in ud]
        if not ud:
            continue
        block = "\n".join(
            [
                f"diff --git a/{rel} b/{rel}",
                "index 0000001..0000002 100644",
                *ud,
            ]
        )
        out_parts.append(block)
    patch_path = ROOT / "cyclotomic_update.patch"
    patch_path.write_text(
        "\n".join(out_parts) + "\n",
        encoding=ENC,
        errors=ERR,
        newline="\n",
    )
    return patch_path


def is_cyclotomic_path(p: str) -> bool:
    low = p.replace("\\", "/").lower()
    keys = (
        "cyclotomic",
        "cyclotomique",
        "polynome-cyclotomique",
        "polynôme cyclotomique",
        "roots_n",
        "cyclotomic-roots",
        "cyclotomic_update.patch",
        "cycl0_patch_readme",
        "pr-cyclotomic",
        "manifest-cyclotomic",
        "cyclotomic_analysis",
        "cyclotomic_exploration",
        "compute_cyclotomic",
        "generate_roots_svg",
    )
    return any(k in low for k in keys)


def main() -> None:
    ART.mkdir(exist_ok=True)
    patch_path = write_cyclotomic_patch()
    print("patch", patch_path.relative_to(ROOT), patch_path.stat().st_size, "bytes")

    lines = [f"MANIFEST-cyclotomic (repo: {ROOT.name})", "=" * 60, ""]
    for dirpath, dirnames, filenames in os.walk(ROOT):
        rel = Path(dirpath).relative_to(ROOT)
        parts = rel.parts
        if parts and parts[0] in ("node_modules", ".git", "dist", "build"):
            dirnames[:] = []
            continue
        if len(parts) >= 2 and parts[0] == "artifacts" and parts[1] == "cyclotomic-docs-bundle":
            dirnames[:] = []
            continue
        for fn in sorted(filenames):
            rp = (rel / fn).as_posix()
            if not is_cyclotomic_path(rp):
                continue
            if fn == "cyclotomic-docs-bundle.zip" and rel == Path("artifacts"):
                continue
            fp = ROOT / rel / fn
            try:
                sz = fp.stat().st_size
            except OSError:
                sz = -1
            lines.append(f"{rp}\t{sz}")

    lines.append("")
    lines.append(
        "Note: article accentue a la racine : Polynôme cyclotomique.txt ; "
        "patch CYCL0 modifie docs/Polynome-cyclotomique.txt (ASCII) + racine."
    )
    manifest_path = ART / "MANIFEST-cyclotomic.txt"
    manifest_path.write_text("\n".join(lines) + "\n", encoding="utf-8")

    zip_path = ART / "cyclotomic-docs-bundle.zip"

    def write_bundle_zip() -> None:
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.write(manifest_path, manifest_path.relative_to(ROOT).as_posix())
            patch = ROOT / "cyclotomic_update.patch"
            if patch.is_file():
                zf.write(patch, "cyclotomic_update.patch")
            html = ART / "cyclotomic_analysis.html"
            if html.is_file():
                zf.write(html, html.relative_to(ROOT).as_posix())
            for extra in [
                "CYCL0_PATCH_README.md",
                "docs/Polynome-cyclotomique.txt",
                "Polynôme cyclotomique.txt",
                "docs/cyclotomic_analysis.ipynb",
                "docs/PR-CYCLOTOMIC-template.md",
                "compute_cyclotomic.py",
                "scripts/compute_cyclotomic.py",
                "scripts/generate_roots_svg.py",
                "scripts/package_cyclotomic_artifacts.py",
                "roots_n7.svg",
                "roots_n12.svg",
            ]:
                p = ROOT / extra
                if p.is_file():
                    zf.write(p, extra)
            assets = ROOT / "docs" / "assets"
            if assets.is_dir():
                for asset in sorted(assets.glob("roots_n*.svg")):
                    zf.write(asset, asset.relative_to(ROOT).as_posix())
                for asset in sorted(assets.glob("cyclotomic-roots-*.svg")):
                    zf.write(asset, asset.relative_to(ROOT).as_posix())
            nb2 = ROOT / "docs" / "cyclotomic_exploration.ipynb"
            if nb2.is_file():
                zf.write(nb2, nb2.relative_to(ROOT).as_posix())

    write_bundle_zip()
    note = lines.pop()
    sep = lines.pop()
    lines.append(f"artifacts/cyclotomic-docs-bundle.zip\t{zip_path.stat().st_size}")
    lines.append(sep)
    lines.append(note)
    manifest_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    write_bundle_zip()

    print(manifest_path.relative_to(ROOT), "lines", len(lines))
    print(zip_path.relative_to(ROOT), "bytes", zip_path.stat().st_size)


if __name__ == "__main__":
    main()
