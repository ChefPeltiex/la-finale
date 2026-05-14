# Contribuer à La Finale

Merci de t’intéresser au dépôt **ChefPeltiex/la-finale**. Ce guide résume les attentes pour des contributions utiles et reviewables.

## Principes (SCALE)

- **L’humain valide** : merge, déploiement et arbitrages à fort impact restent la responsabilité de **mainteneurs humains** (voir [`PROJECT_GENESIS.md`](PROJECT_GENESIS.md) §4, [`SECURITY.md`](SECURITY.md), [`peltiez/docs/scale-bridge.md`](peltiez/docs/scale-bridge.md)).
- **L’IA et la CI proposent / vérifient** : suggestions de code, `npm run verify`, workflows — utiles pour la qualité, pas substituts à la revue consciente sur le sensible.

## Prérequis

- **Node.js 20** (aligné sur la CI).
- Git.

## Environnement local

La plupart du développement se fait sous **`peltiez/`** :

```bash
cd peltiez
npm ci --legacy-peer-deps
npm run dev
```

Pour l’API locale avec le front :

```bash
npm run dev:stack
```

Avant d’ouvrir une PR, exécuter :

```bash
npm run verify
```

(`lint` + vérification de types + `build` — identique au job CI **igor-verify**.)

## Intégration continue (GitHub Actions)

| Workflow | Fichier | Quand |
|----------|---------|--------|
| **igor-verify** | [`ci.yml`](.github/workflows/ci.yml) | Chaque **push** et **pull request** vers `main`, `master` ou `develop` — `npm run verify` dans `peltiez/`. |
| **codex-usb-nightly** | [`codex-usb-nightly.yml`](.github/workflows/codex-usb-nightly.yml) | **Quotidien** (cron UTC, décalé par rapport à `igor-nightly`) + manuel — validateurs Python sous `scripts/codex-usb/` avec manifest minimal de CI (voir [`.github/fixtures/codex-usb-minimal-manifest.json`](.github/fixtures/codex-usb-minimal-manifest.json)). |
| **release** | [`release.yml`](.github/workflows/release.yml) | Push d’un tag **`v*`** — GitHub Release avec notes auto-générées. |

Pas besoin d’un workflow séparé « lint » ou « typecheck » sur les PR : **`npm run verify`** les couvre déjà.

## Où placer les changements

| Zone | Contenu typique |
|------|-------------------|
| `peltiez/` | Application IGOR (front, `server/`, tests, config Vite). |
| `scripts/codex-usb/` | Validateurs / scripts de packs USB. |
| Racine | CI, politiques (`CONTRIBUTING`, `SECURITY`), `CHANGELOG`, `README`. |

Éviter d’indexer secrets, gros artefacts ou dossiers déjà couverts par `.gitignore`.

## Pull requests

1. **Une PR = une intention claire** (correctif, feature, doc) — éviter les mélanges massifs.
2. **Description** : contexte, choix techniques courts, captures si UI.
3. **CI verte** : le workflow `.github/workflows/ci.yml` doit passer.
4. **Pas de secrets** : jamais de clés API, tokens ou `.env` réels dans le dépôt.

Les branches suivent en général **`master`** ou **`main`** selon la configuration du dépôt ; rebaser ou mettre à jour depuis la branche par défaut avant review.

## Signalement de failles

Ne pas ouvrir une issue publique pour une vulnérabilité exploitable : suivre [`SECURITY.md`](SECURITY.md).

## Changelog

Les changements notables côté release sont consignés dans [`CHANGELOG.md`](CHANGELOG.md) ([Keep a Changelog](https://keepachangelog.com/)).

## Releases (semver)

Processus tag + push + GitHub Release : [`.github/RELEASE_PROCESS.md`](.github/RELEASE_PROCESS.md) (workflow [`release.yml`](.github/workflows/release.yml) sur tags `v*`).

## Protection de branche (GitHub)

Recommandations pour **Settings → Branches** : [`.github/BRANCH_PROTECTION.md`](.github/BRANCH_PROTECTION.md).

## Licence

En contribuant, tu acceptes que tes contributions soient publiées sous la **Apache License, Version 2.0**, comme le reste du dépôt (sauf mention explicite contraire convenu avec les mainteneurs). Voir [`LICENSE`](LICENSE).

---

Copyright © 2026 CirculAI Québec Inc.
