# CirculAI — Guide de démonstration

> **CirculAI est une plateforme web (React/Vite) qui propose un cadre de mesure honnête pour des pilotes municipaux d'économie circulaire (objets/heures bénévoles), distinct de la partie divertissement Egor69.**

---

## 3 options pour explorer l'application

### Option A — Zéro installation (immédiat)

Ouvrez directement le fichier :

```
peltiez/DEMO-CIRCULAI.html
```

Double-clic → s'ouvre dans n'importe quel navigateur. Aucun serveur, aucun npm, aucun Node.js requis.
Contient : équation du pilote, graphique SDE simulé, distinction CirculAI/Egor69, structure technique réelle.

---

### Option B — Build existant (recommandée, ~5 secondes)

Le dossier `dist/` est **déjà compilé**. Seul `npx` (inclus avec Node.js) est requis :

```bash
cd peltiez
npx serve dist
```

→ Ouvrir **http://localhost:3000**

Routes principales à visiter :
- `/circulai` — Hub décideurs & partenaires
- `/circulai/equation-pilote` — Le morceau le plus visuel (graphique SDE, formules, rythme 90 j)
- `/pilote` — Tableau de bord 90 jours
- `/docs/circulai/lettre-municipale` — Lettre type pour une mairie

---

### Option C — Développement complet (hot reload)

```bash
cd peltiez
npm install
npm run dev
```

→ Ouvrir **http://localhost:5173**

Pour lancer aussi le backend Express en parallèle :

```bash
npm run dev:stack
# web → http://localhost:5173  |  api → port Express
```

---

## Stack technique réelle

| Couche | Technologie |
|---|---|
| Frontend | React 18 · Vite 6 · Tailwind CSS 3 |
| Composants | Radix UI (headless) · Lucide icons |
| 3D | Three.js · @react-three/fiber |
| Data fetching | TanStack Query v5 |
| Graphiques | Recharts |
| Formules | KaTeX |
| Paiements | Stripe (frontend + backend) |
| Monitoring | Sentry |
| Backend | Express (server/index.js) |
| Structure | src/pages · src/components · src/lib |

Taille estimée : ~61 000 lignes de code. Construit seul en ~40 jours.

---

## 5 points clés factuels

1. **App web complète, multi-pages, déjà buildable** — `dist/` présent, `node_modules/` présent, `npx serve dist` démarre en ~5 secondes avec HTTP 200 confirmé.

2. **Architecture moderne** — composants Radix headless, formules math dans `src/lib/math/pilotEquations.js` (fonctions pures, séparées de l'UI), contextes React, TanStack Query pour le cache.

3. **Distinction explicite produit sérieux / divertissement** — CirculAI (pilotes territoriaux, municipalités, OBNL) et Egor69 (Verse 3D, divertissement) sont séparés dans le code : routes distinctes, `circulaiEgorBrand.js`, ton rédactionnel différent.

4. **Modèle mathématique humble** — SDE simple (`dX_t = μ dt + σ dW_t`), intégrale discrète, ratio Beta — pas de Monte-Carlo certifié, disclaimers explicites dans les pages (« pas une certification universitaire »).

5. **Prêt pour un pilote 90 jours sur un site réel** — plan d'action 13 semaines, lettre municipale type, tableau de bord, trois preuves définies (flux · matching · confiance partenaire) — tout est dans les routes de l'app.

---

## Pitch 30 secondes (à dire au programmeur)

> "C'est une application web React/Vite construite seul en environ 40 jours. Elle propose un cadre de mesure honnête pour des pilotes d'économie circulaire dans les municipalités québécoises : dons d'objets, heures bénévoles, preuves vérifiables en 90 jours. Le code est propre, le build est présent, la stack est standard. Il y a une partie divertissement (Egor69) séparée clairement dans le code — ça ne se mélange pas avec la partie sérieuse. On cherche un programmeur pour continuer à construire, pas pour valider un miracle."

---

## Risques honnêtes

- **Variables d'environnement** : Stripe, Sentry et autres services nécessitent des clés dans `.env` (non incluses). L'app s'ouvre mais les fonctions de paiement et de monitoring seront inactives sans elles.
- **Backend** : `server/index.js` (Express) est séparé du frontend Vite. Les routes API (`/api/…`) nécessitent `npm run dev:api` ou `npm run dev:stack`.
- **`npx serve dist`** : sert l'app comme SPA correctement si `serve` redirige vers `index.html` pour les routes React. En cas de page blanche sur une route directe, ajouter `-s` : `npx serve dist -s`.
- **PowerShell** : sur certains systèmes Windows, `npm` bloque en PowerShell (politique d'exécution). Utiliser CMD ou Git Bash : `cmd /c "npx serve dist"`.

---

*Fichier généré automatiquement · données authentiques extraites du code source · aucune modification de src/*
