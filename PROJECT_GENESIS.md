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

## 4. Reprise post-reset (checklist courte)

1. Lire ce fichier puis **`peltiez/.cursor/rules/*.mdc`** pour réaligner le ton et les garde-fous.
2. En dev : terminal API (`npm run dev:api` dans `peltiez`) + `npm run dev` ; vérifier **`/hub-souverain`** et la réponse **`/api/health`**.
3. Avant merge : **`npm run verify`** dans `peltiez` ; surveiller la CI **`igor-verify`** sur la branche active.

---

*Ce document est la passerelle volatil → persistant : à jour seulement si quelqu’un le révise après les prochains chantiers.*
