# La Finale — portail EGOR / Codex

[![igor-verify](https://github.com/ChefPeltiex/la-finale/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/ChefPeltiex/la-finale/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![App version](https://img.shields.io/github/package-json/v/ChefPeltiex/la-finale?filename=peltiez%2Fpackage.json&label=peltiez)](https://github.com/ChefPeltiex/la-finale/blob/master/peltiez/package.json)
[![Code style](https://img.shields.io/badge/code%20style-eslint-4B32C3)](https://github.com/ChefPeltiex/la-finale/blob/master/peltiez/eslint.config.js)

Projet central du système **EGOR** : un environnement hybride mêlant vision produit, architecture logicielle, scripts d’automatisation et outillage **Codex USB**. Ce dépôt rassemble le moteur applicatif principal (**IGOR** sous `peltiez/`), la documentation de genèse et les validateurs de packs.

---

## Vision

**EGOR** se présente comme un portail : un espace où expérience utilisateur, narration et architecture logicielle se rencontrent pour former un outil évolutif — pensé pour grandir, s’adapter et orchestrer des modules interconnectés.

Ce dépôt est la **base consolidée** : socle versionné, `.gitignore` propre, CI sur `peltiez`, et une entrée claire pour les contributeurs. Le cadrage technique et les axiomes produit sont détaillés dans [`PROJECT_GENESIS.md`](PROJECT_GENESIS.md).

---

## Structure du dépôt

```
la-finale/
├── peltiez/                 # Application principale (React, Vite, Express)
│   ├── src/
│   ├── public/
│   ├── server/
│   ├── package.json
│   └── README.md            # Doc détaillée app + CirculAI φ + déploiement
│
├── scripts/
│   └── codex-usb/           # Validation packs (Python, .bat, .ps1)
│       ├── README.txt
│       ├── validate_all.bat
│       ├── validate_manifest.ps1
│       └── …                # validate_*.py, build_structure.bat, etc.
│
├── egor-time-sim/           # Sandbox / simulation temporelle (périmètre annexe)
│
├── .github/workflows/     # CI (verify sur peltiez)
├── PROJECT_GENESIS.md     # Genèse, constitution, état des modules
├── README.md                # Ce fichier
└── .gitignore
```

---

## Démarrage rapide

```bash
cd peltiez
npm install
npm run dev
```

Frontend + API locale (recommandé si tu utilises `/api`) :

```bash
npm run dev:stack
```

Variables d’environnement : voir [`peltiez/server/README.md`](peltiez/server/README.md) et les fichiers `.env.example` / `.env.server.example` dans `peltiez/`.

> Le dépôt déclare aussi `packageManager: pnpm@9` dans `peltiez/package.json`. Tu peux utiliser **pnpm** en miroir des commandes ci-dessus si c’est ton flux habituel ; la **CI GitHub** utilise aujourd’hui **npm** (`npm ci --legacy-peer-deps` dans `peltiez/`).

---

## Vérification et qualité

**Application (lint, types, build)** — depuis `peltiez/` :

```bash
npm run verify
```

Aligné avec le workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) (`igor-verify`).

**Packs Codex USB** — validateurs et scripts sous [`scripts/codex-usb/`](scripts/codex-usb/) (voir [`scripts/codex-usb/README.txt`](scripts/codex-usb/README.txt) ; exécution typique via `validate_all.bat` ou les scripts Python selon ton OS).

---

## Déploiement (Vercel)

- **Root Directory** du projet Vercel : **`peltiez`**
- **Build** : voir [`peltiez/vercel.json`](peltiez/vercel.json) — actuellement `npm run build`, sortie **`dist/`**
- Réécritures SPA / API déjà esquissées dans ce fichier ; adapter si tu exposes une API Node séparément.

---

## Documentation complémentaire

| Sujet | Fichier |
|--------|---------|
| Application IGOR, CirculAI φ, scripts npm | [`peltiez/README.md`](peltiez/README.md) |
| Genèse, philosophie technique, pont SCALE | [`PROJECT_GENESIS.md`](PROJECT_GENESIS.md) · kit [`peltiez/docs/scale-bridge.md`](peltiez/docs/scale-bridge.md) |
| Codex USB (copie à plat des scripts, validation) | [`scripts/codex-usb/README.txt`](scripts/codex-usb/README.txt) |
| Contribuer (PR, `verify`, périmètres) | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Signalement de vulnérabilités | [`SECURITY.md`](SECURITY.md) |
| Historique des versions | [`CHANGELOG.md`](CHANGELOG.md) |
| Attribution projet (Apache `NOTICE`) | [`NOTICE`](NOTICE) |
| Code owners & modèles GitHub | [`.github/CODEOWNERS`](.github/CODEOWNERS), [`.github/ISSUE_TEMPLATE/`](.github/ISSUE_TEMPLATE/), [`.github/pull_request_template.md`](.github/pull_request_template.md) |
| Releases (tags `v*`), nightly, Codex USB, protection de branche, OpenSSF | [`.github/RELEASE_PROCESS.md`](.github/RELEASE_PROCESS.md), [`.github/workflows/nightly.yml`](.github/workflows/nightly.yml), [`.github/workflows/codex-usb-nightly.yml`](.github/workflows/codex-usb-nightly.yml), [`.github/BRANCH_PROTECTION.md`](.github/BRANCH_PROTECTION.md), [`.github/OPENSSF_BADGE.md`](.github/OPENSSF_BADGE.md) — tableau CI dans [`CONTRIBUTING.md`](CONTRIBUTING.md) |

---

## Roadmap (indicative)

- Intégration et durcissement des modules EGOR côté `peltiez`
- Automatisation du pipeline Codex (scripts + doc)
- Déploiements multi-environnements et doc d’architecture (diagrammes)

---

## Contributions

Le projet est en évolution ; les contributions structurées (PR avec description, `npm run verify` vert) sont les bienvenues une fois la base stabilisée sur ta branche principale.

---

## Licence

**Copyright © 2026 CirculAI Québec Inc.**

Le code et la documentation de ce dépôt (sauf mentions contraires dans des fichiers ou répertoires couverts par une autre licence) sont publiés sous la [**Apache License, Version 2.0**](https://www.apache.org/licenses/LICENSE-2.0). Le texte juridique complet se trouve dans le fichier [`LICENSE`](LICENSE) à la racine du dépôt.

> *Note : Apache-2.0 accorde explicitement des droits d’usage, de modification et de redistribution à quiconque respecte ses conditions. La formule « tous droits réservés » au sens logiciel propriétaire ne décrit donc pas ce périmètre ; le copyright demeure : CirculAI Québec Inc.*
