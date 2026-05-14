# CYCL0 — cyclotomic materials (PELTIEZ)

## FR — Fichiers

- **`Polynôme cyclotomique.txt`** (racine) : article canonique (UTF-8), section *Licence et sources* incluse.
- **`compute_cyclotomic.py`** (racine) : copie miroir du script ; entrée CLI `python compute_cyclotomic.py N`.
- **`scripts/compute_cyclotomic.py`** : **fichier canonique** pour le monorepo (même contenu que la racine).
- **`roots_n7.svg`**, **`roots_n12.svg`** : diagrammes SVG (déclaration XML + cercles). Variantes sous `docs/assets/` possibles pour d’anciens liens.
- **`docs/assets/roots_n17.svg`**, **`docs/assets/roots_n31.svg`** : racines n-ièmes (gris) et primitives `pgcd(k,n)=1` (orange), générables avec `python scripts/generate_roots_svg.py N`.

`docs/Polynome-cyclotomique.txt` renvoie vers l’article à la racine (une seule source de vérité pour le texte).

## EN — Layout

Canonical **Python** lives under **`scripts/`**; the repo root copy exists so `python compute_cyclotomic.py 7` works from the project root without changing `PATH`.

## Usage

```bash
pip install sympy
python scripts/compute_cyclotomic.py 7
python compute_cyclotomic.py 7 --verify
```
