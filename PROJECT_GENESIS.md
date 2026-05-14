# PROJECT GENESIS — IGOR · Cathédrale numérique

**Snapshot** : mémoire projet consolidée pour reprendre une session fraîche après reset de contexte.  
**Racine workspace** : `la finale/` · application principale : `peltiez/`.

---

## 1. Progression (fil conducteur)

La trajectoire récente combine **lore / surfaces UI riches** (hub monde, encyclopédie, marketplace, nombreuses routes éditoriales) avec une **ossature technique plus sobre**, orientée souveraineté des données et honnêteté marketing.

Points techniques marquants déjà en place :

- **Noyau souverain (backend)** : Express modulaire via `createSovereignApp()` dans `peltiez/server/sovereignApp.js`, monté par `peltiez/server/index.js`. Séparation des préoccupations (`lib/origins.js`, `lib/rateLimit.js`).
- **Interface éco-sujette (frontend)** : page `peltiez/src/pages/SovereignEcoHub.jsx`, route **`/hub-souverain`**, lien footer « Hub souverain · noyau & éco-UI ». Tableau de bord qui interroge **`GET /api/health`**, rappelle le proxy Vite → `:8787`, et évite les faux badges juridiques ou climatiques.
- **Qualité continue** : skill Cursor **`igor-verify`** (`peltiez/.cursor/skills/peltiez-verify/SKILL.md`) — gate locale `npm run verify` (lint + typecheck + build). CI GitHub à la racine du dépôt : **`.github/workflows/ci.yml`** (nom du workflow **`igor-verify`**, job « verify (lint · types · build) », `working-directory: peltiez`, Node 20, `npm ci --legacy-peer-deps`).
- **Règles codifiées** : `.cursor/rules/peltiez-core.mdc` (global) et `peltiez-server.mdc` (ciblée `server/**/*.js`) pour aligner assistant et humains sur la même « constitution » produit.

La métaphore **Grand Frère de la Toile** dans le copy UI désigne ici la **visibilité technique** (santé API, charte, sécurité) — pas une surveillance opaque ni des garanties légales automatiques.

---

## 2. Axiomes de la Cathédrale (constitution IGOR)

Synthèse des engagements transcrits dans les règles `.mdc` et dans le ton des pages sensibles.

### Persona & rôle

- **Architecte de cathédrale numérique** : créativité tenue par la rigueur.
- **Non-substitut** aux professions réglementées (juriste, médecin, etc.) : renvoi vers un humain quand la décision engage responsabilité ou conformité.

### Copy & conformité

- **Loi 25 / Québec / infra** : objectifs à **valider humainement**. Interdiction de se présenter comme « certifié Loi 25 » sans preuve réelle hors assistant.
- Pas d’**immunité Cloud Act**, d’hébergement québécois garanti ou d’exemption juridictionnelle **sans documentation** dans le dépôt.
- Pas de promesses marketing ni de métriques **non étayées**.

### Client lourd & éco-conscience logicielle

- Boucles coûteuses : envisager la régulation via `src/lib/acPulseRegulator.js` (yield / idle).
- Pas de **promesse carbone globale** sans base mesurable ; l’interface éco-sujette reste dans ce cadre.

### Autonomie vs garde-fous

- Corrections **mineures** dans le périmètre demandé : autorisées sans redemander systématiquement.
- Actions **destructives**, gestion de **secrets**, **migrations** : confirmation explicite requise.

### Livraison code

- Après changements substantiels : **`npm run verify`** (ou équivalent documenté).
- Hooks React : **jamais** conditionnels (ordre d’appels stable).

### Serveur (`server/`)

- **CORS** : en production, pas d’allowlist vide qui ouvre toutes les origines ; comportement **fail-closed** si `Origin` présent mais `STRIPE_ALLOWED_ORIGINS` / `PUBLIC_SITE_URL` ne produisent aucune origine autorisée (voir `createCorsOriginVerifier`).
- **Rate limiting** sur les endpoints exposés (`/api/stripe/checkout`, `/api/crm/lead`).
- Erreurs API : messages **génériques** côté client ; détails uniquement en logs non prod quand pertinent.
- **PII** : limiter les logs en prod ; CRM « stub » documenté (`note: stub_no_persistence` dans la réponse JSON).
- **Secrets** : variables d’environnement / `.env` hors Git — jamais dans le bundle `VITE_*` sensible.

---

## 3. État actuel du code

### Frontend (`peltiez/src/`)

- Application React + Vite, routing volumineux dans `App.jsx` (lazy loading sur de nombreuses routes).
- **Hub souverain** : `SovereignEcoHub` → `/hub-souverain` ; `fetch("/api/health")` ; SEO via `SEOMeta` ; liens vers `/charte`, `/security`, `/hub-fondations`, `/partenaires`.
- Proxy dev dans `vite.config.js` : préfixe **`/api`** → **`http://localhost:8787`** (commentaire explicite dans le fichier).

### Backend (`peltiez/server/`)

| Fichier | Rôle |
|--------|------|
| `index.js` | Bootstrap : chargement env, `createSovereignApp(process.env)`, écoute. |
| `sovereignApp.js` | Fabrique l’app Express : headers de sécurité légers, CORS, routes API. |
| `lib/origins.js` | `parseCsv`, `createCorsOriginVerifier` (prod stricte si liste vide + Origin présent). |
| `lib/rateLimit.js` | Fenêtre glissante mémoire, réponses `429` / `Retry-After`. |

**Routes principales**

- `GET /api/health` — JSON `{ ok, service, time, mode }`.
- `POST /api/stripe/checkout` — rate limit, validation `priceId` / `mode`, allowlist prix via `STRIPE_ALLOWED_PRICE_IDS`, erreurs client **`checkout_unavailable`**.
- `POST /api/stripe/webhook` — corps brut, signature Stripe ; logs événement surtout hors prod ; erreur client générique.
- `POST /api/crm/lead` — validation email, logs emails masqués en dev ; réponse **`ok`** + **`note: stub_no_persistence`**.

**Variables d’environnement utiles** (non exhaustif) : `NODE_ENV`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_ALLOWED_ORIGINS`, `PUBLIC_SITE_URL`, `STRIPE_ALLOWED_PRICE_IDS`.

### Scripts npm (`peltiez/package.json`)

- **`npm run dev:api`** — `node ./server/index.js` (serveur API local, typiquement derrière le proxy sur le port configuré dans le bootstrap serveur — aligné avec le proxy Vite vers `8787` si ainsi configuré).
- **`npm run verify`** — `lint && typecheck && build`.

### Artefacts Cursor (`peltiez/.cursor/`)

- `rules/peltiez-core.mdc` — alwaysApply.
- `rules/peltiez-server.mdc` — globs `server/**/*.js`.
- `skills/peltiez-verify/SKILL.md` — gate qualité et interprétation des échecs.
- `agents/peltiez-review.md` — profil de revue (à utiliser selon besoin).

### CI (racine `la finale/`)

- `.github/workflows/ci.yml` — workflow **`igor-verify`**, branches `main`, `master`, `develop`.

---

## 4. Pont de cohérence inter-systèmes (protocole SCALE)

**Problème** : dès que **deux systèmes** agissent sur le même produit (ex. IDE + assistant, plateforme + moteur, pipeline CI + contributeur externe), les échanges directs risquent la **désynchronisation** : formats différents, intentions floues, actions non autorisées ou non traçables.

**Chaînon manquant** : un **orchestrateur de validation** — pas seulement un bus de messages, mais un **nœud** qui :

1. **Reçoit** les requêtes ou sorties de chaque système (prompts, patches, hooks, événements métier).
2. **Vérifie** la conformité : syntaxe, politiques de sécurité, règles produit, périmètre autorisé (ce que la constitution IGOR et les règles `.mdc` formalisent déjà côté dev).
3. **Journalise** ce qui a été accepté, refusé ou modéré (traçabilité pour audit et amélioration continue).
4. **Renvoie** une réponse **validée** ou une erreur **explicable** à chaque partie.
5. **Réserve la décision finale** sur le sensible (sécurité à fort impact, conformité, arbitrage métier à risque) à un **humain habilité** — l’IA et les automates **proposent** ; les outils **exécutent** après cadre ; **seul l’humain** porte l’**autorité de validation** sur ces périmètres.

**Pierre angulaire (règle d’or)** :

> **L’humain est le valideur autorisé sur le sensible.**  
> L’IA peut proposer. L’outil peut exécuter dans le périmètre autorisé. Ni l’IA ni le pipeline ne remplacent cette autorité — ce qui limite dérive, automatisations abusives et erreurs irréversibles.

Sans ce pont, les systèmes « se parlent » mais ne partagent pas la même **vérité** opérationnelle. Avec lui, l’intégration devient un **écosystème** : moins de friction, corrections plus rapides, confiance entre humains, IA et outils.

**Implémentation côté dépôt (aujourd’hui)** : la couche « orchestrateur » est **distribuée** mais **explicite** — `npm run verify`, CI **`igor-verify`**, **`SECURITY.md`** + avis privés, **`CONTRIBUTING.md`**, **`CODEOWNERS`**, releases sur tags **`v*`**. Pour la **plateforme EGOR**, le même principe peut être concentré dans un **module SCALE** : arbitre unique (ou fédéré) entre flux humains, IA et automates, avec politiques versionnées et journaux consultables.

**Kit réutilisable (FR + EN, pitch, tooltip, Mermaid)** : [`peltiez/docs/scale-bridge.md`](peltiez/docs/scale-bridge.md).

**Non-objectifs** : ce pont ne remplace pas la **décision humaine** sur le risque métier, légal ou éthique ; il les **prépare** et les **cadre**. Le dépôt matérialise déjà une partie de cette autorité : merge sur GitHub par un compte humain, revue de code, choix de déploiement et gestion des secrets hors automate public.

### Protocole SCALE (version documentaire v1.0)

- **v1.0** — figé avec cette section et le kit [`peltiez/docs/scale-bridge.md`](peltiez/docs/scale-bridge.md) (encarts, Mermaid, bilingue). Toute évolution majeure du protocole = révision explicite de ces fichiers + entrée [`CHANGELOG.md`](CHANGELOG.md).
- **v1.1 (contrat opérationnel)** — états du pont, niveaux de sévérité, codes de retour, escalade humaine, erreurs standardisées, journaux : [`peltiez/docs/scale-protocol-v1.1.md`](peltiez/docs/scale-protocol-v1.1.md).

---

## 5. Reprise post-reset (checklist courte)

1. Lire ce fichier puis **`peltiez/.cursor/rules/*.mdc`** pour réaligner le ton et les garde-fous.
2. En dev : terminal API (`npm run dev:api` dans `peltiez`) + `npm run dev` ; vérifier **`/hub-souverain`** et la réponse **`/api/health`**.
3. Avant merge : **`npm run verify`** dans `peltiez` ; surveiller la CI **`igor-verify`** sur la branche active.

---

*Ce document est la passerelle volatil → persistant : à jour seulement si quelqu’un le révise après les prochains chantiers.*
