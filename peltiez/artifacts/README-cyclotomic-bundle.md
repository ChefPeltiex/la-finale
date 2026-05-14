# Archive `cyclotomic-docs-bundle.zip`

## Contenu

L’archive `cyclotomic-docs-bundle.zip` (dossier `cyclotomic-docs-bundle/` à la racine du zip) regroupe les livrables **cyclotomiques** du dépôt, lorsqu’ils existent :

| Élément | Rôle |
|--------|------|
| `Polynôme cyclotomique.txt` | Article (copie racine, si présent) |
| `docs/Polynome-cyclotomique.txt` | Variante / copie sous `docs/` |
| `compute_cyclotomic.py` | CLI racine (miroir) |
| `scripts/compute_cyclotomic.py` | Script canonique Φₙ(x) |
| `scripts/generate_roots_svg.py` | Génération des figures des racines n-ièmes |
| `docs/cyclotomic_analysis.ipynb` | Notebook d’analyse (ou `cyclotomic_exploration.ipynb` si c’est celui versionné) |
| `docs/assets/roots_n*.svg` | Figures « racines sur le cercle » (primitives surlignées par `pgcd(k,n)=1`) |
| `CYCL0_PATCH_README.md` | Notes patch CYCL0 (si présent) |
| `cyclotomic_update.patch` | Patch (si présent dans le dépôt) |
| `docs/PR-CYCLOTOMIC-template.md` | Gabarit de PR |

## Régénérer les SVG

À la racine du dépôt **peltiez** :

```powershell
python scripts/generate_roots_svg.py 105
```

Produit par défaut `docs/assets/roots_n105.svg`. Remplacer `105` par tout entier `n ≥ 1`. Un second argument optionnel permet de fixer le fichier de sortie :

```powershell
python scripts/generate_roots_svg.py 17 chemin\sortie.svg
```

Les points **primitifs** (orange) sont ceux pour lesquels `pgcd(k,n) = 1` ; les autres sont en gris, avec un rayon réduit lorsque `n` est grand pour limiter l’encombrement.

Pour reconstituer l’archive après mise à jour des fichiers, relancer la logique de copie vers `artifacts/cyclotomic-docs-bundle/` puis :

```powershell
Compress-Archive -LiteralPath "artifacts\cyclotomic-docs-bundle" -DestinationPath "artifacts\cyclotomic-docs-bundle.zip" -Force
```
