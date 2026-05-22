# Protection de branche — recommandations

Ce fichier documente une configuration **type production** pour la branche par défaut (`master` ou `main`). À appliquer dans GitHub : **Settings → Branches → Add branch protection rule**.

## Règle ciblée

- **Branch name pattern** : `master` **ou** `main` (selon ta branche par défaut).

## Paramètres recommandés

| Paramètre | Recommandation | Pourquoi |
|-----------|----------------|----------|
| **Require a pull request before merging** | Activé | Historique reviewable, CI sur PR. |
| **Required approvals** | `1` minimum (augmenter si équipe) | Évite les merges unilatéraux. |
| **Dismiss stale pull request approvals** | Activé | Les nouveaux commits exigent un nouveau regard. |
| **Require review from Code Owners** | Activé si `CODEOWNERS` est à jour | Routage automatique des reviews. |
| **Require status checks to pass** | Activé | Choisir le job **`verify`** du workflow `igor-verify` (`.github/workflows/ci.yml`). |
| **Require branches to be up to date** | Activé | Réduit les merges sur base obsolète. |
| **Require conversation resolution** | Optionnel | Utile si beaucoup de commentaires de review. |
| **Require signed commits** | Optionnel | Plus fort cryptographiquement ; friction pour certains devs. |
| **Require linear history** | Optionnel | Interdit merge commits ; favorise rebase/squash. |
| **Include administrators** | Selon politique | `Non` pour que les admins respectent aussi les règles. |
| **Allow force pushes** | **Désactivé** | Intégrité de l’historique public. |
| **Allow deletions** | **Désactivé** | Évite suppression accidentelle de la branche par défaut. |

## Tags & releases

- Les tags **`v*`** déclenchent [`.github/workflows/release.yml`](workflows/release.yml). Voir [`.github/RELEASE_PROCESS.md`](RELEASE_PROCESS.md).

## Ajustements solo-maintainer

Si tu es seul sur le dépôt, tu peux temporairement **désactiver « Require review from Code Owners »** ou mettre **0** approbation, tout en gardant **CI obligatoire** — puis resserrer quand des contributeurs externes arrivent.

---

Copyright © 2026 CirculAI Québec Inc.
