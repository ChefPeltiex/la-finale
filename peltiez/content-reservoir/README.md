# Réservoir de contenu (backstage)

Espace **hors bundle** pour collecter et structurer du contenu (collages utilisateur, specs, JSON) avant intégration dans l’app. Rien ici n’est importé par Vite : le dossier est à côté de `src/`.

## Dossiers

| Dossier | Rôle |
|--------|------|
| `inbox/` | Collages bruts (`.md`). Modèle : `example-paste.template.md`. Fichiers `private-*.md` : **ignorés par Git** (données sensibles ou trop volumineuses en local). |
| `drafts/` | Partiels structurés (ex. `.json` prêts à être relus avant promotion). |
| `schemas/` | Fils directeurs JSON Schema (stubs) pour valider les brouillons quand l’automation sera branchée. |

## Flux de travail

1. **Coller** dans `inbox/` (source, date, tags, corps).
2. **Brouillon** : découper / normaliser dans `drafts/` (JSON ou markdown structuré).
3. **Revue** : vérifier exactitude, ton, et conformité aux règles ci-dessous.
4. **Promotion** : copier ou fusionner le contenu validé vers `src/data/` (ou module concerné), puis retirer ou archiver l’entrée du réservoir si besoin.

## Règles éditoriales

- **Santé / remèdes** : pas de diagnostic, pas de prescription, pas de promesse de guérison. Orienter vers des sources officielles quand c’est du domaine médical.
- **LoA / manifestation** : pas de promesses légales ou de résultats garantis ; rester factuel et symbolique si le produit le permet.

## Vérification locale

```bash
npm run reservoir:check
```

Le script liste les `.md` de l’inbox (mots, taille), signale les fichiers très longs, et peut contrôler les `drafts/*.json` contre le schéma minimal `schemas/nature-portal-entry.schema.json` s’il est présent. Code de sortie **0** pour l’instant (avertissements seulement).

## CI

Un workflow GitHub **reservoir-check** tourne quand le réservoir ou le script change (voir `.github/workflows/reservoir-check.yml`). Pour le désactiver ou l’étendre, éditer ce fichier ou ajouter une étape dans `ci.yml` qui appelle `npm run reservoir:check`.
