# CYCL0_PATCH_README — livrable cyclotomique

Ce correctif regroupe :

- `Polynôme cyclotomique.txt` (racine) et `docs/Polynome-cyclotomique.txt` : article de référence (UTF-8, sections 1–7, formules LaTeX `\( … \)`, licence CC BY 4.0).
- `compute_cyclotomic.py` et `scripts/compute_cyclotomic.py` : **fichiers identiques** — SymPy, `cyclotomic_poly`, produit de Möbius avec option `--verify`, `--factor p`, `--out`.
- `generate_roots_svg.py` et `scripts/generate_roots_svg.py` : **fichiers identiques** — SVG `docs/assets/roots_n{n}.svg` (non primitives en gris puis primitives en orange, `math.gcd`, écriture des lignes SVG avec de vrais sauts de ligne : `"\n".join(lines) + "\n"`).
- `docs/assets/roots_n*.svg` : figures pour les ordres documentés (ex. 7, 12, 17, 19, 23, 31, 105).
- `docs/cyclotomic_analysis.ipynb` : matplotlib, primitives `math.gcd(k, n) == 1`.
- `docs/PR-CYCLOTOMIC-template.md` : modèle de PR.
- `artifacts/MANIFEST-cyclotomic.txt` : inventaire des chemins.
- `scripts/_emit_cyclotomic_patch.py` : régénère `cyclotomic_update.patch` (diff unifié standard).

## Fichier `cyclotomic_update.patch`

Le fichier `cyclotomic_update.patch` à la racine du dépôt est un **diff unifié standard** (format GNU diff / `git apply`). Si vous avez encore un ancien pseudo-patch du type `*** Begin Patch` (non compatible avec `git apply`), remplacez-le par ce fichier et appliquez avec :

```text
git apply --check cyclotomic_update.patch
git apply cyclotomic_update.patch
```

Vérification locale : `python compute_cyclotomic.py 7 --verify` (ou `python scripts/compute_cyclotomic.py 7 --verify`) ; `python generate_roots_svg.py 7` pour régénérer un SVG. Pour régénérer le patch : `python scripts/_emit_cyclotomic_patch.py`.
