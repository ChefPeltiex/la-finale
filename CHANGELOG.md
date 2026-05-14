# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `NOTICE`.
- Badges README (CI **igor-verify**, licence Apache-2.0, version `peltiez`, style ESLint).
- `.github/CODEOWNERS`, modèles d’issues (bug + évolution), `pull_request_template.md`, lien sécurité dans `ISSUE_TEMPLATE/config.yml`.
- Workflow **`release`** sur tags `v*` ([`.github/workflows/release.yml`](.github/workflows/release.yml)), guides [`.github/RELEASE_PROCESS.md`](.github/RELEASE_PROCESS.md), [`.github/BRANCH_PROTECTION.md`](.github/BRANCH_PROTECTION.md), [`.github/OPENSSF_BADGE.md`](.github/OPENSSF_BADGE.md).
- Formalisation **SCALE v1.0** : étape 5 « humain valideur », règle d’or dans [`PROJECT_GENESIS.md`](PROJECT_GENESIS.md), [`SECURITY.md`](SECURITY.md), [`CONTRIBUTING.md`](CONTRIBUTING.md), kit [`peltiez/docs/scale-bridge.md`](peltiez/docs/scale-bridge.md) (encarts + Mermaid human-in-the-loop).
- **SCALE protocol v1.1** (contrat opérationnel) : [`peltiez/docs/scale-protocol-v1.1.md`](peltiez/docs/scale-protocol-v1.1.md) — états `OK`/`WARN`/`BLOCK`/`ESCALATE`/`PENDING_HUMAN`, sévérités `S0`–`S3`, codes process/CLI/hook, escalade obligatoire, erreurs stables, schéma de logs JSON ; renvois croisés depuis [`PROJECT_GENESIS.md`](PROJECT_GENESIS.md) §4 et [`peltiez/docs/scale-bridge.md`](peltiez/docs/scale-bridge.md).

### Changed

### Fixed

### Removed

### Security

## [0.0.0] - 2026-05-12

### Added

- Monorepo public : application **IGOR** sous `peltiez/` (React, Vite, Express), scripts **Codex USB** sous `scripts/codex-usb/`, projet annexe `egor-time-sim/`.
- CI GitHub **igor-verify** (lint, types, build dans `peltiez/`).
- Documentation racine : `README.md`, `PROJECT_GENESIS.md`, Apache-2.0 (`LICENSE`).

### Security

- Aucun correctif de sécurité listé pour cette entrée initiale (journal à alimenter au fil des releases).
