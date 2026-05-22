# Importer vos images — style Larousse

## Dossier dépôt

Déposez vos PNG (ou JPG) ici :

```
la finale/assets/codex-encyclopedie-incoming/
```

Puis lancez depuis `peltiez/` :

```bash
npm run encyclopedie:import-images
npm run encyclopedie:public
```

## Nommage direct (recommandé)

Si le fichier s’appelle déjà comme une planche du Codex, il est copié tel quel :

- `codex-encyclopedie-4A-chapitre1-opening.png`
- etc. (voir les 12 cartes sur `/encyclopedie`)

## Mapping personnalisé

Éditez `docs/encyclopedie/planches-mapping.json` :

```json
{
  "mappings": [
    { "source": "mon-image-01.png", "target": "codex-encyclopedie-4A-chapitre1-opening.png" }
  ]
}
```

`source` = nom du fichier dans `codex-encyclopedie-incoming/`.

## Douze grands chapitres (cartes web)

| # | ID article | Fichier planche cible |
|---|------------|------------------------|
| 1 | racines-changement | codex-encyclopedie-4A-chapitre1-opening.png |
| 2 | quete-sens | codex-encyclopedie-7A-diagramme-abstract.png |
| 3 | economie-circulaire | codex-encyclopedie-1C-fractal-circulaire.png |
| 4 | harmonie-naturelle | codex-encyclopedie-6A-chapitre3-opening.png |
| 5 | boussole-interieure | codex-encyclopedie-7B-diagramme-reseau.png |
| 6 | chemin-avenir | codex-encyclopedie-7C-diagramme-radial.png |
| 7 | heritage-positif | codex-encyclopedie-8A-medallions.png |
| 8 | passer-action | codex-encyclopedie-5A-chapitre2-opening.png |
| 9 | cultiver-presence | codex-encyclopedie-4C-chapitre1-icons.png |
| 10 | nouvelles-portes | codex-encyclopedie-1A-couverture.png |
| 11 | perseverer-discipline | codex-encyclopedie-9C-annexes-sceaux.png |
| 12 | cycle-reussite | codex-encyclopedie-12A-fermeture-sceau.png |

Les 37 planches du blueprint PDF sont listées dans `scripts/lib/codex-encyclopedie-data.mjs`.
