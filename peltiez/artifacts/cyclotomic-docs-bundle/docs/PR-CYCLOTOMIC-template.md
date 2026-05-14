# docs: rewrite article — polynômes cyclotomiques

## Titre PR

`docs(cyclotomic): article, notebook, figures racines n-ièmes`

## Description

PR pour la réécriture de l’article sur les polynômes cyclotomiques : texte clarifié, liens vers le notebook `docs/cyclotomic_analysis.ipynb`, figures SVG (`docs/assets/roots_n*.svg`) et script `scripts/generate_roots_svg.py` pour régénérer les visuels (primitives mises en avant via `pgcd(k,n)=1`).

## Message de merge (squash)

**Une ligne :** `docs(cyclotomic): article, notebook, SVG racines et bundle artefacts`

**Corps étendu (optionnel) :**

- Mise à jour ou ajout du contenu article (`Polynôme cyclotomique.txt` / `docs/Polynome-cyclotomique.txt`).
- Notebook d’analyse exécutable et chemins d’assets vérifiés.
- Figures `docs/assets/roots_n*.svg` alignées avec le script `scripts/generate_roots_svg.py`.
- Référence éventuelle à `scripts/compute_cyclotomic.py` et `compute_cyclotomic.py` (racine) pour les calculs formels.

## Checklist CI

- [ ] **Script Python :** depuis la racine du dépôt, `python scripts/compute_cyclotomic.py 7 --verify` (ou `python compute_cyclotomic.py 7 --verify`) se termine sans erreur.
- [ ] **SVG :** `python scripts/generate_roots_svg.py <n>` produit bien `docs/assets/roots_n<n>.svg` (smoke sur un `n` déjà versionné, ex. 17 ou 105).
- [ ] **Notebook (smoke) :** ouvrir `docs/cyclotomic_analysis.ipynb` et exécuter les premières cellules (imports `numpy` / `matplotlib` OK, pas d’exception évidente).

## Checklist éditoriale

- [ ] Contenu doc relu (définitions, exemples n=7 / n>1).
- [ ] Figures à jour ou chemins d’assets vérifiés.
- [ ] Notebook exécutable (dépendances : `numpy`, `matplotlib`).
