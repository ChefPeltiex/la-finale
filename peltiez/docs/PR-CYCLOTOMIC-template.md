# Modèle de PR — livrable cyclotomique

## Titre proposé

docs/math : polynômes cyclotomiques (article LaTeX, scripts SymPy/SVG, notebook, assets)

## Description

### Résumé

- Article de référence : `Polynôme cyclotomique.txt` (racine, UTF-8) et `docs/Polynome-cyclotomique.txt` — sections 1 à 7, formules en LaTeX `\( … \)`, licence CC BY 4.0, annexes ISO 7810 et checklist.
- `compute_cyclotomic.py` **et** `scripts/compute_cyclotomic.py` (contenu identique) : affichage de `Φ_n` via SymPy, recoupement optionnel du produit de Möbius avec `--verify`, factorisation `--factor p`, sortie `--out`.
- `generate_roots_svg.py` **et** `scripts/generate_roots_svg.py` (contenu identique) : génération des figures `docs/assets/roots_n{n}.svg`.
- Figures SVG sous `docs/assets/` (`roots_n7.svg`, `roots_n12.svg`, `roots_n17.svg`, etc.) ; anciennes figures optionnelles `docs/assets/cyclotomic-roots-n7.svg`, `cyclotomic-roots-n12.svg`.
- Notebook `docs/cyclotomic_analysis.ipynb` (matplotlib, `math.gcd`).
- `CYCL0_PATCH_README.md` et correctif `cyclotomic_update.patch` (diff unifié standard, compatible `git apply`).

### Vérifications effectuées (à cocher dans la PR)

- [ ] `python compute_cyclotomic.py 7 --verify` ou `python scripts/compute_cyclotomic.py 7 --verify` (sortie Φ_7 + message OK Möbius / SymPy).
- [ ] `python scripts/compute_cyclotomic.py 105 --factor 2` (factorisation sur F_2, optionnelle).
- [ ] `python generate_roots_svg.py 7` (écrit `docs/assets/roots_n7.svg`).
- [ ] Ouverture visuelle des SVG `docs/assets/roots_n*.svg` (légendes, accents).
- [ ] Exécution du notebook `docs/cyclotomic_analysis.ipynb` (au moins les deux cellules).

## Checklist CI (adapter au dépôt)

- [ ] **Lint JS/TS** : si le dépôt utilise ESLint — `npm run lint` (ou équivalent) sans nouvelle erreur sur les fichiers touchés.
- [ ] **Lint Python** : si Ruff ou Flake8 est configuré — lancer la commande documentée dans le README du dépôt.
- [ ] **Scripts cyclotomiques** : `python compute_cyclotomic.py 7 --verify`.
- [ ] **Patch** : `git apply --check cyclotomic_update.patch` sur une base propre.
- [ ] **Artifacts** : les chemins ajoutés/modifiés sont bien suivis par Git (pas de `node_modules`).

## Checklist post-fusion

- [ ] Vérifier sur la branche principale que les liens relatifs (`docs/assets/...`) restent valides depuis la doc publiée.
- [ ] Mettre à jour tout index ou sommaire de documentation qui référence les polynômes cyclotomiques.
- [ ] Si un site statique déploie `docs/`, confirmer le rendu des fichiers `.txt` / SVG.
